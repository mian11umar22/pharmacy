"use client"

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-card p-3 md:p-4 flex flex-col h-full animate-pulse border border-border/30">
            {/* Image Skeleton */}
            <div className="relative overflow-hidden rounded-xl bg-gray-200 aspect-[4/5] mb-3 md:mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col flex-grow">
                {/* Category tag skeleton */}
                <div className="w-16 h-3 bg-gray-200 rounded mb-2"></div>

                {/* Title skeletons */}
                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded mb-4"></div>

                {/* Price & Button Action Area Area */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex flex-col gap-1">
                        <div className="w-12 h-2 bg-gray-100 rounded"></div>
                        <div className="w-20 h-5 bg-gray-200 rounded"></div>
                    </div>

                    <div className="w-16 md:w-20 h-8 md:h-10 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}

export default ProductSkeleton
