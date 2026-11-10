# Couponify Responsiveness Polish & Premium Typography Upgrade

Enhance the mobile and tablet responsiveness across Couponify's entire 13-page directory architecture and implement the user-selected high-end typography pairing (**Outfit** for display headings and brand identity + **Inter** for clean, readable body prose and UI controls + **JetBrains Mono** for codes and telemetry).

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design decisions have been confirmed via Phase 1 user input:

- **Confirmed Typography Pairing**: **Outfit** (weights 500, 600, 700) for geometric, modern brand headlines, card titles, badges, and section headers; **Inter** (weights 400, 500, 600) for clean, high-legibility body prose, metadata labels, and form inputs; **JetBrains Mono** for promo codes, tabular statistics, and timestamps.
- **Confirmed Responsiveness Scope**: **Comprehensive mobile polish** across all 13 standalone page views, specifically targeting:
  1. **Global Header & Navigation**: Fluid touch header with smooth Sheet drawer transitions, responsive search button truncation, and 44px+ mobile touch targets.
  2. **Deal Cards & Grid Layouts**: Adaptive card margins, fluid padding (`p-4 sm:p-5`), non-wrapping metadata rows, and thumb-friendly "Reveal Code" buttons.
  3. **Data & Comparison Tables**: Responsive scroll wrappers with fade indicators on mobile screens for pricing matrices (Brand Detail & Perks pages).
  4. **Redemption & Command Modals**: Centered, sheet-adaptive dialogs with proper mobile keyboard viewport clearance.
  5. **Form & Live Preview Split**: On mobile, gracefully stack the real-time Deal Card Preview directly beneath the submission form with a preview toggle or fluid stack.

---

## 1. Overview & Core Concept

- **What It Delivers**: A fluid, app-like experience across all device viewports (from 360px mobile viewports up to 1440px desktop displays) paired with crisp typography that reinforces trust, legibility, and high conversion rates.
- **Target Audience**: Developers, startup founders, and students accessing verified SaaS promo codes and cloud grants on mobile devices, tablets, and wide desktop screens.
- **Key Value**: Eliminates horizontal scrollbar glitches, cramped text wrapping, clipping modal boxes, and hard-to-tap buttons on mobile, while giving the entire platform a cohesive, modern visual identity.

---

## 2. User Experience & Visual Design

### Typography & Hierarchy
- **Display Headings (`font-display` / `Outfit`)**: 
  - Hero display: `text-3xl sm:text-5xl font-bold tracking-tight`
  - Section titles: `text-xl sm:text-2xl font-bold`
  - Card titles: `text-base sm:text-lg font-semibold leading-snug`
- **Body & Controls (`font-sans` / `Inter`)**:
  - Primary text: `text-sm sm:text-base leading-relaxed`
  - Captions & metadata: `text-xs leading-normal`
- **Telemetry & Codes (`font-mono` / `JetBrains Mono`)**:
  - Promo codes: `font-mono tracking-wider font-bold`
  - Metric counters & timestamps: `font-mono tabular-nums`

### Viewport Responsive Adaptations
- **Mobile (<640px)**:
  - Header height: 56px (`h-14`), compact logo lockup, instant Sheet slide-over with full-width action links.
  - Quick-search: Compact search button with icon and shortcut hidden on small viewports.
  - Filter bar: Horizontally swipeable categories with smooth gradient mask cue.
  - Deal cards: Single column with tight spatial math (`p-4`), touch-friendly 44px action buttons.
  - Modals: Bottom-sheet style or max-w-full sheet on small screens with no viewport clipping.
- **Tablet (640px - 1024px)**:
  - Deal grid: 2-column balanced grid with aligned metadata baselines.
  - Tables: Integrated horizontal scrolling with visible scroll indicators.
- **Desktop (1024px+)**:
  - Full 3-column deal grid, sticky filter sidebars, two-column brand details with companion sidebar.

---

## 3. Key Product Decisions & Trade-Offs

- **Font Loading Strategy**: Load **Outfit** (500, 600, 700) and **Inter** (400, 500, 600) via optimized Google Fonts `<link rel="preconnect">` and map them via `@theme` variables in `src/index.css`. This delivers instant rendering with zero layout shift (FOUT/CLS).
- **Responsive Table Treatment**: Instead of squishing 5-column comparison matrices into illegible tiny text on mobile, wrap them in a responsive `ScrollArea` container with a subtle horizontal scroll indicator and sticky first column where applicable.
- **Touch Target Compliance**: Enforce WCAG AA compliant minimum 44px touch targets on mobile for all primary clickables (filter pills, modal triggers, pagination controls, copy code buttons).

---

