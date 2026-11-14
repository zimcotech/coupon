import React from 'react';
import {
  Bot,
  Cloud,
  Terminal,
  Palette,
  TrendingUp,
  GraduationCap,
  Shield,
  Database,
  Tag,
  Zap,
} from 'lucide-react';
import { cn } from './ui/shadcn';

export interface CategoryBadgeConfig {
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  borderClass: string;
  label: string;
}

export function getCategoryBadgeConfig(categorySlug: string): CategoryBadgeConfig {
  switch (categorySlug) {
    case 'ai-tools':
      return {
        icon: Bot,
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        borderClass: 'border-emerald-200/80 dark:border-emerald-800/80',
        label: 'AI Tools',
      };
    case 'cloud-hosting':
      return {
        icon: Cloud,
        bgClass: 'bg-sky-50 dark:bg-sky-950/60',
        textClass: 'text-sky-700 dark:text-sky-300',
        borderClass: 'border-sky-200/80 dark:border-sky-800/80',
        label: 'Cloud & Hosting',
      };
    case 'dev-tools':
      return {
        icon: Terminal,
        bgClass: 'bg-purple-50 dark:bg-purple-950/60',
        textClass: 'text-purple-700 dark:text-purple-300',
        borderClass: 'border-purple-200/80 dark:border-purple-800/80',
        label: 'Dev Tools',
      };
    case 'design-creative':
      return {
        icon: Palette,
        bgClass: 'bg-pink-50 dark:bg-pink-950/60',
        textClass: 'text-pink-700 dark:text-pink-300',
        borderClass: 'border-pink-200/80 dark:border-pink-800/80',
        label: 'Design',
      };
    case 'productivity':
      return {
        icon: TrendingUp,
        bgClass: 'bg-amber-50 dark:bg-amber-950/60',
        textClass: 'text-amber-700 dark:text-amber-300',
        borderClass: 'border-amber-200/80 dark:border-amber-800/80',
        label: 'Productivity',
      };
    case 'student-startup':
      return {
        icon: GraduationCap,
        bgClass: 'bg-teal-50 dark:bg-teal-950/60',
        textClass: 'text-teal-700 dark:text-teal-300',
        borderClass: 'border-teal-200/80 dark:border-teal-800/80',
        label: 'Student Packs',
      };
    case 'security-vpn':
      return {
        icon: Shield,
        bgClass: 'bg-indigo-50 dark:bg-indigo-950/60',
        textClass: 'text-indigo-700 dark:text-indigo-300',
        borderClass: 'border-indigo-200/80 dark:border-indigo-800/80',
        label: 'Security & VPN',
      };
    case 'data-analytics':
      return {
        icon: Database,
        bgClass: 'bg-blue-50 dark:bg-blue-950/60',
        textClass: 'text-blue-700 dark:text-blue-300',
        borderClass: 'border-blue-200/80 dark:border-blue-800/80',
        label: 'Data & Analytics',
      };
    default:
      return {
        icon: Tag,
        bgClass: 'bg-slate-100 dark:bg-slate-800',
        textClass: 'text-slate-700 dark:text-slate-300',
        borderClass: 'border-slate-200/80 dark:border-slate-700',
        label: 'General Deal',
      };
  }
}

interface CategoryBadgeProps {
  categorySlug: string;
  categoryName?: string;
  size?: 'xs' | 'sm' | 'md';
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categorySlug,
  categoryName,
  size = 'xs',
  onClick,
  className,
}) => {
  const config = getCategoryBadgeConfig(categorySlug);
  const Icon = config.icon;
  const label = categoryName || config.label;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] gap-1',
    sm: 'px-2.5 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-xs gap-1.5',
  }[size];

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  }[size];

  const content = (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border shrink-0 whitespace-nowrap select-none',
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeClasses,
        onClick && 'hover:opacity-85 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Icon className={cn(iconSizes, 'shrink-0')} />
      <span>{label}</span>
    </span>
  );

  return content;
};
