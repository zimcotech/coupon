import React, { useState, createContext, useContext } from 'react';
import { ChevronDown, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomDropdown, DropdownOption } from '../CustomDropdown';

export { CustomDropdown };
export type { DropdownOption };

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// 1. Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'emerald' | 'blue';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants: Record<string, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xs',
      blue: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs',
      emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs',
      outline: 'border border-border bg-background hover:bg-muted text-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-muted/70 text-foreground',
      link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline',
    };
    const sizes: Record<string, string> = {
      default: 'h-10 px-4 py-2 text-sm rounded-xl',
      sm: 'h-8 px-3 text-xs rounded-lg',
      lg: 'h-12 px-6 text-sm font-semibold rounded-xl',
      icon: 'h-9 w-9 rounded-lg',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// 2. Card
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xs', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display font-bold leading-snug tracking-tight text-foreground', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-5 pt-0', className)} {...props} />;
}

// 3. Badge
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'emerald' | 'blue' | 'indigo' | 'amber' | 'pill';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'border-transparent bg-blue-600 text-white',
    blue: 'border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    indigo: 'border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    secondary: 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    emerald: 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    amber: 'border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    outline: 'border-border text-foreground bg-background',
    pill: 'border-transparent bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-full font-medium',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

// 4. Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-1 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

// 5. Textarea
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[90px] w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

// 6. Label
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-xs font-semibold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  );
}

// 7. Select
export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <CustomDropdown
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      className={className}
    />
  );
}

// 8. Tabs
const TabsContext = createContext<{ value: string; onValueChange: (v: string) => void }>({
  value: '',
  onValueChange: () => {},
});

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue || '');
  const active = value !== undefined ? value : internal;
  const setActive = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsContext.Provider value={{ value: active, onValueChange: setActive }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center justify-start rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 text-muted-foreground border border-border/40 overflow-x-auto max-w-full',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer',
        isActive
          ? 'bg-background text-foreground shadow-2xs'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={cn('mt-4', className)}>{children}</div>;
}

// 9. Dialog
export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative z-50 w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-4.5 top-4.5 h-8 w-8 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-xs group"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('font-display text-lg font-bold leading-none tracking-tight', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

// 10. Sheet
export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-50 flex h-full w-80 max-w-full flex-col border-r border-border bg-background p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-4.5 top-4.5 h-8 w-8 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-xs group"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 11. Avatar with Real Product Logo Support
const INITIALS_TO_DOMAIN: Record<string, string> = {
  II: 'elevenlabs.io',
  CW: 'cloudways.com',
  DO: 'digitalocean.com',
  UC: 'upcloud.com',
  OA: 'openai.com',
  PX: 'perplexity.ai',
  CR: 'cursor.com',
  VC: 'vercel.com',
  LN: 'linear.app',
  NT: 'notion.so',
  SB: 'supabase.com',
  GM: 'gamma.app',
  MJ: 'midjourney.com',
  ID: 'ideogram.ai',
  QD: 'qodo.ai',
  GW: 'workspace.google.com',
  G: 'workspace.google.com',
  HF: 'higgsfield.ai',
  BL: 'blink.new',
  B: 'blink.new',
  PV: 'pixverse.ai',
  CA: 'canva.com',
  DC: 'discord.com',
  AW: 'aws.amazon.com',
  GH: 'github.com',
  FG: 'figma.com',
  RC: 'raycast.com',
};

