import React from 'react';

export default function SkeletonProductCard() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
      <div className="shimmer h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-4 w-3/4 rounded-full" />
        <div className="shimmer h-3 w-full rounded-full" />
        <div className="shimmer h-3 w-2/3 rounded-full" />
        <div className="flex items-center justify-between mt-4">
          <div className="shimmer h-6 w-20 rounded-full" />
          <div className="shimmer h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
