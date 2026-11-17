import { BookOpen, RotateCcw } from 'lucide-react';
import type { ClinicalPreset } from '../types/pharmacology';

interface TopBarProps {
  presets: ClinicalPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: ClinicalPreset) => void;
  onResetDefault: () => void;
  onOpenMethodology: () => void;
}

export function TopBar({
  presets,
  activePresetId,
  onSelectPreset,
  onResetDefault,
  onOpenMethodology,
}: TopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-4 md:gap-8 shrink-0">
      {/* Zone 1: Single-line brand wordmark */}
      <a
        href="#workspace"
        className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
      >
        MedGraph DDI
      </a>

      {/* Zone 2: Concise single-line case links + methodology */}
      <nav
        aria-label="Clinical case presets"
        className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
      >
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                isActive
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {preset.shortTitle}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onOpenMethodology}
          className="py-1 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Methodology</span>
        </button>
      </nav>

      {/* Zone 3: Single primary header action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenMethodology}
          className="md:hidden px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Methodology
        </button>
        <button
          type="button"
          onClick={onResetDefault}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Case</span>
        </button>
      </div>
    </header>
  );
}
