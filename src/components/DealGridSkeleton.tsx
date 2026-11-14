import React from 'react';
import { cn } from './ui/shadcn';

/**
 * DealCardSkeleton
 * Pixel-perfect skeleton replica of the standard 3-column / 4-column DealCard.
 * Uses .skeleton-shimmer so that dimensions, borders, and margins exactly match
 * the loaded state, guaranteeing 0 Cumulative Layout Shift (CLS).
 */
export const DealCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('h-full flex flex-col pointer-events-none select-none', className)}>
      <div className="h-full flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs">
        <div className="space-y-3">
          {/* Card Header: Brand Logo + Brand Info + Pill Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl skeleton-shimmer shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-4 w-24 rounded-md skeleton-shimmer" />
                <div className="h-3 w-16 rounded-full skeleton-shimmer" />
              </div>
            </div>
            <div className="h-5 w-16 rounded-full skeleton-shimmer shrink-0" />
          </div>

          {/* Value Badge & Deal Type Bar */}
          <div className="w-full mt-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
            <div className="h-4 w-28 rounded-md skeleton-shimmer" />
            <div className="h-3 w-12 rounded-md skeleton-shimmer" />
          </div>

          {/* Deal Title (2 lines) & Short Description (2 lines) */}
          <div className="space-y-2 pt-0.5">
            <div className="h-4 w-full rounded-md skeleton-shimmer" />
            <div className="h-4 w-4/5 rounded-md skeleton-shimmer" />
            <div className="h-3 w-full rounded-md skeleton-shimmer mt-2" />
            <div className="h-3 w-2/3 rounded-md skeleton-shimmer" />
          </div>
        </div>

        {/* Card Footer: Metadata (Timestamps, Counters) & Action Button */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3 w-20 rounded-md skeleton-shimmer" />
            <div className="flex items-center gap-3">
              <div className="h-3 w-12 rounded-md skeleton-shimmer" />
              <div className="h-3 w-12 rounded-md skeleton-shimmer" />
            </div>
          </div>
          <div className="h-9 sm:h-10 w-full rounded-lg sm:rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

/**
 * DealListRowSkeleton
 * Pixel-perfect skeleton replica of Recently Verified Deals and Black Friday Deals list rows.
 */
export const DealListRowSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'py-4 first:pt-2 last:pb-2 flex items-start gap-3.5 sm:gap-4.5 rounded-xl px-2 -mx-2 pointer-events-none select-none',
        className
      )}
    >
      {/* Left Column: Brand Logo + Badge */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl skeleton-shimmer shadow-2xs" />
        <div className="w-14 h-4 rounded-full skeleton-shimmer mt-1.5" />
      </div>

      {/* Right Column: Metadata, Timestamp, Title & Snippet */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="h-4 w-24 rounded-md skeleton-shimmer" />
          <div className="h-3 w-16 rounded-md skeleton-shimmer" />
          <div className="h-3 w-12 rounded-md skeleton-shimmer" />
          <div className="h-3 w-14 rounded-md skeleton-shimmer" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-20 rounded-md skeleton-shimmer" />
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="h-4 w-4/5 rounded-md skeleton-shimmer" />
          <div className="h-3.5 w-full rounded-md skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

/**
 * DealStackedRowSkeleton
 * Pixel-perfect skeleton replica of New Arrivals stacked cards.
 */
export const DealStackedRowSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs pointer-events-none select-none text-left flex flex-col justify-between',
        className
      )}
    >
      <div className="space-y-3">
        {/* Top: Logo & Brand + Badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl skeleton-shimmer shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 rounded skeleton-shimmer" />
              <div className="h-4 w-28 rounded skeleton-shimmer" />
            </div>
            <div className="h-3 w-24 rounded skeleton-shimmer" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-4 w-5/6 rounded skeleton-shimmer" />
          <div className="h-3 w-full rounded skeleton-shimmer" />
        </div>
      </div>

      {/* Button */}
      <div className="pt-2 mt-3.5">
        <div className="w-full h-10 sm:h-11 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export interface DealGridSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list' | 'stacked' | 'carousel';
  className?: string;
  gridColsClass?: string;
}

/**
 * DealGridSkeleton
 * Primary global skeleton component to be rendered in place of deal collections
 * while deals are loading or being lazily fetched.
 */
export const DealGridSkeleton: React.FC<DealGridSkeletonProps> = ({
  count = 6,
  variant = 'grid',
  className = '',
  gridColsClass,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'carousel') {
    return (
      <div
        className={cn(
          'flex items-stretch gap-3.5 sm:gap-4 overflow-x-hidden -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 pointer-events-none select-none',
          className
        )}
        aria-busy="true"
        aria-label="Loading trending deals carousel..."
      >
        {items.map((i) => (
          <div
            key={i}
            className="w-[84vw] min-w-[270px] max-w-[325px] sm:w-[320px] shrink-0 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs text-left flex flex-col justify-between min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl skeleton-shimmer shrink-0" />
                <div className="h-5 w-24 rounded-md skeleton-shimmer" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-20 rounded skeleton-shimmer" />
                <div className="h-4 w-4/5 rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="h-3 w-24 rounded skeleton-shimmer" />
              <div className="h-3 w-16 rounded skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div
        className={cn('divide-y divide-slate-100 dark:divide-slate-800 pt-1', className)}
        aria-busy="true"
        aria-label="Loading verified deals..."
      >
        {items.map((i) => (
          <DealListRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={cn('space-y-3.5 sm:space-y-4', className)}
        aria-busy="true"
        aria-label="Loading new arrival deals..."
      >
        {items.map((i) => (
          <DealStackedRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  const defaultGridCols = gridColsClass || 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';

  return (
    <div
      className={cn(defaultGridCols, className)}
      aria-busy="true"
      aria-label="Loading deals..."
    >
      {items.map((i) => (
        <DealCardSkeleton key={i} />
      ))}
    </div>
  );
};
