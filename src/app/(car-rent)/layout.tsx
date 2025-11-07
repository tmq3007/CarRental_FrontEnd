

import "@/app/globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ScrollToTopButton from "@/components/common/scroll-button";
import ChatToggleButton from "@/components/chat-bot/chatbox";
import { Props } from "@/components/provider/StoreProvider";
import ClickSpark from "@/blocks/Animations/ClickSpark/ClickSpark";
import RedirectOnLogout from "@/components/common/redirect-on-logout";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Car Rental", // ← Thay đổi tiêu đề tab
    description: "Thuê xe chất lượng cao",
    icons: {
        icon: "/car-icon.svg",
    },
}

export default function RootLayout({ children }: Props) {

    return (
        <>
            <RedirectOnLogout />
            <div>
                <Header />
                <div className="pt-28">
                    {children}
                </div>
                <Footer />
                <ScrollToTopButton />
                <ChatToggleButton />
            </div>
        </>
    )
}
