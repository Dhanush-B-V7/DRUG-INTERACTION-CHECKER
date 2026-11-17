import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Network,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ENZYME_CATALOG, TARGET_CATALOG } from '../data/pharmacologyCatalog';
import type {
  CanvasSelection,
  ExplanationMode,
  InteractionEdge,
  InteractionRecord,
  InteractionSeverity,
  KnowledgeGraphData,
} from '../types/pharmacology';
import { getDrugById } from '../utils/interactionEngine';

interface ExplanationDrawerProps {
  mode: ExplanationMode;
  selection: CanvasSelection;
  graph: KnowledgeGraphData;
  onChangeMode: (mode: ExplanationMode) => void;
  onSelectInteraction: (interactionId: string) => void;
  onClearSelection: () => void;
}

function getSeverityMeta(severity: InteractionSeverity) {
  switch (severity) {
    case 'major':
      return {
        label: 'Major Interaction',
        textClass: 'text-red-800',
        borderClass: 'border-red-200',
        bgClass: 'bg-red-50/70',
        icon: AlertOctagon,
      };
    case 'moderate':
      return {
        label: 'Moderate Interaction',
        textClass: 'text-orange-800',
        borderClass: 'border-orange-200',
        bgClass: 'bg-orange-50/70',
        icon: AlertTriangle,
      };
    case 'safe':
      return {
        label: 'Safe Pairing',
        textClass: 'text-emerald-800',
        borderClass: 'border-emerald-200',
        bgClass: 'bg-emerald-50/60',
        icon: CheckCircle2,
      };
    case 'ai_predicted':
      return {
        label: 'AI-Predicted Link (GNN)',
        textClass: 'text-violet-900',
        borderClass: 'border-violet-200',
        bgClass: 'bg-violet-50/60',
        icon: Network,
      };
  }
}

