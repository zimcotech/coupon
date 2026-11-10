import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  Laptop,
  Smartphone,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  ShieldCheck,
  Flame,
  Clock,
  KeyRound,
  Tag,
  AlertCircle,
  Building2,
  FolderTree,
} from 'lucide-react';
import { DealCard } from '../components/DealCard';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryBadge } from '../components/CategoryBadge';
import { Deal, Brand, Category } from '../data/mockData';
import { CustomDropdown } from '../components/CustomDropdown';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, Button, Badge, cn } from '../components/ui/shadcn';

interface AdminDealEditorPageProps {
  dealId?: string; // If provided, edit mode; otherwise, create mode
  deals: Deal[];
  brands: Brand[];
  categories: Category[];
  onAddDeal: (newDeal: Deal) => void;
  onUpdateDeal: (updatedDeal: Deal) => void;
  onNavigate: (path: string) => void;
}

export const AdminDealEditorPage: React.FC<AdminDealEditorPageProps> = ({
  dealId,
  deals,
  brands,
  categories,
  onAddDeal,
  onUpdateDeal,
  onNavigate,
}) => {
  const existingDeal = useMemo(() => {
    if (!dealId) return null;
    return deals.find((d) => d.id === dealId) || null;
  }, [dealId, deals]);

  const defaultDealForm: Omit<Deal, 'id'> = {
    title: 'Cursor AI Pro Discount: 40% Off Annual Plan',
    slug: 'cursor-ai-pro-discount-40-off',
    brandName: 'Cursor',
    brandSlug: 'cursor',
    brandInitials: 'CU',
    brandColor: 'bg-indigo-600',
    logoUrl: '',
    categorySlug: 'dev-tools',
    categoryName: 'Developer Tools',
    dealType: 'Promo Codes',
    valueBadge: '40% OFF',
    discountPercent: 40,
    hasFreeTrial: true,
    shortDescription: 'Get 40% off your first year of Cursor Pro AI code editor with fast completions and sonnet inference.',
    code: 'BUILDER40',
    isCodeRequired: true,
    verifiedAgo: 'Just now',
    verifiedTimestamp: Date.now(),
    views: 120,
    clicks: 45,
    isTrending: true,
    isNewArrival: true,
    isLimitedTime: false,
    extraDealsCount: 1,
    expiresAt: 'December 2026',
    officialUrl: 'https://cursor.com',
    successRate: 98,
    eligibility: ['Available for both new and existing free-tier developers.'],
    redemptionSteps: [
      'Navigate to cursor.com and log in to your account.',
      'Head to Subscription Settings and select the Annual Pro tier.',
      'Paste the promo code into the checkout billing modal.',
    ],
  };

  const [dealForm, setDealForm] = useState<Omit<Deal, 'id'>>(() => {
    if (existingDeal) {
      const { id, ...rest } = existingDeal;
      return rest;
    }
    return defaultDealForm;
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewModeTab, setPreviewModeTab] = useState<'card' | 'trending' | 'row'>('card');
  const [testModalDeal, setTestModalDeal] = useState<Deal | null>(null);
  const [copiedPreviewCode, setCopiedPreviewCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live preview Deal object
  const previewDeal: Deal = useMemo(() => {
    return {
      id: existingDeal?.id || 'deal-preview-demo',
      ...dealForm,
    };
  }, [dealForm, existingDeal]);

  const handleBrandSelect = (brandSlug: string) => {
    const found = brands.find((b) => b.slug === brandSlug);
    if (found) {
      setDealForm((prev) => ({
        ...prev,
        brandName: found.name,
        brandSlug: found.slug,
        brandInitials: found.initials,
        brandColor: found.colorClass || 'bg-blue-600',
        categorySlug: found.categorySlug,
        categoryName: found.categoryName,
        officialUrl: found.officialUrl || prev.officialUrl,
      }));
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    const found = categories.find((c) => c.slug === categorySlug);
    if (found) {
      setDealForm((prev) => ({
        ...prev,
        categorySlug: found.slug,
        categoryName: found.name,
      }));
    }
  };

  const handleFillSample = () => {
    setDealForm({
      title: 'Supabase Pro: $200 Database Credits for 6 Months',
      slug: 'supabase-pro-200-credits',
      brandName: 'Supabase',
      brandSlug: 'supabase',
      brandInitials: 'SU',
      brandColor: 'bg-emerald-600',
      logoUrl: '',
      categorySlug: 'dev-tools',
      categoryName: 'Developer Tools',
      dealType: 'Free Credits',
      valueBadge: '$200 Free',
      discountPercent: 100,
      hasFreeTrial: true,
      shortDescription: 'Receive $200 in managed Postgres database credits and vector compute for early-stage teams.',
      code: 'SUPACLOUD200',
      isCodeRequired: true,
      verifiedAgo: 'Just now',
      verifiedTimestamp: Date.now(),
      views: 310,
      clicks: 84,
      isTrending: true,
      isNewArrival: true,
      isLimitedTime: false,
      extraDealsCount: 2,
      expiresAt: 'December 2026',
      officialUrl: 'https://supabase.com',
      successRate: 99,
      eligibility: ['Open to developers, student founders, and early-stage SaaS companies.'],
      redemptionSteps: [
        'Create a free Supabase workspace at supabase.com.',
        'Navigate to Organization Settings → Billing & Usage.',
        'Enter promo code SUPACLOUD200 to credit $200 directly.',
      ],
    });
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.title.trim() || !dealForm.code.trim()) {
      setErrorMessage('Please provide at least a Deal Title and Promo Code.');
      return;
    }

    const slug = dealForm.slug.trim() || dealForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (existingDeal) {
      onUpdateDeal({
        ...existingDeal,
        ...dealForm,
        slug,
      });
    } else {
      const newDeal: Deal = {
        id: `deal-custom-${Date.now()}`,
        ...dealForm,
        slug,
        views: dealForm.views || 1,
        clicks: dealForm.clicks || 0,
        verifiedTimestamp: Date.now(),
        verifiedAgo: 'Just now',
      };
      onAddDeal(newDeal);
    }

    onNavigate('/admin');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedPreviewCode(true);
    setTimeout(() => setCopiedPreviewCode(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-6 overflow-x-hidden text-left">
      {/* Top Breadcrumb & Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Admin Panel</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {existingDeal ? 'Edit Deal' : 'Add New Deal'}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live Preview Studio
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Configure promotional metadata, discount details, and preview in real time how this offer will appear to users before saving.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleFillSample}
            className="h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Fill Sample Data</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="h-10 px-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="deal-editor-full-form"
            className="h-10 px-5 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
          >
            <Check className="h-4 w-4" />
            <span>{existingDeal ? 'Save Deal Changes' : 'Publish Deal to Site'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout: Left 7 cols for Form, Right 5 cols for Sticky Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: FULL-PAGE FORM
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <form id="deal-editor-full-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Brand & Category Association */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  1. Brand Association & Classification
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Brand / Vendor *
                  </label>
                  <CustomDropdown
                    value={dealForm.brandSlug}
                    onChange={(val) => handleBrandSelect(val)}
                    options={brands.map((b) => ({
                      value: b.slug,
                      label: `${b.name} (${b.categoryName})`,
                    }))}
                    searchable
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Custom Brand Name (or Override)
                  </label>
                  <input
                    type="text"
                    value={dealForm.brandName}
                    onChange={(e) =>
                      setDealForm({
                        ...dealForm,
                        brandName: e.target.value,
                        brandInitials: e.target.value.slice(0, 2).toUpperCase(),
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category Vertical *
                  </label>
                  <CustomDropdown
                    value={dealForm.categorySlug}
                    onChange={(val) => handleCategorySelect(val)}
                    options={categories.map((c) => ({
                      value: c.slug,
                      label: c.name,
                    }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Deal Type
                  </label>
                  <CustomDropdown
                    value={dealForm.dealType}
                    onChange={(val) => setDealForm({ ...dealForm, dealType: val as any })}
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
            </div>

            {/* Card 2: Headline, Value Badge & Description */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Tag className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  2. Deal Title & Promotional Messaging
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Deal Title (Primary headline) *
                </label>
                <input
                  type="text"
                  required
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  placeholder="e.g. Vultr Cloud: $300 Free Credits Promo Code"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Value Badge (e.g., 50% OFF, $300 Free) *
                  </label>
                  <input
                    type="text"
                    required
                    value={dealForm.valueBadge}
                    onChange={(e) => setDealForm({ ...dealForm, valueBadge: e.target.value })}
                    placeholder="e.g. 50% OFF"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Discount Percentage (numeric optional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={dealForm.discountPercent || ''}
                    onChange={(e) =>
                      setDealForm({
                        ...dealForm,
                        discountPercent: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    placeholder="e.g. 40"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Deal Description (Clean 2-line summary)
                </label>
                <textarea
                  rows={2}
                  value={dealForm.shortDescription}
                  onChange={(e) => setDealForm({ ...dealForm, shortDescription: e.target.value })}
                  placeholder="Provide a clear, value-focused summary of what users get with this deal..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                />
              </div>
            </div>

            {/* Card 3: Promo Code & Checkout URL */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <KeyRound className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  3. Coupon Code & Redemption URL
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={dealForm.code}
                    onChange={(e) => setDealForm({ ...dealForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BUILDER50"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wider focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Official Checkout URL
                  </label>
                  <input
                    type="url"
                    value={dealForm.officialUrl}
                    onChange={(e) => setDealForm({ ...dealForm, officialUrl: e.target.value })}
                    placeholder="https://brand.com/pricing"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Expires At (Text Label)
                  </label>
                  <input
                    type="text"
                    value={dealForm.expiresAt || ''}
                    onChange={(e) => setDealForm({ ...dealForm, expiresAt: e.target.value })}
                    placeholder="e.g. December 2026, Limited Time"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={dealForm.slug}
                    onChange={(e) => setDealForm({ ...dealForm, slug: e.target.value })}
                    placeholder="e.g. cursor-ai-pro-discount"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Badges & Display Toggles */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Flame className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  4. Placement & Editorial Flags
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={dealForm.isTrending || false}
                    onChange={(e) => setDealForm({ ...dealForm, isTrending: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Feature in Trending</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={dealForm.isLimitedTime || false}
                    onChange={(e) => setDealForm({ ...dealForm, isLimitedTime: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span>Limited Time Badge</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={dealForm.isCodeRequired || false}
                    onChange={(e) => setDealForm({ ...dealForm, isCodeRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Code Required</span>
                </label>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onNavigate('/admin')}
                className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Discard & Return
              </button>

              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
              >
                <Check className="h-4 w-4" />
                <span>{existingDeal ? 'Save Deal Changes' : 'Publish Deal to Site'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: STICKY REAL-TIME USER PANEL PREVIEW
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            {/* Header: Mode Switcher & Device Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block">
                  Live Card Simulator
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Simulating user panel appearance
                </span>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    previewDevice === 'desktop'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                  title="Desktop View"
                >
                  <Laptop className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                    previewDevice === 'mobile'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                  title="Mobile 380px Frame"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Layout Mode Selector (Catalog Card vs Trending Carousel vs Recently Verified) */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewModeTab('card')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer',
                  previewModeTab === 'card'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                Catalog Card
              </button>
              <button
                type="button"
                onClick={() => setPreviewModeTab('trending')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer',
                  previewModeTab === 'trending'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                Trending Deal
              </button>
              <button
                type="button"
                onClick={() => setPreviewModeTab('row')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors text-center cursor-pointer',
                  previewModeTab === 'row'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                Verified Row
              </button>
            </div>

            {/* Preview Viewport Container */}
            <div
              className={cn(
                'mx-auto transition-shadow p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50',
                previewDevice === 'mobile' ? 'max-w-[370px] shadow-md border-slate-300 dark:border-slate-700' : 'w-full'
              )}
            >
              {previewDevice === 'mobile' && (
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>
              )}

              {/* View 1: Standard Catalog Card */}
              {previewModeTab === 'card' && (
                <div className="space-y-2">
                  <DealCard deal={previewDeal} onRevealDeal={setTestModalDeal} onNavigate={onNavigate} />
                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
                    Click "Get Code" on this card to test the user claim modal.
                  </p>
                </div>
              )}

              {/* View 2: Trending Deals Carousel Card */}
              {previewModeTab === 'trending' && (
                <div className="space-y-2">
                  <div
                    onClick={() => setTestModalDeal(previewDeal)}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-shadow text-left space-y-3 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <BrandLogo
                        brandSlug={previewDeal.brandSlug}
                        brandName={previewDeal.brandName}
                        initials={previewDeal.brandInitials}
                        colorClass={previewDeal.brandColor}
                        size="md"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {previewDeal.valueBadge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {previewDeal.brandName}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {previewDeal.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        Popular this week
                      </span>
                      <span className="font-semibold text-blue-600">#{previewDeal.dealType}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
                    Click card to simulate the user redemption popup.
                  </p>
                </div>
              )}

              {/* View 3: Recently Verified Row */}
              {previewModeTab === 'row' && (
                <div className="space-y-2">
                  <div
                    onClick={() => setTestModalDeal(previewDeal)}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <BrandLogo
                      brandSlug={previewDeal.brandSlug}
                      brandName={previewDeal.brandName}
                      initials={previewDeal.brandInitials}
                      colorClass={previewDeal.brandColor}
                      size="md"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {previewDeal.brandName}
                        </span>
                        <CategoryBadge
                          categorySlug={previewDeal.categorySlug}
                          categoryName={previewDeal.categoryName}
                          size="xs"
                        />
                        <span className="text-[11px] text-slate-400">· {previewDeal.verifiedAgo}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {previewDeal.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-1">{previewDeal.shortDescription}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {previewDeal.valueBadge}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
                    Click row to test the user claim modal.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Helper Explainer */}
            <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                <ShieldCheck className="h-4 w-4" />
                Live Verification Guarantee
              </span>
              <p className="leading-relaxed">
                Changes to the title, value badge, category, or code update the cards instantly. What you see is pixel-for-pixel what users will encounter on the homepage and deals directory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated User Claim Modal when clicking cards in preview mode */}
      <Dialog open={!!testModalDeal} onOpenChange={(open) => !open && setTestModalDeal(null)}>
        {testModalDeal && (
          <div className="space-y-5 text-left max-w-lg w-full">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <BrandLogo
                  brandSlug={testModalDeal.brandSlug}
                  brandName={testModalDeal.brandName}
                  initials={testModalDeal.brandInitials}
                  colorClass={testModalDeal.brandColor}
                  size="md"
                />
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {testModalDeal.brandName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Interactive simulation of user redemption dialog
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {testModalDeal.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {testModalDeal.shortDescription}
              </p>
            </div>

            {/* Simulated Code Box */}
            <div className="p-4 rounded-xl border border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                  Coupon Code
                </span>
                <span className="font-mono text-base font-extrabold text-slate-900 dark:text-slate-50 tracking-wider">
                  {testModalDeal.code}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(testModalDeal.code)}
                className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedPreviewCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedPreviewCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Verified: {testModalDeal.verifiedAgo} · {testModalDeal.successRate}% Success
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestModalDeal(null)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
