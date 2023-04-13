import * as Turbo from "@hotwired/turbo";
import { Modal } from 'bootstrap';

document.addEventListener('turbo:load', () => {
    const prompt = document.getElementById("prompt");
    const chatContainer = document.getElementById("chat-container");
    const chatIndicator = document.getElementById("chat-indicator");
    const callGPTAPI = document.getElementById("call-gpt-api");

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    document.getElementById("greeting").innerHTML = greeting;
    
    function addChatBubble(role, content) {
        const chatBubble = document.createElement("div");
        chatBubble.classList.add("chat-bubble", role);
        const message = document.createElement("p");
        message.innerText = content;
        chatBubble.appendChild(message);
        chatContainer.appendChild(chatBubble);
        chatContainer.scrollBottom = chatContainer.scrollHeight;
    }

    function showChatIndicator() {
        chatIndicator.style.display = "flex";
    }

    function hideChatIndicator() {
        chatIndicator.style.display = "none";
    }


    function typeResponse(response) {
        const botMessage = response.trim();
        const chatBubble = document.createElement("div");
        chatBubble.classList.add("chat-bubble", "bot");
        chatContainer.appendChild(chatBubble);
        const message = document.createElement("p");
        chatBubble.appendChild(message);
        const words = botMessage.split(" ");
        let i = 0;

        const typeWord = () => {
            if (i < words.length) {
                message.innerText += words[i];
                if (i < words.length - 1) {
                    message.innerText += " ";
                }
                i++;
                setTimeout(() => {
                    typeWord();
                }, Math.floor(Math.random() * 200) + 50);
            } else {
                message.innerText = botMessage;
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        };
        typeWord();
    }

    
    callGPTAPI.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = prompt.value.trim();
        if (message === "") return;
    
        addChatBubble("user", message);
        prompt.value = "";

        showChatIndicator();
    
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '5006587f3dmshcdcc56d3e31c495p19681djsn4a9f5cfa3930',
                'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
            },
            body: `{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"${message}"}]}`
        };
    
        fetch('https://openai80.p.rapidapi.com/chat/completions', options)
            .then(response => response.json())
            .then(response => {
                hideChatIndicator();
                if (response.choices && response.choices.length > 0) {
                    const botResponse = response.choices[0].message.content;
                    typeResponse(botResponse);
                } else {
                    console.error("No response from the API");
                }
            })
            .catch(err => {
                hideChatIndicator();
                console.error(err);
            });
    });
});
