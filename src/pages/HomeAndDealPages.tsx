import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Star,
  Flame,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Eye,
  MousePointerClick,
  Copy,
  Check,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Zap,
  Crown,
  Search,
  BellRing,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bot,
  Terminal,
  Cloud,
  Palette,
  GraduationCap,
  Layers,
  KeyRound,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  Pagination,
  Breadcrumb,
  Separator,
  cn,
} from '../components/ui/shadcn';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryBadge } from '../components/CategoryBadge';
import { DealCard } from '../components/DealCard';
import { DealGridSkeleton } from '../components/DealGridSkeleton';
import { useDealsLoading } from '../context/DealsLoadingContext';
import { Deal, Category, Brand, FeaturedItemConfig } from '../data/mockData';

export function getDealTypeHashtag(dealType?: Deal['dealType']): string {
  if (dealType === 'Free Credits') return '#Credits';
  if (dealType === 'Promo Codes') return '#Promo Codes';
  if (dealType === 'Student Deals') return '#Student';
  if (dealType === 'Free Trials') return '#FreeTrial';
  return '#Discounts';
}

export function formatStatNumber(num?: number): string {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

// ============================================================================
// PAGE 1: HOME / EXPLORE DEALS PAGE (/)
// ============================================================================
interface HomePageProps {
  deals: Deal[];
  categories: Category[];
  brands: Brand[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
  onOpenCommandPalette?: () => void;
  featuredItem?: FeaturedItemConfig;
  featuredItems?: FeaturedItemConfig[];
  searchWords?: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  deals,
  categories,
  brands,
  onNavigate,
  onRevealDeal,
  onOpenCommandPalette,
  featuredItem,
  featuredItems,
  searchWords,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState('all');
  const [recentlyVerifiedTab, setRecentlyVerifiedTab] = useState<'latest' | 'updated' | 'popular'>('latest');
  const [blackFridayTab, setBlackFridayTab] = useState<'all' | 'highest' | 'ai-cloud' | 'dev-tools'>('all');

  // Global Skeleton Loading State Integration
  const { isSectionLoading, triggerLazyFetch } = useDealsLoading();

  // Home Page Deal Sections Pagination States
  const [verifiedPage, setVerifiedPage] = useState(1);
  const [verifiedPageSize, setVerifiedPageSize] = useState(10);
  const [blackFridayPage, setBlackFridayPage] = useState(1);
  const blackFridayPageSize = 4;
  const [newArrivalsPage, setNewArrivalsPage] = useState(1);
  const newArrivalsPageSize = 4;

  // Reset pagination to page 1 and trigger seamless lazy fetch when category chip or sorting tab changes
  useEffect(() => {
    setVerifiedPage(1);
    triggerLazyFetch('verified-deals', 260);
  }, [selectedCategoryChip, recentlyVerifiedTab, triggerLazyFetch]);

  useEffect(() => {
    setBlackFridayPage(1);
    triggerLazyFetch('black-friday', 260);
  }, [blackFridayTab, triggerLazyFetch]);

  // Viewflipper animation words for search placeholder (from admin state or defaults)
  const searchFlipperWords = useMemo(() => {
    if (searchWords && searchWords.length > 0) return searchWords;
    return [
      'namecheap discounts',
      'substore discounts',
      'Google ai pro',
      'ChatGPT Plus discount',
      'Vultr cloud credits',
      'Canva Pro promo codes',
    ];
  }, [searchWords]);
  const [searchFlipperIndex, setSearchFlipperIndex] = useState(0);

  // Auto-flip placeholder text every 2.6 seconds
  useEffect(() => {
    if (searchFlipperIndex >= searchFlipperWords.length) {
      setSearchFlipperIndex(0);
    }
    const timer = setInterval(() => {
      setSearchFlipperIndex((prev) => (prev + 1) % searchFlipperWords.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [searchFlipperWords.length, searchFlipperIndex]);

  // Featured Deals Carousel State & Active Items
  const activeFeaturedItems = useMemo(() => {
    if (featuredItems && featuredItems.length > 0) {
      const active = featuredItems.filter((item) => item.isActive);
      if (active.length > 0) return active;
    }
    if (featuredItem && featuredItem.isActive) {
      return [featuredItem];
    }
    return [];
  }, [featuredItems, featuredItem]);

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Guard current index when active list updates
  useEffect(() => {
    if (currentFeaturedIndex >= activeFeaturedItems.length && activeFeaturedItems.length > 0) {
      setCurrentFeaturedIndex(0);
    }
  }, [activeFeaturedItems.length, currentFeaturedIndex]);

  // Auto-advance carousel every 5 seconds when 2 or more featured deals exist (continuous rotation without hover pausing)
  useEffect(() => {
    if (activeFeaturedItems.length < 2) return;

    const timer = setInterval(() => {
      setSlideDirection('next');
      setCurrentFeaturedIndex((prev) => (prev + 1) % activeFeaturedItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeFeaturedItems.length]);

  const handleSelectFeaturedSlide = (idx: number) => {
    setSlideDirection(idx > currentFeaturedIndex ? 'next' : 'prev');
    setCurrentFeaturedIndex(idx);
  };

  // Popular Brands List
  const popularBrandsList = [
    { name: 'Google Workspace', slug: 'google-workspace' },
    { name: 'OpenArt', slug: 'openart' },
    { name: 'Higgsfield', slug: 'higgsfield' },
    { name: 'Blink.new', slug: 'blink' },
    { name: 'PixVerse AI', slug: 'pixverse' },
    { name: 'UpCloud', slug: 'upcloud' },
    { name: 'Cloudways', slug: 'cloudways' },
  ];

  const googleWorkspaceDeal = deals.find((d) => d.brandSlug === 'google-workspace') || deals[0];

  // Trending Deals
  const openaiBiz = deals.find((d) => d.slug === 'chatgpt-business-discount-48-months' || d.id === 'deal-openai-business');
  const openaiPlus = deals.find((d) => d.slug === 'chatgpt-plus-team-discount-save-300' || d.id === 'deal-openai-plus-team');
  const otherTrending = deals.filter(
    (d) => d.id !== 'deal-openai-business' && d.id !== 'deal-openai-plus-team' && d.isTrending
  );

  const trendingList: Deal[] = [
    ...(openaiBiz ? [openaiBiz] : []),
    ...(openaiPlus ? [openaiPlus] : []),
    ...otherTrending,
  ];

  // Black Friday Deals
  const blackFridayDeals = deals.filter(
    (d) => d.isBlackFriday || d.title.toLowerCase().includes('black friday') || d.code.startsWith('BF')
  );
  const effectiveBfDeals = blackFridayDeals.length > 0 ? blackFridayDeals : deals.filter(d => d.discountPercent >= 50);

  const sortedBlackFridayDeals = effectiveBfDeals.filter((deal) => {
    if (blackFridayTab === 'highest') {
      return deal.discountPercent >= 60;
    }
    if (blackFridayTab === 'ai-cloud') {
      return deal.categorySlug === 'ai-tools' || deal.categorySlug === 'cloud-hosting';
    }
    if (blackFridayTab === 'dev-tools') {
      return deal.categorySlug === 'dev-tools' || deal.categorySlug === 'productivity';
    }
    return true;
  });

  const filteredDeals = selectedCategoryChip === 'all'
    ? deals
    : deals.filter((d) => d.categorySlug === selectedCategoryChip);

  const displayList = filteredDeals.length > 0 ? filteredDeals : deals;

  const sortedVerifiedDeals = [...displayList].sort((a, b) => {
    if (recentlyVerifiedTab === 'popular') {
      return b.clicks - a.clicks;
    }
    if (recentlyVerifiedTab === 'updated') {
      return b.views - a.views;
    }
    const priorityOrder = ['deal-veed-referral', 'deal-vultr-300-credits', 'deal-gearup-booster-30'];
    const indexA = priorityOrder.indexOf(a.id);
    const indexB = priorityOrder.indexOf(b.id);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.verifiedTimestamp - b.verifiedTimestamp;
  });

  // Paginated Slices for HomePage Sections
  const paginatedBlackFridayDeals = useMemo(() => {
    const start = (blackFridayPage - 1) * blackFridayPageSize;
    return sortedBlackFridayDeals.slice(start, start + blackFridayPageSize);
  }, [sortedBlackFridayDeals, blackFridayPage, blackFridayPageSize]);

  const paginatedNewArrivals = useMemo(() => {
    const start = (newArrivalsPage - 1) * newArrivalsPageSize;
    return deals.slice(start, start + newArrivalsPageSize);
  }, [deals, newArrivalsPage, newArrivalsPageSize]);

  const paginatedVerifiedDeals = useMemo(() => {
    const start = (verifiedPage - 1) * verifiedPageSize;
    return sortedVerifiedDeals.slice(start, start + verifiedPageSize);
  }, [sortedVerifiedDeals, verifiedPage, verifiedPageSize]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* 1. Refined Hero Section with Subtle Background Texture & Ambient Glow */}
      <section className="relative pt-6 pb-8 sm:pt-12 sm:pb-14 -mx-4 sm:mx-0 px-4 sm:px-6 border-b border-slate-200/70 dark:border-slate-800 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] rounded-none sm:rounded-3xl">
        {/* Soft top ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-none sm:rounded-3xl">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-full max-w-xl rounded-full bg-[#1565FF]/8 blur-3xl" />
        </div>

        {/* Top Eyebrow & Live Status Row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#D7E3FF]/50 border border-[#1565FF]/20 px-3 py-1 text-xs font-semibold text-[#1565FF] dark:bg-[#1565FF]/10 dark:border-[#1565FF]/30 dark:text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1565FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1565FF]" />
            </span>
            <span>500+ Hand-Tested Deals Active</span>
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated 2h ago</span>
          </span>
        </div>

        {/* Editorial Display Headline & Wavy SVG Underline */}
        <div className="space-y-1 text-left">
          <h1 className="text-[36px] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08] text-slate-900 dark:text-slate-50">
            Couponify — Digital Deals,{' '}
            <span className="relative inline-block text-[#1565FF] pb-1">
              Sorted.
              <svg
                className="absolute -bottom-1 left-0 w-full h-2.5 text-[#1565FF]"
                viewBox="0 0 120 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 8 Q 15 2, 27 8 T 51 8 T 75 8 T 99 8 T 117 8"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            The best digital discounts, developer credits, SaaS coupons, and student perks, verified daily by engineers.
          </p>
        </div>

        {/* Elevated Search Bar (Mobile-Optimized) */}
        <div className="mt-6 relative flex items-center w-full max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <button
            type="button"
            onClick={() => onNavigate('/search')}
            className="w-full h-12 sm:h-14 pl-11 pr-4 sm:pr-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#1565FF] focus:ring-4 focus:ring-[#1565FF]/10 transition-shadow flex items-center justify-between cursor-pointer text-left group overflow-hidden"
          >
            <div className="relative flex items-center h-full w-full overflow-hidden">
              <span className="text-slate-400 text-sm sm:text-base font-normal shrink-0 mr-1.5">
                Search
              </span>
              <div className="relative h-6 sm:h-7 flex-1 overflow-hidden flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={searchFlipperIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 text-slate-400 text-sm sm:text-base font-normal truncate max-w-full"
                  >
                    "{searchFlipperWords[searchFlipperIndex]}"
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200/80 dark:border-slate-700 absolute right-3.5">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Scrollable Category Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {[
            { id: 'all', label: 'All Deals', icon: Zap },
            { id: 'ai-tools', label: 'AI Tools', icon: Bot },
            { id: 'cloud-hosting', label: 'Cloud & Hosting', icon: Cloud },
            { id: 'dev-tools', label: 'Dev Tools', icon: Terminal },
            { id: 'design-creative', label: 'Design', icon: Palette },
            { id: 'productivity', label: 'Productivity', icon: TrendingUp },
            { id: 'student-startup', label: 'Student Perks', icon: GraduationCap },
          ].map((chip) => {
            const isSelected = selectedCategoryChip === chip.id;
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedCategoryChip(chip.id)}
                className={cn(
                  'shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#1565FF] cursor-pointer',
                  isSelected
                    ? 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#1565FF] text-white shadow-sm shadow-[#1565FF]/25'
                    : 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{chip.label}</span>
              </button>
            );
          })}
          {/* Proper trailing right-side padding after the last chip */}
          <span className="shrink-0 w-2 sm:w-3 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Balanced 3-Column Trust Metrics Bar */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 py-3.5 px-2 text-center">
          <div className="py-0.5 px-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">100% Tested</p>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">At checkout daily</p>
          </div>
          <div className="py-0.5 px-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">500+ Verified</p>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">SaaS discounts</p>
          </div>
          <div className="py-0.5 px-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">Zero Paywall</p>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Free code access</p>
          </div>
        </div>
      </section>

      {/* 2. Featured Sponsor / Spotlight Deal Card (with Auto-Carousel for 2+ deals) */}
      {activeFeaturedItems.length > 0 && (() => {
        const currentItem = activeFeaturedItems[currentFeaturedIndex] || activeFeaturedItems[0];
        const hasMultiple = activeFeaturedItems.length >= 2;

        const handleCtaClick = () => {
          if (currentItem.dealSlug) {
            const deal = deals.find((d) => d.slug === currentItem.dealSlug || d.id === currentItem.dealSlug);
            if (deal) {
              onNavigate(`/deals/${deal.slug}`);
              return;
            }
          }
          if (currentItem.brandSlug) {
            const brandDeal = deals.find((d) => d.brandSlug === currentItem.brandSlug);
            if (brandDeal) {
              onNavigate(`/deals/${brandDeal.slug}`);
              return;
            }
          }
          if (currentItem.ctaUrl && currentItem.ctaUrl.startsWith('/')) {
            onNavigate(currentItem.ctaUrl);
            return;
          }
          if (googleWorkspaceDeal) {
            onNavigate(`/deals/${googleWorkspaceDeal.slug}`);
            return;
          }
          onNavigate('/brands');
        };

        return (
          <div className="mt-6">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs text-left transition-colors">
              {/* Top Header Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg border border-slate-100 dark:border-slate-800 p-1 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800">
                    <BrandLogo
                      brandSlug={currentItem.brandSlug || 'google-workspace'}
                      brandName={currentItem.brandName || 'Google Workspace'}
                      logoUrl={currentItem.logoUrl || undefined}
                      size="sm"
                      borderless
                      className="h-6 w-6"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D7E3FF]/60 dark:bg-blue-950/80 text-[#1565FF] dark:text-blue-300">
                    {currentItem.badgeLabel || 'FEATURED DEAL'}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/60 shrink-0">
                  <ShieldCheck className="h-3 w-3" />
                  {currentItem.verifiedText || 'Verified'}
                </span>
              </div>

              {/* Card Content with Smooth Slide Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id || currentFeaturedIndex}
                  initial={{ opacity: 0, x: slideDirection === 'next' ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === 'next' ? -12 : 12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {/* Card Title & Description */}
                  <h2 className="mt-3 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {currentItem.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {currentItem.description}
                  </p>

                  {/* CTA Action */}
                  {currentItem.isExternal && currentItem.ctaUrl ? (
                    <a
                      href={currentItem.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                    >
                      <span>{currentItem.ctaText || 'Claim Free Trial'}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCtaClick}
                      className="mt-4 w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                    >
                      <span>{currentItem.ctaText || 'Claim Free Trial'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Auto Carousel Indicator Dots - Redesigned Round Dot Indicators */}
            {hasMultiple && (
              <div
                className="flex items-center justify-center gap-1.5 pt-3.5"
                role="tablist"
                aria-label="Featured deals carousel pagination"
              >
                {activeFeaturedItems.map((item, idx) => {
                  const isSelected = idx === currentFeaturedIndex;
                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`Go to featured deal ${idx + 1} of ${activeFeaturedItems.length}`}
                      onClick={() => handleSelectFeaturedSlide(idx)}
                      className="group flex h-7 w-7 items-center justify-center rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1565FF] touch-manipulation"
                    >
                      <span
                        className={cn(
                          'rounded-full transition-all duration-300 ease-out block',
                          isSelected
                            ? 'h-2.5 w-2.5 bg-[#1565FF] dark:bg-blue-400 ring-4 ring-[#1565FF]/20 dark:ring-blue-400/25 shadow-xs scale-105'
                            : 'h-2 w-2 bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400 dark:group-hover:bg-slate-500 group-hover:scale-125'
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* 2.5. Black Friday Deals Section (Above New Arrivals) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Black Friday Deals
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-2xs">
              EARLY ACCESS
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/brands')}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Show all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Tabs (Same UI as Recently Verified) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {[
            { id: 'all', label: 'All Black Friday' },
            { id: 'highest', label: 'Highest Discounts (60%+)' },
            { id: 'ai-cloud', label: 'AI & Cloud' },
            { id: 'dev-tools', label: 'Dev Tools & Workspaces' },
          ].map((tab) => {
            const isSelected = blackFridayTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setBlackFridayTab(tab.id as 'all' | 'highest' | 'ai-cloud' | 'dev-tools')}
                className={cn(
                  'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
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

        {/* Vertical List of Deals (Same UI Flow as Recently Verified) with Shimmer Skeleton */}
        {isSectionLoading('black-friday') ? (
          <DealGridSkeleton variant="list" count={blackFridayPageSize} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
            {paginatedBlackFridayDeals.map((deal) => {
              return (
                <div
                  key={deal.id}
                  onClick={() => onRevealDeal(deal)}
                  className="py-4 first:pt-2 last:pb-2 flex items-start gap-3.5 sm:gap-4.5 cursor-pointer group hover:bg-slate-50/70 dark:hover:bg-slate-900/50 rounded-xl px-2 -mx-2 transition-colors"
                >
                  {/* Left Column: Brand Logo + Badge ("+X Deals") */}
                  <div className="shrink-0 flex flex-col items-center">
                    <BrandLogo
                      brandSlug={deal.brandSlug}
                      brandName={deal.brandName}
                      initials={deal.brandInitials}
                      colorClass={deal.brandColor}
                      size="md"
                      className="w-12 h-12 rounded-xl shadow-2xs"
                    />
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold mt-1.5 whitespace-nowrap">
                      +{deal.extraDealsCount || 2} {deal.extraDealsCount === 1 ? 'Deal' : 'Deals'}
                    </span>
                  </div>

                  {/* Right Column: Metadata, Timestamp, Title & Snippet */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {deal.brandName}
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        #BlackFriday
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatStatNumber(deal.views)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-slate-400" />
                        {formatStatNumber(deal.clicks)} clicks
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {deal.verifiedAgo}
                      </span>
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                        Limited Time
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200/80 dark:border-red-900/50">
                        {deal.valueBadge}
                      </span>
                    </div>

                    <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-left pt-0.5">
                      {deal.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 text-left pt-0.5">
                      {deal.shortDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Black Friday Deals Pagination Buttons */}
        {sortedBlackFridayDeals.length > blackFridayPageSize && (
          <div className="pt-2">
            <Pagination
              currentPage={blackFridayPage}
              totalPages={Math.ceil(sortedBlackFridayDeals.length / blackFridayPageSize)}
              onPageChange={(p) => {
                setBlackFridayPage(p);
                triggerLazyFetch('black-friday', 200);
              }}
              totalItems={sortedBlackFridayDeals.length}
              pageSize={blackFridayPageSize}
              itemLabel="Black Friday deals"
            />
          </div>
        )}
      </section>

      {/* 3. New Arrivals Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              New Arrivals
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              NEW
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/brands')}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Show all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Clean Stacked Cards for New Arrivals with Shimmer Skeleton */}
        {isSectionLoading('new-arrivals') ? (
          <DealGridSkeleton variant="stacked" count={newArrivalsPageSize} />
        ) : (
          <div className="space-y-3">
            {paginatedNewArrivals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => onRevealDeal(deal)}
                className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-shadow cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <BrandLogo
                    brandSlug={deal.brandSlug}
                    brandName={deal.brandName}
                    initials={deal.brandInitials}
                    colorClass={deal.brandColor}
                    size="md"
                    className="h-11 w-11 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {deal.brandName}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50">
                        New
                      </span>
                      {deal.isLimitedTime && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/50">
                          Limited Time
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 text-left">
                      {deal.title}
                    </h3>
                  </div>
                </div>

                {/* Value Callout on Desktop right, or full-width stacked on mobile */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {deal.valueBadge}
                  </span>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1 sm:hidden">
                    <span>View</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Arrivals Pagination Buttons */}
        {deals.length > newArrivalsPageSize && (
          <div className="pt-2">
            <Pagination
              currentPage={newArrivalsPage}
              totalPages={Math.min(4, Math.ceil(deals.length / newArrivalsPageSize))}
              onPageChange={(p) => {
                setNewArrivalsPage(p);
                triggerLazyFetch('new-arrivals', 200);
              }}
              totalItems={Math.min(16, deals.length)}
              pageSize={newArrivalsPageSize}
              itemLabel="new arrivals"
            />
          </div>
        )}
      </section>

      {/* 4. Popular Brands Section (Compact Brand Directory Grid) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Popular Brands
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/brands')}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Show all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Compact Brand Directory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {popularBrandsList.map((brand) => (
            <button
              key={brand.slug}
              type="button"
              onClick={() => onNavigate(`/brands/${brand.slug}`)}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-shadow text-left cursor-pointer group shadow-2xs"
            >
              <BrandLogo
                brandSlug={brand.slug}
                brandName={brand.name}
                size="sm"
                className="h-8 w-8 shrink-0"
              />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate min-w-0 flex-1">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Trending Deals Section (Scroll Snap Carousel without collision pills) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Trending Deals
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              HOT
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/brands')}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Show all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scroll Snapping Carousel (Cards w-[85vw] max-w-[320px] sm:w-[340px] shrink-0 snap-start) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {trendingList.map((deal) => (
            <div
              key={deal.id}
              onClick={() => onRevealDeal(deal)}
              className="w-[85vw] max-w-[320px] sm:w-[340px] shrink-0 snap-start rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-shadow cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Header: Brand Logo & Value Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <BrandLogo
                      brandSlug={deal.brandSlug}
                      brandName={deal.brandName}
                      initials={deal.brandInitials}
                      size="sm"
                      className="h-9 w-9 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block truncate">
                        {deal.brandName}
                      </span>
                    </div>
                  </div>

                  {deal.isLimitedTime && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-red-50 text-red-700 border border-red-200/80 dark:bg-red-950/60 dark:text-red-300">
                      Limited Time
                    </span>
                  )}
                </div>

                {/* Clean Stacked Value Badge */}
                <div className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {deal.valueBadge}
                  </span>
                </div>

                {/* Deal Title (H3 line-clamp-2) */}
                <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 text-left">
                  {deal.title}
                </h3>
              </div>

              {/* Bottom Metadata */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Popular this week</span>
                </div>
                <div className="flex items-center gap-1">
                  <MousePointerClick className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{deal.clicks >= 1000 ? `${(deal.clicks / 1000).toFixed(1)}k` : deal.clicks} clicks</span>
                </div>
              </div>
            </div>
          ))}

          {/* End Carousel Card: "Explore All Deals" */}
          <div
            onClick={() => onNavigate('/brands')}
            className="w-[85vw] max-w-[240px] sm:w-[260px] shrink-0 snap-start rounded-xl sm:rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <ArrowRight className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Explore All Brands
            </p>
            <p className="text-xs text-slate-500">
              50+ more software deals
            </p>
          </div>
        </div>
      </section>

      {/* 6. Recently Verified Section */}
      <section id="recently-verified-section" className="space-y-4 pt-2 scroll-mt-20">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Recently Verified
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {[
            { id: 'latest', label: 'Latest' },
            { id: 'updated', label: 'Recently Updated' },
            { id: 'popular', label: 'Most Popular' },
          ].map((tab) => {
            const isSelected = recentlyVerifiedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRecentlyVerifiedTab(tab.id as 'latest' | 'updated' | 'popular')}
                className={cn(
                  'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
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

        {/* Vertical List of Deals with Shimmer Skeleton & Pagination */}
        {isSectionLoading('verified-deals') ? (
          <DealGridSkeleton variant="list" count={verifiedPageSize} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
            {paginatedVerifiedDeals.map((deal, idx) => {
              return (
                <div
                  key={`${deal.id}-${idx}`}
                  onClick={() => onRevealDeal(deal)}
                  className="py-4 first:pt-2 last:pb-2 flex items-start gap-3.5 sm:gap-4.5 cursor-pointer group hover:bg-slate-50/70 dark:hover:bg-slate-900/50 rounded-xl px-2 -mx-2 transition-colors"
                >
                  {/* Left Column: Brand Logo + Badge ("+X Deals") */}
                  <div className="shrink-0 flex flex-col items-center">
                    <BrandLogo
                      brandSlug={deal.brandSlug}
                      brandName={deal.brandName}
                      initials={deal.brandInitials}
                      colorClass={deal.brandColor}
                      size="md"
                      className="w-12 h-12 rounded-xl shadow-2xs"
                    />
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold mt-1.5 whitespace-nowrap">
                      +{deal.extraDealsCount || 1} {deal.extraDealsCount === 1 ? 'Deal' : 'Deals'}
                    </span>
                  </div>

                  {/* Right Column: Metadata, Timestamp, Title & Snippet */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {deal.brandName}
                      </span>
                      <span className="font-medium">
                        {getDealTypeHashtag(deal.dealType)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatStatNumber(deal.views)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-slate-400" />
                        {formatStatNumber(deal.clicks)} clicks
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {deal.verifiedAgo}
                      </span>
                      {deal.isLimitedTime && (
                        <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                          Limited Time
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-left pt-0.5">
                      {deal.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 text-left pt-0.5">
                      {deal.shortDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recently Verified Deals Pagination Buttons */}
        <div className="pt-2">
          <Pagination
            currentPage={verifiedPage}
            totalPages={Math.ceil(sortedVerifiedDeals.length / verifiedPageSize)}
            onPageChange={(p) => {
              setVerifiedPage(p);
              triggerLazyFetch('verified-deals', 200);
              const el = document.getElementById('recently-verified-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            totalItems={sortedVerifiedDeals.length}
            pageSize={verifiedPageSize}
            onPageSizeChange={(s) => {
              setVerifiedPageSize(s);
              setVerifiedPage(1);
              triggerLazyFetch('verified-deals', 200);
            }}
            pageSizeOptions={[10, 20, 30]}
            itemLabel="verified deals"
          />
        </div>
      </section>

      {/* Newsletter Card */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 text-center space-y-4 shadow-2xs">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <BellRing className="h-4 w-4 text-blue-600" />
          <span>STAY UPDATED</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Get exclusive software perks, cloud credits, and verified digital deals straight to your inbox weekly.
        </p>

        {newsletterSubscribed ? (
          <div className="space-y-2 pt-2">
            <Sparkles className="h-6 w-6 text-blue-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              You're in! Check your inbox for deals.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newsletterEmail.trim()) setNewsletterSubscribed(true);
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-sm mx-auto pt-1"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address..."
              className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-10 px-5 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shrink-0 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 2: STANDALONE DEAL DETAIL PAGE (/deals/[slug])
// ============================================================================
interface DealDetailPageProps {
  deal: Deal;
  allDeals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
  onIncrementClick: (dealId: string) => void;
}

export const DealDetailPage: React.FC<DealDetailPageProps> = ({
  deal,
  allDeals,
  onNavigate,
  onRevealDeal,
  onIncrementClick,
}) => {
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);
  const { isSectionLoading } = useDealsLoading();

  const relatedDeals = allDeals
    .filter((d) => d.categorySlug === deal.categorySlug && d.id !== deal.id)
    .slice(0, 3);

  const fallbackRelated =
    relatedDeals.length >= 3
      ? relatedDeals
      : [
          ...relatedDeals,
          ...allDeals.filter((d) => d.id !== deal.id && !relatedDeals.includes(d)),
        ].slice(0, 3);

  const handleCopy = () => {
    setCodeRevealed(true);
    onIncrementClick(deal.id);
    navigator.clipboard?.writeText(deal.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const displayedSuccessRate =
    voteState === 'up'
      ? Math.min(100, deal.successRate + 1)
      : voteState === 'down'
      ? Math.max(85, deal.successRate - 1)
      : deal.successRate;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Deals', path: '/' },
          { label: deal.categoryName, path: `/categories/${deal.categorySlug}` },
          { label: deal.brandName },
        ]}
      />

      {/* Responsive Grid: Main Content + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => onNavigate(`/brands/${deal.brandSlug}`)}
                className="cursor-pointer shrink-0"
              >
                <BrandLogo
                  brandSlug={deal.brandSlug}
                  brandName={deal.brandName}
                  initials={deal.brandInitials}
                  colorClass={deal.brandColor}
                  size="lg"
                  className="h-14 w-14 rounded-xl"
                />
              </button>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/brands/${deal.brandSlug}`)}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {deal.brandName}
                  </button>
                  <CategoryBadge
                    categorySlug={deal.categorySlug}
                    categoryName={deal.categoryName}
                    size="xs"
                    onClick={() => onNavigate(`/categories/${deal.categorySlug}`)}
                  />
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50 shrink-0">
                    {deal.valueBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified promo code · {deal.dealType}
                </p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              {deal.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {deal.shortDescription}
            </p>

            {/* Large Interactive Promo Code Box */}
            <div className="rounded-xl sm:rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Exclusive Promo Code</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {displayedSuccessRate}% Success Rate
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xs">
                <code className="text-center sm:text-left text-base sm:text-lg font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 select-all py-1 sm:py-0">
                  {codeRevealed ? deal.code : `${deal.code.slice(0, 4)}••••••`}
                </code>

                <Button
                  size="default"
                  variant={copied ? 'emerald' : 'default'}
                  onClick={handleCopy}
                  className="h-10 px-5 font-semibold rounded-lg sm:rounded-xl focus-visible:ring-2 focus-visible:ring-[#1565FF] cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        Copied to Clipboard!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="h-4 w-4" />
                        {codeRevealed ? 'Copy Code' : 'Reveal & Copy Code'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Tested {deal.verifiedAgo} by editor</span>
                <span className="inline-flex items-center gap-1">
                  <MousePointerClick className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{deal.clicks.toLocaleString()} successful redemptions</span>
                </span>
              </div>
            </div>

            {/* Redemption Instructions */}
            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                How to Redeem this Deal
              </h2>
              <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed">
                {deal.redemptionSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Terms and Restrictions */}
            <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                Terms & Conditions
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 list-disc list-inside leading-relaxed">
                {(deal.eligibility || ['Valid for registered accounts. Redeemable during checkout.']).map((term: string, idx: number) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
            <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
              Deal Verification Status
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Tested</span>
                <span>{deal.verifiedAgo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Success Rate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{displayedSuccessRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <MousePointerClick className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Total Clicks</span>
                </span>
                <span className="tabular-nums">{deal.clicks.toLocaleString()}</span>
              </div>
            </div>

            <a
              href={deal.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 px-4 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-[#1565FF]"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Did this code work? Feedback */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2 text-center">
              <p className="text-xs text-slate-500">Did this coupon work for you?</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setVoteState('up')}
                  className={cn(
                    'h-9 px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    voteState === 'up'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Yes, worked</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVoteState('down')}
                  className={cn(
                    'h-9 px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    voteState === 'down'
                      ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  <span>No, expired</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Deals Fluid Grid with Shimmer Skeleton */}
      <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          Related Deals in {deal.categoryName}
        </h2>

        {isSectionLoading('related-deals') ? (
          <DealGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {fallbackRelated.map((relDeal) => (
              <DealCard
                key={relDeal.id}
                deal={relDeal}
                onNavigate={onNavigate}
                onRevealDeal={onRevealDeal}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
