<script>

    import {chatbotMessages, windowoption, user_token} from "../store.js";

    let token, session;

    user_token.subscribe(data => {
        token = data.token;
        session = data.session;
    });
    let query = "";

    function addMessage(q) {
        chatbotMessages.addMessage({
            from: "me",
            components: [
                {
                    name: "DEFAULT",
                    content: q
                }
            ]
        });
    }

    function passSpeechQuery() {
        try {
            let recognition;
            document.querySelector(".submit").style.background = "#0d47a1";
            if (window.webkitSpeechRecognition) {
                recognition = new window.webkitSpeechRecognition();
                recognition.interimResults = true;
                recognition.lang = "en";
            }
            recognition.start();
            recognition.onresult = event => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    query = event.results[i][0].transcript;
                }

            };
            recognition.onend = () => {
                recognition.stop();
                addMessage(query)
                sendMessage(query);
            };
        } catch (e) {
            console.error(e);
        }
    }

    function passQuery() {
        if (query.trim().length > 1) {
            addMessage(query);
            chatbotMessages.removeSuggestions();
            sendMessage(query);
        }
    }

    async function sendMessage(q) {
        if (q.length > 1) {
            query = "";
            chatbotMessages.removeSuggestions();
            document.querySelector(".submit").style.background = "#0d47a1";
            if (q.length > 1) {
                let request = {
                    user_token: chatbotMessages.user_token || token,
                    q: q,
                    session_id: session,
                    lang: "en"
                };
                await chatbotMessages.callApi(request);
            }
        }

    }
</script>

<style>
    .inputcontainer {
        height: 8%;
        display: flex;
        flex-direction: row;
        padding: 10px;
        box-shadow: 0px -2px 3px rgba(0, 0, 0, 0.4);
        justify-content: space-evenly;
        align-items: center;
        font-size: 14px;
        background: #2962ff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        bottom: 0;
    }

    .query {
        outline: none;
        border: none;
        width: 270px;
        height: 45px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 25px;
        margin: auto;
        margin-right: 5px;
        margin-left: 5px;
        padding: 15px;
        color: rgba(0, 0, 0, 0.8);
    }

    .submit {
        background-color: #1e88e5;
        height: 40px;
        border-radius: 50%;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
        width: 40px;
        display: flex;
        margin: auto;
        border: none;
        color: #fff;
        justify-content: center;
        align-items: center;
    }

    .fas.fa-play {
        padding: 5px;
        font-size: 18px;
        margin: auto;
    }

    .fas.fa-microphone {
        font-size: 18px;
    }
</style>

<div class="inputcontainer">
    <div>
        <input
                type="text"
                placeholder="Type your response"
                on:keydown={e => (e.key === 'Enter' ? passQuery() : '')}
                class="query"
                bind:value={query}
                        id="query"/>
    </div>
    <button class="submit" on:click={()=>passSpeechQuery()}>
        {#if query.length < 1}
            <i class="fas fa-microphone"></i>
        {:else}
            <i class="fas fa-play"></i>
        {/if}
    </button>
</div>
