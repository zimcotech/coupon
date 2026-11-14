import React, { useState } from 'react';
import {
  ExternalLink,
  Info,
  Copy,
  Check,
  Link2,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from './ui/shadcn';

interface RichArticleRendererProps {
  content: string;
  onNavigate?: (path: string) => void;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number; // 2 or 3
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*|\*|`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function extractHeadings(content: string): HeadingItem[] {
  if (!content) return [];
  const lines = content.split('\n');
  const headings: HeadingItem[] = [];
  let inCode = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '').replace(/\*\*|\*|`/g, '').trim();
      const id = slugifyHeading(text);
      if (id) headings.push({ id, text, level: 3 });
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '').replace(/\*\*|\*|`/g, '').trim();
      const id = slugifyHeading(text);
      if (id) headings.push({ id, text, level: 2 });
    }
  }

  return headings;
}

export const RichArticleRenderer: React.FC<RichArticleRendererProps> = ({
  content,
  onNavigate,
}) => {
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<number | null>(null);
  const [copiedHeadingId, setCopiedHeadingId] = useState<string | null>(null);

  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let codeBlockCounter = 0;

  let inList = false;
  let listItems: React.ReactNode[] = [];
  let isNumberedList = false;

  let inTable = false;
  let tableRows: string[][] = [];

  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  const renderInlineFormatting = (str: string): React.ReactNode => {
    const tokens = str.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return tokens.map((tok, i) => {
      if (tok.startsWith('**') && tok.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
            {tok.slice(2, -2)}
          </strong>
        );
      }
      if (tok.startsWith('`') && tok.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md font-mono text-[12.5px] bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 border border-slate-200/70 dark:border-slate-700/70"
          >
            {tok.slice(1, -1)}
          </code>
        );
      }
      if (tok.startsWith('*') && tok.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-800 dark:text-slate-200">
            {tok.slice(1, -1)}
          </em>
        );
      }
      return tok;
    });
  };

  const renderFormattedText = (text: string): React.ReactNode => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(renderInlineFormatting(text.substring(lastIdx, match.index)));
      }
      const anchorText = match[1];
      const rawUrl = match[2].trim();

      // Convert https://couponify.app/... to internal SPA route if applicable
      const normalizedUrl = rawUrl.replace(/^https?:\/\/(www\.)?couponify\.app/i, '');
      const isInternal =
        (normalizedUrl.startsWith('/') || rawUrl.startsWith('#')) && Boolean(onNavigate);

      if (rawUrl.startsWith('#')) {
        const targetId = rawUrl.slice(1);
        parts.push(
          <button
            key={`link-${match.index}`}
            type="button"
            onClick={() => {
              const el = document.getElementById(targetId);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-400/50 hover:decoration-blue-600 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>{renderInlineFormatting(anchorText)}</span>
          </button>
        );
      } else if (isInternal && onNavigate) {
        parts.push(
          <button
            key={`link-${match.index}`}
            type="button"
            onClick={() => onNavigate(normalizedUrl)}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-400/50 hover:decoration-blue-600 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>{renderInlineFormatting(anchorText)}</span>
            <ArrowUpRight className="h-3.5 w-3.5 inline-block shrink-0 opacity-75" />
          </button>
        );
      } else {
        parts.push(
          <a
            key={`link-${match.index}`}
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-400/50 hover:decoration-blue-600 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{renderInlineFormatting(anchorText)}</span>
            <ExternalLink className="h-3 w-3 inline-block shrink-0 opacity-70" />
          </a>
        );
      }

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(renderInlineFormatting(text.substring(lastIdx)));
    }

    return parts.length > 0 ? parts : text;
  };

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            className="my-4 space-y-2.5 list-decimal list-outside pl-5 text-sm sm:text-[15.5px] text-slate-700 dark:text-slate-300 leading-relaxed marker:font-semibold marker:text-blue-600 dark:marker:text-blue-400"
          >
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="my-4 space-y-2.5 list-disc list-outside pl-5 text-sm sm:text-[15.5px] text-slate-700 dark:text-slate-300 leading-relaxed marker:text-blue-600 dark:marker:text-blue-400"
          >
            {listItems}
          </ul>
        );
      }
      inList = false;
      listItems = [];
      isNumberedList = false;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote && blockquoteLines.length > 0) {
      const joined = blockquoteLines.join(' ');
      elements.push(
        <blockquote
          key={`callout-${elements.length}`}
          className="my-6 p-4 sm:p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border-l-4 border-l-blue-600 border border-blue-200/70 dark:border-blue-900/50 flex items-start gap-3.5 text-left"
        >
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {renderFormattedText(joined)}
          </div>
        </blockquote>
      );
      inBlockquote = false;
      blockquoteLines = [];
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      // Filter out markdown separator rows like | --- | --- |
      const dataRows = tableRows.filter(
        (row) => !row.every((cell) => /^[-:\s]+$/.test(cell))
      );
      if (dataRows.length > 0) {
        const headerRow = dataRows[0];
        const bodyRows = dataRows.slice(1);
        elements.push(
          <div
            key={`table-${elements.length}`}
            className="my-6 overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
                  {headerRow.map((cell, cIdx) => (
                    <th
                      key={cIdx}
                      className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap"
                    >
                      {renderFormattedText(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={cn(
                          'py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed',
                          cIdx === 0 && 'font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap'
                        )}
                      >
                        {renderFormattedText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      inTable = false;
      tableRows = [];
    }
  };

  const flushAll = () => {
    flushList();
    flushBlockquote();
    flushTable();
  };

  const handleCopyHeadingAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard?.writeText(url).catch(() => {});
      setCopiedHeadingId(id);
      setTimeout(() => setCopiedHeadingId(null), 2000);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Code Blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        const blockId = codeBlockCounter++;
        const codeText = codeBuffer.join('\n');
        elements.push(
          <div
            key={`code-${elements.length}`}
            className="my-6 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-left shadow-xs"
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-300">
                {codeLang || 'shell'}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(codeText).catch(() => {});
                  setCopiedCodeBlock(blockId);
                  setTimeout(() => setCopiedCodeBlock(null), 2000);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeBlock === blockId ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="font-sans font-medium">Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-[13px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = '';
      } else {
        flushAll();
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // 2. Empty lines
    if (!line) {
      flushAll();
      continue;
    }

    // 3. Markdown Table rows: | Col 1 | Col 2 |
    if (line.startsWith('|') && line.endsWith('|') && line.length > 2) {
      flushList();
      flushBlockquote();
      inTable = true;
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // 4. Blockquote / Callout: > ...
    if (line.startsWith('>')) {
      flushList();
      flushTable();
      inBlockquote = true;
      blockquoteLines.push(line.replace(/^>\s*/, ''));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // 5. Horizontal Rule: --- or ***
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      flushAll();
      elements.push(
        <hr
          key={`hr-${elements.length}`}
          className="my-8 border-t border-slate-200/80 dark:border-slate-800"
        />
      );
      continue;
    }

    // 6. Standalone Markdown Image: ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushAll();
      const altText = imgMatch[1];
      const imgUrl = imgMatch[2];
      elements.push(
        <figure key={`img-${elements.length}`} className="my-6 space-y-2">
          <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img
              src={imgUrl}
              alt={altText || 'Article illustration'}
              className="w-full max-h-96 object-cover"
              loading="lazy"
            />
          </div>
          {altText && (
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 text-center">
              {altText}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // 7. H2 Headings: ## Heading
    if (line.startsWith('## ')) {
      flushAll();
      const rawText = line.replace('## ', '').trim();
      const cleanText = rawText.replace(/\*\*|\*|`/g, '');
      const id = slugifyHeading(cleanText);
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={id}
          className="scroll-mt-24 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-9 mb-3.5 text-left flex items-center gap-2 group"
        >
          <span>{renderInlineFormatting(rawText)}</span>
          <button
            type="button"
            onClick={() => handleCopyHeadingAnchor(id)}
            title="Copy link to section"
            aria-label={`Copy link to section ${cleanText}`}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity p-1 rounded-md cursor-pointer"
          >
            {copiedHeadingId === id ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </button>
        </h2>
      );
      continue;
    }

    // 8. H3 Headings: ### Subheading
    if (line.startsWith('### ')) {
      flushAll();
      const rawText = line.replace('### ', '').trim();
      const cleanText = rawText.replace(/\*\*|\*|`/g, '');
      const id = slugifyHeading(cleanText);
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          id={id}
          className="scroll-mt-24 text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-7 mb-2.5 text-left flex items-center gap-2 group"
        >
          <span>{renderInlineFormatting(rawText)}</span>
          <button
            type="button"
            onClick={() => handleCopyHeadingAnchor(id)}
            title="Copy link to section"
            aria-label={`Copy link to section ${cleanText}`}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity p-1 rounded-md cursor-pointer"
          >
            {copiedHeadingId === id ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
          </button>
        </h3>
      );
      continue;
    }

    // 9. Bullet List Items: - Item or * Item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inList && isNumberedList) {
        flushList();
      }
      inList = true;
      isNumberedList = false;
      const itemText = line.substring(2);
      listItems.push(
        <li key={`li-${listItems.length}`} className="text-left pl-1">
          {renderFormattedText(itemText)}
        </li>
      );
      continue;
    }

    // 10. Numbered List Items: 1. Item
    if (/^\d+\.\s/.test(line)) {
      if (inList && !isNumberedList) {
        flushList();
      }
      inList = true;
      isNumberedList = true;
      const itemText = line.replace(/^\d+\.\s/, '');
      listItems.push(
        <li key={`nli-${listItems.length}`} className="text-left pl-1">
          {renderFormattedText(itemText)}
        </li>
      );
      continue;
    }

    // 11. Regular Paragraph
    flushAll();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-3.5 text-sm sm:text-[15.5px] text-slate-600 dark:text-slate-300 leading-relaxed text-left"
      >
        {renderFormattedText(line)}
      </p>
    );
  }

  flushAll();

  return <div className="space-y-1">{elements}</div>;
};
