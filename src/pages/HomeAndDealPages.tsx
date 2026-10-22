import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  Star,
  Flame,
  ArrowRight,
  TrendingUp,
  Settings,
  Mail,
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
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  Avatar,
  Pagination,
  Breadcrumb,
  Separator,
  cn,
} from '../components/ui/shadcn';
import { BrandLogo } from '../components/BrandLogo';
import { Deal, Category, Brand } from '../data/mockData';
import { Bot, Terminal, Cloud, Palette, Shield, Database } from 'lucide-react';

export function getCategoryIcon(iconName: Category['iconName'], className = 'h-4 w-4') {
  switch (iconName) {
    case 'Bot':
      return <Bot className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Database':
      return <Database className={className} />;
  }
}

// ============================================================================
// PAGE 1: HOME / EXPLORE DEALS PAGE (/) - Exact Resourify UI from Screenshots
// ============================================================================
interface HomePageProps {
  deals: Deal[];
  categories: Category[];
  brands: Brand[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
  onOpenCommandPalette: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  deals,
  brands,
  onNavigate,
  onRevealDeal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Top Fall Deals Tag Cloud from Screenshot 3 & 4
  const fallDealTags = [
    { label: 'Meta Platforms', query: 'Meta' },
    { label: 'OpenAI', query: 'OpenAI' },
    { label: 'xAI', query: 'xAI' },
    { label: 'Google Gemini', query: 'Gemini' },
    { label: 'Google Gemini', query: 'Gemini' },
    { label: 'Google Gemini', query: 'Gemini' },
    { label: 'Canva', query: 'Canva' },
    { label: 'Discord', query: 'Discord' },
    { label: 'Google Antigravity', query: 'Antigravity' },
    { label: 'ElevenLabs', query: 'ElevenLabs' },
    { label: 'PixVerse AI', query: 'PixVerse' },
    { label: 'Google Workspace', query: 'Workspace' },
    { label: 'Magnific AI', query: 'Magnific' },
    { label: 'Vultr', query: 'Vultr' },
    { label: 'OpenArt', query: 'OpenArt' },
    { label: 'Wispr AI', query: 'Wispr' },
    { label: 'Cloudways', query: 'Cloudways' },
    { label: 'Blink.new', query: 'Blink' },
    { label: 'Base44', query: 'Base44' },
    { label: 'Meshy AI', query: 'Meshy' },
  ];

  // Popular Brands from Screenshot 2
  const popularBrandsList = [
    { name: 'Google Workspace', slug: 'google-workspace', domain: 'workspace.google.com', iconLetter: 'G' },
    { name: 'OpenArt', slug: 'openart', domain: 'openart.ai', iconLetter: 'OA' },
    { name: 'Higgsfield', slug: 'higgsfield', domain: 'higgsfield.ai', iconLetter: 'HF' },
    { name: 'Blink.new', slug: 'blink', domain: 'blink.new', iconLetter: 'B' },
    { name: 'PixVerse AI', slug: 'pixverse', domain: 'pixverse.ai', iconLetter: 'PV' },
    { name: 'UpCloud', slug: 'upcloud', domain: 'upcloud.com', iconLetter: 'UC' },
    { name: 'Cloudways', slug: 'cloudways', domain: 'cloudways.com', iconLetter: 'CW' },
    { name: 'DigitalOcean', slug: 'digitalocean', domain: 'digitalocean.com', iconLetter: 'DO' },
  ];

  const sponsoredDeal = deals.find((d) => d.brandSlug === 'upcloud') || deals[0];

  return (
    <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-9">
      {/* 1. Hero Title & Subtitle (Screenshot 1) */}
      <section className="space-y-3.5 pt-1">
        <h1 className="font-display text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-foreground leading-[1.12]">
          Couponify – Digital Deals, Sorted.
        </h1>

        <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-normal">
          The best digital discounts, developer deals, freelancer offers, and student savings, updated daily.
        </p>

        <div className="pt-1">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Last updated 2 hours ago
          </span>
        </div>
      </section>

      {/* 2. Sponsored Offer Card (Screenshot 1) */}
      <Card className="rounded-2xl border border-blue-200/60 dark:border-blue-950/60 bg-gradient-to-b from-blue-50/40 to-blue-50/10 dark:from-blue-950/20 dark:to-transparent p-5 sm:p-6 space-y-4">
        {/* Brand row + Category Pill */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo
              brandSlug="upcloud"
              brandName="UpCloud"
              domain="upcloud.com"
              size="sm"
            />
            <span className="font-display font-bold text-base text-foreground">
              UpCloud
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-display text-xs font-bold tracking-wide uppercase shadow-xs">
            <Zap className="h-3 w-3 fill-white" />
            CLOUD & AI HOSTING
          </span>
        </div>

        {/* Sponsored offer label + Title */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <span>SPONSORED OFFER</span>
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`/deals/${sponsoredDeal.slug}`)}
            className="font-display text-left text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline leading-snug cursor-pointer block"
          >
            UpCloud — Deploy Fast MaxIOPS Cloud Servers with $50 Free Credit
          </button>

          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal pt-1">
            Experience enterprise European & US cloud infrastructure with 2x faster MaxIOPS block storage, Kubernetes clusters, and 100% uptime SLA.
          </p>
        </div>

        {/* Full-width Blue CTA Button */}
        <button
          type="button"
          onClick={() => onRevealDeal(sponsoredDeal)}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-display font-bold text-sm transition-all shadow-sm cursor-pointer"
        >
          Claim $50 on UpCloud
          <ArrowRight className="h-4 w-4" />
        </button>
      </Card>

      {/* 3. Section 1: "⭐ New Arrivals" (Screenshot 1 & 2) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-foreground fill-foreground/10" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              New Arrivals
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold tracking-wider text-muted-foreground uppercase font-mono">
              NEW
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/brands')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            Show all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Horizontal Deals List (Matching Screenshot 1 & 2) */}
        <div className="divide-y divide-border/60">
          {deals.slice(0, 5).map((deal) => (
            <div
              key={deal.id}
              className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5 sm:gap-4 group cursor-pointer"
              onClick={() => onNavigate(`/deals/${deal.slug}`)}
            >
              {/* Brand Avatar with Real Logo */}
              <BrandLogo
                brandSlug={deal.brandSlug}
                brandName={deal.brandName}
                initials={deal.brandInitials}
                colorClass={deal.brandColor}
                size="md"
                className="mt-0.5"
              />

              {/* Deal Details */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-display font-bold text-foreground">
                    {deal.brandName}
                  </span>

                  <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-muted-foreground">
                    New
                  </span>

                  {/* Value Pill Capsule (Screenshot 1) */}
                  <span className="px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground font-medium text-xs font-mono ml-auto sm:ml-0">
                    {deal.valueBadge}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-red-500 tracking-wide">
                  Limited Time
                </div>

                <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                  {deal.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section 2: "⚙ Popular brands" (Screenshot 2) */}
      <section className="space-y-4 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-foreground" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Popular brands
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/brands')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            Show all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 2-Column Popular Brands Grid with Real Brand Logos (Screenshot 2) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {popularBrandsList.map((brand) => (
            <button
              key={brand.name}
              type="button"
              onClick={() => onNavigate(`/brands/${brand.slug}`)}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left cursor-pointer group"
            >
              <BrandLogo
                brandSlug={brand.slug}
                brandName={brand.name}
                domain={brand.domain}
                initials={brand.iconLetter}
                size="sm"
              />
              <span className="font-display font-bold text-xs sm:text-sm text-foreground group-hover:text-blue-600 transition-colors truncate">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Section 3: "📈 Trending Deals" (Screenshot 2) */}
      <section className="space-y-4 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-foreground" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Trending Deals
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold tracking-wider text-muted-foreground uppercase font-mono">
              HOT
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/perks')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            Show all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Horizontal Trending Cards Carousel / Grid (Screenshot 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deals.slice(5, 7).map((deal) => (
            <Card
              key={deal.id}
              className="p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors cursor-pointer group"
              onClick={() => onNavigate(`/deals/${deal.slug}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <BrandLogo
                    brandSlug={deal.brandSlug}
                    brandName={deal.brandName}
                    initials={deal.brandInitials}
                    colorClass={deal.brandColor}
                    size="md"
                  />
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-foreground">
                    {deal.valueBadge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                      {deal.brandName}
                    </span>
                    <span className="text-red-500 font-semibold text-[11px]">
                      Limited time
                    </span>
                  </div>

                  <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {deal.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRevealDeal(deal);
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-display font-bold text-xs transition-colors flex items-center justify-between"
              >
                <span>Reveal Code</span>
                <span className="font-mono text-[11px] text-muted-foreground">{deal.code.slice(0, 4)}***</span>
              </button>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Circular Pagination (Screenshot 3) */}
      <div className="pt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={12}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
        />
      </div>

      {/* 7. "STAY UPDATED" Newsletter Card (Screenshot 3) */}
      <Card className="rounded-2xl border border-border/80 bg-slate-50/70 dark:bg-slate-900/60 p-6 sm:p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-foreground">
          <Mail className="h-4 w-4 text-foreground" />
          <span>STAY UPDATED</span>
        </div>

        <p className="text-sm text-foreground/80 max-w-md mx-auto leading-relaxed font-normal">
          Get exclusive student offers and digital deals straight to your inbox.
        </p>

        {newsletterSubscribed ? (
          <div className="space-y-2 pt-2">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />
            <p className="font-display text-sm sm:text-base font-bold text-foreground">
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
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm shrink-0 transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </Card>

      {/* 8. Reader-Supported Disclosure Notice (Screenshot 3) */}
      <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
        <p>
          This site is reader-supported. We may earn a commission when you buy through our links at no extra cost to you.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/terms')}
          className="font-semibold text-foreground hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer pt-0.5"
        >
          Read our Affiliate Disclosure →
        </button>
      </div>

      {/* 9. "TOP FALL DEALS" Tag Cloud (Screenshot 3 & 4) */}
      <section className="space-y-3 pt-2">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
          TOP FALL DEALS
        </h3>

        <div className="flex flex-wrap gap-2 pt-1">
          {fallDealTags.map((tag, idx) => (
            <button
              key={`${tag.label}-${idx}`}
              type="button"
              onClick={() => onNavigate('/brands')}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </section>
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
    <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
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

      <div className="space-y-6">
        {/* Main Deal Header Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate(`/brands/${deal.brandSlug}`)}
              className="cursor-pointer"
            >
              <BrandLogo
                brandSlug={deal.brandSlug}
                brandName={deal.brandName}
                initials={deal.brandInitials}
                colorClass={deal.brandColor}
                size="lg"
              />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/brands/${deal.brandSlug}`)}
                  className="font-display text-lg font-bold text-foreground hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {deal.brandName}
                </button>
                <Badge variant="emerald" className="text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </Badge>
                <Badge variant="blue" className="font-mono text-xs">
                  {deal.valueBadge}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Category: {deal.categoryName} · {deal.dealType}
              </p>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
            {deal.title}
          </h1>

          <p className="text-sm text-foreground/80 leading-relaxed font-normal">
            {deal.shortDescription}
          </p>

          {/* Large Interactive Promo Code Box */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30 p-5 text-center space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {codeRevealed ? 'Promo Code Ready at Checkout' : 'Reveal & Copy Verified Promo Code'}
            </p>
            <div className="rounded-xl border border-border bg-background py-3 px-4 font-mono text-xl sm:text-2xl font-bold tracking-widest text-blue-600 dark:text-blue-400 select-all">
              {codeRevealed ? deal.code : `${deal.code.slice(0, 5)}•••••`}
            </div>

            <Button
              variant={copied ? 'emerald' : 'default'}
              className="w-full h-11 font-display font-bold text-sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied to Clipboard ({deal.code})
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {codeRevealed ? 'Copy Code' : 'Reveal & Copy Code'}
                </>
              )}
            </Button>
          </div>

          <a
            href={deal.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onIncrementClick(deal.id)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Go to Official {deal.brandName} Site
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>

          <Separator />

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <strong className="text-foreground">{deal.views.toLocaleString()}</strong> views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MousePointerClick className="h-4 w-4 text-blue-600" />
              <strong className="text-foreground">{deal.clicks.toLocaleString()}</strong> redemptions
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Valid through <strong className="text-foreground">{deal.expiresAt}</strong>
            </span>
          </div>
        </Card>

        {/* Step-by-Step Redemption Instructions */}
        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Step-by-Step Redemption Instructions
          </h2>
          <div className="space-y-3">
            {deal.redemptionSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white font-mono">
                  {idx + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Community Feedback Widget */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-foreground">
              Did This Deal Work For You?
            </h3>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {displayedSuccessRate}% Success
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={voteState === 'up' ? 'emerald' : 'outline'}
              size="sm"
              onClick={() => setVoteState('up')}
              className="h-9 text-xs"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes, Worked
            </Button>
            <Button
              variant={voteState === 'down' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setVoteState('down')}
              className="h-9 text-xs"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              No, Expired
            </Button>
          </div>
        </Card>
      </div>

      {/* Related Deals List */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="font-display text-lg font-bold text-foreground">
          Related Deals in {deal.categoryName}
        </h2>
        <div className="divide-y divide-border/60">
          {fallbackRelated.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onNavigate(`/deals/${rel.slug}`)}
              className="py-3.5 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BrandLogo
                  brandSlug={rel.brandSlug}
                  brandName={rel.brandName}
                  initials={rel.brandInitials}
                  colorClass={rel.brandColor}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="font-display text-xs font-bold text-foreground group-hover:text-blue-600 truncate">
                    {rel.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{rel.brandName}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-emerald-600 shrink-0">
                {rel.valueBadge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
