import React from 'react';
import { cn } from './ui/shadcn';

export function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.48 1.34 5L2 22l5.14-1.34c1.47.8 3.14 1.34 4.9 1.34 5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.83 14.28c-.24.69-1.21 1.33-1.87 1.42-.48.06-1.1.09-3.23-.79-2.58-1.07-4.22-3.71-4.35-3.88-.13-.17-1.04-1.39-1.04-2.65 0-1.26.66-1.88.89-2.13.23-.26.51-.32.68-.32.17 0 .34 0 .49.01.16.01.37-.06.58.44.22.52.74 1.82.81 1.95.07.13.11.29.02.46-.09.17-.13.28-.26.43-.13.15-.28.34-.4.46-.13.13-.27.28-.12.54.15.26.68 1.12 1.46 1.81 1 .89 1.84 1.17 2.1 1.3.26.13.41.11.56-.06.15-.17.65-.76.82-1.02.17-.26.35-.22.58-.13.24.09 1.5.71 1.76.84.26.13.43.19.49.3.07.12.07.68-.17 1.37z" />
    </svg>
  );
}

export function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function TelegramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
    </svg>
  );
}

export function GmailIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export interface ContactChannelItem {
  id: 'whatsapp' | 'facebook' | 'telegram' | 'gmail';
  name: string;
  label: string;
  handle: string;
  url: string;
  description: string;
  badge: string;
  colorClass: string;
  hoverClass: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

export const CONTACT_CHANNELS: ContactChannelItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    label: 'Chat on WhatsApp',
    handle: '+1 (555) 234-DEAL',
    url: 'https://wa.me/?text=Hello%20Couponify!%20I%20have%20an%20inquiry%20regarding%20a%20promo%20code.',
    description: 'Instant support, urgent broken code reports, and fast partner chat.',
    badge: 'Fastest Reply',
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300',
    hoverClass: 'hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/60',
    icon: WhatsAppIcon,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    label: 'Couponify Page',
    handle: 'facebook.com/couponify',
    url: 'https://facebook.com/couponify',
    description: 'Official community page, product announcements, and Messenger support.',
    badge: 'Community',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-300',
    hoverClass: 'hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/60',
    icon: FacebookIcon,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    label: 'Couponify Deals Channel',
    handle: '@couponify_deals',
    url: 'https://t.me/couponify_deals',
    description: 'Direct messaging, real-time SaaS flash drops, and deal alerts.',
    badge: 'Live Alerts',
    colorClass: 'bg-sky-50 text-sky-700 border-sky-500/20 dark:bg-sky-950/40 dark:text-sky-300',
    hoverClass: 'hover:border-sky-500 hover:bg-sky-50/60 dark:hover:bg-sky-950/60',
    icon: TelegramIcon,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    label: 'Official Support Inbox',
    handle: 'susankufakunesu@gmail.com',
    url: 'mailto:susankufakunesu@gmail.com?subject=Couponify%20Inquiry',
    description: 'Official email desk for brand partnerships, verification, and press.',
    badge: 'Direct Inbox',
    colorClass: 'bg-rose-50 text-rose-700 border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-300',
    hoverClass: 'hover:border-rose-500 hover:bg-rose-50/60 dark:hover:bg-rose-950/60',
    icon: GmailIcon,
  },
];
