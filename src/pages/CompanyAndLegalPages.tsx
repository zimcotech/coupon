import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Wallet,
  Mail,
  Clock,
  Calendar,
  Lock,
  Scale,
  CheckCircle2,
  Send,
  Building2,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import {
  Button,
  Breadcrumb,
  Accordion,
  cn,
} from '../components/ui/shadcn';
import { CustomDropdown } from '../components/CustomDropdown';

// ============================================================================
// PAGE 10: ABOUT US PAGE (/about)
// ============================================================================
export const AboutPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate = () => {} }) => {
  const metrics = [
    { label: 'Verified Deals', value: '500+ Active Codes', sub: 'Tested weekly against live checkout flows' },
    { label: 'Cumulative Savings', value: '$2.4M+ Saved', sub: 'Saved by software teams in 2025–2026' },
    { label: 'Direct Vendors', value: '120+ SaaS Partners', sub: 'Direct partner feeds and credit grants' },
    { label: 'Quality Standard', value: '100% Tested', sub: 'Zero scraped or misleading coupon clutter' },
  ];

  const steps = [
    {
      icon: Search,
      step: '01',
      title: 'Direct SaaS Partner Sourcing',
      description: 'We work directly with partnerships and growth leads at leading AI, cloud, and dev tool companies to negotiate exclusive promo codes and startup credit grants.',
    },
    {
      icon: ShieldCheck,
      step: '02',
      title: 'Manual Checkout Verification',
      description: 'Every code listed on Couponify is manually tested against live Stripe, Paddle, or native billing checkouts to verify exact discount percentages and eligibility rules.',
    },
    {
      icon: Wallet,
      step: '03',
      title: 'Instant One-Click Redemption',
      description: 'Copy verified promo codes or apply for $100k+ cloud grants with zero signup walls, spam popups, or expired bait-and-switch links.',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]}
      />

      {/* Hero Mission */}
      <div className="max-w-3xl space-y-3 text-left">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          About Couponify
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Eliminating expired coupon clutter for software builders.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          General-purpose coupon sites are filled with broken promo codes and deceptive popups. We built Couponify to give software engineers, indie hackers, students, and venture-backed founders a clean, high-density directory of real B2B SaaS discounts and cloud credits.
        </p>
      </div>

      {/* 4-Column Metric Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs space-y-1.5"
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{m.label}</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {m.value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* "How Couponify Works" 3-Step Visual Breakdown */}
      <div className="space-y-4">
        <div className="space-y-1 text-left">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            How Couponify Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Our three-stage verification protocol ensures every listed code works at checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Step {s.step}
                  </span>
                </div>
                <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 11: CONTACT & SUPPORT PAGE (/contact)
// ============================================================================
export const ContactPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate = () => {} }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Deal Issue', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]}
      />

      <div className="max-w-3xl space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Get in Touch with our Editorial Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Report an expired discount code, suggest a missing developer tool, or reach out for editorial partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Contact Form (8 cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xs">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Message Received</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out. An editor will review your inquiry within 24 business hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="h-10 text-xs rounded-lg mt-2 cursor-pointer"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. sarah@startup.com"
                      className="w-full h-10 px-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Inquiry Type
                  </label>
                  <CustomDropdown
                    value={form.subject}
                    onChange={(val) => setForm({ ...form, subject: val })}
                    options={[
                      { value: 'Deal Issue', label: 'Report Broken or Expired Deal' },
                      { value: 'Listing Suggestion', label: 'Suggest a New SaaS Tool' },
                      { value: 'Advertising', label: 'Partnership / Sponsored Placement' },
                      { value: 'General', label: 'General Inquiry' },
                    ]}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue or suggestion in detail..."
                    className="w-full p-3.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1565FF]"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Info (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
            <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
              Direct Contact Channels
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span>support@couponify.io</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Response SLA: Within 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>San Francisco, CA & Remote Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 12: PRIVACY POLICY & COOKIE POLICY PAGE (/privacy)
// ============================================================================
export { PrivacyAndCookiePolicyPage, PrivacyAndCookiePolicyPage as PrivacyPolicyPage } from './PrivacyAndCookiePolicyPage';

// ============================================================================
// PAGE 13: TERMS & AFFILIATE DISCLOSURE (/terms)
// ============================================================================
export const TermsAndDisclosurePage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate = () => {} }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 overflow-x-hidden">
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Terms & Affiliate Disclosure' }]}
      />

      <div className="max-w-3xl space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Terms of Service & Affiliate Disclosure
        </h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs text-left max-w-4xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">FTC Affiliate Disclosure</h2>
          <p>
            Couponify is an independent reader-supported deal directory. Some of the links on this website are affiliate referral links. This means that if you click through and complete a purchase or sign up for a paid subscription, we may earn an affiliate commission at zero additional cost to you.
          </p>
          <p>
            Our editorial integrity is strictly separated from commercial relationships. We only list genuine, tested discounts and credit programs that offer real economic value to software engineers, founders, and students.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Coupon Validity & Third-Party Terms</h2>
          <p>
            While our team manually tests coupon codes daily, software vendors reserve the right to alter or terminate promotions at their sole discretion. We recommend confirming the applied discount in the merchant's checkout summary before entering payment details.
          </p>
        </section>
      </div>
    </div>
  );
};
