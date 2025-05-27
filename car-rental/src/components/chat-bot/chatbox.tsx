'use client';

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatboxModal from "@/components/chat-bot/chatbox-modal";

export default function ChatToggleButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Nút mở/đóng chat */}
            <Button
                onClick={toggleChat}
                size="icon"
                className="fixed bottom-6 right-16 z-50 bg-blue-500 hover:bg-blue-700 rounded-full shadow-lg"
                variant="default"
                aria-label="Toggle chat"
            >
                <MessageSquare className="w-5 h-5" />
            </Button>

            {/* Hộp chat (nếu mở) */}
            {isOpen && (
                <div className="fixed bottom-20 right-16 z-50   max-w-full">
                    <ChatboxModal />
                </div>
            )}
        </>
    );
}
