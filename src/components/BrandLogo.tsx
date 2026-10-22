import React, { useState } from 'react';
import { cn } from './ui/shadcn';

interface BrandLogoProps {
  brandSlug?: string;
  brandName?: string;
  domain?: string;
  logoUrl?: string;
  initials?: string;
  colorClass?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Map slugs / names to domain and dedicated brand SVG / logo
const BRAND_DOMAINS: Record<string, { domain: string; defaultColor: string }> = {
  openai: { domain: 'openai.com', defaultColor: 'bg-zinc-900 text-white' },
  chatgpt: { domain: 'openai.com', defaultColor: 'bg-emerald-600 text-white' },
  digitalocean: { domain: 'digitalocean.com', defaultColor: 'bg-blue-600 text-white' },
  cloudways: { domain: 'cloudways.com', defaultColor: 'bg-sky-600 text-white' },
  upcloud: { domain: 'upcloud.com', defaultColor: 'bg-purple-600 text-white' },
  elevenlabs: { domain: 'elevenlabs.io', defaultColor: 'bg-indigo-600 text-white' },
  cursor: { domain: 'cursor.com', defaultColor: 'bg-zinc-900 text-white' },
  vercel: { domain: 'vercel.com', defaultColor: 'bg-black text-white' },
  linear: { domain: 'linear.app', defaultColor: 'bg-indigo-600 text-white' },
  notion: { domain: 'notion.so', defaultColor: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' },
  supabase: { domain: 'supabase.com', defaultColor: 'bg-emerald-950 text-emerald-400' },
  gamma: { domain: 'gamma.app', defaultColor: 'bg-violet-600 text-white' },
  perplexity: { domain: 'perplexity.ai', defaultColor: 'bg-teal-900 text-teal-300' },
  midjourney: { domain: 'midjourney.com', defaultColor: 'bg-zinc-900 text-white' },
  ideogram: { domain: 'ideogram.ai', defaultColor: 'bg-zinc-900 text-white' },
  qodo: { domain: 'qodo.ai', defaultColor: 'bg-indigo-50 text-indigo-700' },
  google: { domain: 'workspace.google.com', defaultColor: 'bg-white text-zinc-800' },
  'google-workspace': { domain: 'workspace.google.com', defaultColor: 'bg-white text-zinc-800' },
  'google workspace': { domain: 'workspace.google.com', defaultColor: 'bg-white text-zinc-800' },
  gemini: { domain: 'gemini.google.com', defaultColor: 'bg-blue-600 text-white' },
  'google gemini': { domain: 'gemini.google.com', defaultColor: 'bg-blue-600 text-white' },
  openart: { domain: 'openart.ai', defaultColor: 'bg-blue-50 text-blue-600' },
  'openart ai': { domain: 'openart.ai', defaultColor: 'bg-blue-50 text-blue-600' },
  higgsfield: { domain: 'higgsfield.ai', defaultColor: 'bg-amber-100 text-amber-800' },
  'higgsfield ai': { domain: 'higgsfield.ai', defaultColor: 'bg-amber-100 text-amber-800' },
  blink: { domain: 'blink.new', defaultColor: 'bg-black text-white' },
  'blink.new': { domain: 'blink.new', defaultColor: 'bg-black text-white' },
  pixverse: { domain: 'pixverse.ai', defaultColor: 'bg-fuchsia-950 text-fuchsia-300' },
  'pixverse ai': { domain: 'pixverse.ai', defaultColor: 'bg-fuchsia-950 text-fuchsia-300' },
  'pixverse-ai': { domain: 'pixverse.ai', defaultColor: 'bg-fuchsia-950 text-fuchsia-300' },
  canva: { domain: 'canva.com', defaultColor: 'bg-cyan-600 text-white' },
  discord: { domain: 'discord.com', defaultColor: 'bg-indigo-600 text-white' },
  meta: { domain: 'meta.com', defaultColor: 'bg-blue-600 text-white' },
  'meta platforms': { domain: 'meta.com', defaultColor: 'bg-blue-600 text-white' },
  xai: { domain: 'x.ai', defaultColor: 'bg-black text-white' },
  aws: { domain: 'aws.amazon.com', defaultColor: 'bg-amber-500 text-white' },
  github: { domain: 'github.com', defaultColor: 'bg-zinc-900 text-white' },
  figma: { domain: 'figma.com', defaultColor: 'bg-black text-white' },
  vultr: { domain: 'vultr.com', defaultColor: 'bg-blue-600 text-white' },
  raycast: { domain: 'raycast.com', defaultColor: 'bg-red-600 text-white' },
  wispr: { domain: 'wisprflow.ai', defaultColor: 'bg-purple-600 text-white' },
  'wispr ai': { domain: 'wisprflow.ai', defaultColor: 'bg-purple-600 text-white' },
  magnific: { domain: 'magnific.ai', defaultColor: 'bg-pink-600 text-white' },
  'magnific ai': { domain: 'magnific.ai', defaultColor: 'bg-pink-600 text-white' },
  meshy: { domain: 'meshy.ai', defaultColor: 'bg-emerald-600 text-white' },
  'meshy ai': { domain: 'meshy.ai', defaultColor: 'bg-emerald-600 text-white' },
  base44: { domain: 'base44.com', defaultColor: 'bg-zinc-800 text-white' },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandSlug = '',
  brandName = '',
  domain,
  logoUrl,
  initials,
  colorClass,
  size = 'md',
  className,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const normalizedSlug = brandSlug.toLowerCase().trim();
  const brandInfo = BRAND_DOMAINS[normalizedSlug] || BRAND_DOMAINS[brandName.toLowerCase().trim()] || null;
  const targetDomain = domain || brandInfo?.domain || `${normalizedSlug}.com`;

  // Real high-res official favicon image URL from Google S2 API
  const computedImageUrl =
    logoUrl ||
    (targetDomain
      ? `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128`
      : null);

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px] rounded-lg',
    sm: 'h-8 w-8 text-xs rounded-xl',
    md: 'h-10 w-10 sm:h-11 sm:w-11 text-sm rounded-xl',
    lg: 'h-12 w-12 sm:h-14 sm:w-14 text-base rounded-2xl',
    xl: 'h-16 w-16 text-lg rounded-2xl',
  };

  const imgSizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6 sm:h-7 sm:w-7',
    lg: 'h-8 w-8 sm:h-9 sm:w-9',
    xl: 'h-10 w-10',
  };

  const computedInitials =
    initials ||
    (brandName
      ? brandName
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : normalizedSlug.slice(0, 2).toUpperCase() || 'CP');

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-white dark:bg-zinc-900 select-none shadow-2xs transition-transform group-hover:scale-105',
        sizeClasses[size],
        className
      )}
    >
      {computedImageUrl && !imageFailed ? (
        <img
          src={computedImageUrl}
          alt={`${brandName || 'Brand'} logo`}
          className={cn('object-contain', imgSizes[size])}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className={cn(
            'flex h-full w-full items-center justify-center font-display font-black tracking-tight',
            colorClass || brandInfo?.defaultColor || 'bg-blue-600 text-white'
          )}
        >
          {computedInitials}
        </span>
      )}
    </div>
  );
};
