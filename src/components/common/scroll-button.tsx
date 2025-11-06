"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTopButton() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bg-blue-500 hover:bg-blue-700 bottom-6 right-6 z-50 rounded-full shadow-lg"
            variant="default"
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-5 h-5" />
        </Button>
    );
}
