import React, { useState } from 'react';
import {
  ExternalLink,
  Info,
  CheckCircle2,
  Copy,
  Check,
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

export function extractHeadings(content: string): HeadingItem[] {
  if (!content) return [];
  const lines = content.split('\n');
  const headings: HeadingItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      headings.push({ id, text, level: 3 });
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      headings.push({ id, text, level: 2 });
    }
  }

  return headings;
}

export const RichArticleRenderer: React.FC<RichArticleRendererProps> = ({
  content,
  onNavigate,
}) => {
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<number | null>(null);

  if (!content) return null;

  // Split lines into blocks: headings, callout boxes, code blocks, lists, paragraphs
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let isNumberedList = false;
  let codeBlockCounter = 0;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            className="my-4 space-y-2 list-decimal list-inside text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-1"
          >
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="my-4 space-y-2 list-disc list-inside text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-1"
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

  const renderFormattedText = (text: string): React.ReactNode => {
    // Parse nested Markdown inline elements:
    // 1. [Anchor Text](URL) -> <a href=...>
    // 2. **Bold** -> <strong>
    // 3. *Italic* -> <em>
    // 4. `code` -> <code>
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(renderInlineFormatting(text.substring(lastIdx, match.index)));
      }
      const anchorText = match[1];
      const url = match[2];
      const isInternal = url.startsWith('/') && onNavigate;

      parts.push(
        isInternal ? (
          <button
            key={`link-${match.index}`}
            type="button"
            onClick={() => onNavigate(url)}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-3 decoration-blue-400/40 hover:decoration-blue-600 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>{anchorText}</span>
          </button>
        ) : (
          <a
            key={`link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-3 decoration-blue-400/40 hover:decoration-blue-600 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>{anchorText}</span>
            <ExternalLink className="h-3 w-3 inline-block shrink-0 opacity-70" />
          </a>
        )
      );

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(renderInlineFormatting(text.substring(lastIdx)));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderInlineFormatting = (str: string): React.ReactNode => {
    // Handles **bold**, `code`, and *italic*
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
            className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200/60 dark:border-slate-700/60"
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

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check Code Blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const blockId = codeBlockCounter++;
        const codeText = codeBuffer.join('\n');
        elements.push(
          <div
            key={`code-${elements.length}`}
            className="my-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 overflow-hidden text-left shadow-xs"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>{codeLang || 'bash'}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(codeText);
                  setCopiedCodeBlock(blockId);
                  setTimeout(() => setCopiedCodeBlock(null), 2000);
                }}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeBlock === blockId ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = '';
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Empty lines
    if (!line) {
      flushList();
      continue;
    }

    // Callout / Blockquote: > Pro-Tip: ...
    if (line.startsWith('>')) {
      flushList();
      const quoteText = line.replace(/^>\s*/, '');
      elements.push(
        <div
          key={`callout-${elements.length}`}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3 text-left shadow-2xs"
        >
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {renderFormattedText(quoteText)}
          </div>
        </div>
      );
      continue;
    }

    // H2 Headings: ## Heading
    if (line.startsWith('## ')) {
      flushList();
      const text = line.replace('## ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={id}
          className="scroll-mt-24 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-8 mb-3 text-left flex items-center gap-2 group"
        >
          <span>{text}</span>
          <a
            href={`#${id}`}
            aria-label={`Link to section ${text}`}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity text-sm"
          >
            #
          </a>
        </h2>
      );
      continue;
    }

    // H3 Headings: ### Subheading
    if (line.startsWith('### ')) {
      flushList();
      const text = line.replace('### ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          id={id}
          className="scroll-mt-24 text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-6 mb-2.5 text-left flex items-center gap-2 group"
        >
          <span>{text}</span>
          <a
            href={`#${id}`}
            aria-label={`Link to section ${text}`}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity text-sm"
          >
            #
          </a>
        </h3>
      );
      continue;
    }

    // Bullet List Items: - Item or * Item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      isNumberedList = false;
      const itemText = line.substring(2);
      listItems.push(
        <li key={`li-${listItems.length}`} className="text-left">
          {renderFormattedText(itemText)}
        </li>
      );
      continue;
    }

    // Numbered List Items: 1. Item
    if (/^\d+\.\s/.test(line)) {
      inList = true;
      isNumberedList = true;
      const itemText = line.replace(/^\d+\.\s/, '');
      listItems.push(
        <li key={`nli-${listItems.length}`} className="text-left">
          {renderFormattedText(itemText)}
        </li>
      );
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-left"
      >
        {renderFormattedText(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
};
