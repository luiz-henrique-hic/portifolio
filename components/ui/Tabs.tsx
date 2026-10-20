'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useRef, useState } from 'react';

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="no-scrollbar -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
      >
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                selected ? 'text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              {item.label}
              {selected && (
                <motion.span
                  layoutId={`${id}-underline`}
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={items[active].key}
          role="tabpanel"
          id={`${id}-panel-${active}`}
          aria-labelledby={`${id}-tab-${active}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {items[active].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
