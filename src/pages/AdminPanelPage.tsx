import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Tag,
  Building2,
  FolderTree,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Megaphone,
  Star,
  Crown,
  Sparkles,
  Check,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Layers,
  BookOpen,
  Type,
  SearchCheck,
  Share2,
  Compass,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
  MessageSquare,
  ImageIcon,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryBadge } from '../components/CategoryBadge';
import { RichArticleRenderer } from '../components/RichArticleRenderer';
import { CustomDropdown } from '../components/CustomDropdown';
import { useCustomPopup } from '../context/CustomPopupContext';
import {
  Deal,
  Brand,
  Category,
  PerkItem,
  BlogArticle,
  TopBannerConfig,
  FeaturedItemConfig,
  SeoConfigMap,
  SeoPageConfig,
  DEFAULT_SEO_CONFIGS,
} from '../data/mockData';
import { cn, Pagination } from '../components/ui/shadcn';

interface AdminPanelPageProps {
  deals: Deal[];
  brands: Brand[];
  categories: Category[];
  perks: PerkItem[];
  articles: BlogArticle[];
  onAddDeal: (newDeal: Deal) => void;
  onUpdateDeal: (updatedDeal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
  onAddBrand: (newBrand: Brand) => void;
  onUpdateBrand: (updatedBrand: Brand) => void;
  onDeleteBrand: (brandSlug: string) => void;
  onAddArticle?: (newArticle: BlogArticle) => void;
  onUpdateArticle?: (updatedArticle: BlogArticle) => void;
  onDeleteArticle?: (articleSlug: string) => void;
  searchWords?: string[];
  onUpdateSearchWords?: (words: string[]) => void;
  seoConfigs?: SeoConfigMap;
  onUpdateSeoConfigs?: (configs: SeoConfigMap) => void;
  onResetAllData: () => void;
  onNavigate: (path: string) => void;
  topBanner: TopBannerConfig;
  onUpdateTopBanner: (banner: TopBannerConfig) => void;
  featuredItem: FeaturedItemConfig;
  featuredItems?: FeaturedItemConfig[];
  onUpdateFeaturedItem: (item: FeaturedItemConfig) => void;
  onUpdateFeaturedItems?: (items: FeaturedItemConfig[]) => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  deals,
  brands,
  categories,
  perks,
  articles,
  onAddDeal,
  onUpdateDeal,
  onDeleteDeal,
  onAddBrand,
  onUpdateBrand,
  onDeleteBrand,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  searchWords = [
    'namecheap discounts',
    'substore discounts',
    'Google ai pro',
    'ChatGPT Plus discount',
    'Vultr cloud credits',
    'Canva Pro promo codes',
  ],
  onUpdateSearchWords,
  seoConfigs = DEFAULT_SEO_CONFIGS,
  onUpdateSeoConfigs,
  onResetAllData,
  onNavigate,
  topBanner,
  onUpdateTopBanner,
  featuredItem,
  featuredItems,
  onUpdateFeaturedItem,
  onUpdateFeaturedItems,
}) => {
  const [activeTab, setActiveTab] = useState<'deals' | 'banner' | 'featured' | 'blogs' | 'searchwords' | 'seo' | 'overview' | 'brands' | 'categories' | 'perks'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam && ['deals', 'banner', 'featured', 'blogs', 'searchwords', 'seo', 'overview', 'brands', 'categories', 'perks'].includes(tabParam)) {
          return tabParam as any;
        }
      } catch {}
    }
    return 'deals';
  });
  const [dealSearchQuery, setDealSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [filterTrendingOnly, setFilterTrendingOnly] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const { showConfirm, showAlert } = useCustomPopup();

  // SEO Configurations State
  const [activeSeoPageKey, setActiveSeoPageKey] = useState<string>('home');
  const [seoState, setSeoState] = useState<SeoConfigMap>(seoConfigs);

  useEffect(() => {
    if (seoConfigs) {
      setSeoState(seoConfigs);
    }
  }, [seoConfigs]);

  const handleSaveSeoPage = (pageKey: string, updatedPageConfig: SeoPageConfig) => {
    const updated = {
      ...seoState,
      [pageKey]: updatedPageConfig,
    };
    setSeoState(updated);
    if (onUpdateSeoConfigs) {
      onUpdateSeoConfigs(updated);
    }
    showNotification(`Updated SEO metadata for "${pageKey}" page.`);
  };

  const handleResetSeoPage = (pageKey: string) => {
    const defaultConfig = DEFAULT_SEO_CONFIGS[pageKey];
    if (!defaultConfig) return;
    const updated = {
      ...seoState,
      [pageKey]: defaultConfig,
    };
    setSeoState(updated);
    if (onUpdateSeoConfigs) {
      onUpdateSeoConfigs(updated);
    }
    showNotification(`Reset SEO metadata for "${pageKey}" to default.`);
  };

  // Search Words Flipper state
  const [flipperWordsList, setFlipperWordsList] = useState<string[]>(searchWords);
  const [newWordInput, setNewWordInput] = useState('');

  useEffect(() => {
    if (searchWords) {
      setFlipperWordsList(searchWords);
    }
  }, [searchWords]);

  // Blog search filter state
  const [blogSearchQuery, setBlogSearchQuery] = useState('');

  // Form states for Top Banner and Featured Spotlight Items Carousel
  const [bannerForm, setBannerForm] = useState<TopBannerConfig>(topBanner);
  const [featuredList, setFeaturedList] = useState<FeaturedItemConfig[]>(() => {
    if (featuredItems && featuredItems.length > 0) return featuredItems;
    return [featuredItem];
  });
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>(featuredItem.id);
  const [featuredForm, setFeaturedForm] = useState<FeaturedItemConfig>(featuredItem);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    setBannerForm(topBanner);
  }, [topBanner]);

  useEffect(() => {
    if (featuredItems && featuredItems.length > 0) {
      setFeaturedList(featuredItems);
      const exists = featuredItems.find((f) => f.id === selectedFeaturedId);
      if (!exists) {
        setSelectedFeaturedId(featuredItems[0].id);
        setFeaturedForm(featuredItems[0]);
      }
    } else {
      setFeaturedForm(featuredItem);
    }
  }, [featuredItems, featuredItem]);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Filtered Deals in Management Table
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const q = dealSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.brandName.toLowerCase().includes(q) ||
        deal.code.toLowerCase().includes(q) ||
        deal.valueBadge.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategoryFilter === 'all' || deal.categorySlug === selectedCategoryFilter;

      const matchesTrending = !filterTrendingOnly || deal.isTrending;

      return matchesQuery && matchesCategory && matchesTrending;
    });
  }, [deals, dealSearchQuery, selectedCategoryFilter, filterTrendingOnly]);

  // Pagination for Deals Manager Table
  const [dealTablePage, setDealTablePage] = useState(1);
  const [dealTablePageSize, setDealTablePageSize] = useState(10);

  // Pagination for Blog Articles Tab
  const [blogTablePage, setBlogTablePage] = useState(1);
  const [blogTablePageSize, setBlogTablePageSize] = useState(6);

  // Reset page when deal filters change
  useEffect(() => {
    setDealTablePage(1);
  }, [dealSearchQuery, selectedCategoryFilter, filterTrendingOnly]);

  // Reset blog page when blog search changes
  useEffect(() => {
    setBlogTablePage(1);
  }, [blogSearchQuery]);

  const paginatedDeals = useMemo(() => {
    const start = (dealTablePage - 1) * dealTablePageSize;
    return filteredDeals.slice(start, start + dealTablePageSize);
  }, [filteredDeals, dealTablePage, dealTablePageSize]);

  const filteredArticles = useMemo(() => {
    if (!blogSearchQuery.trim()) return articles;
    const q = blogSearchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q)
    );
  }, [articles, blogSearchQuery]);

  const paginatedArticles = useMemo(() => {
    const start = (blogTablePage - 1) * blogTablePageSize;
    return filteredArticles.slice(start, start + blogTablePageSize);
  }, [filteredArticles, blogTablePage, blogTablePageSize]);

  // High-level analytics
  const metrics = useMemo(() => {
    const totalViews = deals.reduce((acc, d) => acc + (d.views || 0), 0);
    const totalClicks = deals.reduce((acc, d) => acc + (d.clicks || 0), 0);
    const trendingCount = deals.filter((d) => d.isTrending).length;
    const avgSuccess = Math.round(
      deals.reduce((acc, d) => acc + (d.successRate || 95), 0) / (deals.length || 1)
    );
    return { totalViews, totalClicks, trendingCount, avgSuccess };
  }, [deals]);

  const handleDelete = async (id: string, title: string) => {
    const ok = await showConfirm({
      title: 'Delete Promo Deal',
      message: `Are you sure you want to delete "${title}"? This will immediately remove it from the live directory and category feeds.`,
      confirmText: 'Delete Deal',
      variant: 'danger',
    });
    if (ok) {
      onDeleteDeal(id);
      showNotification(`Deleted deal: "${title}"`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden text-left">
      {/* Toast Alert Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 shadow-xl border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{notificationMsg}</span>
          <button
            type="button"
            onClick={() => setNotificationMsg(null)}
            className="p-1 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 ml-2 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Master Admin Console
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/60">
                Live State Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Website Management & Content Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Control digital coupons, brand profiles, vertical categories, cloud perks, and create deals with a dedicated live preview studio page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/admin/deals/new')}
              className="h-10 px-4 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Deal</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>View User Site</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                const ok = await showConfirm({
                  title: 'Restore Default Demo Data',
                  message: 'Are you sure you want to restore default demo data? Any custom deals, blog articles, and banner configurations added will be reinitialized.',
                  confirmText: 'Reset All Data',
                  variant: 'warning',
                  icon: 'warning',
                });
                if (ok) {
                  onResetAllData();
                  showNotification('All database records reset to factory defaults.');
                }
              }}
              title="Reset data to defaults"
              className="h-10 px-3 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {[
            { id: 'deals', label: `Manage Deals (${deals.length})`, icon: Tag },
            { id: 'seo', label: 'SEO & Metadata', icon: SearchCheck },
            { id: 'blogs', label: `Blogs & Guides (${articles.length})`, icon: BookOpen },
            { id: 'searchwords', label: `Search Words (${flipperWordsList.length})`, icon: Type },
            { id: 'banner', label: 'Top Banner Layer', icon: Megaphone },
            { id: 'featured', label: 'Featured Spotlight Item', icon: Star },
            { id: 'overview', label: 'Analytics & Health', icon: LayoutDashboard },
            { id: 'brands', label: `Brands (${brands.length})`, icon: Building2 },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
            { id: 'perks', label: `Startup Perks (${perks.length})`, icon: GraduationCap },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'whitespace-nowrap shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#1565FF]',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: DEALS MANAGER TABLE
          ========================================================================= */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          {/* Controls: Search, Category Filter, Trending Toggle, Add Deal Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={dealSearchQuery}
                onChange={(e) => setDealSearchQuery(e.target.value)}
                placeholder="Search deals by title, brand, promo code..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CustomDropdown
                value={selectedCategoryFilter}
                onChange={(val) => setSelectedCategoryFilter(val)}
                icon={<Filter className="h-3.5 w-3.5 text-slate-400" />}
                size="sm"
                options={[
                  { value: 'all', label: `All Categories (${deals.length})` },
                  ...categories.map((c) => ({ value: c.slug, label: c.name })),
                ]}
                className="min-w-[170px]"
              />

              <button
                type="button"
                onClick={() => setFilterTrendingOnly(!filterTrendingOnly)}
                className={cn(
                  'h-9 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border',
                  filterTrendingOnly
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                )}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Trending Only</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/admin/deals/new')}
                className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Deal</span>
              </button>
            </div>
          </div>

          {/* Deals Table */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Brand & Deal Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Discount & Code</th>
                    <th className="py-3 px-4">Status Badges</th>
                    <th className="py-3 px-4">Engagement</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                  {filteredDeals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <div className="max-w-xs mx-auto space-y-3">
                          <Tag className="h-8 w-8 mx-auto text-slate-300" />
                          <p className="font-medium text-slate-600 dark:text-slate-300">
                            No deals match your search criteria.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setDealSearchQuery('');
                              setSelectedCategoryFilter('all');
                              setFilterTrendingOnly(false);
                            }}
                            className="text-xs text-blue-600 font-semibold hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedDeals.map((deal) => (
                      <tr
                        key={deal.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 min-w-[240px]">
                          <div className="flex items-center gap-3">
                            <BrandLogo
                              brandSlug={deal.brandSlug}
                              brandName={deal.brandName}
                              initials={deal.brandInitials}
                              colorClass={deal.brandColor}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {deal.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span className="font-medium text-slate-500 dark:text-slate-400">
                                  {deal.brandName}
                                </span>
                                <span>·</span>
                                <span className="truncate">{deal.verifiedAgo}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <CategoryBadge
                            categorySlug={deal.categorySlug}
                            categoryName={deal.categoryName}
                            size="xs"
                          />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-blue-600 dark:text-blue-400 block">
                              {deal.valueBadge}
                            </span>
                            <code className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                              {deal.code}
                            </code>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {deal.isTrending && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300">
                                <Flame className="h-3 w-3" />
                                Trending
                              </span>
                            )}
                            {deal.isLimitedTime && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300">
                                Limited
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <ShieldCheck className="h-3 w-3" />
                              Verified
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap tabular-nums text-xs text-slate-500">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {deal.clicks.toLocaleString()}
                            </span>{' '}
                            clicks
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {deal.views.toLocaleString()} views · {deal.successRate}% rate
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onNavigate(`/admin/deals/edit/${deal.id}`)}
                              className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit deal and view live preview"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Edit & Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(deal.id, deal.title)}
                              className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 inline-flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete deal"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
              <Pagination
                currentPage={dealTablePage}
                totalPages={Math.ceil(filteredDeals.length / dealTablePageSize)}
                onPageChange={(p) => setDealTablePage(p)}
                totalItems={filteredDeals.length}
                pageSize={dealTablePageSize}
                onPageSizeChange={(s) => {
                  setDealTablePageSize(s);
                  setDealTablePage(1);
                }}
                pageSizeOptions={[10, 25, 50]}
                itemLabel="deals"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>Total catalog: {deals.length} active promo deals</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/deals/new')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  + Add Another Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: TOP ANNOUNCEMENT BANNER LAYER CONFIGURATION
          ========================================================================= */}
      {activeTab === 'banner' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
                Top Announcement Banner Layer
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configure the primary announcement strip that sits on top of the sticky topbar across the entire site. Includes external link support with verified icons.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                  bannerForm.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', bannerForm.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
                {bannerForm.isActive ? 'Active on Site' : 'Disabled / Hidden'}
              </span>
            </div>
          </div>

          {/* Real-time Banner Live Preview Box */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Live Viewport Preview (Directly above Topbar)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Updates live as you type</span>
            </div>

            {/* Rendered Banner in preview container */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-2 sm:p-3">
              {bannerForm.isActive ? (
                <div
                  className={cn(
                    'w-full text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow-xs flex items-center justify-center gap-2 sm:gap-3 text-center transition-colors',
                    bannerForm.themeStyle === 'emerald'
                      ? 'bg-emerald-600 text-white'
                      : bannerForm.themeStyle === 'amber'
                      ? 'bg-amber-600 text-white'
                      : bannerForm.themeStyle === 'dark'
                      ? 'bg-slate-900 text-white'
                      : bannerForm.themeStyle === 'gradient'
                      ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white'
                      : 'bg-[#1565FF] text-white'
                  )}
                >
                  {bannerForm.badgeText && (
                    <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                      {bannerForm.badgeText}
                    </span>
                  )}
                  <span className="truncate font-medium text-white/95 text-xs sm:text-sm">
                    {bannerForm.message || 'Announcement message preview...'}
                  </span>
                  {bannerForm.linkUrl && (
                    <span className="inline-flex items-center gap-1 font-bold underline underline-offset-2 shrink-0 cursor-pointer ml-1 text-xs sm:text-sm">
                      <span>{bannerForm.ctaText || 'Learn More'}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </span>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  Banner is currently toggled OFF and will not show on the website.
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Quick Banner Presets (Click to Load)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  label: 'Black Friday Deals',
                  badgeText: 'Black Friday',
                  message: 'Black Friday 2026: Up to 100% off software, 48-mo free seats & $5,000 compute credits',
                  ctaText: 'View Doorbusters',
                  linkUrl: '#black-friday-deals',
                  isExternal: false,
                  themeStyle: 'gradient' as const,
                },
                {
                  label: 'Vultr Cloud Credits',
                  badgeText: 'Flash Perk',
                  message: 'Get $200 free cloud compute & AI credits across top verified platforms',
                  ctaText: 'Claim Credits',
                  linkUrl: 'https://vultr.com',
                  isExternal: true,
                  themeStyle: 'gradient' as const,
                },
                {
                  label: 'ChatGPT 48-Mo Seat',
                  badgeText: 'Partner Deal',
                  message: 'Get 1 free Business seat for 48 months on ChatGPT Enterprise workspace',
                  ctaText: 'Reveal Deal',
                  linkUrl: '/deals/chatgpt-business-discount-48-months',
                  isExternal: false,
                  themeStyle: 'dark' as const,
                },
                {
                  label: 'Google Workspace 14D',
                  badgeText: 'Featured',
                  message: 'Boost your team productivity with Google Workspace — 14-day free trial',
                  ctaText: 'Start Trial',
                  linkUrl: 'https://workspace.google.com',
                  isExternal: true,
                  themeStyle: 'primary' as const,
                },
                {
                  label: 'Perks & Grants Directory',
                  badgeText: 'Grants Hub',
                  message: 'Over $150,000 in startup cloud credits & student discounts now available',
                  ctaText: 'Explore Perks',
                  linkUrl: '/perks',
                  isExternal: false,
                  themeStyle: 'emerald' as const,
                },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setBannerForm((prev) => ({
                      ...prev,
                      isActive: true,
                      badgeText: preset.badgeText,
                      message: preset.message,
                      ctaText: preset.ctaText,
                      linkUrl: preset.linkUrl,
                      isExternal: preset.isExternal,
                      themeStyle: preset.themeStyle,
                    }));
                    showNotification(`Loaded preset: "${preset.label}"`);
                  }}
                  className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 flex items-center justify-between">
                    <span>{preset.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{preset.message}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Display Top Banner</label>
                <p className="text-xs text-slate-500">Toggle announcement banner on or off across the whole website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerForm.isActive}
                  onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={bannerForm.badgeText}
                  onChange={(e) => setBannerForm({ ...bannerForm, badgeText: e.target.value })}
                  placeholder="e.g. Flash Perk, Limited Time, Black Friday"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Call-to-Action Link Text
                </label>
                <input
                  type="text"
                  value={bannerForm.ctaText}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                  placeholder="e.g. Claim Credits, Learn More, View Offer"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Announcement Message
              </label>
              <textarea
                rows={2}
                value={bannerForm.message}
                onChange={(e) => setBannerForm({ ...bannerForm, message: e.target.value })}
                placeholder="Write the full announcement copy that appears centered in the top banner..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Destination Link URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bannerForm.linkUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                    placeholder="https://vultr.com or /perks or /deals/..."
                    className="w-full h-10 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Globe className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Color Theme Style
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'primary', label: 'Blue', color: 'bg-[#1565FF]' },
                    { id: 'gradient', label: 'Gradient', color: 'bg-gradient-to-r from-blue-700 to-purple-700' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-600' },
                    { id: 'amber', label: 'Amber', color: 'bg-amber-600' },
                    { id: 'dark', label: 'Dark', color: 'bg-slate-900' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, themeStyle: theme.id as any })}
                      className={cn(
                        'h-10 rounded-xl border flex items-center justify-center text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer relative',
                        theme.color,
                        bannerForm.themeStyle === theme.id ? 'ring-2 ring-offset-2 ring-blue-500 scale-102 border-white' : 'border-transparent opacity-85 hover:opacity-100'
                      )}
                      title={theme.label}
                    >
                      {bannerForm.themeStyle === theme.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Open as External Link
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Renders the ExternalLink icon and opens the destination in a new browser tab
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerForm.isExternal}
                  onChange={(e) => setBannerForm({ ...bannerForm, isExternal: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setBannerForm(topBanner);
                  showNotification('Reverted changes to current top banner.');
                }}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm cursor-pointer"
              >
                Revert Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateTopBanner(bannerForm);
                  showNotification('Top banner announcement saved and published to website!');
                }}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save & Publish Banner</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: FEATURED SPOTLIGHT ITEM CONFIGURATION
          ========================================================================= */}
      {/* =========================================================================
          TAB: FEATURED SPOTLIGHT ITEMS & CAROUSEL CONFIGURATION
          ========================================================================= */}
      {activeTab === 'featured' && (() => {
        const activeCount = featuredList.filter((f) => f.isActive).length;
        const activeItemsForPreview = featuredList.filter((f) => f.isActive);
        const previewItem = activeItemsForPreview[previewIndex] || activeItemsForPreview[0] || featuredForm;

        const handleSelectToEdit = (item: FeaturedItemConfig) => {
          setSelectedFeaturedId(item.id);
          setFeaturedForm(item);
        };

        const handleUpdateForm = (updated: FeaturedItemConfig) => {
          setFeaturedForm(updated);
          setFeaturedList((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        };

        const handleToggleItemActive = (id: string, active: boolean) => {
          setFeaturedList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isActive: active } : item))
          );
          if (featuredForm.id === id) {
            setFeaturedForm((prev) => ({ ...prev, isActive: active }));
          }
        };

        const handleMoveItem = (index: number, direction: 'up' | 'down') => {
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= featuredList.length) return;
          const updated = [...featuredList];
          const temp = updated[index];
          updated[index] = updated[targetIndex];
          updated[targetIndex] = temp;
          setFeaturedList(updated);
        };

        const handleRemoveItem = async (id: string, title: string) => {
          if (featuredList.length <= 1) {
            await showAlert({
              title: 'Action Restricted',
              message: 'At least one featured deal must remain in the hero rotation.',
              variant: 'warning',
            });
            return;
          }
          const ok = await showConfirm({
            title: 'Remove Featured Deal',
            message: `Are you sure you want to remove "${title}" from the featured carousel rotation?`,
            confirmText: 'Remove Deal',
            variant: 'danger',
            icon: 'trash',
          });
          if (ok) {
            const updated = featuredList.filter((item) => item.id !== id);
            setFeaturedList(updated);
            if (selectedFeaturedId === id && updated.length > 0) {
              setSelectedFeaturedId(updated[0].id);
              setFeaturedForm(updated[0]);
            }
            showNotification(`Removed "${title}" from featured deals.`);
          }
        };

        const handleAddNewFeatured = () => {
          const newId = `featured-${Date.now()}`;
          const newItem: FeaturedItemConfig = {
            id: newId,
            isActive: true,
            brandSlug: 'custom-partner',
            brandName: 'New Partner Deal',
            badgeLabel: 'SPECIAL OFFER',
            title: 'New Featured Software Discount',
            description: 'Exclusive partner promotion available for a limited time.',
            ctaText: 'Claim Offer',
            ctaUrl: 'https://example.com',
            isExternal: true,
            verifiedText: 'Verified',
          };
          const updated = [...featuredList, newItem];
          setFeaturedList(updated);
          setSelectedFeaturedId(newId);
          setFeaturedForm(newItem);
          showNotification('Added new featured deal slot to rotation.');
        };

        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Featured Deals & Auto-Carousel Manager
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Manage the spotlight cards beneath the hero. When 2 or more active deals exist, an automatic rotating carousel with round indicator dots is enabled on the homepage.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                    activeCount >= 2
                      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                      : activeCount === 1
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      activeCount >= 2
                        ? 'bg-blue-500 animate-pulse'
                        : activeCount === 1
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    )}
                  />
                  {activeCount >= 2
                    ? `${activeCount} Active Deals • Auto-Carousel On`
                    : activeCount === 1
                    ? '1 Active Deal • Static Card'
                    : 'Hidden on Homepage'}
                </span>
              </div>
            </div>

            {/* Rotation Management List Deck */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Featured Deals in Rotation ({featuredList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reorder slides, toggle active state, or select any deal below to edit its copy and CTA.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewFeatured}
                  className="h-9 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200 dark:border-blue-900"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Deal to Rotation</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {featuredList.map((item, idx) => {
                  const isSelected = item.id === selectedFeaturedId;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500/50'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="h-6 w-6 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800">
                          <BrandLogo
                            brandSlug={item.brandSlug || 'deal'}
                            brandName={item.brandName}
                            logoUrl={item.logoUrl}
                            size="sm"
                            borderless
                            className="h-6 w-6"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                              {item.badgeLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.brandName} • {item.ctaText} → {item.ctaUrl}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* Move Up / Down Buttons */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveItem(idx, 'up')}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredList.length - 1}
                            onClick={() => handleMoveItem(idx, 'down')}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent border-l border-slate-200 dark:border-slate-700 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Active Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleItemActive(item.id, !item.isActive)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors',
                            item.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          )}
                        >
                          {item.isActive ? 'Active' : 'Off'}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleSelectToEdit(item)}
                          className={cn(
                            'px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors',
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                          )}
                        >
                          {isSelected ? 'Editing' : 'Edit'}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          disabled={featuredList.length <= 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent cursor-pointer"
                          title="Remove from featured list"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-time Featured Deal Card Live Carousel Preview Box */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Live Carousel Viewport Preview
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {activeItemsForPreview.length >= 2 ? 'Auto-rotates every 5s on homepage' : 'Static single card display'}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center">
                {activeItemsForPreview.length > 0 ? (
                  <div className="w-full max-w-xl">
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg border border-slate-100 dark:border-slate-800 p-1 shrink-0 flex items-center justify-center bg-white dark:bg-slate-800">
                            <BrandLogo
                              brandSlug={previewItem.brandSlug || 'google-workspace'}
                              brandName={previewItem.brandName || 'Featured Partner'}
                              logoUrl={previewItem.logoUrl || undefined}
                              size="sm"
                              borderless
                              className="h-6 w-6"
                            />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D7E3FF]/60 dark:bg-blue-950/80 text-[#1565FF] dark:text-blue-300">
                            {previewItem.badgeLabel || 'FEATURED DEAL'}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/60 shrink-0">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      </div>

                      <h3 className="mt-3 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {previewItem.title || 'Spotlight Deal Headline'}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {previewItem.description || 'Description of the partner discount or software perk...'}
                      </p>

                      <div className="mt-4 w-full h-11 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs">
                        <span>{previewItem.ctaText || 'Claim Free Trial'}</span>
                        {previewItem.isExternal ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* Preview Carousel Indicator Dots - Redesigned Round Dot Indicators */}
                    {activeItemsForPreview.length >= 2 && (
                      <div
                        className="flex items-center justify-center gap-1.5 pt-3.5"
                        role="tablist"
                        aria-label="Preview carousel pagination"
                      >
                        {activeItemsForPreview.map((item, idx) => {
                          const isSelected = idx === previewIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              role="tab"
                              aria-selected={isSelected}
                              aria-label={`Preview deal slide ${idx + 1} of ${activeItemsForPreview.length}`}
                              onClick={() => setPreviewIndex(idx)}
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
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    All featured items are disabled and currently hidden from the homepage.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Deal Presets */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Quick Presets from Platform Catalog (Click to Load or Append)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    label: 'Google Workspace',
                    brandSlug: 'google-workspace',
                    brandName: 'Google Workspace',
                    brandInitials: 'GW',
                    brandColor: 'bg-blue-600 text-white',
                    badgeLabel: 'FEATURED DEAL',
                    title: 'Google Workspace — 14-Day Free Trial',
                    description: 'Boost your productivity with custom email, cloud storage, security, and collaborative tools.',
                    ctaText: 'Claim Free Trial',
                    ctaUrl: 'https://workspace.google.com',
                    isExternal: true,
                    dealSlug: 'google-workspace-14-day-free-trial',
                  },
                  {
                    label: 'Vultr Free Credits',
                    brandSlug: 'vultr',
                    brandName: 'Vultr',
                    brandInitials: 'VU',
                    brandColor: 'bg-blue-900 text-white',
                    badgeLabel: 'HOT INFRASTRUCTURE',
                    title: '$300 Vultr Free Credits using Promo Code',
                    description: 'Vultr offers $300 free for credit-based cloud trial access to new users for 30 days.',
                    ctaText: 'Claim $300 Credits',
                    ctaUrl: 'https://vultr.com',
                    isExternal: false,
                    dealSlug: '300-vultr-free-credits-promo-code',
                  },
                  {
                    label: 'VideoGen Model 1',
                    brandSlug: 'videogen',
                    brandName: 'VideoGen',
                    brandInitials: 'VG',
                    brandColor: 'bg-red-500/10 text-red-600 border-red-500/20',
                    badgeLabel: '$1M POOL',
                    title: 'VideoGen Deal: Model 1 - $1M Free AI Credits & Video Generation Pool',
                    description: 'Apply for the $1M shared free-credit pool for selected projects creating automated AI video pipelines.',
                    ctaText: 'Claim $1M Pool',
                    ctaUrl: 'https://videogen.io',
                    isExternal: false,
                    dealSlug: 'videogen-model-1-1m-free-ai-credits',
                  },
                  {
                    label: 'Beautiful.ai Pro',
                    brandSlug: 'beautiful-ai',
                    brandName: 'Beautiful.ai',
                    brandInitials: 'BA',
                    brandColor: 'bg-slate-900 text-white',
                    badgeLabel: 'STUDENT SPECIAL',
                    title: 'Beautiful.ai Students Discount: 1 Year Free Pro ($144 Value)',
                    description: 'Smart presentation software that designs for you. Get 1 full year of Pro free for students & educators.',
                    ctaText: 'Claim 1-Year Free',
                    ctaUrl: 'https://www.beautiful.ai/education',
                    isExternal: false,
                    dealSlug: 'beautiful-ai-students-discount-1-year-free-pro',
                  },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const updated: FeaturedItemConfig = {
                        ...featuredForm,
                        isActive: true,
                        brandSlug: preset.brandSlug,
                        brandName: preset.brandName,
                        brandInitials: preset.brandInitials,
                        brandColor: preset.brandColor,
                        badgeLabel: preset.badgeLabel,
                        title: preset.title,
                        description: preset.description,
                        ctaText: preset.ctaText,
                        ctaUrl: preset.ctaUrl,
                        isExternal: preset.isExternal,
                        dealSlug: preset.dealSlug,
                      };
                      handleUpdateForm(updated);
                      showNotification(`Loaded preset: "${preset.label}" into selected item.`);
                    }}
                    className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 flex items-center justify-between">
                      <span>{preset.label}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-1">{preset.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields for Selected Featured Deal */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Edit Featured Deal Details ({featuredForm.brandName || 'Selected Deal'})
                  </label>
                  <p className="text-xs text-slate-500">Configure parameters for the currently selected deal in rotation</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Active in Rotation</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featuredForm.isActive}
                      onChange={(e) => handleUpdateForm({ ...featuredForm, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

                <CustomDropdown
                  value={featuredForm.dealSlug || ''}
                  onChange={(targetSlug) => {
                    if (!targetSlug) return;
                    const matched = deals.find((d) => d.slug === targetSlug || d.id === targetSlug);
                    if (matched) {
                      const updated: FeaturedItemConfig = {
                        ...featuredForm,
                        brandSlug: matched.brandSlug,
                        brandName: matched.brandName,
                        brandInitials: matched.brandInitials,
                        brandColor: matched.brandColor,
                        title: matched.title,
                        description: matched.shortDescription,
                        ctaText: 'Claim Offer',
                        ctaUrl: matched.officialUrl,
                        dealSlug: matched.slug,
                      };
                      handleUpdateForm(updated);
                      showNotification(`Auto-populated from: "${matched.brandName}"`);
                    }
                  }}
                  placeholder="-- Choose an existing deal to auto-fill --"
                  options={[
                    { value: '', label: '-- Choose an existing deal to auto-fill --' },
                    ...deals.map((d) => ({
                      value: d.slug,
                      label: `${d.brandName} — ${d.title.substring(0, 48)}...`,
                    })),
                  ]}
                  searchable
                  className="w-full"
                />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand Name & Slug
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={featuredForm.brandName}
                      onChange={(e) => handleUpdateForm({ ...featuredForm, brandName: e.target.value })}
                      placeholder="Brand Name"
                      className="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={featuredForm.brandSlug}
                      onChange={(e) => handleUpdateForm({ ...featuredForm, brandSlug: e.target.value })}
                      placeholder="brand-slug"
                      className="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={featuredForm.badgeLabel}
                    onChange={(e) => handleUpdateForm({ ...featuredForm, badgeLabel: e.target.value })}
                    placeholder="e.g. FEATURED DEAL, $1M POOL, HOT INFRASTRUCTURE"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Spotlight Headline / Title
                </label>
                <input
                  type="text"
                  value={featuredForm.title}
                  onChange={(e) => handleUpdateForm({ ...featuredForm, title: e.target.value })}
                  placeholder="e.g. Google Workspace — 14-Day Free Trial"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Description Body Copy
                </label>
                <textarea
                  rows={2}
                  value={featuredForm.description}
                  onChange={(e) => handleUpdateForm({ ...featuredForm, description: e.target.value })}
                  placeholder="Explain the value proposition, software features, and perk savings..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={featuredForm.ctaText}
                    onChange={(e) => handleUpdateForm({ ...featuredForm, ctaText: e.target.value })}
                    placeholder="e.g. Claim Free Trial, Reveal Deal"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={featuredForm.ctaUrl}
                    onChange={(e) => handleUpdateForm({ ...featuredForm, ctaUrl: e.target.value })}
                    placeholder="https://... or /deals/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Direct External Link Action
                    </div>
                    <div className="text-[11px] text-slate-500">
                      If enabled, clicking the CTA opens the destination link in a new tab with ExternalLink icon.
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredForm.isExternal}
                    onChange={(e) => handleUpdateForm({ ...featuredForm, isExternal: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Save & Publish Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const fallback = (featuredItems && featuredItems.length > 0) ? featuredItems : [featuredItem];
                    setFeaturedList(fallback);
                    setSelectedFeaturedId(fallback[0].id);
                    setFeaturedForm(fallback[0]);
                    showNotification('Reverted changes to saved featured deals.');
                  }}
                  className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Revert Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateFeaturedItems?.(featuredList);
                    onUpdateFeaturedItem(featuredList[0] || featuredForm);
                    showNotification('All featured deals & carousel rotation saved and published to homepage!');
                  }}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save & Publish Featured Deals</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          TAB 2: ANALYTICS & PLATFORM HEALTH
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Live Coupons
              </span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                {deals.length}
              </p>
              <span className="text-xs text-emerald-600 font-medium">100% indexed & searchable</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                30-Day User Redemptions
              </span>
              <p className="text-3xl font-extrabold text-blue-600">
                {metrics.totalClicks.toLocaleString()}
              </p>
              <span className="text-xs text-slate-400">From {metrics.totalViews.toLocaleString()} impressions</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Success Rate
              </span>
              <p className="text-3xl font-extrabold text-emerald-600">{metrics.avgSuccess}%</p>
              <span className="text-xs text-emerald-600 font-medium">Guaranteed working codes</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Partner Brands
              </span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                {brands.length}
              </p>
              <span className="text-xs text-slate-400">Across {categories.length} verticals</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">
              Vertical Distribution Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((c) => {
                const count = deals.filter((d) => d.categorySlug === c.slug).length;
                return (
                  <div
                    key={c.slug}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-left"
                  >
                    <span className="text-xs font-medium text-slate-500 block truncate">{c.name}</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {count} deals
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: BRANDS DIRECTORY
          ========================================================================= */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Configured Software Brands ({brands.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/brands')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View User Brand Directory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((b) => {
              const brandDeals = deals.filter((d) => d.brandSlug === b.slug);
              return (
                <div
                  key={b.slug}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs space-y-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <BrandLogo
                      brandSlug={b.slug}
                      brandName={b.name}
                      initials={b.initials}
                      colorClass={b.colorClass}
                      size="md"
                    />
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                      {brandDeals.length} active deals
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{b.name}</h3>
                    <p className="text-xs text-slate-500">{b.categoryName}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/brands/${b.slug}`)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Brand Page
                    </button>
                    {b.officialUrl && (
                      <a
                        href={b.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                      >
                        Site <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CATEGORIES DIRECTORY
          ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Taxonomy Categories ({categories.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.slug}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs text-left"
              >
                <div className="flex items-center justify-between">
                  <CategoryBadge categorySlug={c.slug} categoryName={c.name} size="sm" />
                  <span className="text-xs font-semibold text-slate-500">{c.activeDealsCount} Deals</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{c.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/categories/${c.slug}`)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Browse Category Directory →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: PERKS & GRANTS MANAGEMENT
          ========================================================================= */}
      {activeTab === 'perks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Startup Infrastructure & Student Perks ({perks.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/perks')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View User Perks Page →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perks.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {p.programType === 'startup' ? 'Startup Credits' : 'Student Perk'}
                  </span>
                  <span className="font-bold text-emerald-600 text-xs bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                    {p.maxValue}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{p.programTitle}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span>Eligibility: {p.eligibilityCriteria}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: BLOGS & SAVINGS GUIDES MANAGEMENT
          ========================================================================= */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Blogs & Savings Guides Management ({articles.length})</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Create in-depth software procurement breakdowns, editorial reviews, and savings playbooks.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('/admin/blogs/new')}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Blog Article</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/blog')}
                className="h-10 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>View Blogs</span>
              </button>
            </div>
          </div>

          {/* Search Filter for Blogs */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles by title, category, or excerpt..."
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedArticles.map((article) => (
                <div
                  key={article.slug}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between space-y-4 text-left hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                        {article.category}
                      </span>
                      {article.isFeatured && (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>By {article.authorName}</span>
                      <span>{article.readingTime}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/blog/${article.slug}`)}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Read
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/admin/blogs/edit/${article.slug}`)}
                        className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3 text-slate-500" />
                        Edit
                      </button>

                      {onDeleteArticle && (
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await showConfirm({
                              title: 'Delete Savings Guide',
                              message: `Are you sure you want to delete "${article.title}"? This will permanently remove the article from /blog.`,
                              confirmText: 'Delete Article',
                              variant: 'danger',
                              icon: 'trash',
                            });
                            if (ok) {
                              onDeleteArticle(article.slug);
                              showNotification(`Deleted article "${article.title}".`);
                            }
                          }}
                          className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 inline-flex items-center justify-center cursor-pointer transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length > blogTablePageSize && (
              <Pagination
                currentPage={blogTablePage}
                totalPages={Math.ceil(filteredArticles.length / blogTablePageSize)}
                onPageChange={(p) => setBlogTablePage(p)}
                totalItems={filteredArticles.length}
                pageSize={blogTablePageSize}
                onPageSizeChange={(s) => {
                  setBlogTablePageSize(s);
                  setBlogTablePage(1);
                }}
                pageSizeOptions={[6, 12, 24]}
                itemLabel="guides"
              />
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: VIEWFLIPPER SEARCH WORDS MANAGEMENT
          ========================================================================= */}
      {activeTab === 'searchwords' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Type className="h-5 w-5 text-blue-600" />
                <span>Search Placeholder Viewflipper Animation Words</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Configure the rotating animated search queries displayed in the hero search bar on the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="h-10 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Eye className="h-4 w-4" />
              <span>Preview on Home</span>
            </button>
          </div>

          {/* Add New Word Form */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              Add Search Flipper Word / Phrase
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. namecheap discounts, substore discounts, Google ai pro..."
                  value={newWordInput}
                  onChange={(e) => setNewWordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = newWordInput.trim();
                      if (trimmed && !flipperWordsList.includes(trimmed)) {
                        const updated = [...flipperWordsList, trimmed];
                        setFlipperWordsList(updated);
                        if (onUpdateSearchWords) onUpdateSearchWords(updated);
                        setNewWordInput('');
                        showNotification(`Added "${trimmed}" to viewflipper animation.`);
                      }
                    }
                  }}
                  className="w-full h-11 px-4 text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const trimmed = newWordInput.trim();
                  if (!trimmed) return;
                  if (flipperWordsList.includes(trimmed)) {
                    showNotification('This search word already exists.');
                    return;
                  }
                  const updated = [...flipperWordsList, trimmed];
                  setFlipperWordsList(updated);
                  if (onUpdateSearchWords) onUpdateSearchWords(updated);
                  setNewWordInput('');
                  showNotification(`Added "${trimmed}" to viewflipper animation.`);
                }}
                className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Word</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Tip: Phrases appear inside quotes like <span className="font-mono text-slate-700 dark:text-slate-300">"Search namecheap discounts"</span> and rotate every 2.6 seconds.
            </p>
          </div>

          {/* Words List */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Active Rotation List ({flipperWordsList.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  const defaults = [
                    'namecheap discounts',
                    'substore discounts',
                    'Google ai pro',
                    'ChatGPT Plus discount',
                    'Vultr cloud credits',
                    'Canva Pro promo codes',
                  ];
                  setFlipperWordsList(defaults);
                  if (onUpdateSearchWords) onUpdateSearchWords(defaults);
                  showNotification('Reset search words to default list.');
                }}
                className="text-xs text-slate-500 hover:text-blue-600 cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>

            <div className="space-y-2">
              {flipperWordsList.map((word, idx) => (
                <div
                  key={`${word}-${idx}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 font-mono text-xs font-semibold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                      "{word}"
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const copy = [...flipperWordsList];
                        const temp = copy[idx - 1];
                        copy[idx - 1] = copy[idx];
                        copy[idx] = temp;
                        setFlipperWordsList(copy);
                        if (onUpdateSearchWords) onUpdateSearchWords(copy);
                      }}
                      className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === flipperWordsList.length - 1}
                      onClick={() => {
                        if (idx === flipperWordsList.length - 1) return;
                        const copy = [...flipperWordsList];
                        const temp = copy[idx + 1];
                        copy[idx + 1] = copy[idx];
                        copy[idx] = temp;
                        setFlipperWordsList(copy);
                        if (onUpdateSearchWords) onUpdateSearchWords(copy);
                      }}
                      className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (flipperWordsList.length <= 1) {
                          showNotification('Rotation requires at least 1 word.');
                          return;
                        }
                        const filtered = flipperWordsList.filter((_, i) => i !== idx);
                        setFlipperWordsList(filtered);
                        if (onUpdateSearchWords) onUpdateSearchWords(filtered);
                        showNotification(`Removed "${word}" from viewflipper rotation.`);
                      }}
                      className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove word"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: SEO & METADATA MANAGEMENT
          ========================================================================= */}
      {activeTab === 'seo' && (
        <div className="space-y-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <SearchCheck className="h-5 w-5 text-blue-600" />
                <span>SEO Metadata & OpenGraph Social Sharing Engine</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Optimize search visibility, SERP snippets, and social media preview cards across key public pages.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const targetPath = activeSeoPageKey === 'home' ? '/' : `/${activeSeoPageKey}`;
                  onNavigate(targetPath);
                }}
                className="h-10 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>View Live Page</span>
              </button>
            </div>
          </div>

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {[
              { key: 'home', label: 'Home Page (/)' },
              { key: 'categories', label: 'Categories (/categories)' },
              { key: 'brands', label: 'Brands Directory (/brands)' },
              { key: 'perks', label: 'Startup & Student Perks (/perks)' },
              { key: 'blog', label: 'Savings Guides (/blog)' },
              { key: 'alerts', label: 'Recent Deal Alerts (/alerts)' },
              { key: 'search', label: 'Search Page (/search)' },
            ].map((p) => {
              const isSelected = activeSeoPageKey === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setActiveSeoPageKey(p.key)}
                  className={cn(
                    'whitespace-nowrap shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#1565FF]',
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Page SEO Form & Live Previews */}
          {(() => {
            const pageConfig: SeoPageConfig =
              seoState[activeSeoPageKey] ||
              DEFAULT_SEO_CONFIGS[activeSeoPageKey] ||
              DEFAULT_SEO_CONFIGS['home'];

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5 shadow-2xs text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          Metadata Settings for{' '}
                          <span className="text-blue-600 font-mono text-sm capitalize">
                            /{activeSeoPageKey === 'home' ? '' : activeSeoPageKey}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Updates the HTML &lt;title&gt;, meta tags, and OpenGraph headers.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleResetSeoPage(activeSeoPageKey)}
                        className="text-xs text-slate-500 hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    {/* Page Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Page Title (&lt;title&gt;) *
                        </label>
                        <span
                          className={cn(
                            'text-[11px] font-mono',
                            pageConfig.title.length >= 30 && pageConfig.title.length <= 60
                              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                              : 'text-amber-600 dark:text-amber-400'
                          )}
                        >
                          {pageConfig.title.length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={pageConfig.title}
                        onChange={(e) =>
                          handleSaveSeoPage(activeSeoPageKey, {
                            ...pageConfig,
                            title: e.target.value,
                            ogTitle: pageConfig.ogTitle === pageConfig.title ? e.target.value : pageConfig.ogTitle,
                          })
                        }
                        className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                        placeholder="e.g. Couponify — Verified SaaS & AI Discounts"
                      />
                      <p className="text-[11px] text-slate-400">
                        Recommended: 30–60 characters. Appears as the clickable headline on Google Search.
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Meta Description *
                        </label>
                        <span
                          className={cn(
                            'text-[11px] font-mono',
                            pageConfig.description.length >= 120 && pageConfig.description.length <= 160
                              ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                              : 'text-amber-600 dark:text-amber-400'
                          )}
                        >
                          {pageConfig.description.length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={pageConfig.description}
                        onChange={(e) =>
                          handleSaveSeoPage(activeSeoPageKey, {
                            ...pageConfig,
                            description: e.target.value,
                            ogDescription:
                              pageConfig.ogDescription === pageConfig.description
                                ? e.target.value
                                : pageConfig.ogDescription,
                          })
                        }
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                        placeholder="Compelling 1-2 sentence summary of this page..."
                      />
                      <p className="text-[11px] text-slate-400">
                        Recommended: 120–160 characters. Displayed beneath the title in search engine snippets.
                      </p>
                    </div>

                    {/* OpenGraph Title */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Share2 className="h-3.5 w-3.5 text-blue-600" />
                        <span>OpenGraph Title (og:title / twitter:title)</span>
                      </label>
                      <input
                        type="text"
                        value={pageConfig.ogTitle || ''}
                        onChange={(e) =>
                          handleSaveSeoPage(activeSeoPageKey, {
                            ...pageConfig,
                            ogTitle: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                        placeholder="Defaults to Page Title if left empty"
                      />
                    </div>

                    {/* OpenGraph Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        OpenGraph Description (og:description)
                      </label>
                      <textarea
                        rows={2}
                        value={pageConfig.ogDescription || ''}
                        onChange={(e) =>
                          handleSaveSeoPage(activeSeoPageKey, {
                            ...pageConfig,
                            ogDescription: e.target.value,
                          })
                        }
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                        placeholder="Defaults to Meta Description if left empty"
                      />
                    </div>

                    {/* Meta Keywords & Tag Attributes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Meta Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={pageConfig.keywords || ''}
                          onChange={(e) =>
                            handleSaveSeoPage(activeSeoPageKey, {
                              ...pageConfig,
                              keywords: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          placeholder="saas coupons, promo codes, tech discounts"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Twitter Card Type
                        </label>
                        <CustomDropdown
                          value={pageConfig.twitterCard || 'summary_large_image'}
                          onChange={(val) =>
                            handleSaveSeoPage(activeSeoPageKey, {
                              ...pageConfig,
                              twitterCard: val as 'summary_large_image' | 'summary',
                            })
                          }
                          options={[
                            { value: 'summary_large_image', label: 'summary_large_image (Recommended)' },
                            { value: 'summary', label: 'summary (Compact)' },
                          ]}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Previews (Google SERP & Social Card) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* 1. Google SERP Snippet Preview */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-blue-600" />
                        Google Search Result Preview
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">
                        Desktop / Mobile SERP
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 space-y-1.5 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                          C
                        </div>
                        <div className="text-xs leading-none">
                          <span className="font-medium text-slate-900 dark:text-slate-200">Couponify</span>
                          <span className="text-slate-400 text-[11px] block truncate">
                            https://couponify.app{activeSeoPageKey === 'home' ? '' : `/${activeSeoPageKey}`}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-base sm:text-[17px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline font-normal leading-snug cursor-pointer line-clamp-2 pt-0.5">
                        {pageConfig.title || 'Couponify — Verified SaaS & AI Discounts'}
                      </h4>

                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {pageConfig.description ||
                          'Curated promo codes, startup credits, student freebies, and exclusive discounts on top AI, developer, and productivity tools.'}
                      </p>
                    </div>
                  </div>

                  {/* 2. OpenGraph / Social Share Card Preview */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Share2 className="h-3.5 w-3.5 text-blue-600" />
                        Social Share Card (og:image / Twitter)
                      </span>
                      <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 px-2 py-0.5 rounded font-semibold">
                        Slack · Discord · X
                      </span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      {/* Social Image Mock Banner */}
                      <div className="h-32 sm:h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex flex-col justify-between p-4 text-white relative">
                        <div className="flex items-center justify-between">
                          <span className="font-bold tracking-tight text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-white text-blue-600 flex items-center justify-center font-black text-xs">
                              C
                            </span>
                            Couponify
                          </span>
                          <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Verified Deals
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                            {activeSeoPageKey.toUpperCase()}
                          </div>
                          <div className="text-sm sm:text-base font-bold line-clamp-2">
                            {pageConfig.ogTitle || pageConfig.title}
                          </div>
                        </div>
                      </div>

                      {/* Social Card Caption */}
                      <div className="p-3.5 space-y-1 text-left bg-white dark:bg-slate-900">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          COUPONIFY.APP
                        </span>
                        <h5 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {pageConfig.ogTitle || pageConfig.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {pageConfig.ogDescription || pageConfig.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
