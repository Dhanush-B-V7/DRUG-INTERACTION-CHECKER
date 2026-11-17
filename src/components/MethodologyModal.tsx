import { Network, ShieldCheck, X } from 'lucide-react';
import { useEffect } from 'react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="methodology-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="methodology-title" className="font-display text-lg font-bold text-slate-900">
            Dual-Layer Polypharmacy Architecture
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close methodology dialog"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            Traditional drug interaction checkers rely exclusively on pairwise rule tables, which often miss multi-drug metabolic bottlenecks or hide the biological rationale behind an alert. MedGraph DDI pairs deterministic pharmacology lookups with heterogeneous graph link prediction.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>1. Verified Clinical Rules</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Major (red), Moderate (orange), and Safe (green) solid edges reflect established FDA labeling, CPIC pharmacogenomic guidance, and clinical pharmacology references.
              </p>
            </div>

            <div className="border border-violet-200 bg-violet-50/40 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-violet-950 font-semibold">
                <Network className="w-4 h-4 text-violet-700" aria-hidden="true" />
                <span>2. GNN Link Prediction</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dashed purple edges highlight emergent or multi-hop competition across shared CYP450 enzymes, transporters (P-gp/OATP1B1), and downstream targets, accompanied by GNNExplainer attribution weights.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <h3 className="font-display font-semibold text-slate-900">
              Tailored Dual-Audience Explanations
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
              <li>
                <strong className="text-slate-800">Patient Mode:</strong> Plain-language guidance focused on actionable monitoring, symptoms to watch for, and avoiding abrupt medication discontinuation.
              </li>
              <li>
                <strong className="text-slate-800">Student / Clinical Mode:</strong> Pharmacokinetic vs. pharmacodynamic mechanisms, confidence scores, and multi-hop GNNExplainer pathway weights.
              </li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            Return to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
