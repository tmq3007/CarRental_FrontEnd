import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/provider/theme-provider"
import ReduxProvider, {Props} from "@/components/provider/StoreProvider";
import { Toaster } from "@/components/ui/sonner"

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
            <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
                    <main className="min-h-screen">
                        <div>
                            {children}
                        </div>
                        <Toaster />
                    </main>
            </ThemeProvider>
        </ReduxProvider>
        </body>
        </html>
    )
}
