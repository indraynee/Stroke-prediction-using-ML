import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47] animate-pulse">
    <div className="h-6 bg-[#1a1f47] rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-[#1a1f47] rounded w-full mb-2"></div>
    <div className="h-4 bg-[#1a1f47] rounded w-5/6"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-[#1a1f47] rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-[#1a1f47] rounded w-1/3"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-[#1a1f47] rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-[#1a1f47] rounded w-1/3"></div>
          </div>
          <div className="flex-1">
            <div className="h-8 bg-[#1a1f47] rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-[#0f1432] rounded-lg p-8 border border-[#1a1f47] animate-pulse">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 bg-[#1a1f47] rounded-full"></div>
      <div className="flex-1">
        <div className="h-6 bg-[#1a1f47] rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-[#1a1f47] rounded w-1/4"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-[#1a1f47] rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-[#1a1f47] rounded w-full"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-lg p-6 border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

export default {
  CardSkeleton,
  TableSkeleton,
  ProfileSkeleton,
  ChartSkeleton,
};
