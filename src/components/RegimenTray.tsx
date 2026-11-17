import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Network,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type {
  ActiveMedication,
  ClinicalPreset,
  InteractionEdge,
  InteractionSeverity,
} from '../types/pharmacology';
import { getDrugById, searchMedications } from '../utils/interactionEngine';

interface RegimenTrayProps {
  draftMedications: ActiveMedication[];
  analyzedMedications: ActiveMedication[];
  interactionEdges: InteractionEdge[];
  hasPendingChanges: boolean;
  isAnalyzing: boolean;
  presets: ClinicalPreset[];
  activePresetId: string | null;
  onAddMedication: (drugId: string) => void;
  onUpdateDosage: (drugId: string, dosage: string) => void;
  onRemoveMedication: (drugId: string) => void;
  onClearAll: () => void;
  onRunAnalysis: () => void;
  onSelectPreset: (preset: ClinicalPreset) => void;
  onInspectDrugNode: (drugId: string) => void;
}

const SEVERITY_PRIORITY: Record<InteractionSeverity, number> = {
  major: 4,
  moderate: 3,
  ai_predicted: 2,
  safe: 1,
};

function getDrugRiskStatus(
  drugId: string,
  edges: InteractionEdge[]
): { tier: InteractionSeverity | 'none'; label: string } {
  let highest: InteractionSeverity | 'none' = 'none';
  const nodeId = `drug:${drugId}`;
  for (const edge of edges) {
    if (edge.source !== nodeId && edge.target !== nodeId) continue;
    const sev = edge.interaction.severity;
    if (highest === 'none' || SEVERITY_PRIORITY[sev] > SEVERITY_PRIORITY[highest]) {
      highest = sev;
    }
  }
  if (highest === 'major') return { tier: 'major', label: 'Major Risk' };
  if (highest === 'moderate') return { tier: 'moderate', label: 'Monitor' };
  if (highest === 'ai_predicted') return { tier: 'ai_predicted', label: 'AI Pattern' };
  if (highest === 'safe') return { tier: 'safe', label: 'Safe' };
  return { tier: 'none', label: 'Pending Analysis' };
}

