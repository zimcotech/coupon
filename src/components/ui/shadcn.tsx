import React, { useState, createContext, useContext } from 'react';
import { ChevronDown, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className={cn('relative inline-flex items-center', className)}>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-3.5 pr-8 py-1 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted-foreground" />
    </div>
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 flex h-full w-80 max-w-full flex-col border-r border-border bg-background p-6 shadow-xl">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          aria-label="Close drawer"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
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
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{item.answer}</p>}
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
                className="hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </button>
            ) : (
              <span className={cn('whitespace-nowrap', isLast && 'font-medium text-foreground')}>{item.label}</span>
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

// 18. Resourify Circular Pagination (Screenshot 3 style)
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={cn(
            'flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer font-mono',
            currentPage === page
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground'
          )}
        >
          {page}
        </button>
      ))}

      <span className="text-muted-foreground px-1 font-mono text-xs">...</span>

      <button
        type="button"
        onClick={() => onPageChange(12)}
        className={cn(
          'flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer font-mono',
          currentPage === 12
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground'
        )}
      >
        12
      </button>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
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
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
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
