// app/(auth)/layout.tsx
"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
                <main className="min-h-screen flex items-center justify-center">
                    <div className="w-full max-w-md p-6">
                        {children}
                    </div>
                    <Toaster />
                </main>
            </ThemeProvider>
        </Provider>
        </body>
        </html>
    )
}