import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
  INITIAL_DEALS,
  BRANDS,
  CATEGORIES,
  PERKS_DATA,
  BLOG_ARTICLES,
  BlogArticle,
  Deal,
  DEFAULT_TOP_BANNER,
  DEFAULT_FEATURED_ITEM,
  DEFAULT_FEATURED_ITEMS,
  DEFAULT_VIEWFLIPPER_WORDS,
  DEFAULT_SEO_CONFIGS,
  SeoConfigMap,
  TopBannerConfig,
  FeaturedItemConfig,
} from './data/mockData';
import { LayoutShell } from './components/LayoutShell';
import { HomePage, DealDetailPage } from './pages/HomeAndDealPages';
import {
  BrandsDirectoryPage,
  BrandDetailPage,
  CategoriesDirectoryPage,
  CategoryDetailPage,
} from './pages/BrandsAndCategoriesPages';
import {
  PerksPage,
  SubmitAndAdvertisePage,
} from './pages/PerksBlogSubmitPages';
import { BlogPage } from './pages/BlogPage';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsAndDisclosurePage,
} from './pages/CompanyAndLegalPages';
import { SavedDealsProvider } from './context/SavedDealsContext';
import { CustomPopupProvider } from './context/CustomPopupContext';
import { DealsLoadingProvider } from './context/DealsLoadingContext';
import { SavedDealsPage } from './pages/SavedDealsPage';
import { RecentAlertsPage } from './pages/RecentAlertsPage';
import { SearchPage } from './pages/SearchPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { AdminDealEditorPage } from './pages/AdminDealEditorPage';
import { AdminBlogEditorPage } from './pages/AdminBlogEditorPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });

  // Persistent dark mode via localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('couponify_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    } catch {
      return false;
    }
  });

  // Persistent deals state via localStorage
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem('couponify_deals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_DEALS;
  });

  // Persistent brands state via localStorage
  const [brands, setBrands] = useState(BRANDS);

  // Persistent top announcement banner state via localStorage
  const [topBanner, setTopBanner] = useState<TopBannerConfig>(() => {
    try {
      const saved = localStorage.getItem('couponify_top_banner');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_TOP_BANNER;
  });

  // Persistent featured spotlight deals state via localStorage (supports multi-item carousel)
  const [featuredItems, setFeaturedItems] = useState<FeaturedItemConfig[]>(() => {
    try {
      const saved = localStorage.getItem('couponify_featured_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      const legacy = localStorage.getItem('couponify_featured_item');
      if (legacy) {
        const item = JSON.parse(legacy);
        return [item, ...DEFAULT_FEATURED_ITEMS.slice(1)];
      }
    } catch {}
    return DEFAULT_FEATURED_ITEMS;
  });

  const featuredItem = featuredItems[0] || DEFAULT_FEATURED_ITEM;

  // Persistent articles state via localStorage
  const [articles, setArticles] = useState<BlogArticle[]>(() => {
    try {
      const saved = localStorage.getItem('couponify_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return BLOG_ARTICLES;
  });

  // Persistent search bar placeholder viewflipper words via localStorage
  const [searchWords, setSearchWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('couponify_search_words');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_VIEWFLIPPER_WORDS;
  });

  // Persistent SEO configurations via localStorage
  const [seoConfigs, setSeoConfigs] = useState<SeoConfigMap>(() => {
    try {
      const saved = localStorage.getItem('couponify_seo_configs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SEO_CONFIGS, ...parsed };
        }
      }
    } catch {}
    return DEFAULT_SEO_CONFIGS;
  });

  const [activeModalDeal, setActiveModalDeal] = useState<Deal | null>(null);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);

  // Sync dark mode class on <html> and persist in localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      try {
        localStorage.setItem('couponify_theme', 'dark');
      } catch {}
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('couponify_theme', 'light');
      } catch {}
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    // 1. Inject temporary <style> element disabling all transitions during toggle
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-theme-transition-lock', 'true');
    styleEl.textContent = '*, *::before, *::after { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }';
    document.head.appendChild(styleEl);

    const nextMode = !darkMode;

    // 2. Synchronous root <html> class and localStorage updates
    const root = document.documentElement;
    if (nextMode) {
      root.classList.add('dark');
      try {
        localStorage.setItem('couponify_theme', 'dark');
      } catch {}
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('couponify_theme', 'light');
      } catch {}
    }

    // 3. Synchronous React state update via flushSync so Tailwind dark: classes and React render simultaneously
    flushSync(() => {
      setDarkMode(nextMode);
    });

    // 4. Force browser reflow so all layout and colors calculate synchronously under transition: none
    if (document.body) {
      window.getComputedStyle(document.body).opacity;
    }

    // 5. Remove the temporary style tag after double requestAnimationFrame so normal hover/focus transitions work
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
      });
    });
  };

  // Persist deals to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('couponify_deals', JSON.stringify(deals));
    } catch {}
  }, [deals]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // Ignore history pushState restriction in sandboxed iframe if any
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Instant scroll-to-top on route change like a normal website
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPath]);

  // Synchronize document <title>, <meta description>, and OpenGraph / Twitter tags dynamically based on route and admin SEO config
  useEffect(() => {
    const [path] = currentPath.split('?');
    let configKey = 'home';
    if (path === '/' || path === '') configKey = 'home';
    else if (path === '/categories' || path.startsWith('/categories/')) configKey = 'categories';
    else if (path === '/brands' || path.startsWith('/brands/')) configKey = 'brands';
    else if (path === '/perks') configKey = 'perks';
    else if (path === '/blog' || path.startsWith('/blog/')) configKey = 'blog';
    else if (path === '/alerts') configKey = 'alerts';
    else if (path === '/search') configKey = 'search';

    const currentSeo = seoConfigs[configKey] || seoConfigs['home'] || DEFAULT_SEO_CONFIGS['home'];

    // Update document title
    if (currentSeo.title) {
      document.title = currentSeo.title;
    }

    // Helper to set or create meta tags
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (currentSeo.description) {
      setMetaTag('name', 'description', currentSeo.description);
    }
    if (currentSeo.ogTitle || currentSeo.title) {
      setMetaTag('property', 'og:title', currentSeo.ogTitle || currentSeo.title);
      setMetaTag('name', 'twitter:title', currentSeo.ogTitle || currentSeo.title);
    }
    if (currentSeo.ogDescription || currentSeo.description) {
      setMetaTag('property', 'og:description', currentSeo.ogDescription || currentSeo.description);
      setMetaTag('name', 'twitter:description', currentSeo.ogDescription || currentSeo.description);
    }
    if (currentSeo.ogType) {
      setMetaTag('property', 'og:type', currentSeo.ogType);
    }
    if (currentSeo.twitterCard) {
      setMetaTag('name', 'twitter:card', currentSeo.twitterCard);
    }
    if (currentSeo.keywords) {
      setMetaTag('name', 'keywords', currentSeo.keywords);
    }
  }, [currentPath, seoConfigs]);

  const handleIncrementClick = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, clicks: d.clicks + 1, views: d.views + 1 } : d
      )
    );
  };

  const handleRevealDeal = (deal: Deal) => {
    handleIncrementClick(deal.id);
    handleNavigate(`/deals/${deal.slug}`);
  };

  // Deal Management Handlers
  const handleAddDeal = (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
  };

  // Brand Management Handlers
  const handleAddBrand = (newBrand: (typeof BRANDS)[0]) => {
    setBrands((prev) => [newBrand, ...prev]);
  };

  const handleUpdateBrand = (updatedBrand: (typeof BRANDS)[0]) => {
    setBrands((prev) => prev.map((b) => (b.slug === updatedBrand.slug ? updatedBrand : b)));
  };

  const handleDeleteBrand = (brandSlug: string) => {
    setBrands((prev) => prev.filter((b) => b.slug !== brandSlug));
  };

  // Top Banner Management Handlers
  const handleUpdateTopBanner = (newBanner: TopBannerConfig) => {
    setTopBanner(newBanner);
    try {
      localStorage.setItem('couponify_top_banner', JSON.stringify(newBanner));
    } catch {}
  };

  // Featured Items Management Handlers
  const handleUpdateFeaturedItems = (newItems: FeaturedItemConfig[]) => {
    setFeaturedItems(newItems);
    try {
      localStorage.setItem('couponify_featured_items', JSON.stringify(newItems));
      if (newItems.length > 0) {
        localStorage.setItem('couponify_featured_item', JSON.stringify(newItems[0]));
      }
    } catch {}
  };

  const handleUpdateFeaturedItem = (newItem: FeaturedItemConfig) => {
    setFeaturedItems((prev) => {
      const idx = prev.findIndex((i) => i.id === newItem.id);
      let updated: FeaturedItemConfig[];
      if (idx >= 0) {
        updated = prev.map((item, i) => (i === idx ? newItem : item));
      } else {
        updated = [newItem, ...prev];
      }
      try {
        localStorage.setItem('couponify_featured_items', JSON.stringify(updated));
        localStorage.setItem('couponify_featured_item', JSON.stringify(newItem));
      } catch {}
      return updated;
    });
  };

  // Blog Articles Management Handlers
  const handleAddArticle = (newArticle: BlogArticle) => {
    setArticles((prev) => {
      const updated = [newArticle, ...prev];
      try {
        localStorage.setItem('couponify_articles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateArticle = (updatedArticle: BlogArticle) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.slug === updatedArticle.slug ? updatedArticle : a));
      try {
        localStorage.setItem('couponify_articles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteArticle = (articleSlug: string) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.slug !== articleSlug);
      try {
        localStorage.setItem('couponify_articles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Search Words Management Handlers
  const handleUpdateSearchWords = (newWords: string[]) => {
    setSearchWords(newWords);
    try {
      localStorage.setItem('couponify_search_words', JSON.stringify(newWords));
    } catch {}
  };

  // SEO Configurations Management Handlers
  const handleUpdateSeoConfigs = (newConfigs: SeoConfigMap) => {
    setSeoConfigs(newConfigs);
    try {
      localStorage.setItem('couponify_seo_configs', JSON.stringify(newConfigs));
    } catch {}
  };

  const handleResetAllData = () => {
    setDeals(INITIAL_DEALS);
    setBrands(BRANDS);
    setTopBanner(DEFAULT_TOP_BANNER);
    setFeaturedItems(DEFAULT_FEATURED_ITEMS);
    setArticles(BLOG_ARTICLES);
    setSearchWords(DEFAULT_VIEWFLIPPER_WORDS);
    setSeoConfigs(DEFAULT_SEO_CONFIGS);
    try {
      localStorage.removeItem('couponify_deals');
      localStorage.removeItem('couponify_brands');
      localStorage.removeItem('couponify_top_banner');
      localStorage.removeItem('couponify_featured_item');
      localStorage.removeItem('couponify_featured_items');
      localStorage.removeItem('couponify_articles');
      localStorage.removeItem('couponify_search_words');
      localStorage.removeItem('couponify_seo_configs');
    } catch {}
  };

  // Parse path & query
  const [cleanPath, queryString] = currentPath.split('?');

  const renderPage = () => {
    // Search Deals Page (/search)
    if (cleanPath === '/search') {
      const searchParam = new URLSearchParams(queryString || '').get('q') || '';
      return (
        <SearchPage
          deals={deals}
          brands={brands}
          categories={CATEGORIES}
          initialQuery={searchParam}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Recent Deal Alerts Page (/alerts)
    if (cleanPath === '/alerts') {
      return (
        <RecentAlertsPage
          deals={deals}
          categories={CATEGORIES}
          brands={brands}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 1: Home / Explore Deals Page (/)
    if (cleanPath === '/' || cleanPath === '') {
      return (
        <HomePage
          deals={deals}
          categories={CATEGORIES}
          brands={brands}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
          onOpenCommandPalette={() => handleNavigate('/search')}
          featuredItem={featuredItem}
          featuredItems={featuredItems}
          searchWords={searchWords}
        />
      );
    }

    // Page 2: Standalone Deal Detail Page (/deals/[slug])
    if (cleanPath.startsWith('/deals/')) {
      const slug = cleanPath.replace('/deals/', '');
      const deal = deals.find((d) => d.slug === slug) || deals[0];
      return (
        <DealDetailPage
          deal={deal}
          allDeals={deals}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
          onIncrementClick={handleIncrementClick}
        />
      );
    }

    // Page 3: All Brands Directory Page (/brands)
    if (cleanPath === '/brands') {
      return (
        <BrandsDirectoryPage
          brands={BRANDS}
          categories={CATEGORIES}
          onNavigate={handleNavigate}
        />
      );
    }

    // Page 4: Standalone Brand Detail Page (/brands/[slug])
    if (cleanPath.startsWith('/brands/')) {
      const slug = cleanPath.replace('/brands/', '');
      const brand = BRANDS.find((b) => b.slug === slug) || BRANDS[0];
      return (
        <BrandDetailPage
          brand={brand}
          allBrands={BRANDS}
          deals={deals}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 5: Categories Directory Page (/categories)
    if (cleanPath === '/categories') {
      return (
        <CategoriesDirectoryPage
          categories={CATEGORIES}
          brands={BRANDS}
          onNavigate={handleNavigate}
        />
      );
    }

    // Page 6: Standalone Category Detail Page (/categories/[slug])
    if (cleanPath.startsWith('/categories/')) {
      const slug = cleanPath.replace('/categories/', '');
      const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
      return (
        <CategoryDetailPage
          category={category}
          deals={deals}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 7: Startup & Student Perks Page (/perks)
    if (cleanPath === '/perks') {
      return (
        <PerksPage
          perks={PERKS_DATA}
          deals={deals}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 8: Blog & Savings Guides Page (/blog and /blog/[slug])
    if (cleanPath === '/blog' || cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.startsWith('/blog/')
        ? cleanPath.replace('/blog/', '')
        : undefined;
      return (
        <BlogPage
          articles={articles}
          selectedSlug={slug}
          deals={deals}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 9: Submit a Deal & Advertise Page (/submit)
    if (cleanPath === '/submit') {
      const initialTab =
        queryString && queryString.includes('tab=advertise')
          ? 'advertise'
          : 'submit';
      return (
        <SubmitAndAdvertisePage
          categories={CATEGORIES}
          initialTab={initialTab}
          onAddDeal={handleAddDeal}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 10: About Us Page (/about)
    if (cleanPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    // Page 11: Contact Us Page (/contact)
    if (cleanPath === '/contact') {
      return <ContactPage />;
    }

    // Page 12: Privacy Policy Page (/privacy)
    if (cleanPath === '/privacy') {
      return <PrivacyPolicyPage />;
    }

    // Page 13: Terms of Service & Affiliate Disclosure Page (/terms)
    if (cleanPath === '/terms') {
      return <TermsAndDisclosurePage />;
    }

    // Page 14: Saved Deals Page (/saved)
    if (cleanPath === '/saved') {
      return (
        <SavedDealsPage
          allDeals={deals}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
        />
      );
    }

    // Page 15: Admin Management Panel (/admin)
    if (cleanPath === '/admin') {
      return (
        <AdminPanelPage
          deals={deals}
          brands={brands}
          categories={CATEGORIES}
          perks={PERKS_DATA}
          articles={articles}
          onAddDeal={handleAddDeal}
          onUpdateDeal={handleUpdateDeal}
          onDeleteDeal={handleDeleteDeal}
          onAddBrand={handleAddBrand}
          onUpdateBrand={handleUpdateBrand}
          onDeleteBrand={handleDeleteBrand}
          onAddArticle={handleAddArticle}
          onUpdateArticle={handleUpdateArticle}
          onDeleteArticle={handleDeleteArticle}
          searchWords={searchWords}
          onUpdateSearchWords={handleUpdateSearchWords}
          seoConfigs={seoConfigs}
          onUpdateSeoConfigs={handleUpdateSeoConfigs}
          onResetAllData={handleResetAllData}
          onNavigate={handleNavigate}
          topBanner={topBanner}
          onUpdateTopBanner={handleUpdateTopBanner}
          featuredItem={featuredItem}
          featuredItems={featuredItems}
          onUpdateFeaturedItem={handleUpdateFeaturedItem}
          onUpdateFeaturedItems={handleUpdateFeaturedItems}
        />
      );
    }

    // Page 16: Dedicated Add New Deal Page (/admin/deals/new or /admin/new-deal)
    if (cleanPath === '/admin/deals/new' || cleanPath === '/admin/new-deal') {
      return (
        <AdminDealEditorPage
          deals={deals}
          brands={brands}
          categories={CATEGORIES}
          onAddDeal={handleAddDeal}
          onUpdateDeal={handleUpdateDeal}
          onNavigate={handleNavigate}
        />
      );
    }

    // Page 17: Dedicated Edit Deal Page (/admin/deals/edit/[id] or /admin/edit-deal/[id])
    if (cleanPath.startsWith('/admin/deals/edit/') || cleanPath.startsWith('/admin/edit-deal/')) {
      const dealId = cleanPath.startsWith('/admin/deals/edit/')
        ? cleanPath.replace('/admin/deals/edit/', '')
        : cleanPath.replace('/admin/edit-deal/', '');
      return (
        <AdminDealEditorPage
          dealId={dealId}
          deals={deals}
          brands={brands}
          categories={CATEGORIES}
          onAddDeal={handleAddDeal}
          onUpdateDeal={handleUpdateDeal}
          onNavigate={handleNavigate}
        />
      );
    }

    // Page 18: Dedicated Add New Blog Article Page (/admin/blogs/new or /admin/new-blog)
    if (cleanPath === '/admin/blogs/new' || cleanPath === '/admin/new-blog') {
      return (
        <AdminBlogEditorPage
          articles={articles}
          deals={deals}
          onAddArticle={handleAddArticle}
          onUpdateArticle={handleUpdateArticle}
          onNavigate={handleNavigate}
        />
      );
    }

    // Page 19: Dedicated Edit Blog Article Page (/admin/blogs/edit/[slug] or /admin/edit-blog/[slug])
    if (cleanPath.startsWith('/admin/blogs/edit/') || cleanPath.startsWith('/admin/edit-blog/')) {
      const articleSlug = cleanPath.startsWith('/admin/blogs/edit/')
        ? cleanPath.replace('/admin/blogs/edit/', '')
        : cleanPath.replace('/admin/edit-blog/', '');
      return (
        <AdminBlogEditorPage
          articleSlug={articleSlug}
          articles={articles}
          deals={deals}
          onAddArticle={handleAddArticle}
          onUpdateArticle={handleUpdateArticle}
          onNavigate={handleNavigate}
        />
      );
    }

    return (
      <HomePage
        deals={deals}
        categories={CATEGORIES}
        brands={brands}
        onNavigate={handleNavigate}
        onRevealDeal={handleRevealDeal}
        onOpenCommandPalette={() => handleNavigate('/search')}
        featuredItem={featuredItem}
        featuredItems={featuredItems}
        searchWords={searchWords}
      />
    );
  };

  return (
    <CustomPopupProvider>
      <SavedDealsProvider>
        <DealsLoadingProvider>
          <LayoutShell
            currentPath={cleanPath}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            deals={deals}
            brands={brands}
            categories={CATEGORIES}
            articles={articles}
            activeModalDeal={activeModalDeal}
            onCloseModalDeal={() => setActiveModalDeal(null)}
            onOpenCommandPalette={() => handleNavigate('/search')}
            commandOpen={commandOpen}
            setCommandOpen={setCommandOpen}
            topBanner={topBanner}
          >
            <div key={cleanPath}>
              {renderPage()}
            </div>
          </LayoutShell>
        </DealsLoadingProvider>
      </SavedDealsProvider>
    </CustomPopupProvider>
  );
}
