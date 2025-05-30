'use client'
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/provider/theme-provider"
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ScrollToTopButton from "@/components/common/scroll-button";
import ChatToggleButton from "@/components/chat-bot/chatbox";
import StoreProvider, {Props} from "@/components/provider/StoreProvider"; // <-- Import Provider
import { Toaster } from "@/components/ui/sonner"
import {usePathname} from "next/navigation";

const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({ children }: Props) {
    const pathname = usePathname()

    // Kiểm tra nếu là trang đăng nhập hoặc đăng ký
    const isAuthPage = pathname?.startsWith("/signin") || pathname?.startsWith("/signup")

    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <StoreProvider>
            <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
                {isAuthPage ? (
                    // Trang auth (không có Header/Footer)
                    <main className="min-h-screen">
                        {children}
                        <Toaster />
                    </main>
                ) : (
                    // Trang thường (có đầy đủ layout)
                    <main className="min-h-screen">
                        <Header />
                        <div className="pt-24 sm:pt-28 md:pt-32">
                            {children}
                        </div>
                        <Toaster />
                        <Footer />
                        <ScrollToTopButton />
                        <ChatToggleButton />
                    </main>
                )}
            </ThemeProvider>
        </StoreProvider>
        </body>
        </html>
    )
}
