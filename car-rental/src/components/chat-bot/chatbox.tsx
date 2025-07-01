'use client';

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatboxModal from "@/components/chat-bot/chatbox-modal";

export default function ChatToggleButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(prev => !prev);

    return (
        <>
            {/* Toggle Button */}
            <Button
                onClick={toggleChat}
                size="icon"
                className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-xl"
                aria-label="Toggle chat"
            >
                {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </Button>

            {/* Chatbox */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 z-50">
                    <ChatboxModal />
                </div>
            )}
        </>
    );
}
