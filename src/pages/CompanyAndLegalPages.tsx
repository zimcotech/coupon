import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Wallet,
  Mail,
  Briefcase,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Scale,
  Info,
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  Input,
  Textarea,
  Select,
  Label,
  Accordion,
  Alert,
  Separator,
} from '../components/ui/shadcn';

// ============================================================================
// PAGE 10: ABOUT US PAGE (/about)
// ============================================================================
export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const metrics = [
    { label: 'Verified Deals', value: '500+ Verified Deals', sub: 'Tested weekly against live checkouts' },
    { label: 'Cumulative Savings', value: '$2.4M+ User Savings', sub: 'Saved by software teams in 2025–2026' },
    { label: 'Direct Vendors', value: '120+ SaaS Partners', sub: 'Direct partner & startup program feeds' },
    { label: 'Quality Standard', value: '100% Manual Verification', sub: 'Zero scraped or fake coupon clutter' },
  ];

  const steps = [
    {
      icon: <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      step: 'Step 01',
      title: 'Direct SaaS Partner Sourcing',
      description: 'We work directly with growth and partnerships teams at leading AI, cloud, and developer tool companies to negotiate exclusive promo codes and startup credit grants.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      step: 'Step 02',
      title: 'Manual Checkout Verification',
      description: 'Every code listed on Couponify is manually tested against live Stripe, Paddle, or native billing checkouts to verify exact discount percentages and eligibility rules.',
    },
    {
      icon: <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      step: 'Step 03',
      title: 'Instant One-Click Redemption',
      description: 'Copy verified promo codes or apply for $100k+ cloud grants with zero signup walls, spam popups, or expired bait-and-switch links.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* Hero Mission */}
      <div className="max-w-3xl space-y-3 sm:space-y-4">
        <Badge variant="indigo">About Couponify</Badge>
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Eliminating expired coupon clutter for software builders.
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
          General-purpose coupon sites are filled with broken promo codes and deceptive popups. We built Couponify to give software engineers, indie hackers, students, and venture-backed founders a clean, high-density directory of real B2B SaaS discounts and cloud credits.
        </p>
      </div>

      {/* 4-Column Metric Card Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
            <p className="font-display font-mono text-lg sm:text-xl font-bold text-foreground tabular-nums">
              {m.value}
            </p>
            <p className="text-xs text-muted-foreground">{m.sub}</p>
          </Card>
        ))}
      </div>

      {/* "How Couponify Works" 3-Step Visual Breakdown */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">How Couponify Works</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Our three-stage verification protocol ensures every listed code works at checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((s, idx) => (
            <Card key={idx} className="p-5 sm:p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40">
                  {s.icon}
                </div>
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {s.step}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Editorial Verification CTA */}
      <Card className="p-6 sm:p-8 bg-muted/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
            Run a SaaS product or developer tool?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Partner with Couponify to distribute your official promo codes, startup credits, or academic plans to over 280,000 monthly builders.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Button variant="outline" onClick={() => onNavigate('/contact')} className="flex-1 sm:flex-none h-9 text-xs">
            Contact Us
          </Button>
          <Button onClick={() => onNavigate('/submit')} className="flex-1 sm:flex-none h-9 text-xs">
            Submit a Deal
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// PAGE 11: CONTACT US PAGE (/contact)
// ============================================================================
export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [inquiryType, setInquiryType] = useState('Partnership / Affiliate Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <Badge variant="indigo">Support & Partnerships</Badge>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Contact the Couponify Team
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Report an expired promo code, inquire about SaaS affiliate partnerships, or book a sponsored spotlight placement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Column: Contact Card Form */}
        <Card className="lg:col-span-2 p-5 sm:p-8">
          {submitted ? (
            <Alert variant="emerald" className="space-y-3 p-6">
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold">
                <CheckCircle2 className="h-5 w-5" />
                Inquiry Received — Ref #CPN-2026-894
              </div>
              <p className="text-xs leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Our partnerships and verification desk has received your <strong>{inquiryType}</strong> message and will respond to <strong>{email}</strong> within 4 business hours.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="h-8 text-xs"
              >
                Send Another Message
              </Button>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Company / Brand Name</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme AI Inc."
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Inquiry Type</Label>
                  <Select
                    value={inquiryType}
                    onValueChange={setInquiryType}
                    options={[
                      { value: 'Report Broken Code', label: 'Report Broken Code' },
                      { value: 'Partnership / Affiliate Inquiry', label: 'Partnership / Affiliate Inquiry' },
                      { value: 'Sponsored Ad Booking', label: 'Sponsored Ad Booking' },
                      { value: 'General Support', label: 'General Support' },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Include the deal URL, promo code, or partnership proposal details..."
                  className="min-h-[120px] text-xs sm:text-sm"
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto font-medium">
                Send Message
              </Button>
            </form>
          )}
        </Card>

        {/* Right Column: Direct Channels & FAQ */}
        <div className="space-y-5">
          <div className="space-y-3">
            <Card className="p-4 flex items-center gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Support & Verification Desk</p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  support@couponify.io
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SaaS Partnerships & Ads</p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  partners@couponify.io
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average Response Time</p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  Under 4 Hours (Mon–Fri)
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-sm font-bold text-foreground">Quick Help FAQ</h3>
            <Accordion
              items={[
                {
                  id: 'ch-1',
                  question: 'What if a promo code says "Invalid"?',
                  answer: 'Select "Report Broken Code" in the form. Our team re-tests flagged codes within 2 hours and requests a replacement from the vendor.',
                },
                {
                  id: 'ch-2',
                  question: 'How do we update our brand logo or pricing?',
                  answer: 'Email partners@couponify.io from your corporate domain and we will update your brand directory page.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 12: PRIVACY POLICY PAGE (/privacy)
// ============================================================================
export const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      id: 'info-collect',
      title: '1. Information We Collect',
      body: 'Couponify operates as a public, no-login SaaS deals directory. We collect minimal telemetry: anonymous click counts when you reveal a promo code, voluntary email addresses if you subscribe to our Tuesday Deals Digest, and partner submission details when you submit a deal.',
    },
    {
      id: 'cookies-analytics',
      title: '2. Cookies & Analytics Tracking',
      body: 'We use privacy-first, first-party analytics to measure which promo codes and categories are most helpful to users. We do not sell personal browsing profiles to third-party ad exchanges or cross-site behavioral brokers.',
    },
    {
      id: 'affiliate-redirects',
      title: '3. Outbound Affiliate Links & Third-Party Redirects',
      body: 'When you click "Continue to Partner Site" or redeem an offer, you are directed to the external SaaS merchant (such as ElevenLabs, Cloudways, or DigitalOcean). Those merchants may set a standard affiliate attribution cookie (typically 30 to 90 days) solely to credit Couponify for the referral.',
    },
    {
      id: 'data-security',
      title: '4. Data Security & Retention',
      body: 'All traffic to Couponify is encrypted via TLS 1.3. Newsletter subscriptions and partner contact logs are stored in encrypted databases with strict role-based access control.',
    },
    {
      id: 'user-rights',
      title: '5. User Rights (GDPR & CCPA Compliance)',
      body: 'Under GDPR (EU/UK) and CCPA (California), you have the right to request access to, correction of, or immediate deletion of any personal data (such as your newsletter email or partner submission record).',
    },
    {
      id: 'privacy-contact',
      title: '6. Contact Information for Privacy Inquiries',
      body: 'For any GDPR/CCPA data deletion requests or privacy questions, contact our Data Protection Officer at privacy@couponify.io.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo">
            <Lock className="h-3 w-3" />
            Legal & Privacy
          </Badge>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Last Updated: October 2026
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        {/* Sticky Table of Contents Sidebar */}
        <Card className="p-4 sm:p-5 h-fit lg:sticky lg:top-24 space-y-3">
          <p className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Table of Contents
          </p>
          <ul className="space-y-1.5 text-xs">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block py-0.5"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Card>

        {/* Main Reading Column */}
        <Card className="lg:col-span-3 p-5 sm:p-8 space-y-6">
          {sections.map((s, idx) => (
            <div key={s.id} id={s.id} className="space-y-2 scroll-mt-24">
              <h2 className="font-display text-base sm:text-lg font-bold text-foreground">{s.title}</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              {idx < sections.length - 1 && <Separator className="pt-4" />}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE 13: TERMS OF SERVICE & AFFILIATE DISCLOSURE PAGE (/terms)
// ============================================================================
export const TermsAndDisclosurePage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo">
            <Scale className="h-3 w-3" />
            Terms & Compliance
          </Badge>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Effective: October 2026
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Terms of Service & FTC Affiliate Disclosure
        </h1>
      </div>

      {/* Clear Alert Summary Box at Top */}
      <Alert variant="indigo" className="space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
          <Info className="h-4 w-4 shrink-0" />
          Plain-English Compliance Summary
        </div>
        <p className="text-xs leading-relaxed">
          Couponify is free for all users. We sustain our manual code verification team through partner referral commissions and clearly labeled sponsored placements. Using a Couponify promo code never increases the price you pay—it strictly reduces your bill or adds bonus credits.
        </p>
      </Alert>

      <Card className="p-5 sm:p-8 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
            1. FTC Affiliate Disclosure (16 CFR Part 255)
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            In compliance with the Federal Trade Commission (FTC) guidelines, please assume that outbound links to third-party software vendors on Couponify are affiliate partner links. When you click "Reveal Code", "Claim Deal", or "Go to Official Partner Site" and subsequently purchase a subscription, Couponify may receive an affiliate commission or partner bounty from the merchant at zero extra cost to you.
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
            2. Coupon Accuracy & Expiration Disclaimer
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            While our editorial team manually tests promo codes and startup credit programs, third-party SaaS merchants retain sole discretion to modify, cap, or terminate promotional offers at any time without prior notice. Couponify does not guarantee that every third-party merchant will honor a promotional code if your account does not meet their specific new-customer or startup eligibility criteria.
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
            3. Acceptable Use & Intellectual Property
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            All brand names, trademarks, and initials displayed on Couponify belong to their respective software owners and are used strictly for nominative fair-use identification of promotional offers. Automated scraping, bulk harvesting of our curated verification data, or submitting fraudulent referral codes is strictly prohibited.
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
            4. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Couponify provides directory information on an "as-is" basis. Any billing disputes, subscription renewals, or SLA claims regarding a third-party software product must be resolved directly with the respective SaaS vendor.
          </p>
        </div>
      </Card>
    </div>
  );
};
