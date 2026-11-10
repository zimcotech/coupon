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
        'rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs pointer-events-none select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        <div className="h-11 w-11 rounded-xl skeleton-shimmer shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 rounded-md skeleton-shimmer" />
            <div className="h-4 w-12 rounded-full skeleton-shimmer" />
          </div>
          <div className="h-4 w-4/5 rounded-md skeleton-shimmer" />
        </div>
      </div>

      <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="h-7 w-24 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
};

export interface DealGridSkeletonProps {
  count?: number;
  variant?: 'grid' | 'list' | 'stacked';
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
        className={cn('space-y-3', className)}
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
