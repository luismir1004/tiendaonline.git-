import React from 'react';

const SkeletonProduct = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 animate-pulse">
      {/* Image placeholder - Aspect Ratio 4/5 match */}
      <div className="relative w-full pb-[125%] bg-slate-200"></div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Category placeholder */}
        <div className="h-3 w-20 bg-slate-200 rounded mb-3"></div>
        
        {/* Title placeholder */}
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-3"></div>
        
        {/* Description placeholder - 2 lines */}
        <div className="space-y-2 mb-6 flex-grow">
          <div className="h-3 w-full bg-slate-200 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
        </div>
        
        {/* Price and Button placeholder */}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-8 w-24 bg-slate-200 rounded"></div>
          <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProduct;