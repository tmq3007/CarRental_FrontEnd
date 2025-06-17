import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/provider/theme-provider"
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ScrollToTopButton from "@/components/common/scroll-button";
import ChatToggleButton from "@/components/chat-bot/chatbox";
import ReduxProvider, {Props} from "@/components/provider/StoreProvider";
import { Toaster } from "@/components/ui/sonner"
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
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ReduxProvider>
            <RedirectOnLogout />
            <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
                    <main className="min-h-screen">
                        <Header />
                        <div className="pt-28">
                            {children}
                        </div>
                        <Toaster />
                        <Footer />
                        <ScrollToTopButton />
                        <ChatToggleButton />
                    </main>
            </ThemeProvider>
        </ReduxProvider>
        </body>
        </html>
    )
}
