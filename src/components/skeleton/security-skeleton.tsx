export const SecuritySkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="max-w-md">
                {/* Heading Skeleton */}
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>

                <div className="space-y-4">
                    {/* New Password Field Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>

                    {/* Confirm Password Field Skeleton */}
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
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

export default SecuritySkeleton
