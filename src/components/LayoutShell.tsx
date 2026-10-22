import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  LayoutGrid,
  Sun,
  Moon,
  Sparkles,
  Search,
  Check,
  Copy,
  ExternalLink,
  Mail,
  Info,
  Tag,
  Building2,
  Grid,
  FileText,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Twitter,
} from 'lucide-react';
import {
  Button,
  Badge,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Sheet,
  Avatar,
  Separator,
  cn,
} from './ui/shadcn';
import { BrandLogo } from './BrandLogo';
import { Deal, Brand, Category, BlogArticle } from '../data/mockData';

interface LayoutShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  deals: Deal[];
  brands: Brand[];
  categories: Category[];
  articles: BlogArticle[];
  activeModalDeal: Deal | null;
  onCloseModalDeal: () => void;
  onOpenCommandPalette: () => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({
  currentPath,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  deals,
  brands,
  categories,
  articles,
  activeModalDeal,
  onCloseModalDeal,
  onOpenCommandPalette,
  commandOpen,
  setCommandOpen,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandOpen, setCommandOpen]);

  useEffect(() => {
    setCopiedCode(false);
  }, [activeModalDeal]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const navLinks = [
    { label: 'Explore Deals', path: '/' },
    { label: 'Popular Brands', path: '/brands' },
    { label: 'Categories', path: '/categories' },
    { label: 'Student & Startup Perks', path: '/perks' },
    { label: 'Savings Guides', path: '/blog' },
    { label: 'Submit a Deal / Advertise', path: '/submit' },
  ];

  const q = commandQuery.trim().toLowerCase();
  const filteredDeals = deals
    .filter((d) => !q || d.title.toLowerCase().includes(q) || d.brandName.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
    .slice(0, 5);
  const filteredBrands = brands
    .filter((b) => !q || b.name.toLowerCase().includes(q) || b.categoryName.toLowerCase().includes(q))
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-blue-500/20 selection:text-blue-600">
      {/* Exact Resourify Header: Menu Icon + Logo + Bell + 9-dot Grid + Theme Toggle (Screenshot 1) */}
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 sm:h-16 max-w-4xl lg:max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left: Hamburger Menu + Resourify-style Brand Mark */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 stroke-[2.2]" />
            </button>

            {/* Resourify-style Brand Logo: Dynamic arrows + 'Couponify deal' */}
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
              aria-label="Couponify deal home"
            >
              <svg
                viewBox="0 0 32 32"
                className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 22L16 8L20 14L13 24L6 22Z"
                  fill="currentColor"
                  fillOpacity="0.8"
                />
                <path
                  d="M13 24L23 10L27 16L20 26L13 24Z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Couponify <span className="font-bold text-foreground/90">deal</span>
              </span>
            </button>
          </div>

          {/* Right: Notification Bell + 9-dot Grid + Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Recent deals"
              title="Recent Deal Alerts"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            {/* 9-dot Category Grid (Screenshot 1) */}
            <button
              type="button"
              onClick={() => setCategoriesDrawerOpen(true)}
              className="p-2 rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Browse Categories"
              title="Browse Categories"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hamburger Navigation Drawer (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <div className="flex items-center gap-2 pb-5 border-b border-border">
          <svg
            viewBox="0 0 32 32"
            className="h-6 w-6 text-blue-600 shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 22L16 8L20 14L13 24L6 22Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M13 24L23 10L27 16L20 26L13 24Z" fill="currentColor" />
          </svg>
          <span className="font-display text-lg font-black tracking-tight">
            Couponify <span className="font-bold">deal</span>
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {navLinks.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                onNavigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={cn(
                'flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors text-left cursor-pointer',
                currentPath === item.path
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'text-foreground hover:bg-muted/70'
              )}
            >
              <span>{item.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}

          <Separator className="my-4" />

          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            About & Trust
          </p>

          {[
            { label: 'Mission & About', path: '/about' },
            { label: 'Contact & Support', path: '/contact' },
            { label: 'Affiliate Disclosure', path: '/terms' },
            { label: 'Privacy Policy', path: '/privacy' },
          ].map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                onNavigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </Sheet>

      {/* 9-Dot Quick Category Sheet Drawer */}
      <Sheet open={categoriesDrawerOpen} onOpenChange={setCategoriesDrawerOpen}>
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <span className="font-display text-base font-bold text-foreground">
            Browse Categories
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                onNavigate(`/categories/${cat.slug}`);
                setCategoriesDrawerOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-blue-500/40 hover:bg-muted/50 transition-colors text-left cursor-pointer"
            >
              <div>
                <p className="font-display text-sm font-bold text-foreground">{cat.name}</p>
                <p className="text-[11px] text-muted-foreground">{cat.activeDealsCount} active deals</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Sheet>

      {/* Notifications Modal */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>Recent Deal Alerts</DialogTitle>
            <DialogDescription>
              Hand-tested promo codes verified today by the Couponify team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {deals.slice(0, 4).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  onNavigate(`/deals/${d.slug}`);
                }}
                className="flex w-full items-start gap-3 p-3 rounded-xl border border-border/70 hover:bg-muted/50 transition-colors text-left cursor-pointer"
              >
                <BrandLogo
                  brandSlug={d.brandSlug}
                  brandName={d.brandName}
                  initials={d.brandInitials}
                  colorClass={d.brandColor}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs font-bold text-foreground">{d.brandName}</p>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{d.valueBadge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{d.title}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{d.verifiedAgo}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Dialog>

      {/* Main Standalone Page View */}
      <main className="flex-1 w-full">{children}</main>

      {/* Exact Resourify Footer (Screenshot 4) */}
      <footer className="border-t border-border/60 bg-background pt-14 pb-16 mt-20">
        <div className="mx-auto max-w-3xl px-5 text-left space-y-8">
          {/* Tagline from Screenshot 4 */}
          <p className="text-sm text-foreground/90 leading-relaxed font-normal">
            The ultimate collection of free digital services, developer tools, and exclusive deals.
          </p>

          {/* Horizontal Resourify Navigation Links (Screenshot 4) */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-foreground">
              <button type="button" onClick={() => onNavigate('/blog')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Blog
              </button>
              <button type="button" onClick={() => onNavigate('/about')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Mission
              </button>
              <button type="button" onClick={() => onNavigate('/submit')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Business
              </button>
              <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Contact
              </button>
              <button type="button" onClick={() => onNavigate('/terms')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Terms
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-foreground">
              <button type="button" onClick={() => onNavigate('/privacy')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Privacy
              </button>
              <button type="button" onClick={() => onNavigate('/about')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Editorial Policy
              </button>
              <button type="button" onClick={() => onNavigate('/terms')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Affiliate Disclaimer
              </button>
            </div>
          </div>

          {/* Social Icons from Screenshot 4 */}
          <div className="flex items-center gap-5 pt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-foreground/80 hover:text-blue-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="mailto:support@couponify.io"
              className="p-1 rounded text-foreground/80 hover:text-blue-600 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Legal disclaimer text from Screenshot 4 */}
          <div className="space-y-3 pt-3 text-xs leading-relaxed text-muted-foreground/80">
            <p>
              All product names, logos, and trademarks are the property of their respective owners. Their use on Couponify is for identification and informational purposes only and does not imply affiliation, sponsorship, or endorsement unless explicitly stated.
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/60 pt-1">
              © 2026 Couponify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Global Interactive "Reveal Code / Claim Deal" Modal */}
      <Dialog open={!!activeModalDeal} onOpenChange={(open) => !open && onCloseModalDeal()}>
        {activeModalDeal && (
          <div className="space-y-5 max-h-[85vh] overflow-y-auto pr-1">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <BrandLogo
                  brandSlug={activeModalDeal.brandSlug}
                  brandName={activeModalDeal.brandName}
                  initials={activeModalDeal.brandInitials}
                  colorClass={activeModalDeal.brandColor}
                  size="md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-foreground">
                      {activeModalDeal.brandName}
                    </span>
                    <Badge variant="emerald" className="text-[11px]">
                      <ShieldCheck className="h-3 w-3" />
                      {activeModalDeal.verifiedAgo}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeModalDeal.categoryName} · {activeModalDeal.valueBadge}
                  </p>
                </div>
              </div>
              <DialogTitle className="font-display text-base leading-snug pt-1">
                {activeModalDeal.title}
              </DialogTitle>
              <DialogDescription className="text-xs pt-1 leading-relaxed">
                {activeModalDeal.shortDescription}
              </DialogDescription>
            </DialogHeader>

            {/* High-Contrast Promo Code Reveal Box */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30 p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Verified Promo Code</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                  {activeModalDeal.successRate}% Success ({activeModalDeal.clicks.toLocaleString()} uses)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                <code className="font-mono text-center sm:text-left text-base sm:text-lg font-bold tracking-widest text-blue-600 dark:text-blue-400 select-all py-1 sm:py-0">
                  {activeModalDeal.code}
                </code>
                <Button
                  size="sm"
                  variant={copiedCode ? 'emerald' : 'default'}
                  onClick={() => handleCopyCode(activeModalDeal.code)}
                  className="h-9 font-medium"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Redemption Steps */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Quick Redemption Steps:
              </p>
              <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
                {activeModalDeal.redemptionSteps.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  const slug = activeModalDeal.slug;
                  onCloseModalDeal();
                  onNavigate(`/deals/${slug}`);
                }}
                className="text-center sm:text-left text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer py-1"
              >
                View Full Deal Details & Terms →
              </button>

              <a
                href={activeModalDeal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Continue to {activeModalDeal.brandName}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </Dialog>

      {/* Global CommandDialog (Cmd+K) */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3 pr-6">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              autoFocus
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              placeholder="Search deals, promo codes, brands..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
            {filteredDeals.length > 0 && (
              <div>
                <p className="mb-1.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Verified Deals
                </p>
                <div className="space-y-1">
                  {filteredDeals.map((deal) => (
                    <button
                      key={deal.id}
                      type="button"
                      onClick={() => {
                        setCommandOpen(false);
                        onNavigate(`/deals/${deal.slug}`);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left text-xs hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Tag className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="font-medium text-foreground truncate">{deal.title}</span>
                      </span>
                      <Badge variant="blue" className="font-mono text-[10px]">
                        {deal.valueBadge}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