const SLUG_TO_DOMAIN: Record<string, string> = {
  openai: 'openai.com',
  chatgpt: 'openai.com',
  digitalocean: 'digitalocean.com',
  cloudways: 'cloudways.com',
  upcloud: 'upcloud.com',
  elevenlabs: 'elevenlabs.io',
  cursor: 'cursor.com',
  vercel: 'vercel.com',
  linear: 'linear.app',
  notion: 'notion.so',
  supabase: 'supabase.com',
  gamma: 'gamma.app',
  perplexity: 'perplexity.ai',
  midjourney: 'midjourney.com',
  ideogram: 'ideogram.ai',
  qodo: 'qodo.ai',
  'google-workspace': 'workspace.google.com',
  openart: 'openart.ai',
  higgsfield: 'higgsfield.ai',
  blink: 'blink.new',
  'blink.new': 'blink.new',
  pixverse: 'pixverse.ai',
  canva: 'canva.com',
  discord: 'discord.com',
  aws: 'aws.amazon.com',
  github: 'github.com',
  figma: 'figma.com',
  raycast: 'raycast.com',
  vultr: 'vultr.com',
  meta: 'meta.com',
  xai: 'x.ai',
  gemini: 'gemini.google.com',
  wispr: 'wisprflow.ai',
  magnific: 'magnific.ai',
  meshy: 'meshy.ai',
  base44: 'base44.com',
};

export function Avatar({
  initials,
  brandSlug,
  brandName,
  src,
  colorClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  size = 'md',
  className,
}: {
  initials?: string;
  brandSlug?: string;
  brandName?: string;
  src?: string;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'h-8 w-8 text-xs rounded-xl',
    md: 'h-10 w-10 sm:h-11 sm:w-11 text-sm rounded-xl',
    lg: 'h-12 w-12 sm:h-14 sm:w-14 text-base rounded-2xl',
  };

  const imgSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6 sm:h-7 sm:w-7',
    lg: 'h-7 w-7 sm:h-8 sm:w-8',
  };

  const resolvedDomain =
    (brandSlug && SLUG_TO_DOMAIN[brandSlug.toLowerCase()]) ||
    (brandName && SLUG_TO_DOMAIN[brandName.toLowerCase().replace(/[^a-z0-9]/g, '')]) ||
    (initials && INITIALS_TO_DOMAIN[initials.toUpperCase()]) ||
    null;

  const logoImgUrl =
    src ||
    (resolvedDomain
      ? `https://www.google.com/s2/favicons?domain=${resolvedDomain}&sz=128`
      : null);

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center border font-display font-bold tracking-tight select-none shadow-2xs overflow-hidden bg-card',
        sizes[size],
        !logoImgUrl || imgError ? colorClass : 'border-border/80 bg-white dark:bg-card',
        className
      )}
    >
      {logoImgUrl && !imgError ? (
        <img
          src={logoImgUrl}
          alt={brandName || initials || 'Brand'}
          className={cn('object-contain', imgSizes[size])}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials || 'CP'}</span>
      )}
    </div>
  );
}

// 12. Separator
export function Separator({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'shrink-0 bg-border/70',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
    />
  );
}

