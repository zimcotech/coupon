import React from 'react';
import {
  Flame,
  Layers,
  CheckCircle2,
  Eye,
  MousePointerClick,
  KeyRound,
  ArrowUpRight,
} from 'lucide-react';
import { Card, Badge, Button } from './ui/shadcn';
import { BrandLogo } from './BrandLogo';
import { Deal } from '../data/mockData';

interface DealCardProps {
  deal: Deal;
  onNavigate: (path: string) => void;
  onRevealDeal: (deal: Deal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onNavigate, onRevealDeal }) => {
  return (
    <Card className="group flex flex-col justify-between transition-all duration-200 hover:border-indigo-500/40 hover:shadow-sm bg-card">
      <div className="p-4 sm:p-5">
        {/* Card Header: Brand avatar + Name/Category + Trending badge */}
        <div className="flex items-start justify-between gap-3 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onNavigate(`/brands/${deal.brandSlug}`)}
              className="cursor-pointer shrink-0 transition-transform group-hover:scale-105"
              aria-label={`View ${deal.brandName} brand page`}
            >
              <BrandLogo
                brandSlug={deal.brandSlug}
                brandName={deal.brandName}
                initials={deal.brandInitials}
                colorClass={deal.brandColor}
                size="md"
              />
            </button>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onNavigate(`/brands/${deal.brandSlug}`)}
                className="font-display block truncate text-sm sm:text-base font-bold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {deal.brandName}
              </button>
              <button
                type="button"
                onClick={() => onNavigate(`/categories/${deal.categorySlug}`)}
                className="block truncate text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {deal.categoryName}
              </button>
            </div>
          </div>

          <div className="shrink-0">
            {deal.isTrending ? (
              <Badge variant="amber" className="text-[11px] font-medium py-0.5 px-2">
                <Flame className="h-3 w-3" />
                Trending
              </Badge>
            ) : deal.extraDealsCount ? (
              <Badge variant="secondary" className="text-[11px] font-medium py-0.5 px-2">
                <Layers className="h-3 w-3" />
                +{deal.extraDealsCount} Deals
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Card Body: Discount Badge + Title + Description */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="indigo" className="font-mono font-semibold text-xs px-2.5 py-0.5">
              {deal.valueBadge}
            </Badge>
            <span className="text-xs text-muted-foreground">· {deal.dealType}</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`/deals/${deal.slug}`)}
            className="font-display block text-left text-sm sm:text-base font-bold leading-snug text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer pt-0.5"
          >
            {deal.title}
          </button>

          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {deal.shortDescription}
          </p>
        </div>
      </div>

      {/* Card Metadata & CTA Button */}
      <div className="border-t border-border/70 bg-muted/20 px-4 py-3 sm:px-5 sm:py-3.5 rounded-b-lg space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs truncate">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            {deal.verifiedAgo}
          </span>

          <div className="flex items-center gap-2.5 sm:gap-3 tabular-nums font-mono text-[11px] sm:text-xs shrink-0">
            <span className="inline-flex items-center gap-1 text-muted-foreground" title="Views">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
              {deal.views.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground" title="Redemptions">
              <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground/70" />
              {deal.clicks.toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <Button
            variant={deal.isCodeRequired ? 'default' : 'emerald'}
            className="w-full justify-between h-9 sm:h-10 text-xs sm:text-sm font-medium shadow-2xs"
            onClick={() => onRevealDeal(deal)}
          >
            <span className="inline-flex items-center gap-2">
              {deal.isCodeRequired ? (
                <>
                  <KeyRound className="h-4 w-4" />
                  Reveal Code
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4" />
                  Claim Deal
                </>
              )}
            </span>
            <span className="rounded bg-black/15 dark:bg-white/15 px-2 py-0.5 font-mono text-xs tracking-wider">
              {deal.code.slice(0, 5)}***
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
