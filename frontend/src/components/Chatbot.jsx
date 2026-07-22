import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const Chatbot = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your jewelry store assistant. How can I help you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        // Add user message to chat
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        try {
            const response = await axios.post(buildApiUrl('/chatbot/chat'), {
                message: userMessage,
                conversationHistory: messages.slice(1) // Exclude initial greeting
            });

            if (response.data.success) {
                setMessages([...newMessages, {
                    role: 'assistant',
                    content: response.data.response,
                    actionLinks: response.data.actionLinks || []
                }]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages([...newMessages, {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble responding right now. Please try again later or contact our customer support.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Hide chatbot on login and signup pages
    const hiddenPaths = ['/login', '/register', '/verify-otp'];
    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <>
            {/* Chat Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <h3 className="font-semibold">Jewelry Assistant</h3>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    {message.actionLinks && message.actionLinks.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {message.actionLinks.map((link, linkIndex) => (
                                                <a
                                                    key={linkIndex}
                                                    href={link.url}
                                                    target={link.type === 'external' ? '_blank' : '_self'}
                                                    rel={link.type === 'external' ? 'noopener noreferrer' : ''}
                                                    className="inline-block px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-full transition-colors duration-200"
                                                >
                                                    {link.text}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={16} className="text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows="1"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