## 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Couponify Application Shell                       │
│  Outfit (Headings) · Inter (Prose & Controls) · JetBrains Mono (Codes) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│     Global Responsive Bar    │          │    Mobile Sheet Drawer       │
│  - H-14 mobile / H-16 desktop│          │  - Full vertical stack       │
│  - Responsive search trigger │          │  - Touch targets >= 44px     │
│  - Quick theme toggle        │          │  - Clean category shortcuts  │
└──────────┬───────────────────┘          └──────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                13 Standalone Adaptive Page Layouts                     │
│  ┌───────────────────────┐ ┌───────────────────┐ ┌──────────────────┐  │
│  │  Home & Category Grids│ │ Brand Detail &    │ │ Submit & Preview │  │
│  │  1-col (mobile)       │ │ Pricing Tables    │ │ Stacked on mobile│  │
│  │  2-col (tablet)       │ │ Horizontal scroll │ │ Side-by-side on  │  │
│  │  3-col (desktop)      │ │ responsive shell  │ │ desktop viewports│  │
│  └───────────────────────┘ └───────────────────┘ └──────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│  Reveal Code / Claim Modal   │          │  Command+K Search Modal      │
│  - Viewport-safe padding     │          │  - Dynamic max-height        │
│  - Instant copy state        │          │  - Touch dismissible         │
└──────────────────────────────┘          └──────────────────────────────┘
## 5. Software Vertical Category Badges System (Completed)

- **Dedicated `CategoryBadge` Component (`src/components/CategoryBadge.tsx`)**:
  - Replaced subtle text labels with high-visibility, color-coded icon badges.
  - **AI Tools**: Emerald green background (`bg-emerald-50 text-emerald-800 border-emerald-200/90`) with `Bot` icon.
  - **Cloud & Hosting**: Sky blue background (`bg-sky-50 text-sky-800 border-sky-200/90`) with `Cloud` icon.
  - **Dev Tools**: Violet purple background (`bg-violet-50 text-violet-800 border-violet-200/90`) with `Terminal` icon.
  - **Productivity**: Amber gold background (`bg-amber-50 text-amber-900 border-amber-200/90`) with `Zap` icon.
  - **Design**: Fuchsia rose background (`bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200/90`) with `Palette` icon.
  - **Marketing**: Teal background (`bg-teal-50 text-teal-800 border-teal-200/90`) with `TrendingUp` icon.
  - **Security**: Rose red background (`bg-rose-50 text-rose-800 border-rose-200/90`) with `Shield` icon.
  - **Databases & Backend**: Indigo slate background (`bg-indigo-50 text-indigo-800 border-indigo-200/90`) with `Database` icon.
- **Surface Coverage**:
  - `DealCard.tsx` (primary catalog grid, bookmarked cards, category detail grids)
  - `HomeAndDealPages.tsx` (New Arrivals list rows, Trending Deals cards, Deal Detail header, Related Deals list)
  - `LayoutShell.tsx` (Reveal Code / Claim Deal modal)
  - `BrandsAndCategoriesPages.tsx` (Brand detail active deals, Category directory cards, Category header)
- **Contrast & Ergonomics**:
  - Fully WCAG AA compliant contrast ratios in light and dark themes.
  - Clickable navigation triggers routing to `/categories/:slug` with touch-friendly hit areas and interactive hover states.


### Planned Code Updates (Upon Approval)
1. **`index.html`**: Update Google Fonts preconnect and stylesheets to include `Outfit:wght@500;600;700`, `Inter:wght@400;500;600`, and `JetBrains Mono:wght@400;500;600`.
2. **`src/index.css`**: Configure `@theme` font definitions (`--font-display: 'Outfit'`, `--font-sans: 'Inter'`, `--font-mono: 'JetBrains Mono'`) with refined font smoothing and responsive typography classes.
3. **`src/components/LayoutShell.tsx`**: Refine mobile header heights, responsive command palette search trigger, mobile drawer padding, and responsive 5-column footer wrapping.
4. **`src/components/DealCard.tsx`**: Add fluid container padding, responsive typography clamp, and thumb-friendly button sizes.
5. **`src/pages/HomeAndDealPages.tsx`**: Polish mobile hero spacing, search bar input width, deal type tabs scrolling, and responsive deal detail redemption card.
6. **`src/pages/BrandsAndCategoriesPages.tsx`**: Polish A–Z letter filter wraps on small screens, brand detail stat counters, and pricing table wrappers.
7. **`src/pages/PerksBlogSubmitPages.tsx` & `CompanyAndLegalPages.tsx`**: Enhance mobile responsiveness of comparison matrices, form controls, and sticky sidebars.
