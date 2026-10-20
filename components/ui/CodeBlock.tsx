'use client';

import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSite } from '../providers';

type Lang = 'sql' | 'java' | 'apex' | 'mql5';

const KEYWORDS: Record<Lang, string[]> = {
  sql: ['WITH', 'AS', 'SELECT', 'FROM', 'JOIN', 'ON', 'AND', 'WHERE', 'GROUP', 'BY', 'ORDER', 'DESC', 'CROSS', 'APPLY', 'TOP', 'OVER', 'NULLIF', 'SUM', 'RANK', 'INSERT', 'UPDATE', 'INTO', 'VALUES', 'CREATE', 'PROCEDURE', 'TRIGGER', 'BEGIN', 'END'],
  java: ['public', 'class', 'implements', 'void', 'throws', 'for', 'if', 'return', 'new', 'private', 'static', 'final', 'Override'],
  apex: ['trigger', 'on', 'before', 'insert', 'update', 'for', 'if', 'continue', 'null', 'Map', 'Decimal', 'Integer', 'Trigger'],
  mql5: ['int', 'void', 'double', 'bool', 'return', 'if', 'true', 'false'],
};

const TOKEN = /(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(@?[A-Za-z_][\w]*)(\s*\()?/g;

function highlight(code: string, lang: Lang): React.ReactNode[] {
  const kw = new Set(KEYWORDS[lang].map((k) => (lang === 'sql' ? k.toUpperCase() : k)));
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [full, com, str, num, word, paren] = m;
    if (com) out.push(<span key={i++} className="tok-com">{com}</span>);
    else if (str) out.push(<span key={i++} className="tok-str">{str}</span>);
    else if (num) out.push(<span key={i++} className="tok-num">{num}</span>);
    else if (word) {
      const isKw = kw.has(lang === 'sql' ? word.toUpperCase() : word);
      const cls = isKw ? 'tok-kw' : paren ? 'tok-fn' : word.startsWith('@') ? 'tok-num' : undefined;
      out.push(cls ? <span key={i++} className={cls}>{word}</span> : word);
      if (paren) out.push(paren);
    } else out.push(full);
    last = m.index + full.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBlock({ code, lang, filename, caption }: { code: string; lang: Lang; filename: string; caption?: string }) {
  const { t } = useSite();
  const [copied, setCopied] = useState(false);
  const nodes = useMemo(() => highlight(code, lang), [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
          </span>
          <span className="font-mono text-xs text-muted">{filename}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-muted hover:text-fg"
          aria-label={t.common.copy}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          <span aria-live="polite">{copied ? t.common.copied : lang.toUpperCase()}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed sm:text-[13px]">
        <code className="font-mono">{nodes}</code>
      </pre>
      {caption && <figcaption className="border-t border-line px-4 py-2 text-xs text-muted">{caption}</figcaption>}
    </figure>
  );
}
