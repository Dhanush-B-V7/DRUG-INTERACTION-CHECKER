import {
  Eye,
  EyeOff,
  Maximize2,
  Network,
  Sliders,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  CanvasSelection,
  EdgeFilterMode,
  ExplanationMode,
  GraphNode,
  InteractionEdge,
  InteractionSeverity,
  KnowledgeGraphData,
} from '../types/pharmacology';

interface InteractionGraphCanvasProps {
  graph: KnowledgeGraphData;
  mode: ExplanationMode;
  selection: CanvasSelection;
  edgeFilter: EdgeFilterMode;
  isAnalyzing: boolean;
  onChangeEdgeFilter: (mode: EdgeFilterMode) => void;
  onSelectInteraction: (interactionId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onClearSelection: () => void;
}

const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 560;
const CENTER_X = LOGICAL_WIDTH / 2;
const CENTER_Y = LOGICAL_HEIGHT / 2;

function getEdgeStyle(severity: InteractionSeverity) {
  switch (severity) {
    case 'major':
      return {
        stroke: '#DC2626',
        halo: 'rgba(220, 38, 38, 0.16)',
        strokeWidth: 3,
        dash: undefined,
        badgeBg: '#FEF2F2',
        badgeBorder: '#FCA5A5',
        badgeText: '#991B1B',
        shortLabel: 'MAJOR',
      };
    case 'moderate':
      return {
        stroke: '#EA580C',
        halo: 'rgba(234, 88, 12, 0.15)',
        strokeWidth: 2.5,
        dash: undefined,
        badgeBg: '#FFF7ED',
        badgeBorder: '#FDBA74',
        badgeText: '#9A3412',
        shortLabel: 'MODERATE',
      };
    case 'safe':
      return {
        stroke: '#16A34A',
        halo: 'rgba(22, 163, 74, 0.14)',
        strokeWidth: 2,
        dash: undefined,
        badgeBg: '#F0FDF4',
        badgeBorder: '#86EFAC',
        badgeText: '#166534',
        shortLabel: 'SAFE',
      };
    case 'ai_predicted':
      return {
        stroke: '#7C3AED',
        halo: 'rgba(124, 58, 237, 0.18)',
        strokeWidth: 2.5,
        dash: '7 5',
        badgeBg: '#F5F3FF',
        badgeBorder: '#C4B5FD',
        badgeText: '#5B21B6',
        shortLabel: 'GNN AI',
      };
  }
}

function getDrugNodeStroke(risk: GraphNode['riskTier'], isSelected: boolean) {
  if (isSelected) return '#1D4ED8';
  switch (risk) {
    case 'major':
      return '#DC2626';
    case 'moderate':
      return '#EA580C';
    case 'ai_predicted':
      return '#7C3AED';
    case 'safe':
      return '#16A34A';
    default:
      return '#64748B';
  }
}

/**
 * Computes a quadratic Bezier curve that bows outward away from the center enzyme cluster
 * so DDI arcs remain clear and clickable without overlapping central CYP/target nodes.
 */
function computeInteractionArc(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  edgeIndex: number
) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;

  // Normal vector perpendicular to segment AB
  let nx = -dy / len;
  let ny = dx / len;

  // Orient normal outward away from canvas center (with deterministic tie-break for opposite chords)
  const toCenterX = mx - CENTER_X;
  const toCenterY = my - CENTER_Y;
  const distFromCenter = Math.hypot(toCenterX, toCenterY);
  if (distFromCenter < 35) {
    // Opposite nodes: push upward-right or downward-left cleanly outside the core
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
  } else if (nx * toCenterX + ny * toCenterY < 0) {
    nx = -nx;
    ny = -ny;
  }

  // If chord passes close to the central metabolic cluster, bow it further outward around inner nodes
  const centerProximityBoost = distFromCenter < 165 ? 168 : 56;
  const bow = centerProximityBoost + (edgeIndex % 3) * 18;
  const cx = mx + nx * bow;
  const cy = my + ny * bow;

  // Quadratic Bezier midpoint at t = 0.5
  const labelX = 0.25 * ax + 0.5 * cx + 0.25 * bx;
  const labelY = 0.25 * ay + 0.5 * cy + 0.25 * by;

  return {
    path: `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`,
    labelX,
    labelY,
  };
}

