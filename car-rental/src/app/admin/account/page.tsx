
import AccountManagement from "@/components/admin/account/account-management";
import {SidebarInset, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import Breadcrumb from "@/components/common/breadcum";
import React from "react";

export default function Page() {
    return (
        <SidebarInset>
            <header
                className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <div className="mr-2 h-5">
                        <Breadcrumb items={[{label: "Admin", path: "/admin"}, {label: "Accounts"}]}/>
                    </div>
                </div>
            </header>
        <AccountManagement />
        </SidebarInset>
    );
}