import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Layers,
  ShieldCheck,
  Eye,
  MousePointerClick,
  KeyRound,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from './ui/shadcn';
import { BrandLogo } from './BrandLogo';
import { CategoryBadge } from './CategoryBadge';
import { Deal } from '../data/mockData';

interface DealCardProps {
  deal: Deal;
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onNavigate, onRevealDeal }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="h-full flex flex-col cursor-pointer"
      onClick={() => onNavigate(`/deals/${deal.slug}`)}
    >
      <div className="group h-full flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-shadow">
        <div className="space-y-3">
          {/* Card Header: Brand Logo + Brand Info (min-w-0 flex-1) + Compact Pill Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(`/brands/${deal.brandSlug}`);
                }}
                className="cursor-pointer shrink-0 transition-transform group-hover:scale-105"
                aria-label={`View ${deal.brandName} brand page`}
              >
                <BrandLogo
                  brandSlug={deal.brandSlug}
                  brandName={deal.brandName}
                  initials={deal.brandInitials}
                  colorClass={deal.brandColor}
                  size="sm"
                  className="h-10 w-10 sm:h-11 sm:w-11"
                />
              </button>

              <div className="min-w-0 flex-1 space-y-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/brands/${deal.brandSlug}`);
                  }}
                  className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-left truncate block w-full"
                >
                  {deal.brandName}
                </button>
                <div className="flex items-center">
                  <CategoryBadge
                    categorySlug={deal.categorySlug}
                    categoryName={deal.categoryName}
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/categories/${deal.categorySlug}`);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Single-line Status Pill Indicator */}
            {deal.isTrending ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80">
                <Flame className="h-3 w-3 shrink-0" />
                <span>Trending</span>
              </span>
            ) : deal.extraDealsCount ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                <Layers className="h-3 w-3 shrink-0" />
                <span>+{deal.extraDealsCount} Deals</span>
              </span>
            ) : null}
          </div>

          {/* Value Badge & Type (Stacked cleanly below header) */}
          <div className="w-full mt-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
              {deal.valueBadge}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
              {deal.dealType}
            </span>
          </div>

          {/* Deal Title (H3: line-clamp-2, never single-line truncate) & Description */}
          <div className="space-y-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => onNavigate(`/deals/${deal.slug}`)}
              className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer w-full"
            >
              {deal.title}
            </button>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 text-left">
              {deal.shortDescription}
            </p>
          </div>
        </div>

        {/* Card Footer: Metadata (Timestamps, Counters) & Action Button */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>{deal.verifiedAgo}</span>
            </span>

            <div className="flex items-center gap-3 tabular-nums text-xs">
              <span className="inline-flex items-center gap-1" title="Views">
                <Eye className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{deal.views.toLocaleString()}</span>
              </span>
              <span className="inline-flex items-center gap-1" title="Redemptions">
                <MousePointerClick className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{deal.clicks.toLocaleString()}</span>
              </span>
            </div>
          </div>

          <Button
            variant={deal.isCodeRequired ? 'default' : 'emerald'}
            className="w-full justify-between h-9 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl focus-visible:ring-2 focus-visible:ring-[#1565FF] px-3 sm:px-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRevealDeal(deal);
            }}
          >
            <span className="inline-flex items-center gap-2 truncate">
              {deal.isCodeRequired ? (
                <>
                  <KeyRound className="h-4 w-4 shrink-0" />
                  <span>Reveal Code</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                  <span>Claim Deal</span>
                </>
              )}
            </span>
            <span className="rounded bg-black/15 dark:bg-white/15 px-2 py-0.5 font-mono text-[11px] sm:text-xs font-bold tracking-wider shrink-0">
              {deal.code.slice(0, 5)}***
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
