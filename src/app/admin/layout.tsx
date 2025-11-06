import "@/app/globals.css"
import {Inter} from "next/font/google"
import {Props} from "@/components/provider/StoreProvider";
import {AppSidebar} from "@/components/admin/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({subsets: ["latin"]})

export const metadata = {
    title: "Admin", // ← Thay đổi tiêu đề tab
    description: "Thuê xe chất lượng cao",
    icons: {
        icon: "/car-icon.svg",
    },
}

export default function RootLayout({children}: Props) {

    return (
        <>
            <div>
                <div>
                    <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                        <div className="flex min-h-screen w-full">
                            {children}
                        </div>
                    </SidebarProvider>
                </div>
            </div>
        </>
    )
}
