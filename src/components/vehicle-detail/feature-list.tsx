'use client';

import * as React from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import type { Vehicle } from '@/lib/types';

export function FeatureList({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = React.useState<string[]>(() => vehicle.features.slice(0, 2).map((g) => g.group));

  const toggle = (group: string) =>
    setOpen((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]));

  return (
    <div>
      <h2 className="headline-sm text-ivory">Ausstattung</h2>

      <div className="mt-6 border-t border-line">
        {vehicle.features.map((group) => {
          const isOpen = open.includes(group.group);
          return (
            <div key={group.group} className="border-b border-line">
              <button
                type="button"
                onClick={() => toggle(group.group)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[0.9375rem] text-ivory">{group.group}</span>
                  <span className="tnum text-xs text-ivory-500">{group.items.length}</span>
                </span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0 text-ivory-500" strokeWidth={1.5} />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-ivory-500" strokeWidth={1.5} />
                )}
              </button>

              {isOpen && (
                <ul className="grid gap-x-8 gap-y-2.5 pb-6 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.875rem] text-ivory-300">
                      <Check className="mt-1 h-3 w-3 shrink-0 text-champagne" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
