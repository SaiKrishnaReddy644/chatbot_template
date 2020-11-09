import {
    writable,
    readable
} from 'svelte/store'
import uuidv1 from "uuid/v1";

const session = uuidv1();


function updateChatWindow() {
    const {
        subscribe,
        set,
        update
    } = writable({
        chatwindow: false,
        openbutton: true,
        welcome: true
    });

    return {
        subscribe,
        setWindow() {
            update(ui => {
                ui.chatwindow = !ui.chatwindow
                ui.openbutton = !ui.openbutton
                return ui
            })
        },
        openchat() {
            update(ui => {
                ui.welcome = !ui.welcome
                return ui
            })
        }
    }
}



function updateMessage() {
    const {
        subscribe,
        set,
        update
    } = writable([]);
    return {
        subscribe,
        addMessage: (data) => {
            update(n => {
                n.push(data)
                return n
            })
        },
        removeSuggestions: (data) => {
            update(m => {
                if (m.length > 2) {
                    if (m[m.length - 2].components.length > 1) {
                        m[m.length - 2].components.pop();
                    }
                }
                return m
            })
        },
        reset: () => {
            set([])
        },
        restore: (data) => {
            update(n => n = data)
        },
        callApi(request) {
            fetch("/gateway?format=true", {
                    body: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                })
                .then(data => data.json())
                .then(response => {
                    chatbotMessages.addMessage(response);
                });
        },
    };
}

export const chatbotMessages = updateMessage()

export const windowoption = updateChatWindow()

// @ts-ignore
export const user_token = writable({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjEwMTAxMDEwMTAiLCJlbWFpbCI6ImtyaXNoMDEucmRAZ21haWwuY29tIiwiaWF0IjoxNTcwNzIwMjE0ODUwLCJleHRlcm5hbHV1aWQiOiIzYjllYjc4ZS00NTgxLTQ1MWYtOTQzMy1lMmJhOTZjNjYwYzcifQ.wXnzJN1Iyq-ppx2GV2I3qqiFzlWtDpf0JqJAqGulz2Q",
    session
})