import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/provider/theme-provider"
import { ReduxProvider } from "@/components/provider/redux-provider"
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ScrollToTopButton from "@/components/common/scroll-button";
import ChatToggleButton from "@/components/chat-bot/chatbox"; // <-- Import Provider

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Car Rental Marketplace",
    description: "Rent a car today or list your car for rent",
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ReduxProvider>
            <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
                <Header/>
                {children}
                <Footer />
                <ScrollToTopButton />
                <ChatToggleButton />

            </ThemeProvider>
        </ReduxProvider>
        </body>
        </html>
    )
}
