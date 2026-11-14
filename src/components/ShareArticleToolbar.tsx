import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Send,
  MessageCircle,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { cn } from './ui/shadcn';

interface ShareArticleToolbarProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export const ShareArticleToolbar: React.FC<ShareArticleToolbarProps> = ({
  title,
  url,
  description,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || `${title} — on Couponify`,
          url,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    handleCopyLink();
  };

  const shareText = encodeURIComponent(`${title} — on Couponify`);
  const shareUrl = encodeURIComponent(url);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2.5 py-3 px-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60',
        className
      )}
    >
      <button
        type="button"
        onClick={handleNativeShare}
        className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
      >
        <Share2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        <span>Share Guide</span>
      </button>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={handleCopyLink}
          className={cn(
            'h-8 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer border',
            copied
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'border-slate-200/90 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
          className="h-8 px-2.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <Twitter className="h-3.5 w-3.5 text-sky-500" />
          <span className="hidden sm:inline">Twitter</span>
        </a>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="h-8 px-2.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <Linkedin className="h-3.5 w-3.5 text-[#0a66c2]" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="h-8 px-2.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Telegram"
          className="h-8 px-2.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <Send className="h-3.5 w-3.5 text-sky-500" />
          <span className="hidden sm:inline">Telegram</span>
        </a>
      </div>
    </div>
  );
};
