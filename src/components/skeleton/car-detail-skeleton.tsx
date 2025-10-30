import { Skeleton } from "../ui/skeleton"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Breadcrumb from "@/components/common/breadcum";

// Skeleton Components
function BreadcrumbSkeleton() {
    return (
        <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-4 w-12" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-8" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-24" />
        </div>
    )
}

function CarImageCarouselSkeleton() {
    return (
        <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-lg">
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="flex justify-center space-x-2">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-3 h-3 rounded-full" />
                ))}
            </div>
        </div>
    )
}

function CarInfoHeaderSkeleton() {
    return (
        <div className="flex justify-between items-start">
            <div className="space-y-6 flex-1">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-16" />
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="w-4 h-4 rounded" />
                            ))}
                        </div>
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
        </div>
    )
}

function BasicInformationTabSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-3 w-80 mt-2" />
            </div>
        </div>
    )
}

function DetailsTabSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-52" />
            <div>
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-72 mt-1" />
            </div>
            <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            <div>
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <Skeleton className="w-4 h-4" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="w-4 h-4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function TermsTabSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export  default  function CarDetailsPageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <Breadcrumb items={[{ label: "Home", path: "/" },
                    { label: "Cars", path: "/cars" },
                    { label: "Detail" }]} />
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Car Details</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <CarImageCarouselSkeleton />
                    </div>

                    <div className="space-y-6">
                        <CarInfoHeaderSkeleton />
                    </div>
                </div>

                <div className="mt-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 max-w-md">
                            <TabsTrigger value="basic">Basic Information</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="terms">Terms of use</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="mt-6">
                            <div className="border rounded-lg">
                                <BasicInformationTabSkeleton />
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="mt-6">
                            <div className="border rounded-lg">
                                <DetailsTabSkeleton />
                            </div>
                        </TabsContent>

                        <TabsContent value="terms" className="mt-6">
                            <div className="border rounded-lg">
                                <TermsTabSkeleton />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}