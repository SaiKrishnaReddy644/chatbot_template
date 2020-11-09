<script>
    import {chatbotMessages, user_token} from "../store.js";

    let token, session;
    import {slide} from "svelte/transition";
    import Card from "./Card.svelte";

    user_token.subscribe(data => {
        token = data.token;
        session = data.session;
    });

    /*
     * Optional Needed only if messages to be stored in localStorage
     */
    chatbotMessages.subscribe(data => {
        if (data.length === 0) {
            if (localStorage.getItem("chatbot_messages")) {
                let parsed = JSON.parse(localStorage.getItem("chatbot_messages"));
                if (parsed.length > 0) {
                    chatbotMessages.restore(parsed);
                }
            }
        } else {
            localStorage.setItem("chatbot_messages", JSON.stringify(data));
        }
    });

    /// End of the code
    function addUserMessage(e) {
        chatbotMessages.addMessage({
            from: "me",
            components: [
                {
                    name: "DEFAULT",
                    content: e.toElement.innerText
                }
            ]
        });
    }

    async function sendoption(e) {
        addUserMessage(e);
        let request = {
            user_token: chatbotMessages.user_token || token,
            q: e.toElement.innerText,
            session_id: session,
            lang: "en"
        };

        chatbotMessages.removeSuggestions();

        await chatbotMessages.callApi(request);
    }


    function makeLinksClickable(text) {
        let text1;
        try {
            let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
            if (text) {
                var pat = new RegExp(exp);
                text1 = text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
                let exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                return text1.replace(
                        exp2,
                        '$1<a target="_blank" href="http://$2">$2</a>'
                );
            } else {
                return text;
            }
        } catch (e) {
            console.log(e.message)
            return text
        }
    }
</script>

<style>
    .messages {
        height: 77%;
        width: 100%;
        font-size: 14px;
        overflow-y: scroll;
    }

    .messages::-webkit-scrollbar {
        display: none;
    }

    .bubble.bot {
        max-width: 60%;
        padding: 10px;
        background-color: #fff;
        color: #555;
        margin: 0px 0px 15px 15px;
        padding: 15px;
        padding-left: 20px;
        min-width: 60%;
        white-space: pre-line;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        word-wrap: break-word;
        float: left;
    }

    .bubble.me {
        width: 60%;
        min-width: 60%;
        float: right;
        color: #fff;
        padding: 15px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        margin: 15px;
        white-space: pre-line;
        word-wrap: break-word;
        background-color: #2962ff;
    }

    .bubble.me {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        border-top-right-radius: 30px;
    }

    .bubble.bot {
        border-top-right-radius: 30px;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    }

    .suggestion {
        float: left;
        width: 60%;
        margin-left: 20px;
        padding: 8px;
        margin-bottom: 10px;
        text-align: center;
        border-radius: 20px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    @media only screen and (max-width: 767px) {
        .messages {
            height: 78%;
        }
    }
</style>

<div class="messages" id="messages">
    {#each $chatbotMessages.slice(-20) as Message}
        {#if Array.isArray(Message.components)}
            {#each  Message.components as MessageComponents}
                {#if Message.from === 'me'}
                    <div class="bubble me" transition:slide>
                        {MessageComponents.content}
                    </div>
                {:else if MessageComponents.name === "DEFAULT"}
                    <div class="bubble bot" transition:slide>
                        {@html makeLinksClickable(MessageComponents.content)}
                    </div>
                {/if}
                {#if MessageComponents.name === "CARD" }
                    {#each MessageComponents.content as item}
                        <Card/>
                    {/each}
                {/if}
                {#if MessageComponents.name === "SUGGESTIONS" }
                    {#each MessageComponents.content as item}
                        <div class="suggestion" on:click={sendoption}>{item}</div>
                    {/each}
                {/if}
            {/each}
        {/if}
    {/each}
</div>
