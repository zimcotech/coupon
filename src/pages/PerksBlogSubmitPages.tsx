import React, { useState } from 'react';
import {
  Rocket,
  GraduationCap,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  Calendar,
  CheckCircle2,
  Check,
  Eye,
  Plus,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  Building2,
  ChevronRight,
} from 'lucide-react';
import {
  Button,
  Breadcrumb,
  Pagination,
  cn,
} from '../components/ui/shadcn';
import { CustomDropdown } from '../components/CustomDropdown';
import { BrandLogo } from '../components/BrandLogo';
import { PerkItem, BlogArticle, Deal, Category } from '../data/mockData';
import { DealCard } from '../components/DealCard';

// ============================================================================
// PAGE 7: STARTUP & STUDENT PERKS PAGE (/perks)
// ============================================================================
export interface PerksPageProps {
  perks: PerkItem[];
  deals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}
export type PacksPageProps = PerksPageProps;

export const PerksPage: React.FC<PerksPageProps> = ({
  perks,
  deals,
  onNavigate,
  onRevealDeal,
}) => {
  const [activeTab, setActiveTab] = useState<'startup' | 'student'>('startup');

  const filteredPerks = perks.filter((p) => p.programType === activeTab);

  const handleClaimPerk = (perk: PerkItem) => {
    const matchedDeal = deals.find((d) => d.slug === perk.dealSlug) || deals[0];
    onNavigate(`/deals/${matchedDeal.slug}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Packs & Grants' }]}
      />

      {/* Hero Header */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-2xs text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50">
            <Rocket className="h-3.5 w-3.5" />
            Founder & Academic Hub
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            $320,000+ Combined Value
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Startup Cloud Credits & Student Developer Packs
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
          Compare and claim high-value infrastructure grants from AWS Activate, Google Cloud, OpenAI, and Notion—or unlock 100% free academic licenses with a verified university email.
        </p>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('startup')}
            className={cn(
              'h-10 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
              activeTab === 'startup'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <Rocket className="h-4 w-4" />
            <span>Startup Credits Program</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={cn(
              'h-10 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Education Discounts</span>
          </button>
        </div>
      </div>

      {/* Program Matrix Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <span>
              {activeTab === 'startup'
                ? 'Startup Credits Program Matrix'
                : 'Student Developer & University Packs Matrix'}
            </span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {filteredPerks.length} Verified Programs
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Brand & Program</th>
                <th className="py-3 px-4 font-semibold">Maximum Value</th>
                <th className="py-3 px-4 font-semibold">Eligibility Criteria</th>
                <th className="py-3 px-4 font-semibold">Verification Method</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPerks.map((perk) => (
                <tr key={perk.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <BrandLogo brandSlug={perk.brandSlug} brandName={perk.brandName} initials={perk.brandInitials} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">{perk.brandName}</p>
                        <p className="text-xs text-slate-500 whitespace-nowrap">{perk.programTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {perk.maxValue}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                    {perk.eligibilityCriteria}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {perk.verificationMethod}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      onClick={() => handleClaimPerk(perk)}
                      className="h-9 px-3.5 text-xs font-semibold rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                    >
                      <span>Claim Grant</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Card Listings Fluid Grid */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          Detailed Program Breakdowns & Application Guides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredPerks.map((perk) => (
            <div
              key={perk.id}
              className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BrandLogo
                      brandSlug={perk.brandSlug}
                      brandName={perk.brandName}
                      initials={perk.brandInitials}
                      colorClass={perk.brandColor}
                      size="md"
                    />
                    <div>
                      <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        {perk.programTitle}
                      </h3>
                      <p className="text-xs text-slate-500">{perk.brandName}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                    {perk.maxValue}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {perk.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Eligibility: </span>
                    <span className="text-slate-500">{perk.eligibilityCriteria}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Verification: </span>
                    <span className="text-slate-500">{perk.verificationMethod}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {perk.verificationMethod}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleClaimPerk(perk)}
                  className="h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                >
                  Apply Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 8: SAVINGS GUIDES / BLOG PAGE (/blog)
// ============================================================================
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const activeSlug = currentSlug || selectedSlug;

  // If viewing an individual article
  if (activeSlug) {
    const article = articles.find((a) => a.slug === activeSlug) || articles[0];
    const relatedDeals = deals.filter((d) =>
      article.relatedDealSlugs?.includes(d.slug)
    );

    // 3 Recommended blog posts based on the current article's category
    const sameCategoryArticles = articles.filter(
      (a) => a.category === article.category && a.slug !== article.slug
    );
    const displayedRelatedArticles =
      sameCategoryArticles.length >= 3
        ? sameCategoryArticles.slice(0, 3)
        : [
            ...sameCategoryArticles,
            ...articles.filter(
              (a) => a.slug !== article.slug && !sameCategoryArticles.some((r) => r.slug === a.slug)
            ),
          ].slice(0, 3);

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
        <Breadcrumb
          onNavigate={onNavigate}
          items={[
            { label: 'Home', path: '/' },
            { label: 'Savings Guides', path: '/blog' },
            { label: article.title },
          ]}
        />

        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-6 shadow-2xs text-left max-w-4xl mx-auto">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                {article.category}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {article.publishDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              {article.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-300">
                {article.authorInitials}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{article.authorName}</p>
                <p className="text-slate-500">{article.authorRole}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {article.sections?.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Deals in this Guide */}
        {relatedDeals.length > 0 && (
          <section className="space-y-4 max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
              Verified Promo Codes Featured in This Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

        {/* Related Articles Section (3 Recommended Posts based on category) */}
        {displayedRelatedArticles.length > 0 && (
          <section className="space-y-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>Related Articles in {article.category}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recommended guides and deal tutorials based on this category
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('/blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>All Guides</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {displayedRelatedArticles.map((relArt) => (
                <div
                  key={relArt.slug}
                  onClick={() => {
                    onNavigate(`/blog/${relArt.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 hover:border-blue-500/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                        {relArt.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {relArt.readingTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {relArt.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {relArt.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <span className="truncate">{relArt.authorName}</span>
                    <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 shrink-0">
                      Read →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const categories = ['All', 'AI Tools', 'Cloud & Hosting', 'Productivity', 'Dev Tools', 'Design', 'Databases & Backend'];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const filteredArticles = articles.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  // Reset page when category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      <div className="space-y-2 text-left">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <BookOpen className="h-3.5 w-3.5" />
          Couponify Editorial
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          SaaS Comparisons & Software Savings Guides
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          In-depth benchmarks, cloud credit stacking playbooks, and B2B software procurement guides written by engineers and startup operators.
        </p>
      </div>

      {/* Featured Article Card */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div className="space-y-3 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              Featured Guide
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {featuredArticle.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {featuredArticle.readingTime}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)}
            className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors cursor-pointer block leading-snug text-left"
          >
            {featuredArticle.title}
          </button>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            {featuredArticle.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-300">
              {featuredArticle.authorInitials}
            </div>
            <div className="text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{featuredArticle.authorName}</span>
              <span className="text-slate-500"> · {featuredArticle.authorRole}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)}
            className="w-full sm:w-auto h-10 px-5 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
          >
            <span>Read Full Guide</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Fluid Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedArticles.map((article) => (
            <div
              key={article.slug}
              onClick={() => onNavigate(`/blog/${article.slug}`)}
              className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 group text-left"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-blue-600">{article.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime}
                  </span>
                </div>

                <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700 dark:text-slate-300">{article.authorName}</span>
                <span className="text-blue-600 inline-flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Read Guide
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length > pageSize && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredArticles.length / pageSize)}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            totalItems={filteredArticles.length}
            pageSize={pageSize}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
            pageSizeOptions={[6, 9, 12]}
            itemLabel="articles"
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 9: SUBMIT DEAL & ADVERTISE PAGE (/submit)
// ============================================================================
export interface SubmitAndAdvertisePageProps {
  categories?: Category[];
  initialTab?: string;
  onNavigate: (path: string) => void;
  onAddDeal?: (newDeal: Deal) => void;
  onRevealDeal?: (deal: Deal) => void;
}

export const SubmitAndAdvertisePage: React.FC<SubmitAndAdvertisePageProps> = ({
  initialTab = 'submit',
  onNavigate,
  onAddDeal,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'advertise'>(
    initialTab === 'advertise' ? 'advertise' : 'submit'
  );
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    brandName: '',
    title: '',
    valueBadge: '',
    code: '',
    categorySlug: 'ai-tools',
    officialUrl: '',
    shortDescription: '',
    contactEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.brandName && form.title && form.valueBadge && form.code) {
      if (onAddDeal) {
        const newDeal: Deal = {
          id: `deal-user-${Date.now()}`,
          title: form.title,
          slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brandSlug: form.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brandName: form.brandName,
          brandInitials: form.brandName.slice(0, 2).toUpperCase(),
          brandColor: 'bg-blue-600',
          logoUrl: '',
          categorySlug: form.categorySlug,
          categoryName: form.categorySlug === 'ai-tools' ? 'AI Tools' : 'Developer Tools',
          dealType: 'Promo Codes',
          valueBadge: form.valueBadge,
          discountPercent: 50,
          hasFreeTrial: false,
          code: form.code,
          isCodeRequired: true,
          officialUrl: form.officialUrl || 'https://example.com',
          shortDescription: form.shortDescription || 'Community submitted deal verified by Couponify.',
          verifiedAgo: 'Just now',
          verifiedTimestamp: Date.now(),
          expiresAt: 'December 2026',
          clicks: 1,
          views: 5,
          successRate: 100,
          eligibility: ['Valid for new customer sign-ups.'],
          redemptionSteps: ['Apply code during checkout.'],
        };
        onAddDeal(newDeal);
      }
      setSubmitted(true);
    }
  };

  const adPackages = [
    {
      title: 'Top Banner Showcase',
      price: '$450/week',
      description: 'Pin your product at the top of the homepage hero banner for 100k+ monthly software buyers.',
      features: ['100k+ impressions', 'Direct tracked CTA link', 'Custom badge highlight'],
    },
    {
      title: 'Trending Deals Spotlight',
      price: '$290/week',
      description: 'Place your deal in the first slot of the Trending Deals carousel and category directories.',
      features: ['Permanent verified badge', 'Featured in weekly newsletter', 'Real-time click telemetry'],
    },
    {
      title: 'Sponsored Editorial Review',
      price: '$850/article',
      description: 'Comprehensive 1,500-word software benchmark and savings guide written by our engineering editors.',
      features: ['Permanent SEO placement', 'Dofollow editorial links', 'Featured on homepage blog feed'],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Submit & Advertise' }]}
      />

      <div className="space-y-3 text-left max-w-3xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Partner with Couponify
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Submit your SaaS discount code for free inclusion, or sponsor placements to reach hundreds of thousands of developers, founders, and IT buyers.
        </p>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={cn(
              'h-10 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
              activeTab === 'submit'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <Plus className="h-4 w-4" />
            <span>Submit a Free Deal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advertise')}
            className={cn(
              'h-10 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]',
              activeTab === 'advertise'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <Building2 className="h-4 w-4" />
            <span>Advertise & Sponsor</span>
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs text-left max-w-3xl">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Deal Submitted Successfully!</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Our verification team has received your promo code. It has been added to our live directory and will be tested against checkouts.
              </p>
              <Button
                variant="default"
                onClick={() => onNavigate('/')}
                className="h-10 px-5 text-xs rounded-lg mt-2 cursor-pointer"
              >
                View Live Directory
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Software Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.brandName}
                    onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                    placeholder="e.g. Supabase, Render, Cursor"
                    className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Discount Value / Perk *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.valueBadge}
                    onChange={(e) => setForm({ ...form, valueBadge: e.target.value })}
                    placeholder="e.g. 50% OFF, $200 Credits"
                    className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Deal Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Get 50% Off First 6 Months with Promo Code"
                  className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Promo Code (or write 'LINK') *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. LAUNCH50"
                    className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Software Category
                  </label>
                  <CustomDropdown
                    value={form.categorySlug}
                    onChange={(val) => setForm({ ...form, categorySlug: val })}
                    options={[
                      { value: 'ai-tools', label: 'AI Tools' },
                      { value: 'cloud-hosting', label: 'Cloud & Hosting' },
                      { value: 'dev-tools', label: 'Dev Tools' },
                      { value: 'design-creative', label: 'Design & Creative' },
                      { value: 'productivity', label: 'Productivity & Docs' },
                      { value: 'student-startup', label: 'Student & Startup' },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Official Redemption URL *
                </label>
                <input
                  type="url"
                  required
                  value={form.officialUrl}
                  onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
                  placeholder="https://yourbrand.com/pricing"
                  className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Deal Details & Eligibility
                </label>
                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Any restrictions, eligible tiers, or expiration rules..."
                  className="w-full p-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                />
              </div>

              <button
                type="submit"
                className="h-10 px-6 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
              >
                <Send className="h-4 w-4" />
                <span>Submit Deal for Review</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Sponsored Placement Tiers */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {adPackages.map((pkg, idx) => (
              <div
                key={idx}
                className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs flex flex-col justify-between space-y-4 text-left"
              >
                <div className="space-y-2">
                  <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                    {pkg.title}
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {pkg.price}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="w-full h-10 px-4 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                >
                  Book Placement
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