export function RegimenTray({
  draftMedications,
  analyzedMedications,
  interactionEdges,
  hasPendingChanges,
  isAnalyzing,
  presets,
  activePresetId,
  onAddMedication,
  onUpdateDosage,
  onRemoveMedication,
  onClearAll,
  onRunAnalysis,
  onSelectPreset,
  onInspectDrugNode,
}: RegimenTrayProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const blurTimeoutRef = useRef<number | null>(null);

  const activeIds = useMemo(
    () => draftMedications.map((m) => m.drugId),
    [draftMedications]
  );

  const searchResults = useMemo(
    () => searchMedications(query, activeIds),
    [query, activeIds]
  );

  const analyzedSet = useMemo(
    () => new Set(analyzedMedications.map((m) => m.drugId)),
    [analyzedMedications]
  );

  const handleSelectDrug = (drugId: string) => {
    onAddMedication(drugId);
    setQuery('');
    setHighlightedIndex(0);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsDropdownOpen(true);
      return;
    }
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      return;
    }
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = searchResults[highlightedIndex] ?? searchResults[0];
      if (target) handleSelectDrug(target.id);
    }
  };

  return (
    <section
      aria-label="Medication Regimen Tray"
      className="col-span-12 lg:col-span-3 bg-white border border-slate-200 rounded-xl flex flex-col min-h-[420px] lg:h-[calc(100vh-146px)] overflow-hidden"
    >
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-base font-bold text-slate-900">
              Active Regimen
            </h1>
            <p className="text-xs text-slate-500 tabular-nums">
              {draftMedications.length}{' '}
              {draftMedications.length === 1 ? 'medication' : 'medications'} · click name to focus
            </p>
          </div>
          {draftMedications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium text-slate-500 hover:text-red-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Mobile preset selector (hidden on md+ where TopBar shows links) */}
        <div className="md:hidden">
          <label htmlFor="mobile-preset-select" className="sr-only">
            Load clinical case preset
          </label>
          <select
            id="mobile-preset-select"
            value={activePresetId ?? ''}
            onChange={(e) => {
              const found = presets.find((p) => p.id === e.target.value);
              if (found) onSelectPreset(found);
            }}
            className="w-full px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
          >
            <option value="" disabled>
              Load clinical sample case...
            </option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Autocomplete Search */}
        <div className="relative">
          <label htmlFor="medication-search" className="sr-only">
            Search medications to add
          </label>
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="medication-search"
            type="text"
            role="combobox"
            aria-expanded={isDropdownOpen}
            aria-controls="medication-autocomplete-list"
            aria-autocomplete="list"
            value={query}
            placeholder="Add medication (e.g., Amiodarone)..."
            onFocus={() => {
              if (blurTimeoutRef.current) window.clearTimeout(blurTimeoutRef.current);
              setIsDropdownOpen(true);
            }}
            onBlur={() => {
              blurTimeoutRef.current = window.setTimeout(() => {
                setIsDropdownOpen(false);
              }, 160);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
              setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors"
          />

          {isDropdownOpen && (
            <ul
              id="medication-autocomplete-list"
              role="listbox"
              aria-label="Matching medications"
              className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100"
            >
              {searchResults.length === 0 ? (
                <li className="px-3 py-2.5 text-xs text-slate-500">
                  No additional matching medications found.
                </li>
              ) : (
                searchResults.map((drug, idx) => (
                  <li key={drug.id} role="option" aria-selected={idx === highlightedIndex}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectDrug(drug.id);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        idx === highlightedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {drug.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {drug.genericClass} · {drug.defaultDosage}
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Active Medication List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
        {draftMedications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 border border-dashed border-slate-200 rounded-lg bg-slate-50/60">
            <p className="font-display text-sm font-semibold text-slate-800">
              No medications in regimen
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
              Search above to add medications or load a sample clinical case to inspect pathway interactions.
            </p>
            <button
              type="button"
              onClick={() => onSelectPreset(presets[0])}
              className="mt-4 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              Load Cardiovascular Case
            </button>
          </div>
        ) : (
          draftMedications.map((med) => {
            const drug = getDrugById(med.drugId);
            if (!drug) return null;

            const isInAnalyzedGraph = analyzedSet.has(med.drugId);
            const status = isInAnalyzedGraph
              ? getDrugRiskStatus(med.drugId, interactionEdges)
              : { tier: 'none' as const, label: 'Ready to Analyze' };

            return (
              <div
                key={med.drugId}
                data-testid={`regimen-card-${drug.id}`}
                className="border border-slate-200 bg-white rounded-lg p-2.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (isInAnalyzedGraph) onInspectDrugNode(drug.id);
                        }}
                        className={`font-display text-sm font-bold text-slate-900 truncate text-left leading-tight ${
                          isInAnalyzedGraph
                            ? 'hover:text-blue-700 cursor-pointer'
                            : 'cursor-default'
                        }`}
                      >
                        {drug.name}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {drug.genericClass} · {drug.route}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveMedication(drug.id)}
                    aria-label={`Delete ${drug.name}`}
                    className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor={`dosage-${drug.id}`} className="sr-only">
                      Dosage for {drug.name}
                    </label>
                    <select
                      id={`dosage-${drug.id}`}
                      value={med.dosage}
                      onChange={(e) => onUpdateDosage(drug.id, e.target.value)}
                      className="font-mono text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-600 tabular-nums"
                    >
                      {drug.availableDosages.map((dose) => (
                        <option key={dose} value={dose}>
                          {dose}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unboxed non-hue-only status label */}
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap ${
                      status.tier === 'major'
                        ? 'text-red-700'
                        : status.tier === 'moderate'
                          ? 'text-orange-700'
                          : status.tier === 'ai_predicted'
                            ? 'text-violet-700'
                            : status.tier === 'safe'
                              ? 'text-emerald-700'
                              : 'text-slate-500'
                    }`}
                  >
                    {status.tier === 'major' && (
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {status.tier === 'moderate' && (
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {status.tier === 'ai_predicted' && (
                      <Network className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {status.tier === 'safe' && (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    )}
                    <span>{status.label}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Prominent Trigger Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-2 shrink-0">
        {hasPendingChanges && (
          <p className="text-xs font-medium text-blue-800 text-center">
            Regimen updated — run analysis to refresh graph
          </p>
        )}
        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60 ${
            hasPendingChanges
              ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{isAnalyzing ? 'Analyzing Pathways...' : 'Run Interaction Analysis'}</span>
        </button>
      </div>
    </section>
  );
}
