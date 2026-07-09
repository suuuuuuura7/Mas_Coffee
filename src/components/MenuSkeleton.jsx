import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonCard() {
    return (
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 h-full">
            <Skeleton height={224} className="!block" />
            <div className="flex-grow flex flex-col items-center text-center px-4 py-3 gap-2">
                <Skeleton width="70%" height={16} />
                <Skeleton width="90%" height={12} count={2} />
            </div>
            <Skeleton height={36} className="!block !rounded-none" />
        </div>
    );
}

export default function MenuSkeleton({ count = 6 }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <SkeletonCard key={i} />
            ))}
        </>
    );
}