export function InteractionGraphCanvas({
  graph,
  mode,
  selection,
  edgeFilter,
  isAnalyzing,
  onChangeEdgeFilter,
  onSelectInteraction,
  onSelectNode,
  onClearSelection,
}: InteractionGraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showPathways, setShowPathways] = useState(true);
  const [nodeOverrides, setNodeOverrides] = useState<Record<string, { x: number; y: number }>>({});

  // Dragging refs for smooth pointer pan / node drag without lag
  const dragStateRef = useRef<
    | { type: 'pan'; startClientX: number; startClientY: number; startPanX: number; startPanY: number; moved: boolean }
    | { type: 'node'; nodeId: string; startClientX: number; startClientY: number; origX: number; origY: number; moved: boolean }
    | null
  >(null);

  // Reset node overrides whenever the underlying node ID set changes
  const nodeSignature = useMemo(
    () => graph.nodes.map((n) => n.id).sort().join('|'),
    [graph.nodes]
  );

  useEffect(() => {
    setNodeOverrides({});
  }, [nodeSignature]);

  const resolvedNodes = useMemo(
    () =>
      graph.nodes.map((node) => {
        const override = nodeOverrides[node.id];
        return override ? { ...node, x: override.x, y: override.y } : node;
      }),
    [graph.nodes, nodeOverrides]
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of resolvedNodes) map.set(n.id, n);
    return map;
  }, [resolvedNodes]);

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setNodeOverrides({});
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragStateRef.current;
    if (!drag || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = LOGICAL_WIDTH / Math.max(rect.width, 1);
    const scaleY = LOGICAL_HEIGHT / Math.max(rect.height, 1);
    const dxLogical = ((e.clientX - drag.startClientX) * scaleX) / zoom;
    const dyLogical = ((e.clientY - drag.startClientY) * scaleY) / zoom;

    if (Math.hypot(e.clientX - drag.startClientX, e.clientY - drag.startClientY) > 4) {
      drag.moved = true;
    }

    if (drag.type === 'pan') {
      setPan({
        x: drag.startPanX + dxLogical * zoom,
        y: drag.startPanY + dyLogical * zoom,
      });
    } else if (drag.type === 'node') {
      setNodeOverrides((prev) => ({
        ...prev,
        [drag.nodeId]: {
          x: Math.max(60, Math.min(LOGICAL_WIDTH - 60, drag.origX + dxLogical)),
          y: Math.max(44, Math.min(LOGICAL_HEIGHT - 44, drag.origY + dyLogical)),
        },
      }));
    }
  };

  const handlePointerUp = () => {
    const drag = dragStateRef.current;
    dragStateRef.current = null;
    if (drag && drag.type === 'pan' && !drag.moved) {
      onClearSelection();
    }
  };

  const selectedNodeId = selection.type === 'node' ? selection.nodeId : null;
  const selectedInteractionId =
    selection.type === 'interaction' ? selection.interactionId : null;

  // Focus & Dimming: isolate the active interaction or node neighborhood so the diagram stays uncluttered
  const focusContext = useMemo(() => {
    const activeEdgeId =
      selectedInteractionId ??
      (hoveredId?.startsWith('edge:') ? hoveredId.slice(5) : null);
    const activeNodeId =
      selectedNodeId ??
      (hoveredId && !hoveredId.startsWith('edge:') ? hoveredId : null);

    if (!activeEdgeId && !activeNodeId) {
      return { isFocused: false, nodeIds: new Set<string>(), edgeIds: new Set<string>() };
    }

    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();

    if (activeEdgeId) {
      const edge = graph.interactionEdges.find((e) => e.id === activeEdgeId);
      if (edge) {
        edgeIds.add(edge.id);
        nodeIds.add(edge.source);
        nodeIds.add(edge.target);
        // Also highlight enzymes/targets connected to either drug in this interaction
        for (const bio of graph.biologicalEdges) {
          if (bio.source === edge.source || bio.source === edge.target) {
            nodeIds.add(bio.target);
          }
        }
      }
    } else if (activeNodeId) {
      nodeIds.add(activeNodeId);
      for (const edge of graph.interactionEdges) {
        if (edge.source === activeNodeId || edge.target === activeNodeId) {
          edgeIds.add(edge.id);
          nodeIds.add(edge.source);
          nodeIds.add(edge.target);
        }
      }
      for (const bio of graph.biologicalEdges) {
        if (bio.source === activeNodeId || bio.target === activeNodeId) {
          nodeIds.add(bio.source);
          nodeIds.add(bio.target);
        }
      }
    }

    return { isFocused: true, nodeIds, edgeIds };
  }, [graph, selectedInteractionId, selectedNodeId, hoveredId]);

  const filterButtons: { id: EdgeFilterMode; label: string }[] = [
    { id: 'all', label: 'All Links' },
    { id: 'alerts_only', label: 'Alerts Only' },
    { id: 'clinical_only', label: 'Verified' },
    { id: 'ai_only', label: 'AI Predicted' },
  ];

  const isBiologicalHighlighted = (source: string, target: string) => {
    if (hoveredId && (hoveredId === source || hoveredId === target)) return true;
    if (selectedNodeId && (selectedNodeId === source || selectedNodeId === target)) return true;
    if (selectedInteractionId || hoveredId?.startsWith('edge:')) {
      const activeEdgeId = selectedInteractionId ?? hoveredId?.slice(5);
      const edge = graph.interactionEdges.find((e) => e.id === activeEdgeId);
      if (edge && (edge.source === source || edge.target === source)) {
        return true;
      }
    }
    return false;
  };

  const renderInteractionEdgeLine = (edge: InteractionEdge, idx: number) => {
    const src = nodeMap.get(edge.source);
    const dst = nodeMap.get(edge.target);
    if (!src || !dst) return null;

    const style = getEdgeStyle(edge.interaction.severity);
    const isSelected = selectedInteractionId === edge.id;
    const isHovered = hoveredId === `edge:${edge.id}`;
    const dimmed = focusContext.isFocused && !focusContext.edgeIds.has(edge.id);
    const { path } = computeInteractionArc(src.x, src.y, dst.x, dst.y, idx);

    return (
      <g
        key={`${edge.id}-line`}
        className="cursor-pointer"
        style={{ opacity: dimmed ? 0.18 : 1 }}
        onMouseEnter={() => setHoveredId(`edge:${edge.id}`)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectInteraction(edge.id);
        }}
      >
        <path d={path} fill="none" stroke="transparent" strokeWidth={18} pointerEvents="stroke" />
        {(isSelected || isHovered) && (
          <path
            d={path}
            fill="none"
            stroke={style.halo}
            strokeWidth={style.strokeWidth + 9}
            strokeLinecap="round"
            pointerEvents="none"
          />
        )}
        <path
          d={path}
          fill="none"
          stroke={style.stroke}
          strokeWidth={isSelected ? style.strokeWidth + 1 : style.strokeWidth}
          strokeDasharray={style.dash}
          strokeLinecap="round"
          pointerEvents="none"
          className={
            edge.interaction.severity === 'ai_predicted' ? 'animate-gnn-dash' : undefined
          }
        />
      </g>
    );
  };

  const renderInteractionEdgeBadge = (edge: InteractionEdge, idx: number) => {
    const src = nodeMap.get(edge.source);
    const dst = nodeMap.get(edge.target);
    if (!src || !dst) return null;

    const style = getEdgeStyle(edge.interaction.severity);
    const isSelected = selectedInteractionId === edge.id;
    const dimmed = focusContext.isFocused && !focusContext.edgeIds.has(edge.id);
    const { labelX, labelY } = computeInteractionArc(src.x, src.y, dst.x, dst.y, idx);

    const srcName = src.label;
    const dstName = dst.label;
    const pct = Math.round(edge.interaction.confidenceScore * 100);
    const badgeLabel =
      edge.interaction.severity === 'ai_predicted'
        ? mode === 'patient'
          ? `AI ${pct}%`
          : `GNN ${pct}%`
        : style.shortLabel;

    return (
      <g
        key={`${edge.id}-badge`}
        role="button"
        tabIndex={0}
        aria-label={`${edge.interaction.severity === 'ai_predicted' ? 'AI-Predicted' : 'Clinical'} interaction between ${srcName} and ${dstName}: ${edge.interaction.title}`}
        transform={`translate(${labelX}, ${labelY})`}
        style={{ opacity: dimmed ? 0.22 : 1 }}
        className="cursor-pointer focus:outline-none"
        onMouseEnter={() => setHoveredId(`edge:${edge.id}`)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectInteraction(edge.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectInteraction(edge.id);
          }
        }}
      >
        <rect
          x={-35}
          y={-11}
          width={70}
          height={22}
          rx={5}
          fill={isSelected ? style.stroke : style.badgeBg}
          stroke={style.stroke}
          strokeWidth={isSelected ? 1.8 : 1.1}
        />
        <text
          x={0}
          y={3.5}
          textAnchor="middle"
          fill={isSelected ? '#FFFFFF' : style.badgeText}
          style={{ fontSize: '9.5px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
        >
          {badgeLabel}
        </text>
      </g>
    );
  };

  return (
    <section
      aria-label="Interactive Knowledge Graph Workspace"
      className="col-span-12 lg:col-span-6 bg-white border border-slate-200 rounded-xl flex flex-col min-h-[520px] lg:h-[calc(100vh-146px)] overflow-hidden"
    >
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
            <h2 className="font-display text-sm font-bold text-slate-900 truncate">
              Mechanism &amp; Interaction Network
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {graph.summary.majorCount} Major · {graph.summary.moderateCount} Moderate ·{' '}
            {graph.summary.aiPredictedCount} AI Predicted · {graph.summary.safeCount} Safe
          </p>
        </div>

        {/* Edge Filter + Pathway Visibility Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPathways((prev) => !prev)}
            aria-pressed={showPathways}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showPathways
                ? 'bg-teal-50 border-teal-200 text-teal-900'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {showPathways ? (
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>Pathways</span>
          </button>

          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400 mr-0.5 hidden sm:block" aria-hidden="true" />
            <div
              role="group"
              aria-label="Filter graph edges"
              className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80"
            >
              {filterButtons.map((btn) => {
                const active = edgeFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => onChangeEdgeFilter(btn.id)}
                    aria-pressed={active}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas Area */}
      <div className="relative flex-1 bg-slate-50/70 overflow-hidden select-none">
        {graph.nodes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <Network className="w-10 h-10 text-slate-300 mb-3" aria-hidden="true" />
            <p className="font-display text-sm font-semibold text-slate-700">
              Knowledge Graph Ready
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Add two or more medications in the Regimen Tray and run interaction analysis to map shared CYP450 enzymes, target proteins, and GNN link predictions.
            </p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            data-testid="interaction-graph-svg"
            viewBox={`0 0 ${LOGICAL_WIDTH} ${LOGICAL_HEIGHT}`}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            role="region"
            aria-label="Interactive drug, enzyme, and target protein network"
            onPointerDown={(e) => {
              dragStateRef.current = {
                type: 'pan',
                startClientX: e.clientX,
                startClientY: e.clientY,
                startPanX: pan.x,
                startPanY: pan.y,
                moved: false,
              };
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <pattern
                id="clinical-dot-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="12" cy="12" r="1" fill="#CBD5E1" opacity="0.7" />
              </pattern>
              <marker
                id="bio-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94A3B8" />
              </marker>
              <marker
                id="bio-arrow-active"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0F766E" />
              </marker>
            </defs>

            {/* Background Grid */}
            <rect
              width={LOGICAL_WIDTH}
              height={LOGICAL_HEIGHT}
              fill="url(#clinical-dot-grid)"
              pointerEvents="none"
            />

            {/* Pan & Zoom Transform Group */}
            <g
              data-testid="graph-transform-group"
              transform={`translate(${CENTER_X + pan.x}, ${CENTER_Y + pan.y}) scale(${zoom}) translate(${-CENTER_X}, ${-CENTER_Y})`}
            >
              {/* Layer 1: Biological Pathway Edges (Drug -> Enzyme / Target) */}
              {showPathways && (
                <g aria-label="Biological pathway links">
                  {graph.biologicalEdges.map((bio) => {
                    const src = nodeMap.get(bio.source);
                    const dst = nodeMap.get(bio.target);
                    if (!src || !dst) return null;

                    const active = isBiologicalHighlighted(bio.source, bio.target);
                    const dimmed = focusContext.isFocused && !active;
                    const mx = (src.x + dst.x) / 2;
                    const my = (src.y + dst.y) / 2;
                    const textLabel =
                      mode === 'patient' ? bio.patientRelationLabel : bio.relationLabel;
                    const pillW = Math.max(44, textLabel.length * 5.6 + 12);

                    return (
                      <g
                        key={bio.id}
                        pointerEvents="none"
                        opacity={dimmed ? 0.14 : active ? 0.98 : 0.65}
                      >
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={dst.x}
                          y2={dst.y}
                          stroke={active ? '#0F766E' : '#CBD5E1'}
                          strokeWidth={active ? 2 : 1.15}
                          strokeDasharray={bio.role === 'inhibitor' ? '3 3' : undefined}
                          markerEnd={active ? 'url(#bio-arrow-active)' : 'url(#bio-arrow)'}
                        />
                        {active && (
                          <g transform={`translate(${mx}, ${my})`}>
                            <rect
                              x={-pillW / 2}
                              y={-9}
                              width={pillW}
                              height={18}
                              rx={4}
                              fill="#FFFFFF"
                              stroke="#0F766E"
                              strokeWidth={0.9}
                            />
                            <text
                              x={0}
                              y={3}
                              textAnchor="middle"
                              fill="#0F766E"
                              style={{
                                fontSize: '8.5px',
                                fontWeight: 600,
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              {textLabel}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Layer 2: Drug-Drug Interaction Edge Paths */}
              <g aria-label="Drug-drug interaction edges">
                {graph.interactionEdges.map((edge, idx) =>
                  renderInteractionEdgeLine(edge, idx)
                )}
              </g>

              {/* Layer 3: Nodes (Targets, Enzymes, Drugs) */}
              <g aria-label="Network nodes">
                {resolvedNodes.map((node) => {
                  if (!showPathways && node.kind !== 'drug') return null;

                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredId === node.id;
                  const dimmed = focusContext.isFocused && !focusContext.nodeIds.has(node.id);
                  const displayLabel =
                    mode === 'patient' ? node.patientLabel : node.label;

                  const commonEvents = {
                    onMouseEnter: () => setHoveredId(node.id),
                    onMouseLeave: () => setHoveredId(null),
                    onPointerDown: (e: React.PointerEvent<SVGGElement>) => {
                      e.stopPropagation();
                      dragStateRef.current = {
                        type: 'node',
                        nodeId: node.id,
                        startClientX: e.clientX,
                        startClientY: e.clientY,
                        origX: node.x,
                        origY: node.y,
                        moved: false,
                      };
                    },
                    onClick: (e: React.MouseEvent<SVGGElement>) => {
                      e.stopPropagation();
                      onSelectNode(node.id);
                    },
                    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectNode(node.id);
                      }
                    },
                  };

                  if (node.kind === 'enzyme') {
                    const halfW = Math.max(40, Math.round(displayLabel.length * 3.5 + 16));
                    const innerW = Math.round(halfW * 0.65);
                    const haloHalfW = halfW + 5;
                    const haloInnerW = innerW + 3;
                    return (
                      <g
                        key={node.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Enzyme node ${node.label}`}
                        transform={`translate(${node.x}, ${node.y})`}
                        style={{ opacity: dimmed ? 0.2 : 1 }}
                        className="cursor-pointer focus:outline-none"
                        {...commonEvents}
                      >
                        {(isSelected || isHovered) && (
                          <polygon
                            points={`-${haloHalfW},0 -${haloInnerW},-22 ${haloInnerW},-22 ${haloHalfW},0 ${haloInnerW},22 -${haloInnerW},22`}
                            fill="rgba(15, 118, 110, 0.14)"
                          />
                        )}
                        <polygon
                          points={`-${halfW},0 -${innerW},-17 ${innerW},-17 ${halfW},0 ${innerW},17 -${innerW},17`}
                          fill={isSelected ? '#0F766E' : '#F0FDFA'}
                          stroke={isSelected ? '#115E59' : '#0F766E'}
                          strokeWidth={isSelected ? 2 : 1.4}
                        />
                        <text
                          x={0}
                          y={3.5}
                          textAnchor="middle"
                          fill={isSelected ? '#FFFFFF' : '#134E4A'}
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {displayLabel}
                        </text>
                      </g>
                    );
                  }

                  if (node.kind === 'target') {
                    const boxW = Math.max(82, Math.round(displayLabel.length * 6.3 + 20));
                    const halfW = boxW / 2;
                    return (
                      <g
                        key={node.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Target protein node ${node.label}`}
                        transform={`translate(${node.x}, ${node.y})`}
                        style={{ opacity: dimmed ? 0.2 : 1 }}
                        className="cursor-pointer focus:outline-none"
                        {...commonEvents}
                      >
                        {(isSelected || isHovered) && (
                          <rect
                            x={-(halfW + 5)}
                            y={-18}
                            width={boxW + 10}
                            height={36}
                            rx={10}
                            fill="rgba(67, 56, 202, 0.12)"
                          />
                        )}
                        <rect
                          x={-halfW}
                          y={-14}
                          width={boxW}
                          height={28}
                          rx={6}
                          fill={isSelected ? '#4338CA' : '#EEF2FF'}
                          stroke={isSelected ? '#312E81' : '#6366F1'}
                          strokeWidth={isSelected ? 2 : 1.25}
                        />
                        <text
                          x={0}
                          y={3.5}
                          textAnchor="middle"
                          fill={isSelected ? '#FFFFFF' : '#312E81'}
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {displayLabel}
                        </text>
                      </g>
                    );
                  }

                  // Drug Node (rounded clinical card)
                  const strokeColor = getDrugNodeStroke(node.riskTier, isSelected);
                  return (
                    <g
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Medication node ${node.label} ${node.subLabel}`}
                      transform={`translate(${node.x}, ${node.y})`}
                      style={{ opacity: dimmed ? 0.24 : 1 }}
                      className="cursor-pointer focus:outline-none"
                      {...commonEvents}
                    >
                      {(isSelected || isHovered) && (
                        <rect
                          x={-61}
                          y={-28}
                          width={122}
                          height={56}
                          rx={13}
                          fill="rgba(29, 78, 216, 0.12)"
                        />
                      )}
                      <rect
                        x={-56}
                        y={-23}
                        width={112}
                        height={46}
                        rx={10}
                        fill={isSelected ? '#EFF6FF' : '#FFFFFF'}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 2.4 : 1.8}
                      />
                      <text
                        x={0}
                        y={-3}
                        textAnchor="middle"
                        fill="#0F172A"
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {node.label}
                      </text>
                      <text
                        x={0}
                        y={13}
                        textAnchor="middle"
                        fill="#475569"
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 500,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {node.subLabel}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Layer 4: Interactive DDI Midpoint Badges (always clickable & never hidden behind nodes) */}
              <g aria-label="Drug-drug interaction controls">
                {graph.interactionEdges.map((edge, idx) =>
                  renderInteractionEdgeBadge(edge, idx)
                )}
              </g>
            </g>
          </svg>
        )}

        {/* Analysis Overlay Feedback */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm text-xs font-semibold text-slate-800">
              Computing CYP450 &amp; GNN interaction pathways...
            </div>
          </div>
        )}

        {/* Contextual Canvas Guide Strip */}
        {graph.nodes.length > 0 && (
          <div className="absolute top-3 left-3 max-w-[300px] bg-white/95 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 shadow-xs">
            {selection.type === 'overview' ? (
              <span>
                Click any <strong className="text-slate-800">colored badge</strong> or{' '}
                <strong className="text-slate-800">medication</strong> to isolate its pathway.
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">Focused view active</span>
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer whitespace-nowrap"
                >
                  Show all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Zoom / Pan Controls */}
        <div
          aria-label="Graph zoom and layout controls"
          className="absolute top-3 right-3 flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-xs"
        >
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
            aria-label="Zoom in graph"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="font-mono text-xs text-slate-600 px-1.5 tabular-nums min-w-[44px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.15).toFixed(2))))}
            aria-label="Zoom out graph"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" aria-hidden="true" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" aria-hidden="true" />
          <button
            type="button"
            onClick={handleResetView}
            aria-label="Reset graph zoom and positions"
            className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Bottom Legend Bar */}
      <div className="px-4 py-2.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-600 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-5 h-0.5 bg-red-600 inline-block" aria-hidden="true" />
            <span className="font-medium text-slate-800">Major</span>
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-5 h-0.5 bg-orange-600 inline-block" aria-hidden="true" />
            <span className="font-medium text-slate-800">Moderate</span>
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-5 h-0.5 bg-emerald-600 inline-block" aria-hidden="true" />
            <span className="font-medium text-slate-800">Safe</span>
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span
              className="w-5 border-t-2 border-dashed border-violet-600 inline-block"
              aria-hidden="true"
            />
            <span className="font-medium text-violet-800">AI-Predicted (GNN)</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-slate-500">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-3 h-2.5 rounded-xs border border-slate-400 bg-white inline-block" aria-hidden="true" />
            <span>Drug</span>
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-3 h-2.5 rounded-xs border border-teal-700 bg-teal-50 inline-block" aria-hidden="true" />
            <span>CYP450 Enzyme</span>
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-3 h-2.5 rounded-xs border border-indigo-500 bg-indigo-50 inline-block" aria-hidden="true" />
            <span>Target Protein</span>
          </span>
        </div>
      </div>
    </section>
  );
}
