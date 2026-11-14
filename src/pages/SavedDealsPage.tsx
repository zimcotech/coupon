import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Deal } from '../data/mockData';
import { useSavedDeals } from '../context/SavedDealsContext';
import { Button, Breadcrumb, Pagination } from '../components/ui/shadcn';
import { DealCard } from '../components/DealCard';
import { DealGridSkeleton } from '../components/DealGridSkeleton';
import { useDealsLoading } from '../context/DealsLoadingContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { motion, AnimatePresence } from 'framer-motion';
import { dealGridContainerVariants } from '../utils/motionVariants';

interface SavedDealsPageProps {
  allDeals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const SavedDealsPage: React.FC<SavedDealsPageProps> = ({
  allDeals,
  onNavigate,
  onRevealDeal,
}) => {
  const { savedDealIds, clearSaved } = useSavedDeals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const { isSectionLoading, triggerLazyFetch } = useDealsLoading();

  // Scroll-based loading trigger for Saved Deals grid
  const [savedGridRef, savedGridVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '150px 0px',
    freezeOnceVisible: true,
  });

  // Filter deals to only saved ones
  const savedDeals = useMemo(() => {
    return allDeals.filter((d) => savedDealIds.includes(d.id));
  }, [allDeals, savedDealIds]);

  // Available categories among saved deals
  const categories = useMemo(() => {
    const cats = new Set(savedDeals.map((d) => d.categoryName));
    return ['all', ...Array.from(cats)];
  }, [savedDeals]);

  // Filtered by search and category
  const filteredDeals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return savedDeals.filter((d) => {
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.brandName.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.valueBadge.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'all' || d.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [savedDeals, searchQuery, selectedCategory]);

  // Reset page when search or category filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeals.slice(start, start + pageSize);
  }, [filteredDeals, currentPage, pageSize]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Saved Deals' },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/50">
              <Bookmark className="h-4 w-4 fill-current" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {savedDeals.length} Bookmarked {savedDeals.length === 1 ? 'Deal' : 'Deals'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            Your Saved Deals & Promo Codes
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Quickly access your bookmarked discounts, voucher codes, and startup credits. Your saved deals are stored locally in your browser for instant retrieval whenever you checkout.
          </p>
        </div>

        {savedDeals.length > 0 && (
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSaved}
              className="h-9 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All Saved
            </Button>
          </div>
        )}
      </div>

      {savedDeals.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl sm:rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-4 max-w-xl mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Bookmark className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              No saved deals yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Whenever you find a deal or promo code you want to use later, bookmark it to access it here anytime.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="h-10 px-5 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
            >
              <span>Explore Trending Deals</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Populated State */
        <div className="space-y-6">
          {/* Controls: Search + Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved deals by brand or keyword..."
                className="w-full h-10 pl-10 pr-4 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
              />
            </div>

            {categories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
                {categories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap shrink-0 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF] ${
                        active
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      {cat === 'all' ? (
                        <Sparkles className="h-3 w-3" />
                      ) : (
                        <Layers className="h-3 w-3" />
                      )}
                      <span>{cat === 'all' ? 'All Saved' : cat}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deal Cards Fluid Grid with Shimmer Skeleton */}
          {filteredDeals.length > 0 ? (
            <div ref={savedGridRef} className="space-y-6">
              {!savedGridVisible || isSectionLoading('saved-deals') ? (
                <DealGridSkeleton count={Math.min(filteredDeals.length, pageSize)} />
              ) : (
                <motion.div
                  key={`saved-deals-${selectedCategory}-${searchQuery}-${currentPage}`}
                  variants={dealGridContainerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedDeals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        layout="position"
                        layoutId={`saved-deal-${deal.id}`}
                        deal={deal}
                        onNavigate={onNavigate}
                        onRevealDeal={onRevealDeal}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {filteredDeals.length > pageSize && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredDeals.length / pageSize)}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    triggerLazyFetch('saved-deals', 180);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  totalItems={filteredDeals.length}
                  pageSize={pageSize}
                  onPageSizeChange={(s) => {
                    setPageSize(s);
                    setCurrentPage(1);
                    triggerLazyFetch('saved-deals', 180);
                  }}
                  pageSizeOptions={[9, 18, 27]}
                  itemLabel="saved deals"
                />
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No saved deals match "{searchQuery}".
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs rounded-lg"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
