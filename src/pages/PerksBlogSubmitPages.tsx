import React, { useState } from 'react';
import {
  Rocket,
  GraduationCap,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Check,
  Users,
  MousePointerClick,
  Eye,
  Plus,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  Input,
  Textarea,
  Select,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  Breadcrumb,
  Accordion,
  Alert,
} from '../components/ui/shadcn';
import { BrandLogo } from '../components/BrandLogo';
import { PerkItem, BlogArticle, Deal, Category } from '../data/mockData';
import { DealCard } from '../components/DealCard';

// ============================================================================
// PAGE 7: STARTUP & STUDENT PERKS PAGE (/perks)
// ============================================================================
interface PerksPageProps {
  perks: PerkItem[];
  deals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

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
    onRevealDeal(matchedDeal);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      {/* Hero Header */}
      <Card className="p-5 sm:p-10 bg-muted/25">
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="indigo" className="text-xs">
              <Rocket className="h-3.5 w-3.5" />
              Founder & Academic Hub
            </Badge>
            <Badge variant="emerald" className="text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              $320,000+ Combined Value
            </Badge>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Startup Cloud Credits & Student Developer Perks
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Compare and claim high-value infrastructure grants from AWS Activate, Google Cloud, OpenAI, and Notion—or unlock 100% free academic licenses with a verified university email.
          </p>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'startup' | 'student')}
            className="pt-2"
          >
            <TabsList className="w-full sm:w-auto overflow-x-auto scrollbar-none">
              <TabsTrigger value="startup" className="text-xs">
                <Rocket className="h-3.5 w-3.5" />
                Startup Credits Program
              </TabsTrigger>
              <TabsTrigger value="student" className="text-xs">
                <GraduationCap className="h-3.5 w-3.5" />
                Student Education Discounts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Comprehensive Comparison Table with Responsive Scroll Wrapper */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
            {activeTab === 'startup'
              ? 'Startup Credits Program Matrix'
              : 'Student Developer & University Perks Matrix'}
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            Showing {filteredPerks.length} Verified Programs
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand & Program</TableHead>
                <TableHead>Maximum Value</TableHead>
                <TableHead>Eligibility Criteria</TableHead>
                <TableHead>Verification Method</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPerks.map((perk) => (
                <TableRow key={perk.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <BrandLogo brandSlug={perk.brandSlug} brandName={perk.brandName} initials={perk.brandInitials} size="sm" />
                      <div>
                        <p className="font-display font-bold text-foreground whitespace-nowrap text-xs sm:text-sm">{perk.brandName}</p>
                        <p className="text-[11px] text-muted-foreground whitespace-nowrap">{perk.programTitle}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="emerald" className="font-mono text-xs">
                      {perk.maxValue}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground min-w-[200px]">
                    {perk.eligibilityCriteria}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground whitespace-nowrap">
                    {perk.verificationMethod}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button size="sm" onClick={() => handleClaimPerk(perk)} className="h-8 text-xs">
                      Claim Grant
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detailed Card Listings */}
      <div className="space-y-4">
        <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
          Detailed Program Breakdowns & Application Guides
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          {filteredPerks.map((perk) => (
            <Card key={perk.id} className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={perk.brandInitials} colorClass={perk.brandColor} size="md" />
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">{perk.programTitle}</h3>
                      <p className="text-xs text-muted-foreground">{perk.brandName}</p>
                    </div>
                  </div>
                  <Badge variant="indigo" className="font-mono text-xs">
                    {perk.maxValue}
                  </Badge>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {perk.description}
                </p>

                <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Verification:</span>
                    <span className="font-mono font-medium text-foreground">{perk.verificationMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Applications Open
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-9"
                  onClick={() => onNavigate(`/brands/${perk.brandSlug}`)}
                >
                  Brand Profile
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs h-9"
                  onClick={() => handleClaimPerk(perk)}
                >
                  Reveal Code
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 8: BLOG & SAVINGS GUIDES PAGE (/blog AND /blog/[slug])
// ============================================================================
interface BlogPageProps {
  articles: BlogArticle[];
  selectedSlug?: string;
  deals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  articles,
  selectedSlug,
  deals,
  onNavigate,
  onRevealDeal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activeArticle = selectedSlug
    ? articles.find((a) => a.slug === selectedSlug) || null
    : null;

  // Standalone Article Reader View
  if (activeArticle) {
    const relatedDeals = deals.filter((d) =>
      activeArticle.relatedDealSlugs.includes(d.slug)
    );

    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <Breadcrumb
          onNavigate={onNavigate}
          items={[
            { label: 'Home', path: '/' },
            { label: 'Blog & Savings Guides', path: '/blog' },
            { label: activeArticle.title },
          ]}
        />

        <Button variant="outline" size="sm" onClick={() => onNavigate('/blog')} className="h-8 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Savings Guides
        </Button>

        <Card className="p-5 sm:p-10 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
              <Badge variant="indigo">{activeArticle.category}</Badge>
              <span className="inline-flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {activeArticle.readingTime}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-mono">
                <Calendar className="h-3.5 w-3.5" />
                {activeArticle.publishDate}
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-snug">
              {activeArticle.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {activeArticle.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-3 border-y border-border py-3.5">
            <Avatar initials={activeArticle.authorInitials} size="sm" />
            <div className="text-xs">
              <p className="font-display font-bold text-foreground">{activeArticle.authorName}</p>
              <p className="text-muted-foreground">{activeArticle.authorRole}</p>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 sm:p-5 space-y-2.5">
            <p className="font-display text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Key Savings Takeaways
            </p>
            <ul className="space-y-2">
              {activeArticle.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Body Sections */}
          <div className="space-y-6 pt-2">
            {activeArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">{sec.heading}</h2>
                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Related Deals Mentioned in This Guide */}
        {relatedDeals.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Verified Promo Codes Featured in This Guide
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {relatedDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onNavigate={onNavigate}
                  onRevealDeal={onRevealDeal}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const categories = ['All', 'AI Tools', 'Cloud & Hosting', 'Productivity', 'Dev Tools', 'Design', 'Databases & Backend'];

  const filteredArticles = articles.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      <div className="space-y-2.5">
        <Badge variant="indigo">
          <BookOpen className="h-3.5 w-3.5" />
          Couponify Editorial
        </Badge>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          SaaS Comparisons & Software Savings Guides
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          In-depth benchmarks, cloud credit stacking playbooks, and B2B software procurement guides written by cloud architects and startup operators.
        </p>
      </div>

      {/* Featured Article Hero Card */}
      <Card className="p-5 sm:p-8 border-indigo-500/30 bg-indigo-500/[0.02]">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="indigo">Featured Guide</Badge>
              <Badge variant="secondary">{featuredArticle.category}</Badge>
              <span className="inline-flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {featuredArticle.readingTime}
              </span>
              <span className="inline-flex items-center gap-1 font-mono">
                <Calendar className="h-3.5 w-3.5" />
                {featuredArticle.publishDate}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)}
              className="font-display text-left text-lg sm:text-2xl font-bold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer block leading-snug"
            >
              {featuredArticle.title}
            </button>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {featuredArticle.excerpt}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Avatar initials={featuredArticle.authorInitials} size="sm" />
              <div className="text-xs">
                <span className="font-display font-semibold text-foreground">{featuredArticle.authorName}</span>
                <span className="text-muted-foreground"> · {featuredArticle.authorRole}</span>
              </div>
            </div>
          </div>

          <div className="flex lg:justify-end pt-2 lg:pt-0">
            <Button onClick={() => onNavigate(`/blog/${featuredArticle.slug}`)} className="w-full sm:w-auto h-9 text-xs">
              Read Full Guide
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="h-8 text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* 3-Column Article Card Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card
            key={article.slug}
            className="flex flex-col justify-between p-5 sm:p-6 hover:border-indigo-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-[10px]">{article.category}</Badge>
                <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="h-3 w-3" />
                  {article.readingTime}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(`/blog/${article.slug}`)}
                className="font-display text-left text-sm sm:text-base font-bold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer block leading-snug"
              >
                {article.title}
              </button>

              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar initials={article.authorInitials} size="sm" />
                <div className="text-[11px]">
                  <p className="font-display font-semibold text-foreground">{article.authorName}</p>
                  <p className="text-muted-foreground font-mono">{article.publishDate}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(`/blog/${article.slug}`)}
                className="h-8 text-xs"
              >
                Read →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 9: SUBMIT A DEAL & ADVERTISE PAGE (/submit)
// ============================================================================
interface SubmitAndAdvertisePageProps {
  categories: Category[];
  initialTab?: 'submit' | 'advertise';
  onAddDeal: (newDeal: Deal) => void;
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const SubmitAndAdvertisePage: React.FC<SubmitAndAdvertisePageProps> = ({
  categories,
  initialTab = 'submit',
  onAddDeal,
  onNavigate,
  onRevealDeal,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'advertise'>(initialTab);
  const [brandName, setBrandName] = useState('Raycast');
  const [websiteUrl, setWebsiteUrl] = useState('https://www.raycast.com');
  const [dealTitle, setDealTitle] = useState('Raycast Pro Promo Code: 30% Off Annual Pro + Custom AI Commands');
  const [promoCode, setPromoCode] = useState('RAYCAST30PRO');
  const [discountValue, setDiscountValue] = useState('30% OFF Annual');
  const [expirationDate, setExpirationDate] = useState('Dec 31, 2026');
  const [categorySlug, setCategorySlug] = useState('productivity');
  const [dealType, setDealType] = useState<Deal['dealType']>('Promo Codes');
  const [shortDesc, setShortDesc] = useState('Supercharge your Mac workflow with instant launcher shortcuts, clipboard history, and always-on AI chat.');
  const [redemptionStepsText, setRedemptionStepsText] = useState(
    'Copy code RAYCAST30PRO from Couponify.\nOpen Raycast Account Settings > Billing.\nApply RAYCAST30PRO at annual checkout.'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [selectedAdPackage, setSelectedAdPackage] = useState<string | null>(null);

  const selectedCatObj = categories.find((c) => c.slug === categorySlug) || categories[0];

  const livePreviewDeal: Deal = {
    id: 'preview-deal',
    slug: `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-2026`,
    brandSlug: 'notion',
    brandName: brandName || 'Your Brand',
    brandInitials: (brandName || 'YB').slice(0, 2).toUpperCase(),
    brandColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    categorySlug: selectedCatObj.slug,
    categoryName: selectedCatObj.name,
    dealType,
    valueBadge: discountValue || '25% OFF',
    discountPercent: 30,
    hasFreeTrial: true,
    title: dealTitle || 'Your SEO Promo Code Title Appears Here',
    shortDescription: shortDesc || 'Your concise 2-line product and offer value proposition.',
    code: promoCode || 'COUPON2026',
    isCodeRequired: true,
    verifiedAgo: 'Verified Just Now',
    verifiedTimestamp: 0,
    views: 1,
    clicks: 1,
    isTrending: true,
    expiresAt: expirationDate || 'Dec 31, 2026',
    officialUrl: websiteUrl || 'https://example.com',
    successRate: 100,
    eligibility: ['Valid for new and upgrading workspace subscribers.'],
    redemptionSteps: redemptionStepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDeal({
      ...livePreviewDeal,
      id: `custom-${Date.now()}`,
    });
    setSubmittedSuccess(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="indigo">Partner Portal</Badge>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Submit a SaaS Deal or Advertise With Us
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            List your verified promo code in the Couponify directory or book a high-intent sponsored placement in front of 280,000+ monthly founders and developers.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'submit' | 'advertise')}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto overflow-x-auto scrollbar-none">
            <TabsTrigger value="submit" className="text-xs flex-1 sm:flex-none">
              <Plus className="h-3.5 w-3.5" />
              Submit Deal Form
            </TabsTrigger>
            <TabsTrigger value="advertise" className="text-xs flex-1 sm:flex-none">
              <Sparkles className="h-3.5 w-3.5" />
              Sponsored Ads
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'submit' ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2 Columns: Submit Form */}
          <Card className="lg:col-span-2 p-5 sm:p-8">
            <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-1">
              Submit a Verified Promo Code or Startup Offer
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              All fields update the Live Deal Card Preview in real time. Submitting publishes your deal directly to the directory.
            </p>

            {submittedSuccess && (
              <Alert variant="emerald" className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Your deal for <strong>{brandName}</strong> has been published to the directory!
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={() => onNavigate('/')} className="h-8 text-xs shrink-0">
                  View on Home →
                </Button>
              </Alert>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Brand Name</Label>
                  <Input
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Raycast"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Official Website URL</Label>
                  <Input
                    required
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>SEO Deal Title</Label>
                <Input
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="Raycast Pro Promo Code: 30% Off Annual Plan"
                  className="h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Promo Code</Label>
                  <Input
                    required
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="RAYCAST30"
                    className="font-mono h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Discount Value Badge</Label>
                  <Input
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="30% OFF + $50 Credit"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Expiration Date</Label>
                  <Input
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="Dec 31, 2026"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Software Category</Label>
                  <Select
                    value={categorySlug}
                    onValueChange={setCategorySlug}
                    options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Deal Type</Label>
                  <Select
                    value={dealType}
                    onValueChange={(v) => setDealType(v as Deal['dealType'])}
                    options={[
                      { value: 'Promo Codes', label: 'Promo Codes' },
                      { value: 'Discounts', label: 'Discounts' },
                      { value: 'Free Credits', label: 'Free Credits' },
                      { value: 'Student Deals', label: 'Student Deals' },
                      { value: 'Free Trials', label: 'Free Trials' },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Short Description (2 Lines)</Label>
                <Input
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Step-by-Step Redemption Instructions (One step per line)</Label>
                <Textarea
                  required
                  value={redemptionStepsText}
                  onChange={(e) => setRedemptionStepsText(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full sm:w-auto font-medium">
                  Publish Verified Deal to Directory
                </Button>
              </div>
            </form>
          </Card>

          {/* Right Column: Live Real-Time Deal Card Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Real-Time Card Preview
              </span>
              <Badge variant="emerald" className="text-[11px]">Interactive</Badge>
            </div>

            <DealCard
              deal={livePreviewDeal}
              onNavigate={onNavigate}
              onRevealDeal={onRevealDeal}
            />

            <Card className="p-4 bg-muted/30 text-xs text-muted-foreground space-y-2">
              <p className="font-display font-semibold text-foreground">Verification Standard</p>
              <p className="leading-relaxed">
                Submitted deals are validated across live checkout flows to maintain high accuracy and reliable click-through rates.
              </p>
            </Card>
          </div>
        </div>
      ) : (
        /* Tab 2: Sponsored Packages */
        <div className="space-y-8 sm:space-y-10">
          {/* Audience Metrics Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4 sm:p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Active Builders</p>
                <p className="font-display font-mono text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                  284,000+
                </p>
              </div>
            </Card>
            <Card className="p-4 sm:p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Redemptions</p>
                <p className="font-display font-mono text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                  68,500+
                </p>
              </div>
            </Card>
            <Card className="p-4 sm:p-5 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Sponsored CTR</p>
                <p className="font-display font-mono text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                  9.4%
                </p>
              </div>
            </Card>
          </div>

          {selectedAdPackage && (
            <Alert variant="indigo" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-medium">
                Selected Package: <strong>{selectedAdPackage}</strong> — Slot reserved. Reach out via Contact desk to finalize live dates.
              </span>
              <Button size="sm" onClick={() => onNavigate('/contact')} className="h-8 text-xs shrink-0">
                Finalize Ad Booking →
              </Button>
            </Alert>
          )}

          {/* 3-Tier Pricing Card Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-5 sm:p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary">For Emerging Tools</Badge>
                  <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-foreground">
                    Community Listing
                  </h3>
                  <p className="font-display font-mono text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                    Free
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Standard verification & permanent profile
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground">
                  {[
                    'Dedicated /brands/[slug] SEO profile',
                    'Active promo codes & student deals',
                    'Included in global Command+K search',
                    'Standard 5-day verification queue',
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full text-xs h-10"
                onClick={() => setActiveTab('submit')}
              >
                Submit Free Listing
              </Button>
            </Card>

            <Card className="p-5 sm:p-6 border-indigo-600 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="indigo">Most Popular</Badge>
                  <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-foreground">
                    Homepage Featured Card
                  </h3>
                  <p className="font-display font-mono text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                    $149<span className="text-sm font-normal text-muted-foreground"> / mo</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pinned in top row of Home & Category grids
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground">
                  {[
                    'Everything in Community Listing',
                    'Pinned Top-3 position in your category',
                    '"Trending" Flame badge on deal cards',
                    '1-hour priority verification & updates',
                    'Included in Tuesday Digest (42k+ subs)',
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className="w-full text-xs h-10 font-medium"
                onClick={() => setSelectedAdPackage('Homepage Featured Card ($149/mo)')}
              >
                Book Featured Placement
              </Button>
            </Card>

            <Card className="p-5 sm:p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="amber">Maximum Visibility</Badge>
                  <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-foreground">
                    Hero Spotlight Banner
                  </h3>
                  <p className="font-display font-mono text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                    $299<span className="text-sm font-normal text-muted-foreground"> / mo</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Exclusive full-width banner above the main grid
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground">
                  {[
                    'Exclusive Sponsored Spotlight Card on /',
                    'Dedicated comparison guide in /blog',
                    'Featured placement in Perks table',
                    'Real-time click telemetry report',
                    'Dedicated Slack channel with Couponify team',
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full text-xs h-10"
                onClick={() => setSelectedAdPackage('Hero Spotlight Banner ($299/mo)')}
              >
                Reserve Hero Spotlight
              </Button>
            </Card>
          </div>

          {/* Advertiser FAQ */}
          <div className="space-y-3 max-w-3xl">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Advertiser & Partner Questions
            </h2>
            <Accordion
              items={[
                {
                  id: 'ad-1',
                  question: 'Do we need an exclusive promo code to advertise on Couponify?',
                  answer: 'While exclusive codes convert up to 3.4x higher, you can also promote standard trial extensions, API credit grants, or annual billing discounts.',
                },
                {
                  id: 'ad-2',
                  question: 'How are outbound clicks and conversions tracked?',
                  answer: 'We support custom UTM parameters, Impact, PartnerStack, FirstPromoter, and Rewardful links with zero redirect stripping.',
                },
                {
                  id: 'ad-3',
                  question: 'Can we swap our featured deal mid-month?',
                  answer: 'Yes. Sponsored partners can update promo codes, change landing URLs, or rotate seasonal offers anytime.',
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
