import React, { useState, useMemo } from 'react';
import {
  Search,
  BadgeCheck,
  Tag,
  Globe,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building2,
  MapPin,
  Users,
  Mail,
  Filter,
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Avatar,
  Breadcrumb,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Accordion,
  Checkbox,
  Separator,
} from '../components/ui/shadcn';
import { BrandLogo } from '../components/BrandLogo';
import { Brand, Category, Deal } from '../data/mockData';
import { DealCard } from '../components/DealCard';
import { getCategoryIcon } from './HomeAndDealPages';

// ============================================================================
// PAGE 3: ALL BRANDS DIRECTORY PAGE (/brands)
// ============================================================================
interface BrandsDirectoryPageProps {
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

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      if (selectedCategory !== 'all' && b.categorySlug !== selectedCategory) return false;
      if (selectedLetter !== 'All' && !b.name.toUpperCase().startsWith(selectedLetter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.shortDescription.toLowerCase().includes(q) ||
          b.categoryName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [brands, searchQuery, selectedCategory, selectedLetter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Standalone Header */}
      <div className="space-y-2.5">
        <Badge variant="indigo">Verified SaaS Partners</Badge>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          All Brands Directory
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Browse official software vendors, AI research labs, and cloud hosting platforms offering verified Couponify promo codes and startup credit grants.
        </p>
      </div>

      {/* Search + Category Select + A-Z Filter Bar */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands by name (ElevenLabs, Supabase, Vercel)..."
              className="pl-9 text-xs sm:text-sm h-10"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
            className="w-full sm:w-56"
          />
        </div>

        {/* A-Z Alphabetical Filter Bar (Wrapping gracefully) */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`h-7 min-w-7 px-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </Card>

      {/* Responsive 4-Column Grid of Brand Cards */}
      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBrands.map((brand) => (
            <Card
              key={brand.slug}
              className="flex flex-col justify-between p-4 sm:p-5 hover:border-indigo-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <BrandLogo brandSlug={brand.slug} brandName={brand.name} initials={brand.initials} size="md" />
                  <Badge variant="emerald" className="text-[11px] py-0.5">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>

                <div>
                  <h2 className="font-display text-base font-bold text-foreground">{brand.name}</h2>
                  <p className="text-xs text-muted-foreground">{brand.categoryName}</p>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {brand.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Tag className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    {brand.activeDealsCount} Active Deals
                  </span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {brand.bestDiscount}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-9"
                  onClick={() => onNavigate(`/brands/${brand.slug}`)}
                >
                  View All Deals
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 sm:p-10 text-center space-y-3">
          <p className="font-display text-sm font-semibold text-foreground">
            No brands matched your filter criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLetter('All');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

// ============================================================================
// PAGE 4: STANDALONE BRAND DETAIL PAGE (/brands/[slug])
// ============================================================================
interface BrandDetailPageProps {
  brand: Brand;
  allBrands: Brand[];
  deals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({
  brand,
  allBrands,
  deals,
  onNavigate,
  onRevealDeal,
}) => {
  const brandDeals = deals.filter((d) => d.brandSlug === brand.slug);
  const competitors = allBrands.filter((b) => brand.competitorSlugs.includes(b.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Brands', path: '/brands' },
          { label: brand.name },
        ]}
      />

      {/* Brand Hero Card */}
      <Card className="p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <BrandLogo brandSlug={brand.slug} brandName={brand.name} initials={brand.initials} size="lg" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  {brand.name} Promo Codes & Deals
                </h1>
                <Badge variant="secondary" className="text-xs">{brand.categoryName}</Badge>
                <Badge variant="emerald" className="text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified · {brand.rating}
                </Badge>
              </div>
              <p className="max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {brand.longDescription}
              </p>
            </div>
          </div>

          <div className="shrink-0 pt-2 lg:pt-0">
            <a
              href={brand.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Visit Official Website
            </a>
          </div>
        </div>

        {/* Key Stats Bar (Responsive Grid) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-5">
          <div className="p-2 sm:p-0">
            <p className="text-xs text-muted-foreground">Active Offers</p>
            <p className="font-display font-mono text-base sm:text-lg font-bold text-foreground tabular-nums mt-0.5">
              {brand.activeDealsCount} Verified Codes
            </p>
          </div>
          <div className="p-2 sm:p-0 border-t sm:border-t-0 sm:border-l border-border/60 sm:pl-4">
            <p className="text-xs text-muted-foreground">Total Clicks</p>
            <p className="font-display font-mono text-base sm:text-lg font-bold text-foreground tabular-nums mt-0.5">
              {brand.totalClicks.toLocaleString()} Redemptions
            </p>
          </div>
          <div className="p-2 sm:p-0 border-t sm:border-t-0 sm:border-l border-border/60 sm:pl-4">
            <p className="text-xs text-muted-foreground">Best Discount</p>
            <p className="font-display font-mono text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {brand.bestDiscount}
            </p>
          </div>
        </div>
      </Card>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Active Deals List */}
          <div className="space-y-4">
            <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
              Active {brand.name} Promo Codes & Discounts ({brandDeals.length})
            </h2>
            <div className="space-y-3.5">
              {brandDeals.map((deal) => (
                <Card key={deal.id} className="p-4 sm:p-5 hover:border-indigo-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="indigo" className="font-mono text-xs">
                          {deal.valueBadge}
                        </Badge>
                        <Badge variant="emerald" className="text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          {deal.verifiedAgo}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          · {deal.dealType}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/deals/${deal.slug}`)}
                        className="font-display text-left text-sm sm:text-base font-bold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer block leading-snug"
                      >
                        {deal.title}
                      </button>
                      <p className="text-xs text-muted-foreground line-clamp-2">{deal.shortDescription}</p>
                    </div>

                    <div className="flex sm:flex-col items-stretch sm:items-end gap-2 shrink-0">
                      <Button size="sm" onClick={() => onRevealDeal(deal)} className="h-9 text-xs">
                        <KeyRound className="h-3.5 w-3.5" />
                        Reveal Code
                      </Button>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/deals/${deal.slug}`)}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer text-center"
                      >
                        Terms & Steps →
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Brand Pricing & Plans Overview Table (Responsive Horizontal Scroll) */}
          <div className="space-y-3">
            <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
              {brand.name} Pricing & Plans (With Couponify Savings)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Tier</TableHead>
                    <TableHead>Best For</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>With Code</TableHead>
                    <TableHead>Total Savings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brand.pricingTiers.map((tier, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-foreground whitespace-nowrap">{tier.planName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{tier.targetAudience}</TableCell>
                      <TableCell className="font-mono tabular-nums text-muted-foreground whitespace-nowrap">{tier.standardPrice}</TableCell>
                      <TableCell className="font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {tier.couponifyPrice}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="emerald" className="font-mono text-xs">
                          {tier.annualSavings}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Expired Deals Archive */}
          {brand.expiredDeals.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display text-sm font-semibold text-muted-foreground">
                Expired {brand.name} Deals Archive
              </h2>
              <div className="space-y-2">
                {brand.expiredDeals.map((exp, idx) => (
                  <Card key={idx} className="p-3.5 bg-muted/20 opacity-75">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Badge variant="secondary" className="text-[10px]">
                          <Clock className="h-3 w-3" />
                          Expired {exp.expiredDate}
                        </Badge>
                        <span className="text-muted-foreground line-through">
                          {exp.title}
                        </span>
                      </div>
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {exp.code}
                      </code>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Brand FAQ Accordion */}
          <div className="space-y-3">
            <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
              Frequently Asked Questions About {brand.name} Codes
            </h2>
            <Accordion items={brand.faqs} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Brand Overview Card */}
          <Card className="p-4 sm:p-5 space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">Brand Overview</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  Founded Year
                </span>
                <span className="font-mono font-semibold text-foreground">{brand.foundedYear}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Headquarters
                </span>
                <span className="font-medium text-foreground">{brand.headquarters}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/60">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  Target Audience
                </span>
                <span className="font-medium text-foreground text-right max-w-[170px] truncate" title={brand.targetAudience}>
                  {brand.targetAudience}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Partner Contact
                </span>
                <span className="font-mono text-foreground">{brand.supportEmail}</span>
              </div>
            </div>
          </Card>

          {/* Competitor Deals Card */}
          <Card className="p-4 sm:p-5 space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">
              Alternative & Competitor Deals
            </h3>
            <div className="space-y-2.5">
              {competitors.map((comp) => (
                <button
                  key={comp.slug}
                  type="button"
                  onClick={() => onNavigate(`/brands/${comp.slug}`)}
                  className="flex w-full items-center justify-between rounded-md border border-border p-2.5 sm:p-3 text-left hover:border-indigo-500/40 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <BrandLogo brandSlug={comp.slug} brandName={comp.name} initials={comp.initials} size="sm" />
                    <div>
                      <p className="font-display text-xs font-bold text-foreground">{comp.name}</p>
                      <p className="text-[11px] text-muted-foreground">{comp.categoryName}</p>
                    </div>
                  </div>
                  <Badge variant="emerald" className="font-mono text-[10px]">
                    {comp.bestDiscount}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 5: CATEGORIES DIRECTORY PAGE (/categories)
// ============================================================================
interface CategoriesDirectoryPageProps {
  categories: Category[];
  brands: Brand[];
  onNavigate: (path: string) => void;
}

export const CategoriesDirectoryPage: React.FC<CategoriesDirectoryPageProps> = ({
  categories,
  brands,
  onNavigate,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="space-y-2.5">
        <Badge variant="indigo">8 Software Verticals</Badge>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Browse Deals by Software Category
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Explore verified discounts, API credit grants, and annual billing rebates organized across every core modern engineering and business vertical.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const topBrands = brands.filter((b) => cat.topBrandSlugs.includes(b.slug)).slice(0, 3);
          return (
            <Card
              key={cat.slug}
              className="flex flex-col justify-between p-5 sm:p-6 hover:border-indigo-500/40 transition-colors"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {getCategoryIcon(cat.iconName, 'h-5 w-5')}
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {cat.activeDealsCount} Deals
                  </Badge>
                </div>

                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-foreground">{cat.name}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Top Partners:</span>
                  <div className="flex items-center -space-x-1.5">
                    {topBrands.map((b) => (
                      <BrandLogo
                        key={b.slug}
                        brandSlug={b.slug}
                        brandName={b.name}
                        initials={b.initials}
                        size="xs"
                        className="ring-2 ring-background"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-9"
                  onClick={() => onNavigate(`/categories/${cat.slug}`)}
                >
                  Explore Category
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 6: STANDALONE CATEGORY DETAIL PAGE (/categories/[slug])
// ============================================================================
interface CategoryDetailPageProps {
  category: Category;
  deals: Deal[];
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  category,
  deals,
  onNavigate,
  onRevealDeal,
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minDiscount50, setMinDiscount50] = useState(false);
  const [onlyFreeTrial, setOnlyFreeTrial] = useState(false);

  const categoryDeals = useMemo(() => {
    const base = deals.filter((d) => d.categorySlug === category.slug);
    return base.length >= 3 ? base : [...base, ...deals.filter((d) => d.categorySlug !== category.slug)].slice(0, 6);
  }, [deals, category.slug]);

  const featuredDeal = categoryDeals[0];

  const filteredDeals = useMemo(() => {
    return categoryDeals.filter((d) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.dealType)) return false;
      if (minDiscount50 && d.discountPercent < 50) return false;
      if (onlyFreeTrial && !d.hasFreeTrial) return false;
      return true;
    });
  }, [categoryDeals, selectedTypes, minDiscount50, onlyFreeTrial]);

  const toggleDealType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]}
      />

      {/* Category Header + Top Featured Deal */}
      <Card className="p-5 sm:p-8 bg-muted/20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                {getCategoryIcon(category.iconName, 'h-5 w-5')}
              </div>
              <Badge variant="emerald" className="font-mono text-xs">
                {category.activeDealsCount} Verified Deals
              </Badge>
            </div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {category.name} Promo Codes & Startup Credits
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {category.curatedEditorial}
            </p>
          </div>

          {featuredDeal && (
            <div className="rounded-xl border border-indigo-500/30 bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="indigo" className="text-[11px]">Top Category Pick</Badge>
                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {featuredDeal.valueBadge}
                </span>
              </div>
              <p className="font-display text-xs sm:text-sm font-bold text-foreground line-clamp-2">
                {featuredDeal.title}
              </p>
              <Button
                size="sm"
                className="w-full text-xs h-9"
                onClick={() => onRevealDeal(featuredDeal)}
              >
                Reveal Featured Code
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Sidebar + 3-Column Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        {/* Left Sidebar Filters */}
        <Card className="p-4 sm:p-5 h-fit space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground">
              <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Filter Deals
            </span>
            {(selectedTypes.length > 0 || minDiscount50 || onlyFreeTrial) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTypes([]);
                  setMinDiscount50(false);
                  setOnlyFreeTrial(false);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Deal Type</p>
            <div className="flex flex-col gap-2">
              {['Promo Codes', 'Discounts', 'Free Credits', 'Student Deals', 'Free Trials'].map(
                (type) => (
                  <Checkbox
                    key={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleDealType(type)}
                    label={type}
                  />
                )
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Discount Value</p>
            <Checkbox
              checked={minDiscount50}
              onCheckedChange={setMinDiscount50}
              label="50% Off or High-Value Credits"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Trial Availability</p>
            <Checkbox
              checked={onlyFreeTrial}
              onCheckedChange={setOnlyFreeTrial}
              label="Includes Free Trial Tier"
            />
          </div>
        </Card>

        {/* Main 3-Column Grid */}
        <div className="lg:col-span-3">
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onNavigate={onNavigate}
                  onRevealDeal={onRevealDeal}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center space-y-3">
              <p className="font-display text-sm font-semibold text-foreground">
                No deals match those exact filter checkboxes.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTypes([]);
                  setMinDiscount50(false);
                  setOnlyFreeTrial(false);
                }}
              >
                Clear Category Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
