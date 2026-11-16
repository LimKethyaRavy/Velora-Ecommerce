import React from 'react'

const ProductCardSkeleton = () => {
  return (
    <div>
         <div className="animate-pulse">

            {/* Image Skeleton */}
            <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg">
            </div>

            {/* Product Information */}
            <div className="mt-3 space-y-3">

                {/* Product Name */}
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>

                {/* Price */}
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>

                {/* Button */}
                <div className="h-10 bg-gray-200 rounded-md w-full"></div>

            </div>

        </div>
    </div>
  )
}

export default ProductCardSkeleton