"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Send, MessageCircle, User, Bot, Loader2 } from "lucide-react"
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {useGetUserByIdQuery} from "@/lib/services/user-api";
import {useGetCompletionMutation} from "@/lib/services/chatbot-api";

interface Message {
    question: string
    answer?: string
}

const STORAGE_KEY = "chat-history"

const ChatboxModal: React.FC = () => {
    const [input, setInput] = useState("")
    const [chatHistory, setChatHistory] = useState<Message[]>([])
    const userId = useSelector((state: RootState) => state.user?.id);

    const {
        data: user,
        isLoading: userLoading,
        error: userError,
    } = useGetUserByIdQuery(userId)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [getCompletion, { data, isLoading, error }] = useGetCompletionMutation();

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory])

    // Load chat history from localStorage when component mounts
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            setChatHistory(JSON.parse(saved))
        }
    }, [])

    // Update chat history when new answer arrives
    useEffect(() => {
        if (!isLoading && data && data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const answer = data.candidates[0].content.parts[0].text
            setChatHistory((prev) => {
                const updated = [...prev]
                updated[updated.length - 1].answer = answer
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
        }
    }, [data, isLoading])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        // Include user data if available
        let messageToSend = input
        if (!userLoading && !userError && user) {
            messageToSend = `User info: ${JSON.stringify(user)}. Question: ${input}`
        }

        // Add new question to history (without answer yet)
        const newChat: Message = { question: input }
        setChatHistory((prev) => {
            const updated = [...prev, newChat]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })

        await getCompletion(messageToSend)
        setInput("")
    }

    const clearHistory = () => {
        setChatHistory([])
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <div className="flex flex-col h-[450px] max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">AI Assistant</h2>
                            <p className="text-blue-100 text-sm">
                                {userLoading ? "Loading user..." : user ? `Hello, ${user.data.fullName || "User"}!` : "Ready to help"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clearHistory}
                        className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Clear Chat
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatHistory.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h3>
                        <p className="text-gray-500">Ask me anything and I'll be happy to help!</p>
                    </div>
                )}

                {chatHistory.map((msg, idx) => (
                    <div key={idx} className="space-y-3">
                        {/* User Question */}
                        <div className="flex justify-end">
                            <div className="flex items-start space-x-2 max-w-[80%]">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl rounded-tr-md shadow-lg">
                                    <p className="text-sm leading-relaxed">{msg.question}</p>
                                </div>
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* AI Answer */}
                        {msg.answer ? (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-2 max-w-[80%]">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-lg border border-gray-200">
                                        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{msg.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ) : isLoading && idx === chatHistory.length - 1 ? (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-lg border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                            <span className="text-sm text-gray-600">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Messages */}
            {userError && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                    <p className="text-red-600 text-sm">⚠️ Error loading user info</p>
                </div>
            )}
            {error && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                    <p className="text-red-600 text-sm">⚠️ Error: {(error as any).message}</p>
                </div>
            )}

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            disabled={isLoading || userLoading}
                        />
                        {input.trim() && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || userLoading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatboxModal
