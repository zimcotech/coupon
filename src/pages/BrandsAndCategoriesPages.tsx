import React, { useState, useMemo } from 'react';
import {
  Search,
  Tag,
  Globe,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building2,
  MapPin,
  ExternalLink,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  Breadcrumb,
  Pagination,
  cn,
} from '../components/ui/shadcn';
import { CustomDropdown } from '../components/CustomDropdown';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryBadge, getCategoryBadgeConfig } from '../components/CategoryBadge';
import { Brand, Category, Deal } from '../data/mockData';
import { DealCard } from '../components/DealCard';
import { DealGridSkeleton } from '../components/DealGridSkeleton';
import { useDealsLoading } from '../context/DealsLoadingContext';

// ============================================================================
// PAGE 3: ALL BRANDS DIRECTORY PAGE (/brands)
// ============================================================================
export interface BrandsDirectoryPageProps {
  brands: Brand[];
  categories: Category[];
  onNavigate: (path: string) => void;
}

export const BrandsDirectoryPage: React.FC<BrandsDirectoryPageProps> = ({
  brands,
  categories,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || brand.categorySlug === selectedCategory;
      const matchesLetter =
        selectedLetter === 'All' ||
        brand.name.toUpperCase().startsWith(selectedLetter);
      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [brands, searchQuery, selectedCategory, selectedLetter]);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLetter]);

  // Paginated Brands slice
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, currentPage, pageSize]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Brands Directory' }]}
      />

      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Software & SaaS Brands Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          Browse verified coupons, cloud credit trials, and discounts across {brands.length}+ developer and business software companies.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by brand name or category..."
              className="w-full h-10 pl-10 pr-4 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
            />
          </div>

          <CustomDropdown
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
            className="w-full sm:w-56 shrink-0"
          />
        </div>

        {/* Scrollable A-Z Letter Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={cn(
                'whitespace-nowrap shrink-0 h-8 px-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
                selectedLetter === letter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Brand Directory Grid (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6) */}
      {filteredBrands.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            {paginatedBrands.map((brand) => (
              <button
                key={brand.slug}
                type="button"
                onClick={() => onNavigate(`/brands/${brand.slug}`)}
                className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-shadow text-left flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <BrandLogo
                    brandSlug={brand.slug}
                    brandName={brand.name}
                    initials={brand.initials}
                    colorClass={brand.colorClass}
                    size="md"
                    className="h-10 w-10 shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {brand.bestDiscount}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 line-clamp-1">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {brand.categoryName}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{brand.activeDealsCount} {brand.activeDealsCount === 1 ? 'deal' : 'deals'}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {filteredBrands.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredBrands.length / pageSize)}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              totalItems={filteredBrands.length}
              pageSize={pageSize}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
              pageSizeOptions={[12, 18, 36]}
              itemLabel="brands"
            />
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No brands matched your search
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query, letter selection, or category filter.
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PAGE 4: BRAND DETAIL PAGE (/brands/[slug])
// ============================================================================
export interface BrandDetailPageProps {
  brand: Brand;
  brandDeals?: Deal[];
  deals?: Deal[];
  allBrands?: Brand[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({
  brand,
  brandDeals,
  deals,
  onNavigate,
  onRevealDeal,
}) => {
  const activeDeals = brandDeals || deals || [];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const { isSectionLoading, triggerLazyFetch } = useDealsLoading();
  const paginatedDeals = activeDeals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Brands', path: '/brands' },
          { label: brand.name },
        ]}
      />

      {/* Main Content + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Brand Profile Banner */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xs">
            <div className="flex items-start gap-4">
              <BrandLogo
                brandSlug={brand.slug}
                brandName={brand.name}
                initials={brand.initials}
                colorClass={brand.colorClass}
                size="lg"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl shrink-0"
              />

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {brand.name}
                  </h1>
                  <CategoryBadge
                    categorySlug={brand.categorySlug}
                    categoryName={brand.categoryName}
                    size="xs"
                    onClick={() => onNavigate(`/categories/${brand.categorySlug}`)}
                  />
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Partner
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Best Discount: <strong className="text-emerald-600 dark:text-emerald-400">{brand.bestDiscount}</strong></span>
                  <span>·</span>
                  <span>{brand.activeDealsCount} active verified deals</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {brand.longDescription || brand.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={brand.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-[#1565FF]"
              >
                <span>Visit {brand.name} Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Updated today with hand-tested codes
              </span>
            </div>
          </div>

          {/* Active Deals for this Brand */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <span>Verified Coupons & Offers for {brand.name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {activeDeals.length}
              </span>
            </h2>

            {isSectionLoading('brand-deals') ? (
              <DealGridSkeleton count={Math.min(activeDeals.length || 4, pageSize)} gridColsClass="grid grid-cols-1 md:grid-cols-2 gap-4" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {activeDeals.length > pageSize && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(activeDeals.length / pageSize)}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  triggerLazyFetch('brand-deals', 180);
                }}
                totalItems={activeDeals.length}
                pageSize={pageSize}
                itemLabel="deals"
              />
            )}
          </section>
        </div>

        {/* Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
            <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
              About {brand.name}
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Category</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{brand.categoryName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Founded</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{brand.foundedYear || 2021}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Headquarters</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{brand.headquarters || 'Global / Remote'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Coupon Success</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">98% Verified</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 leading-relaxed">
                Couponify monitors {brand.name} promotion releases, student programs, and seasonal credit grants directly from their engineering & marketing channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 5: ALL CATEGORIES DIRECTORY PAGE (/categories)
// ============================================================================
export interface CategoriesDirectoryPageProps {
  categories: Category[];
  brands?: Brand[];
  onNavigate: (path: string) => void;
}

export const CategoriesDirectoryPage: React.FC<CategoriesDirectoryPageProps> = ({
  categories,
  onNavigate,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Software Categories' }]}
      />

      <div className="space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Explore Deals by Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          Browse vetted discounts, API credits, developer subscriptions, and design tool perks across specialized software verticals.
        </p>
      </div>

      {/* Categories Grid (Compact Directory Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const config = getCategoryBadgeConfig(category.slug);
          const Icon = config.icon;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onNavigate(`/categories/${category.slug}`)}
              className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-shadow text-left flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className={cn('p-2.5 rounded-xl border', config.bgClass, config.textClass, config.borderClass)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {category.activeDealsCount} Deals
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Browse Deals</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 6: CATEGORY DETAIL PAGE (/categories/[slug])
// ============================================================================
export interface CategoryDetailPageProps {
  category: Category;
  categoryDeals?: Deal[];
  deals?: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  category,
  categoryDeals,
  deals,
  onNavigate,
  onRevealDeal,
}) => {
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const { isSectionLoading, triggerLazyFetch } = useDealsLoading();

  const config = getCategoryBadgeConfig(category.slug);
  const Icon = config.icon;
  const activeDeals = categoryDeals || deals || [];

  const filteredDeals = activeDeals.filter((d) => {
    if (filterType === 'all') return true;
    if (filterType === 'credits') return d.dealType === 'Free Credits';
    if (filterType === 'promo') return d.dealType === 'Promo Codes';
    if (filterType === 'trial') return d.dealType === 'Free Trials';
    return true;
  });

  // Reset to page 1 on filter or category change with smooth lazy fetch simulation
  React.useEffect(() => {
    setCurrentPage(1);
    triggerLazyFetch('category-deals', 200);
  }, [filterType, category.slug, triggerLazyFetch]);

  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeals.slice(start, start + pageSize);
  }, [filteredDeals, currentPage, pageSize]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]}
      />

      {/* Category Header */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={cn('p-3 rounded-xl border', config.bgClass, config.textClass, config.borderClass)}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {category.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {activeDeals.length} Verified Deals
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {category.description}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'all', label: 'All Deals' },
            { id: 'credits', label: 'Free Credits' },
            { id: 'promo', label: 'Promo Codes' },
            { id: 'trial', label: 'Free Trials' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={cn(
                'whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid (Fluid Grid) with Shimmer Skeleton */}
      <section className="space-y-6">
        {isSectionLoading('category-deals') ? (
          <DealGridSkeleton count={Math.min(filteredDeals.length || 6, pageSize)} />
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

        {filteredDeals.length > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredDeals.length / pageSize)}
            onPageChange={(p) => {
              setCurrentPage(p);
              triggerLazyFetch('category-deals', 180);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            totalItems={filteredDeals.length}
            pageSize={pageSize}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
              triggerLazyFetch('category-deals', 180);
            }}
            pageSizeOptions={[6, 12, 24]}
            itemLabel="deals"
          />
        )}
      </section>
    </div>
  );
};
