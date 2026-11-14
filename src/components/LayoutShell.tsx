import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Menu,
  Bell,
  LayoutGrid,
  Sun,
  Moon,
  Search,
  Check,
  Copy,
  ExternalLink,
  Mail,
  ShieldCheck,
  Send,
  Crown,
  Compass,
  GraduationCap,
  BookOpen,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Sheet,
  cn,
} from './ui/shadcn';
import { BrandLogo } from './BrandLogo';
import { CategoryBadge } from './CategoryBadge';
import { CookieConsent, openCookiePreferences } from './CookieConsent';
import { Deal, Brand, Category, BlogArticle, TopBannerConfig, hasCouponCode } from '../data/mockData';

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
  onOpenCommandPalette?: () => void;
  commandOpen?: boolean;
  setCommandOpen?: (open: boolean) => void;
  topBanner?: TopBannerConfig;
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
  topBanner,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onNavigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  useEffect(() => {
    setCopiedCode(false);
  }, [activeModalDeal]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const drawerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.05,
      },
    },
  };

  const drawerItemVariants: Variants = {
    hidden: { opacity: 0, x: -14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 24,
      },
    },
  };

  const navLinks = [
    { label: 'Explore Deals', path: '/', icon: Compass, badge: 'Popular' },
    { label: 'Search Deals', path: '/search', icon: Search },
    { label: 'Recent Deal Alerts', path: '/alerts', icon: Bell, badge: 'Live' },
    { label: 'Popular Brands', path: '/brands', icon: Crown },
    { label: 'Categories', path: '/categories', icon: LayoutGrid },
    { label: 'Student & Startup Packs', path: '/packs', icon: GraduationCap, badge: 'Up to 100% OFF' },
    { label: 'Savings Guides', path: '/blog', icon: BookOpen },
    { label: 'Submit a Deal / Advertise', path: '/submit', icon: PlusCircle },
    { label: 'Admin Panel', path: '/admin', icon: SlidersHorizontal, badge: 'Manager' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-600">
      {/* Top Banner Layer with External Link Icon */}
      {topBanner && topBanner.isActive && (
        <aside
          aria-label="Announcement banner"
          className={cn(
            'w-full text-xs py-2 px-3 sm:px-6 relative z-50 transition-colors',
            topBanner.themeStyle === 'emerald'
              ? 'bg-emerald-600 text-white border-b border-emerald-500/40'
              : topBanner.themeStyle === 'amber'
              ? 'bg-amber-600 text-white border-b border-amber-500/40'
              : topBanner.themeStyle === 'gradient'
              ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white border-b border-indigo-500/30'
              : 'bg-slate-900 text-white dark:bg-slate-950 border-b border-slate-800'
          )}
        >
          <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center min-w-0">
            {topBanner.badgeText && (
              <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white shrink-0">
                {topBanner.badgeText}
              </span>
            )}
            <span className="font-medium text-white/90 text-xs truncate max-w-[200px] xs:max-w-xs sm:max-w-none">
              {topBanner.message}
            </span>
            {topBanner.linkUrl && (
              <a
                href={topBanner.linkUrl}
                target={topBanner.isExternal ? '_blank' : '_self'}
                rel={topBanner.isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (topBanner.linkUrl.startsWith('#')) {
                    e.preventDefault();
                    if (currentPath !== '/') {
                      onNavigate('/');
                      setTimeout(() => {
                        document.getElementById(topBanner.linkUrl.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    } else {
                      document.getElementById(topBanner.linkUrl.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                  }
                  if (!topBanner.isExternal && topBanner.linkUrl.startsWith('/')) {
                    e.preventDefault();
                    onNavigate(topBanner.linkUrl);
                  }
                }}
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-blue-200 text-white shrink-0 cursor-pointer text-xs"
              >
                <span>{topBanner.ctaText || 'Claim Deal'}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            )}
          </div>
        </aside>
      )}

      {/* Top Navbar with Glassmorphism & Tactile Polish */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 sm:px-6 flex items-center justify-between transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Hamburger Drawer + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer group active:scale-[0.98] transition-transform"
              aria-label="Couponify home"
            >
              <svg
                viewBox="0 0 32 32"
                className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 shrink-0 group-hover:scale-105 transition-transform"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 22L16 8L20 14L13 24L6 22Z" fill="currentColor" fillOpacity="0.8" />
                <path d="M13 24L23 10L27 16L20 26L13 24Z" fill="currentColor" />
              </svg>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-slate-50">
                Couponify
              </span>
            </button>
          </div>

          {/* Center Search Bar Shortcut (Desktop only) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <button
              type="button"
              onClick={() => onNavigate('/search')}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5 truncate">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">Search 500+ verified coupons, brands...</span>
              </span>
              <kbd className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[10px] text-slate-500 shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions (Notification, Categories Grid, Admin, Theme Toggle) with balanced touch spacing */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/alerts')}
              className={cn(
                'relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 cursor-pointer transition-all',
                currentPath === '/alerts' && 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400'
              )}
              aria-label="Recent deals"
              title="Recent Deal Alerts"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <button
              type="button"
              onClick={() => setCategoriesDrawerOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 cursor-pointer transition-all"
              aria-label="Browse Categories"
              title="Browse Categories"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 cursor-pointer transition-all"
              aria-label="Admin Management Panel"
              title="Admin Management Panel"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 cursor-pointer transition-all"
              aria-label={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hamburger Navigation Drawer (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <div className="flex items-center gap-2 pb-5 border-b border-slate-200 dark:border-slate-800 pr-10">
          <svg
            viewBox="0 0 32 32"
            className="h-6 w-6 text-blue-600 shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 22L16 8L20 14L13 24L6 22Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M13 24L23 10L27 16L20 26L13 24Z" fill="currentColor" />
          </svg>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Couponify
          </span>
        </div>

        <motion.div
          variants={drawerContainerVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 flex flex-col gap-1.5"
        >
          {navLinks.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            return (
              <motion.button
                key={item.path}
                variants={drawerItemVariants}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  onNavigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors text-left cursor-pointer group',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      'p-1.5 rounded-lg transition-colors shrink-0',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-blue-600'
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                  <ArrowRight
                    className={cn(
                      'h-4 w-4 transition-transform group-hover:translate-x-0.5',
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    )}
                  />
                </div>
              </motion.button>
            );
          })}

          {/* Mobile Drawer Dedicated Dark Mode Switcher */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2 px-1">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-600" />}
                <span>Theme: {darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                Switch to {darkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </motion.div>
      </Sheet>

      {/* 9-Dot Quick Category Sheet Drawer */}
      <Sheet open={categoriesDrawerOpen} onOpenChange={setCategoriesDrawerOpen}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 pr-10">
          <span className="text-base font-bold text-slate-900 dark:text-slate-50">
            Browse Categories
          </span>
        </div>
        <motion.div
          variants={drawerContainerVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 grid grid-cols-1 gap-2.5"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.slug}
              variants={drawerItemVariants}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                onNavigate(`/categories/${cat.slug}`);
                setCategoriesDrawerOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors text-left cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">
                  {cat.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cat.activeDealsCount} active verified deals</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      </Sheet>

      {/* Main Standalone Page View */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Standardized Professional SaaS Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-14 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-12 pb-12">
            {/* Brand & Value Proposition Column (2 Cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Couponify Logo */}
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="flex items-center gap-2.5 cursor-pointer group text-left"
                aria-label="Couponify home"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <svg
                    viewBox="0 0 32 32"
                    className="h-5 w-5 text-white shrink-0"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 22L16 8L20 14L13 24L6 22Z" fill="currentColor" fillOpacity="0.85" />
                    <path d="M13 24L23 10L27 16L20 26L13 24Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Couponify
                  </span>
                </div>
              </button>

              {/* Tagline */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-sm">
                The ultimate collection of free digital services, developer tools, and exclusive deals.
              </p>

              {/* Social & Community Channels with Telegram Lucide Icon */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://t.me/couponify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/80 dark:border-slate-800 bg-slate-50 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all cursor-pointer"
                  aria-label="Telegram"
                  title="Join our Telegram Channel"
                >
                  <Send className="h-4 w-4 -rotate-12 translate-x-0.5" />
                </a>
                <a
                  href="mailto:support@couponify.io"
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/80 dark:border-slate-800 bg-slate-50 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all cursor-pointer"
                  aria-label="Email Support"
                  title="Contact Support via Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('/alerts')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/80 dark:border-slate-800 bg-slate-50 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all cursor-pointer"
                  aria-label="Deal Alerts"
                  title="Recent Deal Alerts"
                >
                  <Bell className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Responsive Navigation Sections Grid (Categories, Discover, Company, Legal) */}
            <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-8">
              {/* Column 1: Categories */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Categories
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/categories/ai-tools')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      AI Tools & LLMs
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/categories/cloud-hosting')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Cloud & Hosting
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/categories/dev-tools')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Developer Tools
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/categories/productivity')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Productivity
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/categories/design')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Design & Creative
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/categories')}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-left inline-flex items-center gap-1"
                    >
                      <span>All 8 Categories</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: Discover */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Discover
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/brands')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Top Tech Brands
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/packs')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Startup Credits Program
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/packs')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Student Packs & Grants
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/alerts')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Recent Alerts Feed
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/search')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Search Deals Catalog
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Company */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Company
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/about')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      About & Mission
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/blog')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Guides & Blog
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/submit')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Submit a Promo Code
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/submit')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Partner Advertising
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/contact')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Contact Support
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/admin')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Admin Portal
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4: Legal & Trust */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Legal & Trust
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/terms')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/privacy')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/about')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Editorial Standards
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/terms')}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Affiliate Disclosure
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={openCookiePreferences}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                    >
                      Cookie Preferences
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p className="text-center sm:text-left">
              © 2026 Couponify Technologies, Inc. All rights reserved. Hand-tested coupons, discounts & cloud credits.
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
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                      {activeModalDeal.brandName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                      {activeModalDeal.verifiedAgo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge
                      categorySlug={activeModalDeal.categorySlug}
                      categoryName={activeModalDeal.categoryName}
                      size="xs"
                      onClick={() => {
                        onCloseModalDeal();
                        onNavigate(`/categories/${activeModalDeal.categorySlug}`);
                      }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      · {activeModalDeal.valueBadge}
                    </span>
                  </div>
                </div>
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug pt-1 text-left">
                {activeModalDeal.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 leading-relaxed text-left">
                {activeModalDeal.shortDescription}
              </DialogDescription>
            </DialogHeader>

            {/* High-Contrast Promo Code Reveal or Direct Offer Box */}
            {hasCouponCode(activeModalDeal) ? (
              <motion.div
                animate={copiedCode ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={cn(
                  'rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-colors duration-300',
                  copiedCode
                    ? 'border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/40'
                    : 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30'
                )}
              >
                <div className="mb-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-900 dark:text-slate-100">Verified Promo Code</span>
                  <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {activeModalDeal.successRate}% Success ({activeModalDeal.clicks.toLocaleString()} uses)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xs">
                  <code className="text-center sm:text-left text-base sm:text-lg font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 select-all py-1 sm:py-0">
                    {activeModalDeal.code}
                  </code>
                  <Button
                    size="sm"
                    variant={copiedCode ? 'emerald' : 'default'}
                    onClick={() => handleCopyCode(activeModalDeal.code)}
                    className="h-10 px-4 font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-[#1565FF] cursor-pointer"
                  >
                    <AnimatePresence mode="wait">
                      {copiedCode ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-1.5"
                        >
                          <Check className="h-4 w-4" />
                          Copied!
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
                          Copy Code
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 sm:p-5">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Direct Link • No Code Required
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg sm:rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-3 shadow-2xs">
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                      Offer Activated Automatically
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No promo code needed. Discount is attached directly to the partner link.
                    </p>
                  </div>
                  <a
                    href={activeModalDeal.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-4 font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Claim Offer</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Redemption Steps */}
            <div className="space-y-2 text-left">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quick Redemption Steps:
              </p>
              <ol className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 list-decimal list-inside">
                {(hasCouponCode(activeModalDeal)
                  ? activeModalDeal.redemptionSteps
                  : [
                      `Click "Continue to ${activeModalDeal.brandName}" to activate the direct promotion.`,
                      `The ${activeModalDeal.valueBadge} savings will be automatically attached to your session.`,
                      `Complete signup or checkout on ${activeModalDeal.brandName} to enjoy your verified savings!`,
                    ]
                ).map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const slug = activeModalDeal.slug;
                  onCloseModalDeal();
                  onNavigate(`/deals/${slug}`);
                }}
                className="text-center sm:text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer py-1"
              >
                View Full Deal Details & Terms →
              </button>

              <a
                href={activeModalDeal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus-visible:ring-2 focus-visible:ring-[#1565FF]"
              >
                Continue to {activeModalDeal.brandName}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </Dialog>

      {/* Global shadcn/ui Cookie Consent Popup & Persistent Settings Trigger */}
      <CookieConsent onNavigate={onNavigate} />
    </div>
  );
};
