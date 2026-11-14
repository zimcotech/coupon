import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Eye,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Share2,
  Tag,
  Clock,
  User,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
  MessageSquare,
  ImageIcon,
  Type,
  BookOpen,
  Star,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
} from 'lucide-react';
import { BlogArticle, Deal } from '../data/mockData';
import { RichArticleRenderer } from '../components/RichArticleRenderer';
import { cn } from '../components/ui/shadcn';

export interface AdminBlogEditorPageProps {
  articleSlug?: string; // If provided, edit mode; otherwise, create mode
  articles: BlogArticle[];
  deals: Deal[];
  onAddArticle?: (newArticle: BlogArticle) => void;
  onUpdateArticle?: (updatedArticle: BlogArticle, originalSlug?: string) => void;
  onNavigate: (path: string) => void;
}

export const AdminBlogEditorPage: React.FC<AdminBlogEditorPageProps> = ({
  articleSlug,
  articles,
  deals,
  onAddArticle,
  onUpdateArticle,
  onNavigate,
}) => {
  const existingArticle = useMemo(() => {
    if (!articleSlug) return null;
    return articles.find((a) => a.slug === articleSlug) || null;
  }, [articleSlug, articles]);

  const isEditing = Boolean(existingArticle);

  // Form State
  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [category, setCategory] = useState(existingArticle?.category || 'AI Tools');
  const [readingTime, setReadingTime] = useState(existingArticle?.readingTime || '5 min read');
  const [publishDate, setPublishDate] = useState(existingArticle?.publishDate || 'Today');
  const [authorName, setAuthorName] = useState(existingArticle?.authorName || 'Alex Vance');
  const [authorRole, setAuthorRole] = useState(existingArticle?.authorRole || 'Tech Finance & Cloud Editor');
  const [authorInitials, setAuthorInitials] = useState(existingArticle?.authorInitials || 'AV');
  const [isFeatured, setIsFeatured] = useState(Boolean(existingArticle?.isFeatured));

  // SEO & Social Preview Fields
  const [metaTitle, setMetaTitle] = useState(existingArticle?.metaTitle || existingArticle?.title || '');
  const [metaDescription, setMetaDescription] = useState(
    existingArticle?.metaDescription ||
      existingArticle?.excerpt ||
      'A comprehensive guide with actionable strategies to claim verified promotional credits and negotiate SaaS contracts.'
  );
  const [coverImage, setCoverImage] = useState(
    existingArticle?.coverImage ||
      existingArticle?.metaImage ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );
  const [tagsText, setTagsText] = useState((existingArticle?.tags || ['SaaS Deals', 'Cloud Credits', 'AI Tools']).join(', '));
  const [keyTakeawaysText, setKeyTakeawaysText] = useState(
    (existingArticle?.keyTakeaways || [
      'Always audit active user seats and idle staging clusters before annual renewals.',
      'Stack early-stage founder credits with cloud vendor marketplace credits.',
      'Check Couponify verification timestamps before finalizing checkout.',
    ]).join('\n')
  );
  const [relatedDealSlugsText, setRelatedDealSlugsText] = useState(
    (existingArticle?.relatedDealSlugs || []).join(', ')
  );

  // Markdown Content
  const [content, setContent] = useState<string>(() => {
    if (existingArticle?.content) return existingArticle.content;
    if (existingArticle?.sections && existingArticle.sections.length > 0) {
      return existingArticle.sections.map((s) => `## ${s.heading}\n\n${s.body}`).join('\n\n');
    }
    return `## The 2026 Software Savings Landscape\n\nModern engineering and product teams face mounting software subscription costs. By actively claiming partner credits, startups can preserve runway while leveraging tier-one cloud platforms and AI models.\n\n### Essential Rules of Procurement\n- Audit seat sprawl before annual enterprise renewals.\n- Claim cloud compute credits on staging clusters prior to launch.\n- Use verified partner codes for database and issue tracking tooling.\n\n> **Pro-Tip:** Always verify coupon validity dates and tier eligibility prior to submitting annual payment credentials.`;
  });

  // Editor View Tab: 'write' | 'preview'
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // Textarea ref and link bar state
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLinkBarOpen, setIsLinkBarOpen] = useState(false);
  const [linkAnchorInput, setLinkAnchorInput] = useState('');
  const [linkUrlInput, setLinkUrlInput] = useState('/deals/');
  const [copiedLink, setCopiedLink] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const wordCount = useMemo(() => {
    const cleaned = content.replace(/[#*`>|[\]()-]/g, ' ').trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).filter(Boolean).length;
  }, [content]);

  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-generate slug when title changes (in create mode)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(newTitle);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = contentTextareaRef.current;
    const currentVal = content;
    if (!textarea) {
      setContent(currentVal + prefix + defaultText + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentVal.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setContent(newVal);
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleOpenLinkBar = () => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const selected = content.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selected) {
        setLinkAnchorInput(selected);
      }
    }
    setIsLinkBarOpen((prev) => !prev);
  };

  const handleApplyLink = () => {
    const anchor = linkAnchorInput.trim() || 'Link Text';
    const url = linkUrlInput.trim() || 'https://couponify.app/deals/';
    insertMarkdown(`[${anchor}](`, ')', url);
    setIsLinkBarOpen(false);
    setLinkAnchorInput('');
    setLinkUrlInput('https://couponify.app/deals/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification('Please enter an article title');
      return;
    }

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const tagsArray = tagsText
      ? tagsText.split(',').map((s) => s.trim()).filter(Boolean)
      : ['SaaS', 'Cloud', 'AI Tools'];

    const newOrUpdatedArticle: BlogArticle = {
      slug: generatedSlug,
      title: title.trim(),
      excerpt:
        metaDescription.trim().slice(0, 160) ||
        'A comprehensive guide on maximizing savings and promotional credits.',
      category: category.trim() || 'AI Tools',
      readingTime: readingTime || '5 min read',
      publishDate: publishDate || 'Today',
      authorName: authorName || 'Alex Vance',
      authorRole: authorRole || 'Tech Finance & Cloud Editor',
      authorInitials:
        authorInitials ||
        (authorName
          ? authorName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'AV'),
      authorAvatar: coverImage || undefined,
      isFeatured,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription:
        metaDescription.trim() ||
        'A comprehensive guide on maximizing savings and promotional credits.',
      metaImage: coverImage.trim(),
      coverImage: coverImage.trim(),
      tags: tagsArray,
      content: content.trim(),
      keyTakeaways: keyTakeawaysText
        ? keyTakeawaysText.split('\n').filter((l) => l.trim().length > 0)
        : ['Verify active promotions before signing up for annual tiers.'],
      sections: existingArticle?.sections || [],
      relatedDealSlugs: relatedDealSlugsText
        ? relatedDealSlugsText.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (isEditing) {
      if (onUpdateArticle) onUpdateArticle(newOrUpdatedArticle, existingArticle?.slug);
      showNotification(`Updated article "${newOrUpdatedArticle.title}".`);
    } else {
      if (onAddArticle) onAddArticle(newOrUpdatedArticle);
      showNotification(`Published new article "${newOrUpdatedArticle.title}".`);
    }

    setTimeout(() => {
      onNavigate('/admin?tab=blogs');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 text-slate-900 dark:text-slate-100">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/admin?tab=blogs')}
              className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Return to Savings Guides"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {isEditing ? 'Edit Savings Guide' : 'Compose New Savings Guide'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500 font-mono">
                  /blog/{slug || 'new-slug'}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {title.trim() || (isEditing ? 'Edit Article' : 'Untitled Savings Guide')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isEditing && (
              <button
                type="button"
                onClick={() => onNavigate(`/blog/${slug}`)}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>View Live</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('/admin?tab=blogs')}
              className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="h-9 px-4.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Core Authoring Studio (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & URL Slug Card */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Essential Guide: Claiming Over $150,000 in Startup Cloud Credits in 2026"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-base sm:text-lg font-bold px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    URL Slug (Direct Shareable Link)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-slate-400 font-mono select-none">
                      /blog/
                    </span>
                    <input
                      type="text"
                      placeholder="how-to-save-cloud-compute"
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]+/g, '-')
                            .replace(/^-+|-+$/g, '')
                        )
                      }
                      className="w-full h-10 pl-16 pr-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="SaaS Guides, AI Tools, Cloud Optimization..."
                    className="w-full h-10 px-3 text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Quick Category Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Quick categories:</span>
                {['AI Tools', 'Cloud & Hosting', 'SaaS Deals', 'Startup Packs', 'Student Packs'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'text-[11px] px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer',
                      category === cat
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/80 text-blue-600 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SEO Meta Description with 160-char counter */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    SEO Meta Tags & Excerpt
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controls Google search snippet (<span className="font-mono text-slate-400">description</span>) and card summaries.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs font-mono font-semibold px-2 py-0.5 rounded-md',
                      metaDescription.length > 160
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    )}
                  >
                    {metaDescription.length} / 160 chars
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SEO Meta Title (<span className="font-mono text-slate-400">og:title</span>)
                </label>
                <input
                  type="text"
                  placeholder="Title shown on social previews and search engines..."
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  SEO Meta Description & Excerpt (<span className="font-mono text-slate-400">og:description</span>)
                </label>
                <textarea
                  rows={3}
                  placeholder="Compelling 1-2 sentence snippet that summarizes this savings guide for Google search results and social cards..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
                {metaDescription.length > 160 && (
                  <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    Search engines like Google usually truncate descriptions longer than 160 characters.
                  </p>
                )}
              </div>
            </div>

            {/* Rich Markdown Authoring Studio */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Article Content (Rich Markdown, Headings & Nested Links)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Use H2/H3 for table of contents headings and insert nested links to internal deals.
                  </p>
                </div>

                {/* Write vs Live Preview Tab Switch */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={cn(
                      'px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                      editorTab === 'write'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                  >
                    <Type className="h-3.5 w-3.5" /> Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={cn(
                      'px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                      editorTab === 'preview'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    )}
                  >
                    <Eye className="h-3.5 w-3.5" /> Live Preview
                  </button>
                </div>
              </div>

              {editorTab === 'write' ? (
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden focus-within:border-blue-600 transition-colors">
                  {/* Authoring Toolbar */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n\n## ', '\n\n', 'Section Title')}
                      title="Add H2 Heading"
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n\n### ', '\n\n', 'Subheading Title')}
                      title="Add H3 Subheading"
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
                    >
                      H3
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown('**', '**', 'bold text')}
                      title="Bold Text"
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('*', '*', 'italic text')}
                      title="Italic Text"
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenLinkBar}
                      title="Insert or Nest Link"
                      className={cn(
                        'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors',
                        isLinkBarOpen
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      )}
                    >
                      <Link2 className="h-3.5 w-3.5" /> Link
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n- ', '\n', 'List item')}
                      title="Bullet List"
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n1. ', '\n', 'Step one')}
                      title="Numbered List"
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <ListOrdered className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdown(
                          '\n\n> **Pro-Tip:** ',
                          '\n\n',
                          'Apply verified credits on staging clusters prior to launch.'
                        )
                      }
                      title="Callout Box"
                      className="px-2 py-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Callout
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdown(
                          '\n\n| Feature / Tier | Standard Pricing | Verified Partner Deal |\n| --- | --- | --- |\n| ',
                          ' | $20/mo | 50% Off |\n\n',
                          'Pro Plan'
                        )
                      }
                      title="Insert Comparison Table"
                      className="px-2 py-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="h-3.5 w-3.5" /> Table
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdown(
                          '\n\n```bash\n# Code snippet\n',
                          '\n```\n',
                          'curl -X GET https://couponify.app/api/deals'
                        )
                      }
                      title="Code Block"
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdown(
                          '\n\n![Image description](',
                          ')\n\n',
                          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
                        )
                      }
                      title="Inline Image"
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                    </button>
                    <div className="ml-auto flex items-center gap-2 pr-1 text-[11px] font-mono text-slate-400">
                      <span>{wordCount} words</span>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => setReadingTime(`${estimatedReadMinutes} min read`)}
                        title="Click to sync reading time with word count"
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        ~{estimatedReadMinutes} min read
                      </button>
                    </div>
                  </div>

                  {/* Inline Link Prompt Bar */}
                  {isLinkBarOpen && (
                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/50 border-b border-blue-200 dark:border-blue-900/60 space-y-2.5 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          Nest Link:
                        </span>
                        <input
                          type="text"
                          placeholder="Anchor text (e.g. Vultr $300 Credits)"
                          value={linkAnchorInput}
                          onChange={(e) => setLinkAnchorInput(e.target.value)}
                          className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex-1 min-w-[150px] focus:outline-none focus:border-blue-600"
                        />
                        <input
                          type="text"
                          placeholder="URL (e.g. /deals/300-vultr-free-credits-promo-code)"
                          value={linkUrlInput}
                          onChange={(e) => setLinkUrlInput(e.target.value)}
                          className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex-1 min-w-[200px] font-mono focus:outline-none focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={handleApplyLink}
                          className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                        >
                          Insert Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLinkBarOpen(false)}
                          className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      {deals && deals.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
                          <span className="text-[11px] font-medium text-blue-700/80 dark:text-blue-300/80">
                            Quick link internal deal:
                          </span>
                          {deals.slice(0, 6).map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => {
                                if (!linkAnchorInput.trim()) {
                                  setLinkAnchorInput(`${d.brandName} (${d.valueBadge})`);
                                }
                                setLinkUrlInput(`/deals/${d.slug}`);
                              }}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 cursor-pointer"
                            >
                              {d.brandName}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Markdown Textarea */}
                  <textarea
                    ref={contentTextareaRef}
                    rows={18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article content using Markdown:&#10;&#10;## 1. Introduction&#10;Startups often overpay for infrastructure...&#10;&#10;### Top Cloud Credits in 2026&#10;Check out the [Vultr $300 Credits](/deals/300-vultr-free-credits-promo-code) to save on GPU compute.&#10;&#10;> **Pro-Tip:** Always verify promotional codes before checkout!"
                    className="w-full p-4 text-xs sm:text-sm font-mono leading-relaxed bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none resize-y"
                  />
                </div>
              ) : (
                /* Live Preview Canvas */
                <div className="p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[420px] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Live Rendered Customer View
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      /blog/{slug || 'preview'}
                    </span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-left">
                    <RichArticleRenderer
                      content={content || '*No content written yet. Switch to the Write tab to begin drafting.*'}
                      onNavigate={(path) => {
                        console.log('Preview link clicked:', path);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Key Takeaways & Related Deals */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Key Highlights & Related Promotions
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Key Takeaways Card (one bullet point per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Audit active cloud infrastructure licenses&#10;Stack credits with early-stage founder discounts&#10;Verify promotional terms before annual commitments"
                  value={keyTakeawaysText}
                  onChange={(e) => setKeyTakeawaysText(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Related Deal Slugs (comma-separated to display promotional cards at article footer)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 300-vultr-free-credits-promo-code, chatgpt-business-discount-48-months"
                  value={relatedDealSlugsText}
                  onChange={(e) => setRelatedDealSlugsText(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-blue-600"
                />

                {/* Deal Slug Quick Selector */}
                {deals && deals.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1.5">Click to append deal slug:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {deals.slice(0, 8).map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            const current = relatedDealSlugsText
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            if (!current.includes(d.slug)) {
                              setRelatedDealSlugsText([...current, d.slug].join(', '));
                            }
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-600 text-slate-600 dark:text-slate-400 cursor-pointer"
                        >
                          +{d.brandName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Publishing Sidebar & Social Card Preview (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* LIVE SOCIAL PREVIEW CARD */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Live Social Share Card
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-600 px-2 py-0.5 rounded">
                  X · LinkedIn · Slack
                </span>
              </div>

              {/* Rendered Preview Card */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={coverImage}
                    alt="Social preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/70 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {category || 'Savings Guide'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5 text-left bg-white dark:bg-slate-900">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    COUPONIFY.APP / BLOG / {slug || 'how-to-save'}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                    {metaTitle || title || 'How to Maximize Software Savings in 2026'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {metaDescription ||
                      'A comprehensive guide with actionable strategies to claim credits and negotiate renewals.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover / Meta Image URL */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Cover & Meta Image URL (<span className="font-mono text-slate-400">og:image</span>)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or hosted URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />

              {/* Sample preset cover images */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block mb-1.5">Preset Unsplash covers:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: 'Cloud',
                      url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
                    },
                    {
                      label: 'AI & Code',
                      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                    },
                    {
                      label: 'Fintech',
                      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                    },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCoverImage(p.url)}
                      className="h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative hover:border-blue-600 group cursor-pointer"
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-[10px] text-white font-semibold">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Publishing Settings & Metadata */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Publishing Details & Author
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Author Role
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    placeholder="Today"
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="AI Tools, Cloud Credits, SaaS Discounts"
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Feature Prominently Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="page-blog-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="page-blog-featured"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer leading-snug"
                >
                  Feature prominently as Hero Editorial Guide on <span className="font-mono">/blog</span>
                </label>
              </div>
            </div>

            {/* Action Bar Card */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>{isEditing ? 'Save Guide Changes' : 'Publish Article'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/admin?tab=blogs')}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs cursor-pointer transition-colors"
              >
                Return to Admin Panel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
