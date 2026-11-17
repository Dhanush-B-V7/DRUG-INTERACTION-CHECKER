import test from 'node:test';
import assert from 'node:assert/strict';
import { CLINICAL_PRESETS } from '../data/pharmacologyCatalog';
import {
  buildInteractionGraph,
  findInteractionBetween,
  searchMedications,
} from './interactionEngine';

test('default cardiovascular preset detects all four interaction tiers', () => {
  const defaultPreset = CLINICAL_PRESETS[0];
  const graph = buildInteractionGraph(defaultPreset.medications, 'all');

  assert.equal(graph.summary.majorCount >= 1, true, 'Expected at least 1 Major interaction');
  assert.equal(graph.summary.moderateCount >= 2, true, 'Expected at least 2 Moderate interactions');
  assert.equal(graph.summary.safeCount >= 1, true, 'Expected at least 1 Safe pairing');
  assert.equal(
    graph.summary.aiPredictedCount >= 1,
    true,
    'Expected at least 1 AI-predicted GNN link'
  );
  assert.equal(graph.summary.highestRisk, 'major');
});

test('verified clinical facts are strictly distinguished from GNN predictions', () => {
  const verified = findInteractionBetween('warfarin', 'aspirin');
  assert.ok(verified);
  assert.equal(verified.provenance, 'clinical_verified');
  assert.equal(verified.severity, 'major');

  const predicted = findInteractionBetween('simvastatin', 'warfarin');
  assert.ok(predicted);
  assert.equal(predicted.provenance, 'gnn_predicted');
  assert.equal(predicted.severity, 'ai_predicted');
  assert.equal(predicted.clinicalMode.gnnExplainerPaths.length > 0, true);
});

test('edge filter modes isolate AI predictions and clinical alerts cleanly', () => {
  const defaultPreset = CLINICAL_PRESETS[0];

  const aiOnly = buildInteractionGraph(defaultPreset.medications, 'ai_only');
  assert.equal(aiOnly.interactionEdges.length, aiOnly.summary.aiPredictedCount);
  assert.equal(
    aiOnly.interactionEdges.every((e) => e.interaction.provenance === 'gnn_predicted'),
    true
  );

  const alertsOnly = buildInteractionGraph(defaultPreset.medications, 'alerts_only');
  assert.equal(
    alertsOnly.interactionEdges.some((e) => e.interaction.severity === 'safe'),
    false
  );
});

test('empty regimen produces empty graph with nominal summary', () => {
  const graph = buildInteractionGraph([]);
  assert.equal(graph.nodes.length, 0);
  assert.equal(graph.interactionEdges.length, 0);
  assert.equal(graph.biologicalEdges.length, 0);
  assert.equal(graph.summary.totalPairs, 0);
  assert.equal(graph.summary.highestRisk, 'none');
});

test('autocomplete search excludes active medications and matches class/indication', () => {
  const matches = searchMedications('amio', ['warfarin', 'aspirin']);
  assert.equal(matches.some((d) => d.id === 'amiodarone'), true);

  const excluded = searchMedications('war', ['warfarin']);
  assert.equal(excluded.some((d) => d.id === 'warfarin'), false);
});

test('graph layout assigns distinct non-overlapping coordinates to all nodes', () => {
  for (const preset of CLINICAL_PRESETS) {
    const graph = buildInteractionGraph(preset.medications);
    for (let i = 0; i < graph.nodes.length; i++) {
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const a = graph.nodes[i];
        const b = graph.nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        assert.equal(
          dist >= 32,
          true,
          `Nodes ${a.id} and ${b.id} in preset ${preset.id} are too close (${dist.toFixed(1)}px)`
        );
      }
    }
  }
});

test('deterministic GNN synthesis catches uncataloged inhibitor-substrate pairs', () => {
  // Amiodarone inhibits CYP2D6; Metoprolol is a CYP2D6 substrate (not explicitly in INTERACTION_RECORDS)
  const interaction = findInteractionBetween('amiodarone', 'metoprolol');
  assert.ok(interaction);
  assert.equal(interaction.provenance, 'gnn_predicted');
  assert.equal(interaction.severity, 'ai_predicted');
  assert.equal(interaction.clinicalMode.gnnExplainerPaths.length, 1);
});
