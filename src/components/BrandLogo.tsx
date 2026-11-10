import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './ui/shadcn';

export interface BrandLogoProps {
  brandSlug?: string;
  brandName?: string;
  domain?: string;
  logoUrl?: string;
  initials?: string;
  colorClass?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  borderless?: boolean;
  eager?: boolean;
  showSkeleton?: boolean;
  alt?: string;
  onLoadComplete?: () => void;
}

// Global in-memory cache of already resolved & successfully loaded logo URLs
// Prevents skeleton flashing on revisit or repeat renders across components
const LOADED_LOGO_CACHE = new Set<string>();

export function clearLogoCache() {
  LOADED_LOGO_CACHE.clear();
}

// Map slugs / names to domain, official external logo asset, and fallback color
const BRAND_DOMAINS: Record<string, { domain: string; defaultColor: string; logoUrl?: string }> = {
  openai: {
    domain: 'openai.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23111827' d='M41.8 19.3a11.9 11.9 0 0 0-.9-9.1 12 12 0 0 0-12.8-5.7 11.9 11.9 0 0 0-9.1-3.9 12 12 0 0 0-11.5 6.3 11.9 11.9 0 0 0-3.8 9.1c0 2 .5 4 1.5 5.7a11.9 11.9 0 0 0 .9 9.1 12 12 0 0 0 12.8 5.7 11.9 11.9 0 0 0 9.1 3.9 12 12 0 0 0 11.5-6.3 11.9 11.9 0 0 0 3.8-9.1c0-2-.5-4-1.5-5.7zm-14.7 20.3a9.6 9.6 0 0 1-5.7-1.9l.3-.8 4.7-2.7a1.2 1.2 0 0 0 .6-1V24.8l2.9 1.7v7.6a9.5 9.5 0 0 1-2.8 5.5zm-14.5-6.5a9.6 9.6 0 0 1-1.9-5.7c0-.3 0-.5.1-.8l.8.3 4.7 2.7a1.2 1.2 0 0 0 1.2 0l7.3-4.2v3.4l-6.6 3.8a9.6 9.6 0 0 1-5.6.5zm-3.1-15.5a9.6 9.6 0 0 1 3.8-3.8l.5.7 4.7 2.7a1.2 1.2 0 0 0 1.2 0L27 13v3.4l-6.6 3.8a1.2 1.2 0 0 0-.6 1v8.4l-2.9-1.7v-7.6a9.6 9.6 0 0 1-7.4-4.6zm23.5-3.8l-7.3 4.2V14.6l6.6-3.8a9.6 9.6 0 0 1 5.6-.5 9.6 9.6 0 0 1 1.9 5.7c0 .3 0 .5-.1.8l-.8-.3-4.7-2.7a1.2 1.2 0 0 0-1.2 0zm5.9 10.1c0 .3 0 .5-.1.8l-.5-.7-4.7-2.7a1.2 1.2 0 0 0-1.2 0L21 27.8v-3.4l6.6-3.8a1.2 1.2 0 0 0 .6-1V11.2l2.9 1.7v7.6a9.6 9.6 0 0 1 3.9 3.8zm-17.5 4.3l3.6-2.1 3.6 2.1v4.2l-3.6 2.1-3.6-2.1v-4.2z'/%3E%3C/svg%3E",
    defaultColor: 'bg-zinc-900 text-white'
  },
  chatgpt: {
    domain: 'openai.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%2310A37F'/%3E%3Cpath fill='%23FFFFFF' d='M37.8 21.3a9.9 9.9 0 0 0-.8-7.6 10 10 0 0 0-10.7-4.8 9.9 9.9 0 0 0-7.6-3.3 10 10 0 0 0-9.6 5.3 9.9 9.9 0 0 0-3.2 7.6c0 1.7.4 3.3 1.3 4.8a9.9 9.9 0 0 0 .8 7.6 10 10 0 0 0 10.7 4.8 9.9 9.9 0 0 0 7.6 3.3 10 10 0 0 0 9.6-5.3 9.9 9.9 0 0 0 3.2-7.6c0-1.7-.4-3.3-1.3-4.8zm-12.3 17a8 8 0 0 1-4.8-1.6l.3-.7 3.9-2.3c.3-.2.5-.5.5-.8V25l2.4 1.4v6.3a8 8 0 0 1-2.3 4.6zm-12.1-5.4a8 8 0 0 1-1.6-4.8c0-.3 0-.4.1-.7l.7.3 3.9 2.3c.3.2.7.2 1 0l6.1-3.5v2.8l-5.5 3.2a8 8 0 0 1-4.7.4zm-2.6-13a8 8 0 0 1 3.2-3.2l.4.6 3.9 2.3c.3.2.7.2 1 0l6.1-3.5v2.8l-5.5 3.2c-.3.2-.5.5-.5.8v7l-2.4-1.4v-6.3a8 8 0 0 1-6.2-3.9zm19.6-3.2l-6.1 3.5V17.4l5.5-3.2a8 8 0 0 1 4.7-.4 8 8 0 0 1 1.6 4.8c0 .3 0 .4-.1.7l-.7-.3-3.9-2.3c-.3-.2-.7-.2-1 0zm4.9 8.5c0 .3 0 .4-.1.7l-.4-.6-3.9-2.3c-.3-.2-.7-.2-1 0L21.7 28.3v-2.8l5.5-3.2c.3-.2.5-.5.5-.8v-7l2.4 1.4v6.3a8 8 0 0 1 3.3 3.2zm-14.6 3.6l3-1.8 3 1.8v3.5l-3 1.8-3-1.8v-3.5z'/%3E%3C/svg%3E",
    defaultColor: 'bg-emerald-600 text-white'
  },
  digitalocean: { domain: 'digitalocean.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg', defaultColor: 'bg-blue-600 text-white' },
  cloudways: {
    domain: 'cloudways.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%231E293B'/%3E%3Cpath d='M33 27a4.5 4.5 0 0 0-1.8-8.6A6.8 6.8 0 0 0 18.8 21 5.3 5.3 0 0 0 15 27c0 2.9 2.4 5.3 5.3 5.3h12.7c2.5 0 4.5-2 4.5-4.5 0-.3 0-.6-.1-.8H33z' fill='none' stroke='white' stroke-width='3.2' stroke-linejoin='round'/%3E%3Cpath d='M21 25.5h6' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",
    defaultColor: 'bg-slate-900 text-white'
  },
  upcloud: {
    domain: 'upcloud.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%237C3AED'/%3E%3Cpath d='M33.5 28a4.5 4.5 0 0 0-1.8-8.6A6.8 6.8 0 0 0 19.3 22 5.3 5.3 0 0 0 15.5 28c0 2.9 2.4 5.3 5.3 5.3h12.7c2.5 0 4.5-2 4.5-4.5 0-.3 0-.6-.1-.8H33.5z' fill='white'/%3E%3C/svg%3E",
    defaultColor: 'bg-purple-600 text-white'
  },
  elevenlabs: { domain: 'elevenlabs.io', logoUrl: 'https://elevenlabs.io/favicon.ico', defaultColor: 'bg-indigo-600 text-white' },
  cursor: { domain: 'cursor.com', logoUrl: 'https://cursor.com/favicon.ico', defaultColor: 'bg-zinc-900 text-white' },
  vercel: { domain: 'vercel.com', logoUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico', defaultColor: 'bg-black text-white' },
  linear: { domain: 'linear.app', logoUrl: 'https://linear.app/favicon.ico', defaultColor: 'bg-indigo-600 text-white' },
  notion: { domain: 'notion.so', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg', defaultColor: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white' },
  supabase: { domain: 'supabase.com', logoUrl: 'https://supabase.com/brand-assets/supabase-logo-icon.svg', defaultColor: 'bg-emerald-950 text-emerald-400' },
  gamma: { domain: 'gamma.app', logoUrl: 'https://gamma.app/favicon.ico', defaultColor: 'bg-violet-600 text-white' },
  perplexity: { domain: 'perplexity.ai', logoUrl: 'https://www.perplexity.ai/favicon.ico', defaultColor: 'bg-teal-900 text-teal-300' },
  midjourney: { domain: 'midjourney.com', logoUrl: 'https://www.midjourney.com/favicon.ico', defaultColor: 'bg-zinc-900 text-white' },
  ideogram: { domain: 'ideogram.ai', logoUrl: 'https://ideogram.ai/favicon.ico', defaultColor: 'bg-zinc-900 text-white' },
  qodo: { domain: 'qodo.ai', logoUrl: 'https://qodo.ai/favicon.ico', defaultColor: 'bg-indigo-50 text-indigo-700' },
  google: {
    domain: 'workspace.google.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M47.5 24.5c0-1.4-.1-2.8-.4-4.1H24v8.2h13.2c-.6 3.1-2.3 5.7-4.8 7.4v6.1h7.8c4.5-4.2 7.3-10.4 7.3-17.6z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.5 0 11.9-2.2 15.9-5.9l-7.8-6.1c-2.2 1.5-4.9 2.4-8.1 2.4-6.2 0-11.5-4.2-13.4-9.9H2.5v6.3C6.5 42.7 14.7 48 24 48z'/%3E%3Cpath fill='%23FBBC05' d='M10.6 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5v-6.3H2.5C.9 16.3 0 20 0 24s.9 7.7 2.5 10.8l8.1-6.3z'/%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.3c1.9-5.7 7.2-10 13.4-10z'/%3E%3C/svg%3E",
    defaultColor: 'bg-white text-zinc-800'
  },
  'google-workspace': {
    domain: 'workspace.google.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M47.5 24.5c0-1.4-.1-2.8-.4-4.1H24v8.2h13.2c-.6 3.1-2.3 5.7-4.8 7.4v6.1h7.8c4.5-4.2 7.3-10.4 7.3-17.6z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.5 0 11.9-2.2 15.9-5.9l-7.8-6.1c-2.2 1.5-4.9 2.4-8.1 2.4-6.2 0-11.5-4.2-13.4-9.9H2.5v6.3C6.5 42.7 14.7 48 24 48z'/%3E%3Cpath fill='%23FBBC05' d='M10.6 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5v-6.3H2.5C.9 16.3 0 20 0 24s.9 7.7 2.5 10.8l8.1-6.3z'/%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.3c1.9-5.7 7.2-10 13.4-10z'/%3E%3C/svg%3E",
    defaultColor: 'bg-white text-zinc-800'
  },
  'google workspace': {
    domain: 'workspace.google.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M47.5 24.5c0-1.4-.1-2.8-.4-4.1H24v8.2h13.2c-.6 3.1-2.3 5.7-4.8 7.4v6.1h7.8c4.5-4.2 7.3-10.4 7.3-17.6z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.5 0 11.9-2.2 15.9-5.9l-7.8-6.1c-2.2 1.5-4.9 2.4-8.1 2.4-6.2 0-11.5-4.2-13.4-9.9H2.5v6.3C6.5 42.7 14.7 48 24 48z'/%3E%3Cpath fill='%23FBBC05' d='M10.6 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5v-6.3H2.5C.9 16.3 0 20 0 24s.9 7.7 2.5 10.8l8.1-6.3z'/%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.3c1.9-5.7 7.2-10 13.4-10z'/%3E%3C/svg%3E",
    defaultColor: 'bg-white text-zinc-800'
  },
  gemini: { domain: 'gemini.google.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', defaultColor: 'bg-blue-600 text-white' },
  'google gemini': { domain: 'gemini.google.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', defaultColor: 'bg-blue-600 text-white' },
  openart: {
    domain: 'openart.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M14 16c-4.4 0-8 3.6-8 8s3.6 8 8 8c5.6 0 8-6.4 10-9.6 2-3.2 4.4-6.4 10-6.4 4.4 0 8 3.6 8 8s-3.6 8-8 8c-5.6 0-8-6.4-10-9.6-2-3.2-4.4-6.4-10-6.4z' fill='none' stroke='%23000000' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
    defaultColor: 'bg-white text-black'
  },
  'openart ai': {
    domain: 'openart.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M14 16c-4.4 0-8 3.6-8 8s3.6 8 8 8c5.6 0 8-6.4 10-9.6 2-3.2 4.4-6.4 10-6.4 4.4 0 8 3.6 8 8s-3.6 8-8 8c-5.6 0-8-6.4-10-9.6-2-3.2-4.4-6.4-10-6.4z' fill='none' stroke='%23000000' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
    defaultColor: 'bg-white text-black'
  },
  higgsfield: {
    domain: 'higgsfield.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23D5F938'/%3E%3Cpath d='M17 31c-2.2-2.2-2.2-5.8 0-8l7-7c2.2-2.2 5.8-2.2 8 0s2.2 5.8 0 8l-7 7c-2.2 2.2-5.8 2.2-8 0z' fill='none' stroke='%23000000' stroke-width='3.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M21 20l6 6' stroke='%23000000' stroke-width='3.5' stroke-linecap='round'/%3E%3C/svg%3E",
    defaultColor: 'bg-lime-300 text-black'
  },
  'higgsfield ai': {
    domain: 'higgsfield.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23D5F938'/%3E%3Cpath d='M17 31c-2.2-2.2-2.2-5.8 0-8l7-7c2.2-2.2 5.8-2.2 8 0s2.2 5.8 0 8l-7 7c-2.2 2.2-5.8 2.2-8 0z' fill='none' stroke='%23000000' stroke-width='3.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M21 20l6 6' stroke='%23000000' stroke-width='3.5' stroke-linecap='round'/%3E%3C/svg%3E",
    defaultColor: 'bg-lime-300 text-black'
  },
  blink: {
    domain: 'blink.new',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23000000'/%3E%3Ctext x='24' y='32.5' text-anchor='middle' fill='%23FFFFFF' font-family='system-ui, -apple-system, sans-serif' font-weight='800' font-size='24'%3EB%3C/text%3E%3C/svg%3E",
    defaultColor: 'bg-black text-white'
  },
  'blink.new': {
    domain: 'blink.new',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23000000'/%3E%3Ctext x='24' y='32.5' text-anchor='middle' fill='%23FFFFFF' font-family='system-ui, -apple-system, sans-serif' font-weight='800' font-size='24'%3EB%3C/text%3E%3C/svg%3E",
    defaultColor: 'bg-black text-white'
  },
  pixverse: {
    domain: 'pixverse.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='14' fill='%23191124'/%3E%3Cpath d='M15 15a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v10a12 12 0 0 1-12 12h-2a4 4 0 0 1-4-4V15z' fill='%237C3AED'/%3E%3Cpath d='M25 18a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v6a9 9 0 0 1-9 9h-1v-15z' fill='%23FF5E62'/%3E%3C/svg%3E",
    defaultColor: 'bg-fuchsia-950 text-fuchsia-300'
  },
  'pixverse ai': {
    domain: 'pixverse.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='14' fill='%23191124'/%3E%3Cpath d='M15 15a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v10a12 12 0 0 1-12 12h-2a4 4 0 0 1-4-4V15z' fill='%237C3AED'/%3E%3Cpath d='M25 18a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v6a9 9 0 0 1-9 9h-1v-15z' fill='%23FF5E62'/%3E%3C/svg%3E",
    defaultColor: 'bg-fuchsia-950 text-fuchsia-300'
  },
  'pixverse-ai': {
    domain: 'pixverse.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='14' fill='%23191124'/%3E%3Cpath d='M15 15a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v10a12 12 0 0 1-12 12h-2a4 4 0 0 1-4-4V15z' fill='%237C3AED'/%3E%3Cpath d='M25 18a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v6a9 9 0 0 1-9 9h-1v-15z' fill='%23FF5E62'/%3E%3C/svg%3E",
    defaultColor: 'bg-fuchsia-950 text-fuchsia-300'
  },
  canva: { domain: 'canva.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg', defaultColor: 'bg-cyan-600 text-white' },
  discord: { domain: 'discord.com', logoUrl: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png', defaultColor: 'bg-indigo-600 text-white' },
  meta: { domain: 'meta.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', defaultColor: 'bg-blue-600 text-white' },
  'meta platforms': { domain: 'meta.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', defaultColor: 'bg-blue-600 text-white' },
  xai: { domain: 'x.ai', logoUrl: 'https://x.ai/favicon.ico', defaultColor: 'bg-black text-white' },
  aws: { domain: 'aws.amazon.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', defaultColor: 'bg-amber-500 text-white' },
  github: { domain: 'github.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', defaultColor: 'bg-zinc-900 text-white' },
  figma: { domain: 'figma.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', defaultColor: 'bg-black text-white' },
  vultr: {
    domain: 'vultr.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%23001844'/%3E%3Cpath d='M13 15l11 19 11-19h-6.5l-4.5 8-4.5-8H13z' fill='white'/%3E%3Cpath d='M13 15l11 19h-5.5L13 15z' fill='%23007BFC'/%3E%3C/svg%3E",
    defaultColor: 'bg-blue-900 text-white',
  },
  veed: {
    domain: 'veed.io',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%238FF000'/%3E%3Cpath d='M14 15h6.5l3.5 14.5 3.5-14.5H34l-6.8 19.5h-6.4L14 15z' fill='%23000000'/%3E%3C/svg%3E",
    defaultColor: 'bg-lime-400 text-black',
  },
  'veed.io': {
    domain: 'veed.io',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%238FF000'/%3E%3Cpath d='M14 15h6.5l3.5 14.5 3.5-14.5H34l-6.8 19.5h-6.4L14 15z' fill='%23000000'/%3E%3C/svg%3E",
    defaultColor: 'bg-lime-400 text-black',
  },
  gearup: {
    domain: 'gearupbooster.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%230B101D'/%3E%3Cpath d='M24 9l13 29-13-7-13 7 13-29z' fill='%230044CC'/%3E%3Cpath d='M24 9l13 29-13-7V9z' fill='%2300E5FF'/%3E%3Cpath d='M24 9l-13 29 13-7V9z' fill='%232979FF'/%3E%3C/svg%3E",
    defaultColor: 'bg-slate-950 text-cyan-400',
  },
  'gearup booster': {
    domain: 'gearupbooster.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%230B101D'/%3E%3Cpath d='M24 9l13 29-13-7-13 7 13-29z' fill='%230044CC'/%3E%3Cpath d='M24 9l13 29-13-7V9z' fill='%2300E5FF'/%3E%3Cpath d='M24 9l-13 29 13-7V9z' fill='%232979FF'/%3E%3C/svg%3E",
    defaultColor: 'bg-slate-950 text-cyan-400',
  },
  'gearup-booster': {
    domain: 'gearupbooster.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%230B101D'/%3E%3Cpath d='M24 9l13 29-13-7-13 7 13-29z' fill='%230044CC'/%3E%3Cpath d='M24 9l13 29-13-7V9z' fill='%2300E5FF'/%3E%3Cpath d='M24 9l-13 29 13-7V9z' fill='%232979FF'/%3E%3C/svg%3E",
    defaultColor: 'bg-slate-950 text-cyan-400',
  },
  raycast: { domain: 'raycast.com', logoUrl: 'https://www.raycast.com/favicon.ico', defaultColor: 'bg-red-600 text-white' },
  wispr: { domain: 'wisprflow.ai', logoUrl: 'https://wisprflow.ai/favicon.ico', defaultColor: 'bg-purple-600 text-white' },
  'wispr ai': { domain: 'wisprflow.ai', logoUrl: 'https://wisprflow.ai/favicon.ico', defaultColor: 'bg-purple-600 text-white' },
  magnific: { domain: 'magnific.ai', logoUrl: 'https://magnific.ai/favicon.ico', defaultColor: 'bg-pink-600 text-white' },
  'magnific ai': { domain: 'magnific.ai', logoUrl: 'https://magnific.ai/favicon.ico', defaultColor: 'bg-pink-600 text-white' },
  meshy: { domain: 'meshy.ai', logoUrl: 'https://meshy.ai/favicon.ico', defaultColor: 'bg-emerald-600 text-white' },
  'meshy ai': { domain: 'meshy.ai', logoUrl: 'https://meshy.ai/favicon.ico', defaultColor: 'bg-emerald-600 text-white' },
  base44: { domain: 'base44.com', logoUrl: 'https://base44.com/favicon.ico', defaultColor: 'bg-zinc-800 text-white' },
  videogen: {
    domain: 'videogen.io',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%23FF3B30'/%3E%3Cpath d='M14 18c0-1.1.9-2 2-2h11c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H16c-1.1 0-2-.9-2-2V18z' fill='white'/%3E%3Cpath d='M29 21.5l6.5-4.2c.6-.4 1.5 0 1.5.8v11.8c0 .8-.9 1.2-1.5.8l-6.5-4.2v-5z' fill='white'/%3E%3Ccircle cx='18.5' cy='24' r='2' fill='%23FF3B30'/%3E%3Ccircle cx='23.5' cy='24' r='2' fill='%23FF3B30'/%3E%3C/svg%3E",
    defaultColor: 'bg-red-500 text-white',
  },
  'video gen': {
    domain: 'videogen.io',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='12' fill='%23FF3B30'/%3E%3Cpath d='M14 18c0-1.1.9-2 2-2h11c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H16c-1.1 0-2-.9-2-2V18z' fill='white'/%3E%3Cpath d='M29 21.5l6.5-4.2c.6-.4 1.5 0 1.5.8v11.8c0 .8-.9 1.2-1.5.8l-6.5-4.2v-5z' fill='white'/%3E%3Ccircle cx='18.5' cy='24' r='2' fill='%23FF3B30'/%3E%3Ccircle cx='23.5' cy='24' r='2' fill='%23FF3B30'/%3E%3C/svg%3E",
    defaultColor: 'bg-red-500 text-white',
  },
  'google-cloud': {
    domain: 'cloud.google.com',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 13.5c-4.2 0-7.8 2.6-9.3 6.4 1.3-.6 2.7-.9 4.3-.9 5.2 0 9.5 3.8 10.3 8.8.8-.5 1.7-.8 2.7-.8 2.8 0 5 2.2 5 5 0 .3 0 .6-.1.8 3.5-.8 6.1-3.9 6.1-7.6 0-4.4-3.6-8-8-8-1.5 0-2.8.4-4 1.1-1.7-2.9-4.8-4.8-7-4.8z'/%3E%3Cpath fill='%234285F4' d='M19 19c-5.5 0-10 4.5-10 10 0 5.2 4 9.4 9.1 9.9.5-1.4 1.4-2.6 2.6-3.4-3.4-.6-6-3.5-6-7.1 0-4 3.2-7.2 7.2-7.2 1.3 0 2.5.3 3.6 1 .3-1.8 1.4-3.2 2.9-4.1-2.4-.7-4.9-1.1-6.4-1.1z'/%3E%3Cpath fill='%2334A853' d='M37 32c0-2.8-2.2-5-5-5-1 0-1.9.3-2.7.8-.8-5-5.1-8.8-10.3-8.8-1.6 0-3 .3-4.3.9 1.4 2.8 4.3 4.8 7.6 5.1 1.2.1 2.3.6 3.1 1.4 1.4 1.4 2.3 3.3 2.3 5.6H37z'/%3E%3Cpath fill='%23FBBC05' d='M27.7 32c0-2.3-.9-4.2-2.3-5.6-.8-.8-1.9-1.3-3.1-1.4-3.3-.3-6.2-2.3-7.6-5.1-1.5.9-2.6 2.3-2.9 4.1 1.2.7 2.1 1.9 2.5 3.3 1.1.2 2.1.8 2.8 1.6 1.3 1.3 2.1 3.1 2.1 5.1h8.5z'/%3E%3C/svg%3E",
    defaultColor: 'bg-white text-blue-600',
  },
  'inception-labs': {
    domain: 'inceptionlabs.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='10' fill='%23111827'/%3E%3Crect x='14' y='14' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='29' y='14' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='14' y='29' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='29' y='29' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='21.5' y='12' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='21.5' y='31' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='12' y='21.5' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='31' y='21.5' width='5' height='5' rx='1' fill='white'/%3E%3Ccircle cx='24' cy='24' r='3.5' fill='white'/%3E%3C/svg%3E",
    defaultColor: 'bg-zinc-950 text-white',
  },
  inceptionlabs: {
    domain: 'inceptionlabs.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='10' fill='%23111827'/%3E%3Crect x='14' y='14' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='29' y='14' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='14' y='29' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='29' y='29' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='21.5' y='12' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='21.5' y='31' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='12' y='21.5' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='31' y='21.5' width='5' height='5' rx='1' fill='white'/%3E%3Ccircle cx='24' cy='24' r='3.5' fill='white'/%3E%3C/svg%3E",
    defaultColor: 'bg-zinc-950 text-white',
  },
  'beautiful-ai': {
    domain: 'beautiful.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%230E2738'/%3E%3Ctext x='13' y='32' font-family='system-ui, -apple-system, sans-serif' font-size='24' font-weight='800' fill='white'%3Eb.%3C/text%3E%3C/svg%3E",
    defaultColor: 'bg-slate-900 text-white',
  },
  'beautiful.ai': {
    domain: 'beautiful.ai',
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%230E2738'/%3E%3Ctext x='13' y='32' font-family='system-ui, -apple-system, sans-serif' font-size='24' font-weight='800' fill='white'%3Eb.%3C/text%3E%3C/svg%3E",
    defaultColor: 'bg-slate-900 text-white',
  },
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
  borderless = false,
  eager = false,
  showSkeleton = true,
  alt,
  onLoadComplete,
}) => {
  const normalizedSlug = brandSlug.toLowerCase().trim();
  const brandInfo =
    BRAND_DOMAINS[normalizedSlug] ||
    BRAND_DOMAINS[brandName.toLowerCase().trim()] ||
    null;
  const targetDomain = domain || brandInfo?.domain || (normalizedSlug ? `${normalizedSlug}.com` : '');

  // High-resolution target image URL
  const computedImageUrl =
    logoUrl ||
    brandInfo?.logoUrl ||
    (targetDomain
      ? `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128`
      : null);

  // Progressive low-res micro-placeholder (loads near-instantaneously for domain favicons)
  const lowResPlaceholderUrl =
    targetDomain && !logoUrl && !brandInfo?.logoUrl
      ? `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=16`
      : null;

  // Track state: 'loading' | 'loaded' | 'error'
  const isInitiallyCached = computedImageUrl ? LOADED_LOGO_CACHE.has(computedImageUrl) : false;
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() => {
    if (!computedImageUrl) return 'error';
    if (isInitiallyCached) return 'loaded';
    return 'loading';
  });

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync state when computedImageUrl changes or mounts
  useEffect(() => {
    if (!computedImageUrl) {
      setStatus('error');
      return;
    }

    if (LOADED_LOGO_CACHE.has(computedImageUrl)) {
      setStatus('loaded');
      return;
    }

    // Check if the DOM image is already complete (e.g. from browser memory cache)
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        LOADED_LOGO_CACHE.add(computedImageUrl);
        setStatus('loaded');
        onLoadComplete?.();
      } else {
        setStatus('error');
      }
    } else {
      setStatus('loading');
    }
  }, [computedImageUrl, onLoadComplete]);

  const handleImageLoad = () => {
    if (computedImageUrl) {
      LOADED_LOGO_CACHE.add(computedImageUrl);
    }
    setStatus('loaded');
    onLoadComplete?.();
  };

  const handleImageError = () => {
    setStatus('error');
  };

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

  const ghostIconSizes = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
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

  const isLoaded = status === 'loaded';
  const isError = status === 'error';
  const isLoading = status === 'loading';
  const accessibleAlt = alt || `${brandName || 'Brand'} logo`;

  return (
    <motion.div
      role="img"
      aria-label={accessibleAlt}
      aria-busy={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none',
        borderless
          ? 'border-0 bg-transparent shadow-none rounded-none'
          : 'rounded-xl border border-border/80 bg-white dark:bg-zinc-900 shadow-2xs',
        sizeClasses[size],
        className
      )}
    >
      {/* 1. Typographic Monogram Fallback Layer (Displayed if image fails or is absent) */}
      <AnimatePresence>
        {isError && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-hidden={!isError}
            className={cn(
              'absolute inset-0 flex h-full w-full items-center justify-center font-display font-black tracking-tight select-none',
              colorClass || brandInfo?.defaultColor || 'bg-blue-600 text-white'
            )}
          >
            {computedInitials}
          </motion.span>
        )}
      </AnimatePresence>

      {/* 2. Progressive Low-Resolution Backdrop Preview (Visible during progressive fetch) */}
      {lowResPlaceholderUrl && !isError && (
        <img
          src={lowResPlaceholderUrl}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 m-auto object-contain filter blur-xs transition-opacity duration-300 pointer-events-none',
            imgSizes[size],
            isLoaded ? 'opacity-0' : 'opacity-35'
          )}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      )}

      {/* 3. Skeleton Screen Transition Layer (Shimmer sweep wave with animated pulse) */}
      <AnimatePresence>
        {showSkeleton && isLoading && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute inset-0 z-10 flex items-center justify-center skeleton-shimmer"
          >
            {/* Subtle ghost geometric silhouette representing incoming brand asset */}
            <motion.div
              animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.97, 1.03, 0.97] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className={cn(
                'rounded-md bg-slate-400/20 dark:bg-slate-500/25',
                ghostIconSizes[size]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Progressive High-Resolution Image Layer */}
      {computedImageUrl && !isError && (
        <motion.img
          ref={imgRef}
          src={computedImageUrl}
          alt={accessibleAlt}
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(4px)' }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 0.88,
            filter: isLoaded ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative z-20 object-contain',
            borderless ? 'h-full w-full' : imgSizes[size]
          )}
          referrerPolicy="no-referrer"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </motion.div>
  );
};