export function ExplanationDrawer({
  mode,
  selection,
  graph,
  onChangeMode,
  onSelectInteraction,
  onClearSelection,
}: ExplanationDrawerProps) {
  const selectedEdge: InteractionEdge | undefined =
    selection.type === 'interaction'
      ? graph.interactionEdges.find((e) => e.id === selection.interactionId) ??
        undefined
      : undefined;

  const selectedNode =
    selection.type === 'node'
      ? graph.nodes.find((n) => n.id === selection.nodeId)
      : undefined;

  const renderInteractionDetails = (record: InteractionRecord) => {
    const drugA = getDrugById(record.drugA);
    const drugB = getDrugById(record.drugB);
    const meta = getSeverityMeta(record.severity);
    const Icon = meta.icon;
    const isGnn = record.provenance === 'gnn_predicted';
    const pct = Math.round(record.confidenceScore * 100);

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onClearSelection}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>All Interactions</span>
        </button>

        {/* Clear Verification Provenance Header */}
        <div className={`border ${meta.borderClass} ${meta.bgClass} rounded-lg p-3.5 space-y-2`}>
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${meta.textClass}`}>
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{meta.label}</span>
            </span>
            <span className="font-mono text-xs text-slate-600 tabular-nums">
              {pct}% conf.
            </span>
          </div>

          <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
            {drugA?.name ?? record.drugA} + {drugB?.name ?? record.drugB}
          </h3>
          <p className="text-xs font-medium text-slate-700">{record.title}</p>

          <div className="pt-2 border-t border-slate-200/70 flex items-center gap-1.5 text-xs">
            {isGnn ? (
              <>
                <Network className="w-3.5 h-3.5 text-violet-700 shrink-0" aria-hidden="true" />
                <span className="text-violet-900 font-medium">
                  Algorithmic GNN Hypothesis — requires clinical confirmation
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
                <span className="text-slate-600">
                  Verified Fact · {record.clinicalSource}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Mode-Specific Body */}
        {mode === 'patient' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                What This Means For You
              </h4>
              <p className="text-sm font-semibold text-slate-900">
                {record.patientMode.headline}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {record.patientMode.plainSummary}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3.5 space-y-2">
              <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                Symptoms to Watch For
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {record.patientMode.symptomsToWatch.map((sym, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5" aria-hidden="true">
                      •
                    </span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-3.5 space-y-2">
              <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                Recommended Next Steps
              </h4>
              <ol className="space-y-2 text-sm text-slate-700">
                {record.patientMode.actionableNextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-semibold text-blue-700 mt-0.5 tabular-nums">
                      0{i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Confidence & Evidence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {isGnn ? 'GNN Link Probability' : 'Clinical Evidence Confidence'}
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {(record.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isGnn ? 'bg-violet-600' : 'bg-blue-700'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{record.clinicalMode.evidenceLevel}</p>
            </div>

            {/* PK / PD Breakdown */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div>
                <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Pharmacokinetics (PK)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {record.clinicalMode.pkMechanism}
                </p>
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Pharmacodynamics (PD)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {record.clinicalMode.pdMechanism}
                </p>
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Clinical Management
                </h4>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {record.clinicalMode.clinicalManagement}
                </p>
              </div>
            </div>

            {/* GNNExplainer Attribution Paths */}
            {record.clinicalMode.gnnExplainerPaths.length > 0 ? (
              <div className="border-t border-slate-200 pt-3.5 space-y-2.5">
                <h4 className="font-display text-xs font-bold text-violet-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>GNNExplainer Attribution Paths</span>
                </h4>
                {record.clinicalMode.gnnExplainerPaths.map((path) => (
                  <div
                    key={path.id}
                    className="border border-violet-200 bg-violet-50/40 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {path.title}
                      </span>
                      <span className="font-mono text-xs font-semibold text-violet-800 tabular-nums">
                        attr {(path.importanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {path.hops.map((hop, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 text-xs bg-white border border-violet-100 rounded px-2 py-1.5"
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                            <span className="font-semibold text-slate-900">
                              {hop.fromLabel}
                            </span>
                            <ArrowRight className="w-3 h-3 text-violet-600 shrink-0" aria-hidden="true" />
                            <span className="font-mono text-[11px] text-slate-600">
                              {hop.relation}
                            </span>
                            <ArrowRight className="w-3 h-3 text-violet-600 shrink-0" aria-hidden="true" />
                            <span className="font-semibold text-slate-900">
                              {hop.toLabel}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-violet-800 tabular-nums shrink-0">
                            w={hop.weight.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {path.rationale}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Shared Pathway Tags
                </h4>
                <p className="text-xs font-mono text-slate-700">
                  {record.sharedMechanisms.join(' · ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    const connectedEdges = graph.interactionEdges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );

    if (selectedNode.kind === 'drug' && selectedNode.drugId) {
      const drug = getDrugById(selectedNode.drugId);
      if (!drug) return null;

      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Interactions</span>
          </button>

          <div className="border border-slate-200 rounded-lg p-3.5 space-y-1.5">
            <span className="font-mono text-[11px] text-slate-500 uppercase">
              Medication Node · {selectedNode.subLabel}
            </span>
            <h3 className="font-display text-base font-bold text-slate-900">
              {drug.name}
            </h3>
            <p className="text-xs text-slate-600">
              {drug.genericClass} · {drug.indication}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
              {mode === 'patient' ? 'Plain-Language Role' : 'Clinical Pharmacology'}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {mode === 'patient' ? drug.patientSummary : drug.clinicalPharmacology}
            </p>
          </div>

          {mode === 'clinical' && drug.enzymes.length > 0 && (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                CYP450 &amp; Transporter Profile
              </h4>
              <ul className="space-y-1.5 text-xs">
                {drug.enzymes.map((e) => (
                  <li
                    key={e.enzymeId}
                    className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-mono font-semibold text-teal-900">
                      {ENZYME_CATALOG[e.enzymeId]?.name ?? e.enzymeId}
                    </span>
                    <span className="font-mono text-slate-600">
                      {e.strength} {e.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
              Interactions Involving {drug.name} ({connectedEdges.length})
            </h4>
            {connectedEdges.length === 0 ? (
              <p className="text-xs text-slate-500">
                No interactions detected with current regimen filters.
              </p>
            ) : (
              <div className="space-y-2">
                {connectedEdges.map((edge) => {
                  const meta = getSeverityMeta(edge.interaction.severity);
                  const otherId =
                    edge.source === selectedNode.id ? edge.target : edge.source;
                  const otherName = otherId.replace('drug:', '');
                  const otherDrug = getDrugById(otherId.replace('drug:', ''));
                  return (
                    <button
                      key={edge.id}
                      type="button"
                      onClick={() => onSelectInteraction(edge.id)}
                      className="w-full text-left border border-slate-200 hover:border-blue-400 rounded-lg p-2.5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          + {otherDrug?.name ?? otherName}
                        </span>
                        <span className={`text-xs font-semibold ${meta.textClass}`}>
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 truncate">
                        {edge.interaction.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedNode.kind === 'enzyme' && selectedNode.enzymeId) {
      const enzyme = ENZYME_CATALOG[selectedNode.enzymeId];
      if (!enzyme) return null;

      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Interactions</span>
          </button>

          <div className="border border-teal-200 bg-teal-50/40 rounded-lg p-3.5 space-y-1">
            <span className="font-mono text-[11px] text-teal-800 uppercase">
              {mode === 'patient' ? 'Body Processing Enzyme' : 'Metabolic Enzyme Node'}
            </span>
            <h3 className="font-display text-base font-bold text-slate-900">
              {mode === 'patient' ? `${enzyme.patientName} (${enzyme.name})` : enzyme.name}
            </h3>
            <p className="text-xs text-slate-600">
              {enzyme.fullName} · {enzyme.family}
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {mode === 'patient' ? enzyme.patientDescription : enzyme.clinicalNotes}
          </p>
        </div>
      );
    }

    if (selectedNode.kind === 'target' && selectedNode.targetId) {
      const target = TARGET_CATALOG[selectedNode.targetId];
      if (!target) return null;

      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Interactions</span>
          </button>

          <div className="border border-indigo-200 bg-indigo-50/40 rounded-lg p-3.5 space-y-1">
            <span className="font-mono text-[11px] text-indigo-800 uppercase">
              {mode === 'patient' ? 'Where The Medicine Acts' : 'Target Protein Node'}
            </span>
            <h3 className="font-display text-base font-bold text-slate-900">
              {mode === 'patient' ? `${target.patientName} (${target.name})` : target.name}
            </h3>
            <p className="text-xs text-slate-600">
              {target.fullName} · {target.pathway}
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {mode === 'patient' ? target.patientDescription : target.clinicalNotes}
          </p>
        </div>
      );
    }

    return null;
  };

  const renderOverview = () => {
    const sortedEdges = [...graph.interactionEdges].sort((a, b) => {
      const rank: Record<InteractionSeverity, number> = {
        major: 4,
        moderate: 3,
        ai_predicted: 2,
        safe: 1,
      };
      return rank[b.interaction.severity] - rank[a.interaction.severity];
    });

    const verifiedEdges = sortedEdges.filter(
      (e) => e.interaction.provenance === 'clinical_verified'
    );
    const aiEdges = sortedEdges.filter(
      (e) => e.interaction.provenance === 'gnn_predicted'
    );

    const verifiedAlerts = verifiedEdges.filter(
      (e) => e.interaction.severity !== 'safe'
    );
    const verifiedSafe = verifiedEdges.filter(
      (e) => e.interaction.severity === 'safe'
    );

    const topPriorityEdge = sortedEdges[0];
    const topDrugA = topPriorityEdge ? getDrugById(topPriorityEdge.interaction.drugA)?.name : null;
    const topDrugB = topPriorityEdge ? getDrugById(topPriorityEdge.interaction.drugB)?.name : null;

    const summaryHeadline =
      graph.summary.majorCount > 0
        ? mode === 'patient'
          ? `Key Takeaway: ${graph.summary.majorCount} high-priority interaction found (${topDrugA} + ${topDrugB}).`
          : `Priority Alert: ${graph.summary.majorCount} Major clinical DDI detected (${topDrugA} + ${topDrugB}).`
        : graph.summary.moderateCount > 0
          ? mode === 'patient'
            ? `Key Takeaway: ${graph.summary.moderateCount} combinations need routine monitoring.`
            : `${graph.summary.moderateCount} Moderate pharmacokinetic/pharmacodynamic interactions identified.`
          : graph.summary.aiPredictedCount > 0
            ? mode === 'patient'
              ? 'No major confirmed conflicts; AI spotted a possible liver pathway overlap.'
              : 'No confirmed clinical alerts; GNN link prediction flagged theoretical pathway overlap.'
            : 'No harmful interactions detected across this regimen.';

    return (
      <div className="space-y-3.5 pb-2">
        {/* Compact 4-Metric Regimen Summary */}
        <div className="grid grid-cols-4 border border-slate-200 rounded-lg divide-x divide-slate-200 text-center bg-slate-50/50">
          <div className="py-2 px-1">
            <div className="font-mono text-base font-bold text-red-700 tabular-nums">
              {graph.summary.majorCount}
            </div>
            <div className="text-[11px] font-medium text-slate-600">Major</div>
          </div>
          <div className="py-2 px-1">
            <div className="font-mono text-base font-bold text-orange-700 tabular-nums">
              {graph.summary.moderateCount}
            </div>
            <div className="text-[11px] font-medium text-slate-600">Moderate</div>
          </div>
          <div className="py-2 px-1">
            <div className="font-mono text-base font-bold text-violet-700 tabular-nums">
              {graph.summary.aiPredictedCount}
            </div>
            <div className="text-[11px] font-medium text-slate-600">AI Link</div>
          </div>
          <div className="py-2 px-1">
            <div className="font-mono text-base font-bold text-emerald-700 tabular-nums">
              {graph.summary.safeCount}
            </div>
            <div className="text-[11px] font-medium text-slate-600">Safe</div>
          </div>
        </div>

        {/* Immediate Plain-Language Bottom-Line Takeaway */}
        {sortedEdges.length > 0 && (
          <div
            className={`border rounded-lg p-3 space-y-2 ${
              graph.summary.majorCount > 0
                ? 'bg-red-50/70 border-red-200'
                : graph.summary.moderateCount > 0
                  ? 'bg-orange-50/70 border-orange-200'
                  : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p className="text-xs font-semibold text-slate-900 leading-relaxed">
              {summaryHeadline}
            </p>
            {topPriorityEdge && (
              <button
                type="button"
                onClick={() => onSelectInteraction(topPriorityEdge.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                <span>
                  {mode === 'patient' ? 'See what to watch for' : 'Inspect mechanism'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {sortedEdges.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No interaction edges match the active filter or fewer than two medications are analyzed.
          </p>
        ) : (
          <div className="space-y-3.5">
            {verifiedAlerts.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Verified Clinical Alerts
                </h3>
                <div className="space-y-1.5">
                  {verifiedAlerts.map((edge) => {
                    const meta = getSeverityMeta(edge.interaction.severity);
                    const Icon = meta.icon;
                    const dA = getDrugById(edge.interaction.drugA);
                    const dB = getDrugById(edge.interaction.drugB);
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => onSelectInteraction(edge.id)}
                        className="w-full text-left border border-slate-200 hover:border-slate-400 bg-white rounded-lg p-2.5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-xs font-bold text-slate-900">
                            {dA?.name} + {dB?.name}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${meta.textClass}`}>
                            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>
                              {edge.interaction.severity === 'major' ? 'Major' : 'Moderate'}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {mode === 'patient'
                            ? edge.interaction.patientMode.headline
                            : edge.interaction.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {aiEdges.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="font-display text-xs font-bold text-violet-900 uppercase tracking-wide">
                  AI-Predicted Links (GNN)
                </h3>
                <div className="space-y-1.5">
                  {aiEdges.map((edge) => {
                    const dA = getDrugById(edge.interaction.drugA);
                    const dB = getDrugById(edge.interaction.drugB);
                    const pct = Math.round(edge.interaction.confidenceScore * 100);
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => onSelectInteraction(edge.id)}
                        className="w-full text-left border border-violet-200 hover:border-violet-400 bg-violet-50/35 rounded-lg p-2.5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-xs font-bold text-slate-900">
                            {dA?.name} + {dB?.name}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-violet-800 tabular-nums">
                            <Network className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>GNN {pct}%</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {mode === 'patient'
                            ? edge.interaction.patientMode.headline
                            : edge.interaction.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {verifiedSafe.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Verified Safe Pairings
                </h3>
                <div className="space-y-1.5">
                  {verifiedSafe.map((edge) => {
                    const dA = getDrugById(edge.interaction.drugA);
                    const dB = getDrugById(edge.interaction.drugB);
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => onSelectInteraction(edge.id)}
                        className="w-full text-left border border-slate-200 hover:border-slate-400 bg-white rounded-lg p-2.5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-xs font-bold text-slate-900">
                            {dA?.name} + {dB?.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Safe</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {mode === 'patient'
                            ? edge.interaction.patientMode.headline
                            : edge.interaction.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      aria-label="Interaction Explanation Drawer"
      className="col-span-12 lg:col-span-3 bg-white border border-slate-200 rounded-xl flex flex-col min-h-[460px] lg:h-[calc(100vh-146px)] overflow-hidden"
    >
      {/* Mode Switch Header */}
      <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-slate-900">
            Clinical Explanation
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Explanation audience mode"
          className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg border border-slate-200/80"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'patient'}
            onClick={() => onChangeMode('patient')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'patient'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Patient Mode</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'clinical'}
            onClick={() => onChangeMode('clinical')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'clinical'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Student/Clinical</span>
          </button>
        </div>
      </div>

      {/* Scrollable Explanation Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedEdge
          ? renderInteractionDetails(selectedEdge.interaction)
          : selectedNode
            ? renderNodeDetails()
            : renderOverview()}
      </div>
    </aside>
  );
}
