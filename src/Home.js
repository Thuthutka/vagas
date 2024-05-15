import React, { useState } from 'react';
import axios from 'axios';
import { FaComments } from 'react-icons/fa';
import './App.css';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const Home = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) {
        const systemMessage = { role: "system", content: "You are a helpful assistant." };

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.text };
        });

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                systemMessage,
                ...apiMessages
            ]
        };

        try {
            await makeRequestWithRetry(apiRequestBody, chatMessages);
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            setError(error.message);
        }
        setIsTyping(false);
    }

    const makeRequestWithRetry = async (apiRequestBody, chatMessages, retries = 5, delay = 1000) => {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            });

            if (response.status === 429) {
                if (retries > 0) {
                    console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return makeRequestWithRetry(apiRequestBody, chatMessages, retries - 1, delay * 2);
                } else {
                    throw new Error('Rate limit exceeded. Please try again later.');
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            setMessages([...chatMessages, {
                text: data.choices[0].message.content,
                sender: "ChatGPT"
            }]);
        } catch (error) {
            throw error;
        }
    }

    return (
        <div>
            <h3>This is the home page</h3>
            <FaComments className="chat-icon" onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className="chat-container">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && <div className="message bot">ChatGPT is typing...</div>}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                    {error && <div className="error">Error: {error}</div>}
                </div>
            )}
        </div>
    );
};

export default Home;
