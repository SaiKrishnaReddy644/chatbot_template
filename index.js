const functions = require('firebase-functions');
const dialogflow = require('dialogflow');
const jwt = require('jsonwebtoken');
const structjson = require('./structjson.js')
const serviceAccount = require('./serviceAccount.json');
const express = require('express');
const app = express();

const agentsClient = new dialogflow.AgentsClient({
    credentials: {
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email
    }
})

/* SessionsClient makes text requests */
const sessionClient = new dialogflow.SessionsClient({
    credentials: { // <-- Initialize with service account
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email
    }
})

/* We need to set this headers, to make our HTTP calls possible */
let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*'
}

exports.gateway = functions.https.onRequest((req, res) => {
    if (req.method === "POST") {
        console.log("entered here")
        /* If no body, session, query, or lang, return 400 */
        if (!req.body || !req.body.session_id || !req.body.q || !req.body.lang || !req.body.user_token) {
            res.set(headers)
            console.log("entered here1")

            res.status(400).send({})
        }

        /* Prepare dialogflow request */
        else {
            let decoded_token_info;



            let session_id = req.body.session_id
            let q = req.body.q
            let lang = req.body.lang
            let phone = '23568909098'
            let sessionPath = sessionClient.sessionPath(serviceAccount.project_id, session_id)
            let request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: q,
                        languageCode: lang
                    }
                },
                queryParams: {
                    payload: structjson.jsonToStructProto({
                        data: {
                            external_uuid: 'akhefgweugjrwgheuiyger',
                            From: phone
                        },
                        telephony: {
                            callerId: phone
                        }
                    })
                }

            }

            //console.log(JSON.stringify(request), ' >>> req to bot');

            /* Send our request to Dialogflow */
            sessionClient.detectIntent(request).then(responses => {
                    //console.log( '>>> format index in query params: ',req.query.format )

                    /* If the response should be formatted (?format=true), then return the format the response */
                    if (req.query.format) {
                        let fulfillment = responses[0].queryResult.fulfillmentMessages

                        /* Base of formatted response */
                        let formatted = {
                            id: responses[0].responseId,
                            action: responses[0].queryResult.action,
                            query: responses[0].queryResult.queryText,
                            params: responses[0].queryResult.parameters,
                            diagnosticInfo: responses[0].queryResult.diagnosticInfo,
                            components: []
                        }

                        /* Iterate through components and add them to components list */
                        for (let component in fulfillment) {

                            /* Recognize Dialogflow, Messenger and Webhook components */
                            if (fulfillment[component].platform === "PLATFORM_UNSPECIFIED" || fulfillment[component].platform === "FACEBOOK" || fulfillment[component].platform === "SLACK" || fulfillment[component].platform === "TELEGRAM" || fulfillment[component].platform === "KIK" || fulfillment[component].platform === "VIBER" || fulfillment[component].platform === "SKYPE" || fulfillment[component].platform === "LINE") {
                                if (fulfillment[component].text) {

                                    /* Text */
                                    if (fulfillment[component].text.text[0]) {
                                        formatted.components.push({
                                            name: "DEFAULT",
                                            content: fulfillment[component].text.text[0]
                                        })
                                    } else {
                                        //Note: Not sure why DF is sending this empty node.
                                    }
                                }

                                if (fulfillment[component].card) {

                                    /* Convert Card to Actions on Google Card (to follow a common format) */
                                    let google_card = {
                                        title: fulfillment[component].card.title,
                                        formattedText: fulfillment[component].card.subtitle,
                                        image: {
                                            imageUri: fulfillment[component].card.imageUri,
                                            accessibilityText: 'Card Image'
                                        },
                                        buttons: []
                                    }

                                    for (let button in fulfillment[component].card.buttons) {
                                        google_card.buttons.push({
                                            title: fulfillment[component].card.buttons[button].text,
                                            openUriAction: {
                                                uri: fulfillment[component].card.buttons[button].postback
                                            }
                                        })
                                    }

                                    formatted.components.push({
                                        name: "CARD",
                                        content: google_card
                                    })
                                }

                                if (fulfillment[component].image) {

                                    /* Image */
                                    formatted.components.push({
                                        name: "IMAGE",
                                        content: fulfillment[component].image
                                    })
                                }

                                if (fulfillment[component].quickReplies) {

                                    /* Suggestions */
                                    formatted.components.push({
                                        name: "SUGGESTIONS",
                                        content: fulfillment[component].quickReplies.quickReplies
                                    })
                                }

                                if (fulfillment[component].payload) {

                                    /* Payload */
                                    formatted.components.push({
                                        name: "PAYLOAD",
                                        content: fulfillment[component].payload
                                    })
                                }
                            }

                            /* Recognize Actions on Google components */
                            if (fulfillment[component].platform === "ACTIONS_ON_GOOGLE") {
                                if (fulfillment[component].simpleResponses) {

                                    /* Google Simple Response */
                                    formatted.components.push({
                                        name: "SIMPLE_RESPONSE",
                                        content: fulfillment[component].simpleResponses.simpleResponses[0]
                                    })
                                }

                                if (fulfillment[component].basicCard) {

                                    /* Google Card */
                                    formatted.components.push({
                                        name: "CARD",
                                        content: fulfillment[component].basicCard
                                    })
                                }

                                if (fulfillment[component].listSelect) {

                                    /* Google List */
                                    formatted.components.push({
                                        name: "LIST",
                                        content: fulfillment[component].listSelect
                                    })
                                }

                                if (fulfillment[component].suggestions) {

                                    /* Convert Google Suggestions to text-only suggestions (like the webhook quick-replies) */
                                    let suggestions = fulfillment[component].suggestions.suggestions.map(suggestion => suggestion.title)
                                    formatted.components.push({
                                        name: "SUGGESTIONS",
                                        content: suggestions
                                    })
                                }

                                if (fulfillment[component].linkOutSuggestion) {

                                    /* Google Link out suggestion */
                                    formatted.components.push({
                                        name: "LINK_OUT_SUGGESTION",
                                        content: fulfillment[component].linkOutSuggestion
                                    })
                                }

                                if (fulfillment[component].payload) {

                                    /* Google Payload */
                                    formatted.components.push({
                                        name: "PAYLOAD",
                                        content: fulfillment[component].payload
                                    })
                                }

                                if (fulfillment[component].carouselSelect) {

                                    /* Google Carousel Card */
                                    formatted.components.push({
                                        name: "CAROUSEL_CARD",
                                        content: fulfillment[component].carouselSelect.items
                                    })
                                }
                            }
                        }

                        res.set(headers)
                        res.send(formatted)
                    } else {
                        res.set(headers)
                        res.send(responses[0])
                    }
                    return true;
                })
                .catch(err => {
                    //console.log("Error from dialogflow, ", err)
                    res.set(headers)
                    res.status(500).send(err.message)
                })
        }
    }


    /* Pass pre-flight HTTP check */
    else if (req.method === 'OPTIONS') {
        res.set(headers)
        res.status(200).send({})
    }

    /* Send 404 on undefined method */
    else {
        res.set(headers)
        res.status(404).send({})
    }

    return true;
});
let bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.post('/gateway', exports.gateway)
app.use(express.static('./public/'))
app.listen(7089, () => {
    console.log(`Server started on port`);
});