// 13. Accordion
export function Accordion({
  items,
  className,
}: {
  items: { id: string; question: string; answer: string }[];
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);
  return (
    <div className={cn('divide-y divide-border/80 rounded-2xl border border-border bg-card px-5', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <span className="font-display">{item.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-muted-foreground ml-2"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// 14. Breadcrumb
export function Breadcrumb({
  items,
  onNavigate,
}: {
  items: { label: string; path?: string }[];
  onNavigate: (path: string) => void;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.path && !isLast ? (
              <button
                type="button"
                onClick={() => onNavigate(item.path!)}
                className="hover:text-foreground transition-colors cursor-pointer truncate max-w-[110px] xs:max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </button>
            ) : (
              <span className={cn('truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none', isLast && 'font-medium text-foreground')}>{item.label}</span>
            )}
            {!isLast && <span aria-hidden="true" className="text-muted-foreground/60">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// 15. Table
export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-border">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-muted/50 border-b border-border', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-border bg-card', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('transition-colors hover:bg-muted/30', className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('h-10 px-4 text-left align-middle text-xs font-semibold text-muted-foreground whitespace-nowrap', className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3.5 align-middle text-xs sm:text-sm', className)} {...props} />;
}

// 16. ScrollArea
export function ScrollArea({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('overflow-x-auto scrollbar-none', className)}>{children}</div>;
}

// 17. Alert
export function Alert({
  variant = 'default',
  className,
  children,
}: {
  variant?: 'default' | 'emerald' | 'blue' | 'indigo';
  className?: string;
  children: React.ReactNode;
}) {
  const variants = {
    default: 'border-border bg-muted/40 text-foreground',
    emerald: 'border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200',
    blue: 'border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200',
    indigo: 'border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200',
  };
  return <div className={cn('relative w-full rounded-2xl border p-4 text-sm', variants[variant], className)}>{children}</div>;
}

// 18. Responsive Dynamic Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showItemCount?: boolean;
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  className = '',
  showItemCount = true,
  itemLabel = 'items',
}: PaginationProps) {
  // If only 1 page and no items count, hide
  if (totalPages <= 1 && (!totalItems || totalItems <= (pageSize || 10))) {
    return null;
  }

  // Safe bounds
  const validCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (validCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
    }

    if (validCurrentPage >= totalPages - 3) {
      return [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis-start', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, 'ellipsis-end', totalPages];
  };

  const pages = getPageNumbers();

  const startItem = totalItems && pageSize ? (validCurrentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems && pageSize ? Math.min(validCurrentPage * pageSize, totalItems) : null;

  const handlePageClick = (page: number) => {
    if (page === validCurrentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 text-xs select-none',
        className
      )}
    >
      {/* Left: Results Count Summary */}
      <div className="text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
        {totalItems && pageSize && showItemCount ? (
          <span>
            Showing{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {startItem}–{endItem}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {totalItems}
            </span>{' '}
            {itemLabel}
          </span>
        ) : (
          <span>
            Page <span className="font-semibold text-slate-900 dark:text-slate-100">{validCurrentPage}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Center: Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={validCurrentPage <= 1}
          onClick={() => handlePageClick(validCurrentPage - 1)}
          className="flex h-9 px-2.5 sm:px-3 items-center justify-center gap-1 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs font-medium"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Prev</span>
        </button>

        {/* Mobile Compact Page Indicator */}
        <div className="flex sm:hidden items-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200">
          <span>{validCurrentPage} / {totalPages}</span>
        </div>

        {/* Desktop / Tablet Numbered Buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((item, index) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 text-center text-slate-400 font-bold select-none"
                >
                  …
                </span>
              );
            }

            const isCurrent = item === validCurrentPage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => handlePageClick(item)}
                className={cn(
                  'flex h-9 min-w-9 px-2.5 items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-xs hover:bg-blue-700'
                    : 'border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                )}
                aria-label={`Page ${item}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          disabled={validCurrentPage >= totalPages}
          onClick={() => handlePageClick(validCurrentPage + 1)}
          className="flex h-9 px-2.5 sm:px-3 items-center justify-center gap-1 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs font-medium"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline text-xs">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Right: Optional Page Size Selector */}
      {pageSizeOptions && onPageSizeChange && pageSize ? (
        <div className="flex items-center gap-2 text-slate-500">
          <span className="hidden md:inline text-xs">Per page:</span>
          <div className="flex items-center gap-1">
            {pageSizeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onPageSizeChange(opt)}
                className={cn(
                  'h-7 px-2 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  pageSize === opt
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden sm:block w-20" />
      )}
    </div>
  );
}

// 19. Checkbox
export function Checkbox({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-foreground">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer',
          checked
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-input bg-background hover:border-blue-500'
        )}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </button>
      {label && <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</span>}
    </label>
  );
}

// 20. Switch
export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onCheckedChange(!checked);
        }
      }}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        checked ? 'bg-blue-600' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-xs transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
}

// 21. Skeleton Screen Component
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-xl select-none', className)}
      {...props}
    />
  );
}

export {
  DealGridSkeleton,
  DealCardSkeleton,
  DealListRowSkeleton,
  DealStackedRowSkeleton,
} from '../DealGridSkeleton';


