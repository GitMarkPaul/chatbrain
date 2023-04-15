import * as Turbo from "@hotwired/turbo";
import { Modal } from 'bootstrap';
import { rapidApiKey, rapidApiHost, rapidApiChatCompletions } from '../../config.js';

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
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': rapidApiHost
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `${message}`
                }]
            })
        };
    
        fetch(rapidApiChatCompletions, options)
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

    // Dropdown
    const toggleDropdown = (dropdown) => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        dropdownMenu.classList.toggle('show');
    };
    
    const closeDropdowns = () => {
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach(dropdownMenu => {
			if (dropdownMenu.classList.contains('show')) {
				dropdownMenu.classList.remove('show');
			}
        });
    };
    
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', () => {
			const dropdown = dropdownToggle.closest('.dropdown');
			toggleDropdown(dropdown);
        });
    });
    
    document.addEventListener('click', event => {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
			if (!dropdown.contains(event.target)) {
				const dropdownMenu = dropdown.querySelector('.dropdown-menu');
				if (dropdownMenu.classList.contains('show')) {
					dropdownMenu.classList.remove('show');
				}
			}
        });
    });
    
    const menuItems = document.querySelectorAll('.dropdown-menu li a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
			const dropdown = item.closest('.dropdown');
			toggleDropdown(dropdown);
        });
    });
});
