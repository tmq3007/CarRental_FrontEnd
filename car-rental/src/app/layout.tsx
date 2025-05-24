import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/redux-provider" // <-- Import Provider

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
                {children}
            </ThemeProvider>
        </ReduxProvider>
        </body>
        </html>
    )
}
