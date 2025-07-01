'use client';

import { useState, useEffect, useRef } from 'react';
import { useAskChatbotMutation } from '@/lib/services/chatbot-api';

export default function ChatboxModal() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
    const [askChatbot, { isLoading }] = useAskChatbotMutation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        const userQuestion = question;
        setQuestion('');
        setMessages(prev => [...prev, { role: 'user', text: userQuestion }]);

        try {
            const res = await askChatbot({ question: userQuestion }).unwrap();
            setMessages(prev => [...prev, { role: 'bot', text: res.answer }]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'bot',
                    text: '⚠️ The chatbot is currently experiencing issues. Please try again later.',
                },
            ]);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[450px] w-[300px] bg-gray-50 border rounded-2xl shadow-xl overflow-hidden">
            <header className="bg-emerald-500 text-white py-3 px-5 text-center">
                <h1 className="text-lg font-semibold">AI Assistant</h1>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center text-gray-400 text-sm mt-16">
                        Start a conversation...
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                msg.role === 'user'
                                    ? 'bg-emerald-500 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none border'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[70%] px-4 py-2 rounded-2xl border bg-white text-gray-600 animate-pulse text-sm">
                            Typing...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </main>

            <footer className="bg-white p-3 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-4  py-2 text-sm border rounded-full focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className="bg-emerald-500 mr-2 hover:bg-emerald-600 text-white px-2 py-2 rounded-full text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
}
