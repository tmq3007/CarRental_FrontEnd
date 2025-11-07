import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarCardSkeletonProps {
    showConfirmPayment?: boolean
}

export function CarCardSkeleton({ showConfirmPayment = false }: CarCardSkeletonProps) {
    return (
        <Card className="bg-white">
            <CardContent className="p-6">
                <div className="flex gap-6">
                    {/* Navigation Arrow Left */}
                    <Button variant="ghost" size="icon" className="self-center" disabled>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Car Image Skeleton */}
                    <div className="relative w-64 h-40">
                        <Skeleton className="w-full h-full rounded" />
                        {/* Dots indicator skeleton */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <Skeleton className="w-2 h-2 rounded-full" />
                        </div>
                    </div>

                    {/* Navigation Arrow Right */}
                    <Button variant="ghost" size="icon" className="self-center" disabled>
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Car Details Skeleton */}
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-64" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Skeleton key={starIndex} className="h-4 w-4" />
                                    ))}
                                    <Skeleton className="h-4 w-24 ml-2" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-8" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-14" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                        {showConfirmPayment && <Skeleton className="h-8 w-24" />}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
