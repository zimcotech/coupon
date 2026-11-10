import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cookie,
  SlidersHorizontal,
  Check,
  X,
  Lock,
  Sparkles,
  BarChart3,
  Tag,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Switch,
  Separator,
  cn,
} from './ui/shadcn';

export interface CookiePreferences {
  necessary: boolean;
  affiliate: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export interface CookieConsentProps {
  onNavigate?: (path: string) => void;
}

const STORAGE_KEY = 'couponify_cookie_consent_v2';

export const openCookiePreferences = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('couponify_open_cookie_preferences'));
  }
};

export const CookieConsent: React.FC<CookieConsentProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [view, setView] = useState<'summary' | 'customize'>('summary');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  // Cookie preference states
  const [affiliate, setAffiliate] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(true);
  const [marketing, setMarketing] = useState<boolean>(false);

  // Load existing preferences if available, but default to open as requested
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CookiePreferences;
        setAffiliate(Boolean(parsed.affiliate));
        setAnalytics(Boolean(parsed.analytics));
        setMarketing(Boolean(parsed.marketing));
      }
    } catch {
      // ignore JSON parse error
    }

    const handleOpenEvent = () => {
      setIsOpen(true);
      setShowSavedFeedback(false);
    };

    window.addEventListener('couponify_open_cookie_preferences', handleOpenEvent);
    return () => {
      window.removeEventListener('couponify_open_cookie_preferences', handleOpenEvent);
    };
  }, []);

  const handleNavigateToPolicy = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (onNavigate) {
      onNavigate('/privacy');
    } else {
      window.history.pushState({}, '', '/privacy');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const savePreferences = (prefs: { affiliate: boolean; analytics: boolean; marketing: boolean }) => {
    const fullPreferences: CookiePreferences = {
      necessary: true,
      affiliate: prefs.affiliate,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPreferences));
    } catch {
      // storage quota or private mode error
    }

    setAffiliate(prefs.affiliate);
    setAnalytics(prefs.analytics);
    setMarketing(prefs.marketing);

    setShowSavedFeedback(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowSavedFeedback(false);
      setView('summary');
    }, 1200);
  };

  const handleAcceptAll = () => {
    savePreferences({ affiliate: true, analytics: true, marketing: true });
  };

  const handleRejectNonEssential = () => {
    savePreferences({ affiliate: false, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    savePreferences({ affiliate, analytics, marketing });
  };

  return (
    <>
      {/* Floating Cookie Trigger (Accessible when popup is dismissed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-4 left-4 z-40"
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setView('summary');
              }}
              aria-label="Open Cookie Preferences"
              className="group flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg hover:shadow-xl text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer text-xs font-semibold"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform">
                <Cookie className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline">Cookie Settings</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main shadcn/ui Cookie Consent Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-w-full"
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
          >
            <Card className="border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
              {/* Header */}
              <div className="p-4 sm:p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                      <Cookie className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle id="cookie-consent-title" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Cookie Choices
                        </CardTitle>
                        <Badge variant="blue" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                          Privacy
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                        Manage your preferences
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 -mr-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Dismiss cookie popup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Saved Notification Banner */}
              <AnimatePresence>
                {showSavedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-emerald-500/10 border-y border-emerald-500/30 px-5 py-2.5 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
                  >
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>Preferences saved!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Body Content */}
              <CardContent className="px-4 sm:px-5 py-2 space-y-3">
                {view === 'summary' ? (
                  <CardDescription id="cookie-consent-desc" className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    We use cookies to save your settings and verify partner discounts when you claim deals. You can accept all or choose your preferences.
                  </CardDescription>
                ) : (
                  <div className="space-y-3 py-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choose which cookie categories you allow:
                    </p>

                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                      {/* 1. Necessary */}
                      <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Essential
                            </span>
                            <Badge variant="emerald" className="text-[10px] font-semibold py-0 px-1.5">
                              Required
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            Dark mode, saved deals, and basic security.
                          </p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => {}} disabled={true} />
                      </div>

                      {/* 2. Affiliate Tracking */}
                      <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Affiliate Verification
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            Ensures promo codes apply correctly at checkout.
                          </p>
                        </div>
                        <Switch checked={affiliate} onCheckedChange={setAffiliate} />
                      </div>

                      {/* 3. Analytics */}
                      <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Analytics
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            Anonymous performance to keep search fast.
                          </p>
                        </div>
                        <Switch checked={analytics} onCheckedChange={setAnalytics} />
                      </div>

                      {/* 4. Personalization */}
                      <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Recommendations
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            Suggests deals based on software categories you view.
                          </p>
                        </div>
                        <Switch checked={marketing} onCheckedChange={setMarketing} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <Separator className="my-1 bg-slate-200/70 dark:bg-slate-800" />

              {/* Action Buttons */}
              <CardFooter className="p-4 sm:p-5 pt-3 flex flex-col gap-2">
                {view === 'summary' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAcceptAll}
                        className="w-full font-semibold rounded-xl text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Accept All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRejectNonEssential}
                        className="w-full font-medium rounded-xl text-xs h-9 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Essential Only
                      </Button>
                    </div>

                    <div className="flex items-center justify-between w-full pt-1">
                      <button
                        type="button"
                        onClick={() => setView('customize')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Customize
                      </button>

                      <button
                        type="button"
                        onClick={handleNavigateToPolicy}
                        className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline cursor-pointer"
                      >
                        Cookie Policy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveCustom}
                        className="w-full font-semibold rounded-xl text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAcceptAll}
                        className="w-full font-medium rounded-xl text-xs h-9 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Accept All
                      </Button>
                    </div>

                    <div className="flex items-center justify-between w-full pt-1">
                      <button
                        type="button"
                        onClick={() => setView('summary')}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={handleRejectNonEssential}
                        className="text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        Reject Optional
                      </button>
                    </div>
                  </>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
