import React, { useState } from 'react';
import {
  Link,
  Copy,
  Check,
  Share2,
  Send,
  MessageCircle,
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
      // Fallback
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

  const shareText = encodeURIComponent(`${title} — on Couponify`);
  const shareUrl = encodeURIComponent(url);

  // Social share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs',
        className
      )}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
        <Share2 className="h-3.5 w-3.5 text-blue-600" />
        <span>Share</span>
      </span>

      {/* Copy Link Button with Toast State */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={cn(
          'h-8 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer border',
          copied
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'border-slate-200/90 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
        )}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
      >
        <span className="font-mono text-xs font-black">𝕏</span>
        <span className="hidden sm:inline">Post</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
      >
        <span className="font-bold text-xs text-[#0a66c2]">in</span>
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Telegram */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Telegram"
        className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
      >
        <Send className="h-3.5 w-3.5 text-sky-500" />
        <span className="hidden sm:inline">Telegram</span>
      </a>
    </div>
  );
};
