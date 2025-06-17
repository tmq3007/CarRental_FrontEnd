import "@/app/globals.css"
import { Inter } from "next/font/google"
import {Props} from "@/components/provider/StoreProvider";

const inter = Inter({ subsets: ["latin"] })

 export const metadata = {
     title: "Admin", // ← Thay đổi tiêu đề tab
     description: "Thuê xe chất lượng cao",
     icons: {
         icon: "/car-icon.svg",
     },
 }

export default function RootLayout({ children }: Props) {

    return (
        <>
                    <div>
                        <div>
                            {children}
                        </div>
                    </div>
        </>
    )
}
