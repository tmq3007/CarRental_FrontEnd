import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/provider/theme-provider"
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ScrollToTopButton from "@/components/common/scroll-button";
import ChatToggleButton from "@/components/chat-bot/chatbox";
import StoreProvider, {Props} from "@/components/provider/StoreProvider"; // <-- Import Provider

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Car Rental Marketplace",
    description: "Rent a car today or list your car for rent",
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <StoreProvider>
            <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
                <main className="min-h-screen">
                    <Header />
                    <div className="pt-24 sm:pt-28 md:pt-32">
                        {children}
                    </div>
                    <Footer />
                    <ScrollToTopButton />
                    <ChatToggleButton />
                </main>
            </ThemeProvider>
        </StoreProvider>
        </body>
        </html>
    )
}
