import GuestHomepageLayout from "@/components/homepage/guest-layout";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ScrollToTopButton from "@/components/common/scroll-button";
import ChatToggleButton from "@/components/chat-bot/chatbox";

export default function HomePage() {
    return (
        <>
            <Header/>
            <GuestHomepageLayout/>
            <Footer/>
            <ScrollToTopButton />
            <ChatToggleButton />
        </>
    );
}