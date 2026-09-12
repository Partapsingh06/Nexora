import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-md p-4 border border-gray-200 shadow-sm flex flex-col justify-between animate-pulse">
    <div>
      <div className="w-full h-44 bg-gray-200 rounded-md mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
    </div>
    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
      <div className="h-6 bg-gray-200 rounded w-2/5"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const CategoryBarSkeleton = () => (
  <div className="flex items-center justify-start sm:justify-around gap-6 overflow-x-auto py-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-2 animate-pulse flex-shrink-0">
        <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
        <div className="w-12 h-3 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
    {/* Left image column skeleton */}
    <div className="md:col-span-5 space-y-4">
      <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
      <div className="flex gap-3 justify-center">
        <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
        <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
        <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="h-12 bg-gray-200 rounded-md"></div>
        <div className="h-12 bg-gray-200 rounded-md"></div>
      </div>
    </div>

    {/* Right details column skeleton */}
    <div className="md:col-span-7 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);
