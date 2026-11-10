import React, { useState, useEffect } from 'react';
import {
  Cookie,
  Lock,
  SlidersHorizontal,
  Check,
  Tag,
  BarChart3,
  Sparkles,
  Mail,
} from 'lucide-react';
import {
  Breadcrumb,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Switch,
} from '../components/ui/shadcn';
import { CookiePreferences } from '../components/CookieConsent';

const COOKIE_STORAGE_KEY = 'couponify_cookie_consent_v2';

interface CookieItem {
  name: string;
  category: 'Essential' | 'Affiliate' | 'Analytics' | 'Marketing';
  purpose: string;
  duration: string;
}

const COOKIE_LIST: CookieItem[] = [
  {
    name: 'couponify_theme',
    category: 'Essential',
    purpose: 'Remembers your light or dark mode theme.',
    duration: 'Persistent',
  },
  {
    name: 'couponify_saved_deals',
    category: 'Essential',
    purpose: 'Saves your bookmarked coupons locally on your device.',
    duration: 'Persistent',
  },
  {
    name: 'couponify_cookie_consent_v2',
    category: 'Essential',
    purpose: 'Stores your cookie preference choices.',
    duration: '12 Months',
  },
  {
    name: 'aff_ref_partner',
    category: 'Affiliate',
    purpose: 'Confirms partner discounts and cashbacks when you click out to merchant stores.',
    duration: '30–90 Days',
  },
  {
    name: '_cp_metrics_speed',
    category: 'Analytics',
    purpose: 'Measures anonymous page speed to keep the site fast.',
    duration: 'Session',
  },
];

export const PrivacyAndCookiePolicyPage: React.FC<{ onNavigate?: (path: string) => void }> = ({
  onNavigate = () => {},
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    affiliate: true,
    analytics: true,
    marketing: false,
    timestamp: new Date().toISOString(),
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleToggle = (key: 'affiliate' | 'analytics' | 'marketing', value: boolean) => {
    const updated = {
      ...preferences,
      [key]: value,
      timestamp: new Date().toISOString(),
    };
    setPreferences(updated);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {}
  };

  const handleAcceptAll = () => {
    const updated: CookiePreferences = {
      necessary: true,
      affiliate: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setPreferences(updated);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {}
  };

  const handleRejectOptional = () => {
    const updated: CookiePreferences = {
      necessary: true,
      affiliate: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setPreferences(updated);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-8 text-left">
      {/* Breadcrumb */}
      <Breadcrumb
        onNavigate={onNavigate}
        items={[{ label: 'Home', path: '/' }, { label: 'Cookie Policy' }]}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We use cookies and local browser storage to keep Couponify fast, remember your settings, and verify discount promo codes. Here is what we use and how you can manage them.
        </p>
      </div>

      {/* Interactive Cookie Settings Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Your Cookie Preferences
              </CardTitle>
            </div>
            {saveSuccess && (
              <Badge variant="emerald" className="gap-1 text-xs px-2 py-0.5">
                <Check className="h-3 w-3" />
                Saved
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Customize which cookies you want enabled:
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Essential */}
            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Essential
                  </span>
                  <Badge variant="emerald" className="text-[10px] py-0 px-1 font-semibold">
                    Always On
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Dark mode, saved deals, and basic security.
                </p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} disabled={true} />
            </div>

            {/* Affiliate */}
            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Affiliate Verification
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Validates coupon codes and partner store deals.
                </p>
              </div>
              <Switch
                checked={preferences.affiliate}
                onCheckedChange={(val) => handleToggle('affiliate', val)}
              />
            </div>

            {/* Analytics */}
            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Analytics
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Anonymous performance metrics to keep search fast.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(val) => handleToggle('analytics', val)}
              />
            </div>

            {/* Recommendations */}
            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Recommendations
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Suggests software discounts based on your interests.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(val) => handleToggle('marketing', val)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800">
            <Button
              size="sm"
              variant="default"
              onClick={handleAcceptAll}
              className="text-xs rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Accept All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRejectOptional}
              className="text-xs rounded-xl font-medium border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Essential Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clean Cookies Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cookie className="h-4 w-4 text-blue-600" />
          Cookies & Storage We Use
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50/70 dark:bg-slate-950/50">
              <TableRow>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Name</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Type</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Purpose</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COOKIE_LIST.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.category === 'Essential' ? 'emerald' : 'secondary'}
                      className="text-[10px] font-semibold"
                    >
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {item.purpose}
                  </TableCell>
                  <TableCell className="text-slate-500 whitespace-nowrap">
                    {item.duration}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Browser Controls & Contact */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
        <p>
          <strong className="text-slate-900 dark:text-slate-100">Browser Settings:</strong> You can also delete or block cookies anytime directly in your browser preferences (Chrome, Safari, Firefox, or Edge).
        </p>
        <p>
          <strong className="text-slate-900 dark:text-slate-100">Have questions?</strong> Contact us at{' '}
          <a href="mailto:support@couponify.io" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700">
            support@couponify.io
          </a>.
        </p>
      </div>
    </div>
  );
};
