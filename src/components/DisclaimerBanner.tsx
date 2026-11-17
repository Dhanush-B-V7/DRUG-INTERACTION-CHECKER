import { ShieldAlert } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className="bg-amber-50 border-t border-amber-200 px-4 sm:px-6 py-2.5 text-xs text-amber-950 shrink-0"
    >
      <div className="max-w-[1600px] mx-auto flex items-start sm:items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Clinical Decision Support Disclaimer:</strong>{' '}
          For educational and informational use only—not a substitute for professional medical advice, diagnosis, or treatment.{' '}
          <span className="font-medium">Solid edges</span> indicate verified pharmacology database interactions;{' '}
          <span className="font-medium text-violet-900">dashed purple edges</span> represent experimental Graph Neural Network (GNN) predictions requiring clinical validation. Never alter or stop prescribed therapy without consulting your physician or pharmacist.
        </p>
      </div>
    </aside>
  );
}
