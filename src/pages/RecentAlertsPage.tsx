import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
  Search,
  Zap,
  ArrowRight,
  Eye,
  MousePointerClick,
  Sparkles,
  ExternalLink,
  Tag,
  KeyRound,
  ArrowUpRight,
} from 'lucide-react';
import { Breadcrumb, Button, Pagination, cn } from '../components/ui/shadcn';
import { CustomDropdown } from '../components/CustomDropdown';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryBadge } from '../components/CategoryBadge';
import { DealCard } from '../components/DealCard';
import { Deal, Category, Brand } from '../data/mockData';
import { formatStatNumber, getDealTypeHashtag } from './HomeAndDealPages';

interface RecentAlertsPageProps {
  deals: Deal[];
  categories: Category[];
  brands: Brand[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const RecentAlertsPage: React.FC<RecentAlertsPageProps> = ({
  deals,
  categories,
  brands,
  onNavigate,
  onRevealDeal,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'trending' | 'high-discount' | 'codes' | 'credits'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Filter deals based on alert tabs, search, and category
  const filteredDeals = useMemo(() => {
    let list = [...deals];

    // Alert filter
    if (selectedFilter === 'today') {
      list = list.filter((d) => d.verifiedAgo.includes('m ago') || d.verifiedAgo.includes('h ago'));
    } else if (selectedFilter === 'trending') {
      list = list.filter((d) => d.isTrending);
    } else if (selectedFilter === 'high-discount') {
      list = list.filter((d) => d.discountPercent >= 50);
    } else if (selectedFilter === 'codes') {
      list = list.filter((d) => d.isCodeRequired);
    } else if (selectedFilter === 'credits') {
      list = list.filter((d) => d.dealType === 'Free Credits' || d.dealType === 'Free Trials');
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((d) => d.categorySlug === selectedCategory);
    }

    // Keyword search within alerts
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.brandName.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.shortDescription.toLowerCase().includes(q)
      );
    }

    // Sort by recent verification time by default
    return list.sort((a, b) => a.verifiedTimestamp - b.verifiedTimestamp);
  }, [deals, selectedFilter, selectedCategory, searchQuery]);

  // Auto-reset to page 1 on filter or search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedCategory, searchQuery]);

  // Paginated Deals slice
  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeals.slice(start, start + pageSize);
  }, [filteredDeals, currentPage, pageSize]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Recent Deal Alerts' },
        ]}
      />

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-2xs">
        {/* Soft Ambient Background Glow */}
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>LIVE VERIFICATION FEED</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Tested every 2 hours</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Recent Deal Alerts
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Real-time feed of hand-tested coupon codes, limited-time flash discounts, and newly verified software packs.
            Every deal is checkout-tested to guarantee it works.
          </p>

          {/* Key Metrics Row */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Deals</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{deals.length}+</p>
            </div>
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Success Rate</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">98.4%</p>
            </div>
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Today</p>
              <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">24 Deals</p>
            </div>
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Paywall</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">Zero ($0)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recent alerts by brand or deal..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">Category:</span>
            <CustomDropdown
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              options={[
                { value: 'all', label: `All Categories (${deals.length})` },
                ...categories.map((c) => ({ value: c.slug, label: c.name })),
              ]}
              className="min-w-[170px]"
            />
          </div>
        </div>

        {/* Horizontal Alert Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'today', label: 'Verified Today' },
            { id: 'trending', label: 'Trending Hot' },
            { id: 'high-discount', label: '50%+ Discounts' },
            { id: 'codes', label: 'Promo Codes' },
            { id: 'credits', label: 'Credits & Trials' },
          ].map((tab) => {
            const isSelected = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
                className={cn(
                  'whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF] transition-colors',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-slate-100">{filteredDeals.length}</strong> deal alert
          {filteredDeals.length === 1 ? '' : 's'}
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Deals Stream List */}
      {filteredDeals.length > 0 ? (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:p-4 shadow-2xs">
            {paginatedDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => onNavigate(`/deals/${deal.slug}`)}
                className="py-4 first:pt-2 last:pb-2 px-2 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
              >
                {/* Left Brand Info + Content */}
                <div className="flex items-start gap-3.5 sm:gap-4.5 min-w-0 flex-1">
                  <div className="shrink-0 flex flex-col items-center">
                    <BrandLogo
                      brandSlug={deal.brandSlug}
                      brandName={deal.brandName}
                      initials={deal.brandInitials}
                      colorClass={deal.brandColor}
                      size="md"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shadow-2xs"
                    />
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold mt-1.5 whitespace-nowrap">
                      +{deal.extraDealsCount || 1} Deals
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    {/* Meta tag line */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {deal.brandName}
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {getDealTypeHashtag(deal.dealType)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {deal.verifiedAgo}
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3 text-slate-400" />
                        {formatStatNumber(deal.views)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-slate-400" />
                        {formatStatNumber(deal.clicks)} clicks
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {deal.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                      {deal.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Right: Value Badge + Actions */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs sm:text-sm border border-blue-200/80 dark:border-blue-900/50">
                    {deal.valueBadge}
                  </span>

                  <Button
                    size="sm"
                    variant={deal.isCodeRequired ? 'default' : 'emerald'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRevealDeal(deal);
                    }}
                    className="h-9 px-3.5 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    {deal.isCodeRequired ? (
                      <>
                        <KeyRound className="h-3.5 w-3.5 mr-1" />
                        <span>Reveal</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                        <span>Claim</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredDeals.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredDeals.length / pageSize)}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              totalItems={filteredDeals.length}
              pageSize={pageSize}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 30]}
              itemLabel="alerts"
            />
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Bell className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No deal alerts found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            No alerts match your current filter criteria. Try resetting your search or choosing another category.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFilter('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Newsletter Subscription Box */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 text-center space-y-4 shadow-2xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>INSTANT ALERTS NOTIFICATIONS</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
          Never miss an expiring developer credit or discount
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Subscribe to our alert stream to get instant email pings when high-value packs from OpenAI, Google Cloud, Canva, and AWS drop.
        </p>

        {subscribed ? (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>You're subscribed! You will receive new deal alerts as soon as verified.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
            <Button type="submit" size="sm" className="h-10 px-4 font-semibold rounded-xl">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
