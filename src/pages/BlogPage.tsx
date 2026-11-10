import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  Search,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ChevronRight,
  Share2,
  Tag,
  Star,
  CheckCircle2,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import { Breadcrumb, Pagination, cn } from '../components/ui/shadcn';
import { DealCard } from '../components/DealCard';
import { ShareArticleToolbar } from '../components/ShareArticleToolbar';
import {
  RichArticleRenderer,
  extractHeadings,
  HeadingItem,
} from '../components/RichArticleRenderer';
import { BlogArticle, Deal } from '../data/mockData';

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

  // Extract Table of Contents headings for active article
  const tableOfContents = useMemo<HeadingItem[]>(() => {
    if (!activeArticle) return [];
    if (activeArticle.content) {
      return extractHeadings(activeArticle.content);
    }
    if (activeArticle.sections && activeArticle.sections.length > 0) {
      return activeArticle.sections.map((sec) => ({
        id: sec.heading
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
        text: sec.heading,
        level: 2,
      }));
    }
    return [];
  }, [activeArticle]);

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

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumb
            onNavigate={onNavigate}
            items={[
              { label: 'Home', path: '/' },
              { label: 'Savings Guides & Blog', path: '/blog' },
              { label: activeArticle.title },
            ]}
          />

          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Articles</span>
          </button>
        </div>

        {/* Main Article Container + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Body */}
          <article className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-2xs text-left space-y-6">
              {/* Header Badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/60">
                    {activeArticle.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {activeArticle.readingTime}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {activeArticle.publishDate}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                  {activeArticle.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeArticle.excerpt}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800">
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
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 my-4 shadow-2xs">
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.title}
                    className="w-full h-56 sm:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Key Takeaways Box */}
              {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Key Takeaways & Savings Rules
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {activeArticle.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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
              <div className="pt-2">
                <ShareArticleToolbar
                  title={activeArticle.title}
                  url={shareUrl}
                  description={activeArticle.excerpt}
                />
              </div>
            </div>

            {/* Featured Deals Mentioned in This Guide */}
            {relatedDeals.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>Verified Promo Codes Featured in This Guide</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onNavigate={onNavigate}
                      onRevealDeal={onRevealDeal}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sticky Sidebar: Table of Contents & Related Reads */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ListFilter className="h-3.5 w-3.5 text-blue-600" />
                  Table of Contents
                </span>
                <nav className="space-y-1.5 text-xs font-medium">
                  {tableOfContents.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.id}`}
                      className={cn(
                        'block py-1 hover:text-blue-600 transition-colors truncate',
                        h.level === 3 ? 'pl-3 text-slate-500' : 'text-slate-700 dark:text-slate-300 font-semibold'
                      )}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Other Trending Articles */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                More Savings Guides
              </span>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {articles
                  .filter((a) => a.slug !== activeArticle.slug)
                  .slice(0, 3)
                  .map((other) => (
                    <div
                      key={other.slug}
                      onClick={() => onNavigate(`/blog/${other.slug}`)}
                      className="py-3 first:pt-1 last:pb-1 cursor-pointer group space-y-1"
                    >
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                        {other.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 line-clamp-2">
                        {other.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {other.readingTime} · {other.publishDate}
                      </p>
                    </div>
                  ))}
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
  const categoriesList = [
    'All',
    'AI Tools',
    'Cloud & Hosting',
    'Productivity',
    'Dev Tools',
    'Design',
    'Databases & Backend',
  ];

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
  const [pageSize, setPageSize] = useState(6);

  // Reset to page 1 on search or category filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArticles.slice(start, start + pageSize);
  }, [filteredArticles, currentPage, pageSize]);

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Hero Header */}
      <div className="space-y-3 text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Couponify Editorial Hub</span>
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          SaaS Savings Playbooks & Cloud Buying Guides
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          In-depth benchmarks, cloud credit stacking playbooks, and verified B2B software procurement guides written by engineers and startup operators.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search guides by tool, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500 self-center sm:self-auto">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'Guide' : 'Guides'} Published
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Featured Article Card (Shown when on "All" and no search query) */}
      {selectedCategory === 'All' && !searchQuery.trim() && featuredArticle && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-stretch justify-between gap-6 text-left hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="space-y-3 min-w-0 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500" />
                  Featured Guide
                </span>
                <span className="font-semibold text-blue-600">{featuredArticle.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {featuredArticle.readingTime}
                </span>
                <span>·</span>
                <span>{featuredArticle.publishDate}</span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)}
                className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors cursor-pointer block leading-snug text-left"
              >
                {featuredArticle.title}
              </button>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl line-clamp-3">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center">
                  {featuredArticle.authorInitials}
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {featuredArticle.authorName}
                  </span>
                  <span className="text-slate-500"> · {featuredArticle.authorRole}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)}
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>Read Full Guide</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {featuredArticle.coverImage && (
            <div
              onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)}
              className="md:w-72 lg:w-96 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shrink-0 cursor-pointer group"
            >
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}

      {/* Responsive Grid of Blog Cards */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <article
              key={article.slug}
              onClick={() => onNavigate(`/blog/${article.slug}`)}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group text-left"
            >
              {/* Optional Cover Image */}
              {article.coverImage && (
                <div className="h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">{article.publishDate}</span>
                  <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredArticles.length / pageSize)}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            totalItems={filteredArticles.length}
            pageSize={pageSize}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
            pageSizeOptions={[6, 9, 18]}
            itemLabel="guides"
          />
        )}
      </div>
    </div>
  );
};
