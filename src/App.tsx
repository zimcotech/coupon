import React, { useState, useEffect } from 'react';
import {
  INITIAL_DEALS,
  BRANDS,
  CATEGORIES,
  PERKS_DATA,
  BLOG_ARTICLES,
  Deal,
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
  BlogPage,
  SubmitAndAdvertisePage,
} from './pages/PerksBlogSubmitPages';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsAndDisclosurePage,
} from './pages/CompanyAndLegalPages';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeModalDeal, setActiveModalDeal] = useState<Deal | null>(null);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIncrementClick = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, clicks: d.clicks + 1, views: d.views + 1 } : d
      )
    );
  };

  const handleRevealDeal = (deal: Deal) => {
    handleIncrementClick(deal.id);
    const updated = { ...deal, clicks: deal.clicks + 1, views: deal.views + 1 };
    setActiveModalDeal(updated);
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);
  };

  // Parse path & query
  const [cleanPath, queryString] = currentPath.split('?');

  const renderPage = () => {
    // Page 1: Home / Explore Deals Page (/)
    if (cleanPath === '/' || cleanPath === '') {
      return (
        <HomePage
          deals={deals}
          categories={CATEGORIES}
          brands={BRANDS}
          onNavigate={handleNavigate}
          onRevealDeal={handleRevealDeal}
          onOpenCommandPalette={() => setCommandOpen(true)}
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
          articles={BLOG_ARTICLES}
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

    return (
      <HomePage
        deals={deals}
        categories={CATEGORIES}
        brands={BRANDS}
        onNavigate={handleNavigate}
        onRevealDeal={handleRevealDeal}
        onOpenCommandPalette={() => setCommandOpen(true)}
      />
    );
  };

  return (
    <LayoutShell
      currentPath={cleanPath}
      onNavigate={handleNavigate}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      deals={deals}
      brands={BRANDS}
      categories={CATEGORIES}
      articles={BLOG_ARTICLES}
      activeModalDeal={activeModalDeal}
      onCloseModalDeal={() => setActiveModalDeal(null)}
      onOpenCommandPalette={() => setCommandOpen(true)}
      commandOpen={commandOpen}
      setCommandOpen={setCommandOpen}
    >
      {renderPage()}
    </LayoutShell>
  );
}
