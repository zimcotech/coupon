import React, { useState, useEffect } from 'react';
import {
  Cookie,
  ShieldCheck,
  Lock,
  Tag,
  BarChart3,
  Sparkles,
  Check,
  SlidersHorizontal,
  ExternalLink,
  Info,
  Clock,
  ArrowRight,
  Globe,
  Settings,
} from 'lucide-react';
import {
  Button,
  Breadcrumb,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Switch,
  Separator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  cn,
} from '../components/ui/shadcn';

const STORAGE_KEY = 'couponify_cookie_consent_v2';

interface CookiePreferences {
  necessary: boolean;
  affiliate: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export const CookiePolicyPage: React.FC<{ onNavigate?: (path: string) => void }> = ({
  onNavigate = () => {},
}) => {
  // Live Cookie preferences state
  const [affiliate, setAffiliate] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(true);
  const [marketing, setMarketing] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('November 2026');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CookiePreferences;
        setAffiliate(Boolean(parsed.affiliate));
        setAnalytics(Boolean(parsed.analytics));
        setMarketing(Boolean(parsed.marketing));
        if (parsed.timestamp) {
          const date = new Date(parsed.timestamp);
          setLastUpdatedDate(
            date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          );
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  const handleSave = (newAffiliate: boolean, newAnalytics: boolean, newMarketing: boolean) => {
    const prefs: CookiePreferences = {
      necessary: true,
      affiliate: newAffiliate,
      analytics: newAnalytics,
      marketing: newMarketing,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}

    setAffiliate(newAffiliate);
    setAnalytics(newAnalytics);
    setMarketing(newMarketing);

    // Broadcast change
    window.dispatchEvent(new CustomEvent('couponify_cookie_consent_updated', { detail: prefs }));

    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const handleAcceptAll = () => {
    handleSave(true, true, true);
  };

  const handleRejectNonEssential = () => {
    handleSave(false, false, false);
  };

  const cookieInventory = [
    {
      name: 'couponify_cookie_consent_v2',
      category: 'Strictly Necessary',
      provider: 'Couponify (First-party)',
      purpose: 'Stores your cookie and tracking consent choices so the banner does not re-appear unnecessarily.',
      duration: '1 Year',
    },
    {
      name: 'couponify_theme',
      category: 'Strictly Necessary',
      provider: 'Couponify (First-party)',
      purpose: 'Remembers your light or dark mode display preference across page navigations.',
      duration: 'Persistent',
    },
    {
      name: 'couponify_saved_deals',
      category: 'Strictly Necessary',
      provider: 'Couponify (First-party)',
      purpose: 'Stores your bookmarked coupons, deals, and vouchers locally on your device without requiring an account.',
      duration: 'Persistent',
    },
    {
      name: 'couponify_affiliate_click',
      category: 'Affiliate & Tracking',
      provider: 'Couponify / Merchant Partners',
      purpose: 'Validates outbound coupon redemption clicks so discount rates and exclusive merchant packs are honored.',
      duration: '30 Days',
    },
    {
      name: '_cf_bm / __cflb',
      category: 'Security & Cloud',
      provider: 'Cloudflare (Security)',
      purpose: 'Mitigates malicious bot scraping, automated spam queries, and DDoS attacks to protect server availability.',
      duration: '30 Minutes',
    },
    {
      name: 'couponify_anon_analytics',
      category: 'Analytics & Performance',
      provider: 'Couponify Analytics',
      purpose: 'Measures anonymized page loading times, popular coupon searches, and broken promo code rates.',
      duration: '90 Days',
    },
  ];

  const browserGuides = [
    {
      browser: 'Google Chrome',
      steps: 'Settings → Privacy and security → Third-party cookies → Choose your preferred blocking level.',
    },
    {
      browser: 'Apple Safari',
      steps: 'Settings / Preferences → Privacy → Select "Prevent cross-site tracking" or "Block all cookies".',
    },
    {
      browser: 'Mozilla Firefox',
      steps: 'Settings → Privacy & Security → Enhanced Tracking Protection → Select Standard or Strict mode.',
    },
    {
      browser: 'Microsoft Edge',
      steps: 'Settings → Cookies and site permissions → Manage and delete cookies and site data.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-10 text-left">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[
          { label: 'Home', path: '/' },
          { label: 'Legal & Privacy', path: '/privacy' },
          { label: 'Cookie Policy' },
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <span>Compliance & Data Transparency</span>
          <span>·</span>
          <span>GDPR / CCPA / ePrivacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Cookie Policy & Tracking Disclosure
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Last revised: {lastUpdatedDate}</span>
          <span>·</span>
          <span>Effective immediately for all visitors</span>
          <span>·</span>
          <span>Estimated read: 4 minutes</span>
        </div>
      </div>

      {/* Interactive In-Page Cookie Settings Card */}
      <Card className="border-2 border-blue-500/30 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/40 dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900/60 shadow-lg rounded-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />
        
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Cookie className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                  Interactive Cookie Preferences
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Update your consent preferences at any time. Changes take effect immediately.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="blue" className="text-xs py-1 px-3">
                Live Controller
              </Badge>
            </div>
          </div>
        </CardHeader>

        {savedFeedback && (
          <div className="mx-6 mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Preferences saved! Your tracking choices have been updated across Couponify.</span>
          </div>
        )}

        <CardContent className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Category 1: Strictly Necessary */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-start justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Strictly Necessary
                  </span>
                  <Badge variant="emerald" className="text-[10px] py-0 px-1.5">
                    Required
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Crucial for site navigation, dark mode persistence, saved deal bookmarks, and bot security. Cannot be disabled.
                </p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} disabled={true} />
            </div>

            {/* Category 2: Affiliate & Deal Verification */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-start justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Affiliate & Deal Verification
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Allows coupon tracking tokens to verify promotional discounts and cashback with merchant partners upon checkout.
                </p>
              </div>
              <Switch checked={affiliate} onCheckedChange={setAffiliate} />
            </div>

            {/* Category 3: Analytics & Performance */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-start justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Analytics & Performance
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Aggregated, anonymous metrics about search speed, response latency, and coupon redemption success rates.
                </p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>

            {/* Category 4: Personalized Recommendations */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-start justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Personalized Recommendations
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tailors deals and software suggestions based on categories and tools you browse most frequently.
                </p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Cookie choices are stored locally in your browser for up to 365 days.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectNonEssential}
              className="text-xs font-medium cursor-pointer"
            >
              Reject Non-Essential
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave(affiliate, analytics, marketing)}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Save Preferences
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white cursor-pointer"
            >
              Accept All
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Main Educational Policy Content */}
      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text data files placed on your browser or device when you visit an online service. They allow websites to remember user preferences, facilitate secure authentication, record user bookmarks, and maintain state across different browser tabs.
          </p>
          <p>
            In addition to HTTP cookies, modern web applications like Couponify utilize browser-side HTML5 Web Storage (<code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code> and <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">sessionStorage</code>) to deliver high-performance browsing without sending unnecessary payload overhead to servers on every click.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
            2. Detailed Cookie & Storage Inventory
          </h2>
          <p>
            The table below provides a full inventory of the identifiers and storage keys utilized directly by Couponify or our verified service providers:
          </p>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                <TableRow>
                  <TableHead className="font-semibold text-xs">Storage Key / Cookie</TableHead>
                  <TableHead className="font-semibold text-xs">Category</TableHead>
                  <TableHead className="font-semibold text-xs">Provider</TableHead>
                  <TableHead className="font-semibold text-xs">Purpose</TableHead>
                  <TableHead className="font-semibold text-xs">Lifespan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cookieInventory.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-slate-500">
                      {item.provider}
                    </TableCell>
                    <TableCell className="text-xs leading-relaxed max-w-xs sm:max-w-md">
                      {item.purpose}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">
                      {item.duration}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
            3. Affiliate Tracking & Merchant Promo Codes
          </h2>
          <p>
            Couponify is an independent reader-supported deal directory. When you click <strong className="text-slate-900 dark:text-slate-100">"Reveal Code"</strong>, <strong className="text-slate-900 dark:text-slate-100">"Get Deal"</strong>, or <strong className="text-slate-900 dark:text-slate-100">"Claim Pack"</strong>, you may be redirected to the vendor's official checkout website via an affiliate referral link.
          </p>
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <div className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              How Affiliate Attribution Protects You:
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Affiliate cookies contain an anonymous alphanumeric tracking token; they never access your personal contact info, passwords, or credit card digits.</li>
              <li>They inform the merchant that the discount originated from Couponify, unlocking the promised discount or free trial credits.</li>
              <li>Merchant checkout sessions are governed by the respective vendor&apos;s independent privacy statement.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
            4. Managing Cookies in Your Web Browser
          </h2>
          <p>
            You can configure your browser to reject all cookies, alert you when a cookie is placed, or erase stored cookies whenever you close the application. If you completely disable cookies, certain interactive conveniences (such as saved coupon collections or custom theme switches) may require re-selection upon reload.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {browserGuides.map((guide, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  {guide.browser}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {guide.steps}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
            5. Contact Our Privacy Team
          </h2>
          <p>
            If you have questions regarding this Cookie Policy or how we handle data privacy, feel free to reach out to our team at any time:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 transition-colors cursor-pointer"
            >
              Contact Support
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
              href="mailto:privacy@couponify.io"
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              privacy@couponify.io
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
