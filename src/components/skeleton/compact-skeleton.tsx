import { Skeleton } from "@/components/ui/skeleton"

export function CompactCarListSkeleton() {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Car Cards */}
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="flex gap-4">
                        <Skeleton className="w-32 h-24 rounded" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
