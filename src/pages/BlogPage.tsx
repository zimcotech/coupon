import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  Search,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Tag,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Breadcrumb, Pagination, cn } from '../components/ui/shadcn';
import { BrandLogo } from '../components/BrandLogo';
import { ShareArticleToolbar } from '../components/ShareArticleToolbar';
import { RichArticleRenderer } from '../components/RichArticleRenderer';
import { BlogArticle, Deal, hasCouponCode } from '../data/mockData';

export interface BlogPageProps {
  articles: BlogArticle[];
  deals: Deal[];
  currentSlug?: string;
  selectedSlug?: string;
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  articles,
  deals,
  currentSlug,
  selectedSlug,
  onNavigate,
  onRevealDeal,
}) => {
  const activeSlug = currentSlug || selectedSlug;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find active article if slug provided
  const activeArticle = useMemo(() => {
    if (!activeSlug) return null;
    return articles.find((a) => a.slug === activeSlug) || null;
  }, [articles, activeSlug]);

  // Dynamic SEO & Meta Tags update when reading a specific article
  useEffect(() => {
    if (activeArticle) {
      const pageTitle = `${activeArticle.metaTitle || activeArticle.title} | Couponify`;
      document.title = pageTitle;

      const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
        let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attribute, key);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      const metaDesc =
        activeArticle.metaDescription || activeArticle.excerpt || 'Verified SaaS discounts and cloud credits guides.';
      setMeta('name', 'description', metaDesc);
      setMeta('property', 'og:title', activeArticle.metaTitle || activeArticle.title);
      setMeta('property', 'og:description', metaDesc);
      setMeta('property', 'og:type', 'article');
      setMeta('name', 'twitter:card', 'summary_large_image');
      setMeta('name', 'twitter:title', activeArticle.metaTitle || activeArticle.title);
      setMeta('name', 'twitter:description', metaDesc);

      const coverImg =
        activeArticle.metaImage ||
        activeArticle.coverImage ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
      setMeta('property', 'og:image', coverImg);
      setMeta('name', 'twitter:image', coverImg);
    }
  }, [activeArticle]);

  // ==========================================================================
  // VIEW 1: DYNAMIC BLOG POST DETAIL PAGE (/blog/:slug)
  // ==========================================================================
  if (activeArticle) {
    const relatedDeals = deals.filter((d) =>
      activeArticle.relatedDealSlugs?.includes(d.slug)
    );

    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/blog/${activeArticle.slug}`
        : `https://couponify.app/blog/${activeArticle.slug}`;

    const currentIndex = articles.findIndex((a) => a.slug === activeArticle.slug);
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-6 sm:space-y-8 overflow-x-hidden">
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumb
            onNavigate={onNavigate}
            items={[
              { label: 'Home', path: '/' },
              { label: 'Articles', path: '/blog' },
              { label: activeArticle.title },
            ]}
          />

          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-800 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Articles</span>
          </button>
        </div>

        {/* Main Article Container + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Content Body (8 cols) */}
          <article className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 lg:p-10 shadow-2xs text-left space-y-6">
              {/* Header Badges & Metadata */}
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/60">
                    {activeArticle.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {activeArticle.readingTime}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {activeArticle.publishDate}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                  {activeArticle.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeArticle.excerpt}
                </p>

                {/* Author Info Card */}
                <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-850">
                    {activeArticle.authorInitials || 'CP'}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {activeArticle.authorName}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {activeArticle.authorRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              {activeArticle.coverImage && (
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.title}
                    className="w-full h-56 sm:h-80 lg:h-96 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Share Article Toolbar Top */}
              <ShareArticleToolbar
                title={activeArticle.title}
                url={shareUrl}
                description={activeArticle.excerpt}
              />

              {/* Rich Body Content */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {activeArticle.content ? (
                  <RichArticleRenderer
                    content={activeArticle.content}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <div className="space-y-6">
                    {activeArticle.sections?.map((sec, idx) => {
                      const id = sec.heading
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                      return (
                        <div key={idx} id={id} className="scroll-mt-24 space-y-2">
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-left">
                            {sec.heading}
                          </h2>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                            {sec.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tags Row */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-slate-400 mr-1" />
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Share Toolbar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <ShareArticleToolbar
                  title={activeArticle.title}
                  url={shareUrl}
                  description={activeArticle.excerpt}
                />
              </div>

              {/* Next / Previous Article Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {prevArticle ? (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(`/blog/${prevArticle.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-left transition-colors cursor-pointer group space-y-1"
                  >
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                      Previous Article
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {prevArticle.title}
                    </p>
                  </button>
                ) : (
                  <div />
                )}

                {nextArticle && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(`/blog/${nextArticle.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-right transition-colors cursor-pointer group space-y-1"
                  >
                    <span className="text-[11px] font-semibold text-slate-400 inline-flex items-center gap-1 justify-end">
                      Next Article
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {nextArticle.title}
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* Mentioned Deals (Styled similar to New Arrivals cards) */}
            {relatedDeals.length > 0 && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>Mentioned Deals</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedDeals.map((deal) => {
                    const cleanedVerifiedAgo = (deal.verifiedAgo || 'recently')
                      .replace(/^Verified\s*/i, '')
                      .trim();

                    return (
                      <div
                        key={deal.id}
                        onClick={() => onRevealDeal(deal)}
                        className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] transition-all cursor-pointer text-left flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Top: Logo & Brand + Badge */}
                          <div className="flex items-start gap-3.5">
                            <BrandLogo
                              brandSlug={deal.brandSlug}
                              brandName={deal.brandName}
                              initials={deal.brandInitials}
                              colorClass={deal.brandColor}
                              size="md"
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shadow-2xs shrink-0 mt-0.5"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {deal.brandName}
                                </span>
                                <span className="inline-block max-w-full truncate text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 px-2.5 py-0.5 rounded-md">
                                  {deal.valueBadge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                                <span>Verified {cleanedVerifiedAgo}</span>
                              </p>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div className="space-y-1 pt-0.5">
                            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                              {deal.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {deal.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Bottom CTA Button */}
                        <div className="pt-2 mt-3.5">
                          <button
                            type="button"
                            className="w-full h-10 sm:h-11 rounded-xl bg-slate-950 group-hover:bg-slate-800 dark:bg-white dark:group-hover:bg-slate-100 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>{hasCouponCode(deal) ? 'Get Code' : 'Claim Deal'}</span>
                            {hasCouponCode(deal) ? (
                              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                            ) : (
                              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </article>

          {/* Sticky Sidebar: More Articles */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs text-left">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>More Articles</span>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('/blog')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Articles List with Rich Visual Cards */}
              <div className="space-y-3">
                {articles
                  .filter((a) => a.slug !== activeArticle.slug)
                  .slice(0, 4)
                  .map((other) => (
                    <div
                      key={other.slug}
                      onClick={() => {
                        onNavigate(`/blog/${other.slug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-start gap-3"
                    >
                      {/* Thumbnail or Fallback */}
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 relative">
                        {other.coverImage ? (
                          <img
                            src={other.coverImage}
                            alt={other.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-center text-blue-600">
                            <BookOpen className="h-6 w-6 opacity-60" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="inline-block text-[10.5px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/50 truncate max-w-full">
                          {other.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                          {other.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{other.readingTime}</span>
                          <span>•</span>
                          <span>{other.publishDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Bottom Explore Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('/blog')}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore All Articles</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: MAIN BLOG INDEX PAGE (/blog)
  // ==========================================================================
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ['All', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      (article.tags && article.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  // Reset to page 1 on search or category filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArticles.slice(start, start + pageSize);
  }, [filteredArticles, currentPage, pageSize]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-7 sm:space-y-8 overflow-x-hidden">
      {/* Hero Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Latest Articles
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Insights, tutorials, and updates about latest deals.
        </p>
      </div>

      {/* Search Bar */}
      <div className="pt-1">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles by title, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600',
                isSelected
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Responsive Grid of Blog Cards */}
      <div className="space-y-6 pt-1">
        {paginatedArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 sm:p-14 text-center space-y-3 bg-white/50 dark:bg-slate-900/50">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find any articles matching "{searchQuery}". Try searching for another topic or clear filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Clear search & filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {paginatedArticles.map((article) => (
              <article
                key={article.slug}
                onClick={() => onNavigate(`/blog/${article.slug}`)}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group text-left"
              >
                {/* Cover Image or Fallback Header Banner */}
                {article.coverImage ? (
                  <div className="h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="font-semibold text-[11px] text-blue-700 dark:text-blue-300 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                        {article.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 sm:h-48 w-full bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/30 border-b border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between relative">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] text-blue-700 dark:text-blue-300 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                        {article.category}
                      </span>
                      <BookOpen className="h-5 w-5 text-blue-500/60" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {article.readingTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {article.publishDate}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {article.authorInitials || 'CP'}
                      </div>
                      <span className="font-medium text-slate-600 dark:text-slate-300 truncate">
                        {article.authorName}
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredArticles.length > 0 && Math.ceil(filteredArticles.length / pageSize) > 1 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredArticles.length / pageSize)}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              totalItems={filteredArticles.length}
              pageSize={pageSize}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
              pageSizeOptions={[3, 6, 9, 12]}
              itemLabel="articles"
            />
          </div>
        )}
      </div>
    </div>
  );
};
