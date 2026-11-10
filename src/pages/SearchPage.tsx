import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Tag,
  Crown,
  Layers,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Breadcrumb, Button, Pagination, cn } from '../components/ui/shadcn';
import { CustomDropdown } from '../components/CustomDropdown';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryBadge } from '../components/CategoryBadge';
import { DealCard } from '../components/DealCard';
import { DealGridSkeleton } from '../components/DealGridSkeleton';
import { useDealsLoading } from '../context/DealsLoadingContext';
import { Deal, Brand, Category } from '../data/mockData';

interface SearchPageProps {
  deals: Deal[];
  brands: Brand[];
  categories: Category[];
  initialQuery?: string;
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  deals,
  brands,
  categories,
  initialQuery = '',
  onNavigate,
  onRevealDeal,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'brands'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDealType, setSelectedDealType] = useState<string>('all');
  const [dealPage, setDealPage] = useState(1);
  const [dealPageSize, setDealPageSize] = useState(12);
  const [brandPage, setBrandPage] = useState(1);
  const [brandPageSize, setBrandPageSize] = useState(8);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Deals Loading Hook
  const { isSectionLoading, triggerLazyFetch } = useDealsLoading();

  // Reset pagination to page 1 on search or filter change with smooth lazy fetch simulation
  useEffect(() => {
    setDealPage(1);
    setBrandPage(1);
    triggerLazyFetch('search-deals', 200);
  }, [query, selectedCategory, selectedDealType, activeTab, triggerLazyFetch]);

  // Sync with initialQuery when prop updates
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Focus input on initial mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trendingTags = [
    'OpenAI',
    'Google Workspace',
    'Canva',
    'Cloudways',
    'Vultr',
    'ElevenLabs',
    'Free Credits',
    'Student Deals',
    'Black Friday',
    'Discord',
  ];

  const q = query.trim().toLowerCase();

  // Filtered Deals
  const matchingDeals = useMemo(() => {
    return deals.filter((d) => {
      // Category filter
      if (selectedCategory !== 'all' && d.categorySlug !== selectedCategory) {
        return false;
      }
      // Deal Type filter
      if (selectedDealType !== 'all' && d.dealType !== selectedDealType) {
        return false;
      }
      // Search query filter
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.brandName.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.categoryName.toLowerCase().includes(q) ||
        d.valueBadge.toLowerCase().includes(q)
      );
    });
  }, [deals, q, selectedCategory, selectedDealType]);

  // Filtered Brands
  const matchingBrands = useMemo(() => {
    return brands.filter((b) => {
      if (selectedCategory !== 'all' && b.categorySlug !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q) ||
        (b.shortDescription && b.shortDescription.toLowerCase().includes(q))
      );
    });
  }, [brands, q, selectedCategory]);

  // Paginated Slices for ultra-fast rendering
  const paginatedDeals = useMemo(() => {
    const start = (dealPage - 1) * dealPageSize;
    return matchingDeals.slice(start, start + dealPageSize);
  }, [matchingDeals, dealPage, dealPageSize]);

  const paginatedBrands = useMemo(() => {
    const start = (brandPage - 1) * brandPageSize;
    return matchingBrands.slice(start, start + brandPageSize);
  }, [matchingBrands, brandPage, brandPageSize]);

  const totalResults = matchingDeals.length + matchingBrands.length;

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Search' },
        ]}
      />

      {/* Main Search Input Section */}
      <div className="space-y-4">
        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Search Software Deals & Brands
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Find verified coupons, developer credits, SaaS discounts, and software companies.
          </p>
        </div>

        {/* Elevated Search Bar */}
        <div className="relative flex items-center w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClear();
              }
            }}
            placeholder="Search deals, promo codes, brand names, or software categories..."
            className="w-full h-13 sm:h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trending Keywords Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-1 pb-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0 inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Popular:</span>
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className={cn(
                'shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer font-medium',
                q === tag.toLowerCase()
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        {/* Results Tab View (All / Deals / Brands) */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
          {[
            { id: 'all', label: `All Results (${totalResults})` },
            { id: 'deals', label: `Deals (${matchingDeals.length})` },
            { id: 'brands', label: `Brands (${matchingBrands.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dropdowns: Category & Deal Type */}
        <div className="flex flex-wrap items-center gap-2">
          <CustomDropdown
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            size="sm"
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
            className="min-w-[145px]"
          />

          <CustomDropdown
            value={selectedDealType}
            onChange={(val) => setSelectedDealType(val)}
            size="sm"
            options={[
              { value: 'all', label: 'All Deal Types' },
              { value: 'Promo Codes', label: 'Promo Codes' },
              { value: 'Free Credits', label: 'Free Credits' },
              { value: 'Discounts', label: 'Discounts' },
              { value: 'Free Trials', label: 'Free Trials' },
              { value: 'Student Deals', label: 'Student Deals' },
            ]}
            className="min-w-[140px]"
          />
        </div>
      </div>

      {/* Results Content */}
      <div className="space-y-8">
        {/* 1. Brands Section (if activeTab is 'all' or 'brands') */}
        {(activeTab === 'all' || activeTab === 'brands') && matchingBrands.length > 0 && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-blue-600" />
                <span>Matching Brands ({matchingBrands.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {paginatedBrands.map((brand) => (
                <div
                  key={brand.slug}
                  onClick={() => onNavigate(`/brands/${brand.slug}`)}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <BrandLogo
                      brandSlug={brand.slug}
                      brandName={brand.name}
                      initials={brand.initials}
                      colorClass={brand.colorClass}
                      size="sm"
                      className="w-10 h-10 rounded-lg shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">
                        {brand.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {brand.categoryName} · {brand.activeDealsCount} deals
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                    {brand.bestDiscount}
                  </span>
                </div>
              ))}
            </div>

            {matchingBrands.length > brandPageSize && (
              <Pagination
                currentPage={brandPage}
                totalPages={Math.ceil(matchingBrands.length / brandPageSize)}
                onPageChange={(p) => setBrandPage(p)}
                totalItems={matchingBrands.length}
                pageSize={brandPageSize}
                onPageSizeChange={(s) => {
                  setBrandPageSize(s);
                  setBrandPage(1);
                }}
                pageSizeOptions={[8, 16, 24]}
                itemLabel="brands"
              />
            )}
          </div>
        )}

        {/* 2. Deals Section (if activeTab is 'all' or 'deals') */}
        {(activeTab === 'all' || activeTab === 'deals') && matchingDeals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Matching Verified Deals ({matchingDeals.length})</span>
              </h2>
            </div>

            {isSectionLoading('search-deals') ? (
              <DealGridSkeleton count={Math.min(dealPageSize, 6)} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {paginatedDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onNavigate={onNavigate}
                    onRevealDeal={onRevealDeal}
                  />
                ))}
              </div>
            )}

            {matchingDeals.length > dealPageSize && (
              <Pagination
                currentPage={dealPage}
                totalPages={Math.ceil(matchingDeals.length / dealPageSize)}
                onPageChange={(p) => {
                  setDealPage(p);
                  triggerLazyFetch('search-deals', 180);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                totalItems={matchingDeals.length}
                pageSize={dealPageSize}
                onPageSizeChange={(s) => {
                  setDealPageSize(s);
                  setDealPage(1);
                  triggerLazyFetch('search-deals', 180);
                }}
                pageSizeOptions={[6, 12, 24]}
                itemLabel="deals"
              />
            )}
          </div>
        )}

        {/* 3. Empty State (When no deals or brands match) */}
        {totalResults === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
            <Search className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              No results found for "{query}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any verified coupons or software brands matching your exact search. Try checking your spelling or explore popular categories.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('all');
                  setSelectedDealType('all');
                }}
              >
                Clear Filters & Search
              </Button>
              <Button
                size="sm"
                onClick={() => onNavigate('/')}
              >
                Explore All Deals
              </Button>
            </div>

            {/* Trending Suggestions */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Try searching for these trending brands:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['OpenAI', 'Google Workspace', 'Canva', 'Cloudways', 'Vultr', 'ElevenLabs'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setQuery(b)}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
