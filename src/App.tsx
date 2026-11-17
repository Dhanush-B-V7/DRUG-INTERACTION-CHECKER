/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ExplanationDrawer } from './components/ExplanationDrawer';
import { InteractionGraphCanvas } from './components/InteractionGraphCanvas';
import { MethodologyModal } from './components/MethodologyModal';
import { RegimenTray } from './components/RegimenTray';
import { TopBar } from './components/TopBar';
import { CLINICAL_PRESETS } from './data/pharmacologyCatalog';
import type {
  ActiveMedication,
  CanvasSelection,
  ClinicalPreset,
  EdgeFilterMode,
  ExplanationMode,
} from './types/pharmacology';
import { buildInteractionGraph, getDrugById } from './utils/interactionEngine';

const DEFAULT_PRESET = CLINICAL_PRESETS[0];

function medicationsEqual(a: ActiveMedication[], b: ActiveMedication[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (item, idx) => item.drugId === b[idx].drugId && item.dosage === b[idx].dosage
  );
}

export default function App() {
  const [activePresetId, setActivePresetId] = useState<string | null>(DEFAULT_PRESET.id);
  const [draftMedications, setDraftMedications] = useState<ActiveMedication[]>(
    DEFAULT_PRESET.medications
  );
  const [analyzedMedications, setAnalyzedMedications] = useState<ActiveMedication[]>(
    DEFAULT_PRESET.medications
  );
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('patient');
  const [edgeFilter, setEdgeFilter] = useState<EdgeFilterMode>('all');
  const [selection, setSelection] = useState<CanvasSelection>({ type: 'overview' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const analyzeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) window.clearTimeout(analyzeTimerRef.current);
    };
  }, []);

  const graph = useMemo(
    () => buildInteractionGraph(analyzedMedications, edgeFilter),
    [analyzedMedications, edgeFilter]
  );

  const hasPendingChanges = useMemo(
    () => !medicationsEqual(draftMedications, analyzedMedications),
    [draftMedications, analyzedMedications]
  );

  const handleAddMedication = (drugId: string) => {
    const drug = getDrugById(drugId);
    if (!drug) return;
    setActivePresetId(null);
    setDraftMedications((prev) => {
      if (prev.some((m) => m.drugId === drugId)) return prev;
      return [...prev, { drugId: drug.id, dosage: drug.defaultDosage }];
    });
  };

  const handleUpdateDosage = (drugId: string, dosage: string) => {
    setActivePresetId(null);
    setDraftMedications((prev) =>
      prev.map((m) => (m.drugId === drugId ? { ...m, dosage } : m))
    );
  };

  const handleRemoveMedication = (drugId: string) => {
    setActivePresetId(null);
    setDraftMedications((prev) => prev.filter((m) => m.drugId !== drugId));
  };

  const handleClearAll = () => {
    setActivePresetId(null);
    setDraftMedications([]);
    setAnalyzedMedications([]);
    setSelection({ type: 'overview' });
  };

  const handleRunAnalysis = () => {
    if (analyzeTimerRef.current) window.clearTimeout(analyzeTimerRef.current);
    setIsAnalyzing(true);
    const snapshotMeds = [...draftMedications];

    analyzeTimerRef.current = window.setTimeout(() => {
      setAnalyzedMedications(snapshotMeds);
      setSelection({ type: 'overview' });
      setIsAnalyzing(false);
    }, 200);
  };

  const handleSelectPreset = (preset: ClinicalPreset) => {
    if (analyzeTimerRef.current) window.clearTimeout(analyzeTimerRef.current);
    setIsAnalyzing(false);
    setActivePresetId(preset.id);
    setDraftMedications(preset.medications);
    setAnalyzedMedications(preset.medications);
    setEdgeFilter('all');
    setSelection({ type: 'overview' });
  };

  const handleResetDefault = () => {
    handleSelectPreset(DEFAULT_PRESET);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        presets={CLINICAL_PRESETS}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onResetDefault={handleResetDefault}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      <main
        id="workspace"
        className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 grid grid-cols-12 gap-4 items-stretch"
      >
        <RegimenTray
          draftMedications={draftMedications}
          analyzedMedications={analyzedMedications}
          interactionEdges={graph.interactionEdges}
          hasPendingChanges={hasPendingChanges}
          isAnalyzing={isAnalyzing}
          presets={CLINICAL_PRESETS}
          activePresetId={activePresetId}
          onAddMedication={handleAddMedication}
          onUpdateDosage={handleUpdateDosage}
          onRemoveMedication={handleRemoveMedication}
          onClearAll={handleClearAll}
          onRunAnalysis={handleRunAnalysis}
          onSelectPreset={handleSelectPreset}
          onInspectDrugNode={(drugId) =>
            setSelection({ type: 'node', nodeId: `drug:${drugId}` })
          }
        />

        <InteractionGraphCanvas
          graph={graph}
          mode={explanationMode}
          selection={selection}
          edgeFilter={edgeFilter}
          isAnalyzing={isAnalyzing}
          onChangeEdgeFilter={setEdgeFilter}
          onSelectInteraction={(interactionId) =>
            setSelection({ type: 'interaction', interactionId })
          }
          onSelectNode={(nodeId) => setSelection({ type: 'node', nodeId })}
          onClearSelection={() => setSelection({ type: 'overview' })}
        />

        <ExplanationDrawer
          mode={explanationMode}
          selection={selection}
          graph={graph}
          onChangeMode={setExplanationMode}
          onSelectInteraction={(interactionId) =>
            setSelection({ type: 'interaction', interactionId })
          }
          onClearSelection={() => setSelection({ type: 'overview' })}
        />
      </main>

      <DisclaimerBanner />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
