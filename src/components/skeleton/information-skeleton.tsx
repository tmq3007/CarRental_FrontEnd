export const InformationSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column Skeleton */}
                <div className="space-y-4">
                    {/* Full Name Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>

                    {/* Phone Number Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>

                    {/* Address Section Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="space-y-2">
                            {/* House Number/Street */}
                            <div className="h-10 bg-gray-200 rounded"></div>

                            {/* City/Province */}
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>

                            {/* District */}
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>

                            {/* Ward */}
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="space-y-4">
                    {/* Date of Birth Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>

                    {/* National ID Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>

                    {/* Driving License Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex justify-end gap-3 pt-6 border-t">
                <div className="h-10 w-20 bg-gray-200 rounded"></div>
                <div className="h-10 w-16 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}

export default InformationSkeleton
