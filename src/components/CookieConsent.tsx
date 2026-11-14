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
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        return !saved;
      }
      return false;
    } catch {
      return false;
    }
  });
  const [view, setView] = useState<'summary' | 'customize'>('summary');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  // Cookie preference states
  const [affiliate, setAffiliate] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(true);
  const [marketing, setMarketing] = useState<boolean>(false);

  // Load existing preferences if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CookiePreferences;
        setAffiliate(Boolean(parsed.affiliate));
        setAnalytics(Boolean(parsed.analytics));
        setMarketing(Boolean(parsed.marketing));
        setIsOpen(false);
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
      {/* Compact Non-Intrusive Cookie Consent Toast */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-3 inset-x-3 sm:bottom-4 sm:right-4 sm:left-auto z-50 sm:max-w-md w-auto"
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
          >
            <div className="border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl rounded-2xl p-4 ring-1 ring-black/5 dark:ring-white/10">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                    <Cookie className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 id="cookie-consent-title" className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      Cookie Choices
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => savePreferences({ affiliate, analytics, marketing })}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Dismiss cookie popup"
                >
                  <X className="h-4 w-4" />
                </button>
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
              <div className="py-2">
                {view === 'summary' ? (
                  <p id="cookie-consent-desc" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    We use cookies to save your settings and verify coupon codes at checkout. You can accept all or keep essentials only.
                  </p>
                ) : (
                  <div className="space-y-2 py-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage cookie categories:
                    </p>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {/* 1. Necessary */}
                      <div className="flex items-start justify-between gap-3 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Essential
                            </span>
                            <Badge variant="emerald" className="text-[10px] font-semibold py-0 px-1.5">
                              Required
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Dark mode, saved deals, and basic security.
                          </p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => {}} disabled={true} />
                      </div>

                      {/* 2. Affiliate Tracking */}
                      <div className="flex items-start justify-between gap-3 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Affiliate Verification
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Ensures promo codes apply correctly at checkout.
                          </p>
                        </div>
                        <Switch checked={affiliate} onCheckedChange={setAffiliate} />
                      </div>

                      {/* 3. Analytics */}
                      <div className="flex items-start justify-between gap-3 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Analytics
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Anonymous performance to keep search fast.
                          </p>
                        </div>
                        <Switch checked={analytics} onCheckedChange={setAnalytics} />
                      </div>

                      {/* 4. Recommendations */}
                      <div className="flex items-start justify-between gap-3 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              Recommendations
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Suggests deals based on software categories.
                          </p>
                        </div>
                        <Switch checked={marketing} onCheckedChange={setMarketing} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                {view === 'summary' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAcceptAll}
                        className="w-full font-semibold rounded-xl text-xs h-8.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Accept All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRejectNonEssential}
                        className="w-full font-medium rounded-xl text-xs h-8.5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Essential Only
                      </Button>
                    </div>

                    <div className="flex items-center justify-between w-full pt-0.5">
                      <button
                        type="button"
                        onClick={() => setView('customize')}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="h-3 w-3" />
                        Customize
                      </button>

                      <button
                        type="button"
                        onClick={handleNavigateToPolicy}
                        className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline cursor-pointer"
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
                        className="w-full font-semibold rounded-xl text-xs h-8.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAcceptAll}
                        className="w-full font-medium rounded-xl text-xs h-8.5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Accept All
                      </Button>
                    </div>

                    <div className="flex items-center justify-between w-full pt-0.5">
                      <button
                        type="button"
                        onClick={() => setView('summary')}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={handleRejectNonEssential}
                        className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        Reject Optional
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
