import AccountManagement from "@/components/admin/account/account-management"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

function Breadcrumb({ items }: { items: Array<{ label: string; path?: string }> }) {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                        <span className="text-sm font-medium text-gray-500">{item.label}</span>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default function Page() {
    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="mr-2 h-5">
                        <Breadcrumb items={[{ label: "Admin", path: "/admin" }, { label: "Accounts" }]} />
                    </div>
                </div>
            </header>
            <AccountManagement />
        </SidebarInset>
    )
}
