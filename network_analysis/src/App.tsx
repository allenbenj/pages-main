import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  NodeResizer,
  Panel,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Building2,
  Calendar,
  Download,
  Edit3,
  FileText,
  FileUp,
  Focus,
  MapPin,
  Plus,
  RefreshCw,
  Route,
  Search,
  Sparkles,
  Trash2,
  Undo,
  Redo,
  Users,
  ZoomOut,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from './utils/cn';

type SourceType = 'person' | 'organization' | 'location' | 'event' | 'document';
type NodeStatus = 'verified' | 'disputed' | 'hypothetical' | 'archived';
type EdgeStatus = 'verified' | 'alleged' | 'disputed';

interface DbEntity {
  id: string;
  name: string;
  type: SourceType;
  kind: string;
  description: string;
  tags: string[];
  color: string;
  sourceTable: string;
  sourcePk: number;
  slug: string | null;
  meta: Record<string, string | number | null>;
}

interface DbRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type: string;
  status: EdgeStatus;
  confidence: number;
  notes: string;
  direction: 'forward' | 'bidirectional';
}

interface GraphPayload {
  entities: DbEntity[];
  relationships: DbRelationship[];
  summary: {
    entityCount: number;
    relationshipCount: number;
    kinds: Record<string, number>;
  };
}

interface WorkspaceNodeData {
  entityId: string;
  label: string;
  type: SourceType;
  kind: string;
  description: string;
  tags: string[];
  confidence: number;
  status: NodeStatus;
  notes: string;
  icon: React.ReactNode;
  sourceTable: string;
  sourcePk: number;
  slug: string | null;
  meta: Record<string, string | number | null>;
  visibleMetaFields: string[];
  width: number;
  height: number;
}

type AppNode = Node<WorkspaceNodeData>;

interface WorkspaceEdgeData {
  label: string;
  type: string;
  confidence: number;
  status: EdgeStatus;
  notes: string;
  direction: 'forward' | 'bidirectional';
}

type AppEdge = Edge<WorkspaceEdgeData>;

interface HistoryNodeSnapshot {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Omit<WorkspaceNodeData, 'icon'>;
  style?: {
    width?: number | string;
    height?: number | string;
  };
}

interface HistoryEdgeSnapshot {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: WorkspaceEdgeData;
}

interface HistorySnapshot {
  nodes: HistoryNodeSnapshot[];
  edges: HistoryEdgeSnapshot[];
}

interface ExportedWorkspace {
  workspace?: string;
  nodes?: HistoryNodeSnapshot[];
  edges?: HistoryEdgeSnapshot[];
  exportedAt?: string;
}

interface ContextMenuState {
  kind: 'node' | 'edge' | 'pane';
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
  position?: { x: number; y: number };
}

interface ConnectorPickerState {
  edgeId: string;
}

const KIND_ORDER = [
  'chronology',
  'fact',
  'contradiction',
  'motion',
  'standard',
  'quote',
  'evidence',
  'card',
];

const DEFAULT_GRAPH_LIMIT = 80;
const DEFAULT_LEFT_PANEL_WIDTH = 352;
const DEFAULT_RIGHT_PANEL_WIDTH = 420;
const MIN_PANEL_WIDTH = 240;
const MAX_PANEL_WIDTH = 720;
const MIN_NODE_WIDTH = 220;
const MAX_NODE_WIDTH = 520;
const MIN_NODE_HEIGHT = 88;
const MAX_NODE_HEIGHT = 320;
const GRID_X_SPACING = 420;
const GRID_Y_SPACING = 180;
const GROUP_X_GAP = 560;
const GROUP_Y_GAP = 220;
const CANVAS_EXTENT: [[number, number], [number, number]] = [[-8000, -8000], [8000, 8000]];
const CONNECTOR_PRESETS = [
  { key: 'supports', label: 'Supports', status: 'verified' as EdgeStatus, color: '#10b981', dash: undefined },
  { key: 'contradicts', label: 'Contradicts', status: 'disputed' as EdgeStatus, color: '#f87171', dash: '8 4' },
  { key: 'timeline', label: 'Timeline', status: 'verified' as EdgeStatus, color: '#a78bfa', dash: '4 4' },
  { key: 'reference', label: 'Reference', status: 'verified' as EdgeStatus, color: '#38bdf8', dash: undefined },
  { key: 'association', label: 'Association', status: 'alleged' as EdgeStatus, color: '#f59e0b', dash: '2 6' },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function estimateNodeWidth(label: string, tags: string[]) {
  const labelWidth = Math.max(MIN_NODE_WIDTH, Math.min(MAX_NODE_WIDTH, 88 + label.length * 7.5));
  const tagBoost = tags.length > 0 ? Math.min(60, tags.join(' ').length * 2) : 0;
  return clamp(Math.round(labelWidth + tagBoost), MIN_NODE_WIDTH, MAX_NODE_WIDTH);
}

function estimateNodeHeight(description: string, tags: string[]) {
  const descriptionLines = description ? Math.min(3, Math.ceil(description.length / 90)) : 0;
  const tagLines = tags.length > 0 ? Math.min(2, Math.ceil(tags.length / 3)) : 0;
  return clamp(88 + descriptionLines * 18 + tagLines * 16, MIN_NODE_HEIGHT, MAX_NODE_HEIGHT);
}

function estimateNodeHeightForContent(description: string, tags: string[], visibleMetaFields: string[]) {
  const baseHeight = estimateNodeHeight(description, tags);
  const metaHeight = Math.min(72, visibleMetaFields.length * 18);
  return clamp(baseHeight + metaHeight, MIN_NODE_HEIGHT, MAX_NODE_HEIGHT);
}

function getConnectorPreset(connectorType?: string, fallbackLabel?: string, fallbackStatus?: EdgeStatus) {
  const preset = CONNECTOR_PRESETS.find((item) => item.key === connectorType);
  if (preset) return preset;
  return {
    key: connectorType || 'association',
    label: fallbackLabel || 'Association',
    status: fallbackStatus || 'alleged',
    color: '#64748b',
    dash: undefined as string | undefined,
  };
}

function buildEdgeStyle(connectorType?: string, status?: EdgeStatus) {
  const preset = getConnectorPreset(connectorType, undefined, status);
  return {
    stroke: preset.color,
    strokeWidth: status === 'disputed' ? 2.8 : 2.2,
    strokeDasharray: preset.dash,
  };
}

function getDefaultVisibleMetaFields(meta: Record<string, string | number | null>) {
  return Object.entries(meta)
    .filter(([, value]) => String(value ?? '').trim().length > 0)
    .slice(0, 2)
    .map(([key]) => key);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDrawioNodeLabel(node: AppNode) {
  const visibleMeta = node.data.visibleMetaFields
    .map((key) => [key, node.data.meta[key]] as const)
    .filter(([, value]) => String(value ?? '').trim().length > 0)
    .slice(0, 6);

  const sections = [
    `<div style="font-size:16px;font-weight:700;">${escapeXml(node.data.label)}</div>`,
    `<div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">${escapeXml(node.data.kind.replace(/_/g, ' '))}</div>`,
  ];

  if (node.data.description.trim()) {
    sections.push(`<div style="margin-top:6px;font-size:12px;">${escapeXml(node.data.description)}</div>`);
  }

  if (visibleMeta.length) {
    sections.push(
      `<div style="margin-top:6px;font-size:11px;">${visibleMeta
        .map(([key, value]) => `<div><b>${escapeXml(key)}:</b> ${escapeXml(String(value))}</div>`)
        .join('')}</div>`,
    );
  }

  if (node.data.tags.length) {
    sections.push(`<div style="margin-top:6px;font-size:10px;color:#475569;">${escapeXml(node.data.tags.join(' • '))}</div>`);
  }

  if (node.data.notes.trim()) {
    sections.push(`<div style="margin-top:6px;font-size:11px;color:#334155;"><b>Notes:</b> ${escapeXml(node.data.notes)}</div>`);
  }

  sections.push(
    `<div style="margin-top:8px;font-size:10px;color:#64748b;">table=${escapeXml(node.data.sourceTable)} | row=${escapeXml(String(node.data.sourcePk))} | confidence=${escapeXml(String(node.data.confidence))}% | status=${escapeXml(node.data.status)}</div>`,
  );

  return sections.join('');
}

function buildDrawioEdgeLabel(edge: AppEdge) {
  const label = edge.data?.label || edge.label || 'Relationship';
  const type = edge.data?.type || 'association';
  const status = edge.data?.status || 'alleged';
  const confidence = edge.data?.confidence ?? 50;
  const notes = edge.data?.notes?.trim() || '';

  const sections = [
    `<div style="font-size:12px;font-weight:700;">${escapeXml(label)}</div>`,
    `<div style="font-size:10px;color:#64748b;">type=${escapeXml(type)} | status=${escapeXml(status)} | confidence=${escapeXml(String(confidence))}%</div>`,
  ];

  if (notes) {
    sections.push(`<div style="margin-top:4px;font-size:10px;">${escapeXml(notes)}</div>`);
  }

  return sections.join('');
}

function buildDrawioXml(workspaceName: string, nodes: AppNode[], edges: AppEdge[]) {
  const cells: string[] = [
    '<mxCell id="0"/>',
    '<mxCell id="1" parent="0"/>',
  ];

  nodes.forEach((node, index) => {
    const color = getNodeColor(node.data.type, node.data.kind);
    const width = Number(node.style?.width || node.data.width || MIN_NODE_WIDTH);
    const height = Number(node.style?.height || node.data.height || MIN_NODE_HEIGHT);
    const x = Math.round(node.position.x);
    const y = Math.round(node.position.y);
    const fillColor = `${color}22`;
    const strokeColor = color;
    const nodeId = `node-${index + 1}`;

    cells.push(
      `<mxCell id="${nodeId}" value="${escapeXml(buildDrawioNodeLabel(node))}" style="rounded=1;whiteSpace=wrap;html=1;container=0;spacing=10;fillColor=${fillColor};strokeColor=${strokeColor};strokeWidth=2;fontColor=#e2e8f0;align=left;verticalAlign=top;" vertex="1" parent="1">` +
      `<mxGeometry x="${x}" y="${y}" width="${Math.round(width)}" height="${Math.round(height)}" as="geometry"/>` +
      '</mxCell>',
    );
  });

  edges.forEach((edge, index) => {
    const preset = getConnectorPreset(edge.data?.type, edge.data?.label, edge.data?.status);
    const edgeId = `edge-${index + 1}`;
    const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
    const targetIndex = nodes.findIndex((node) => node.id === edge.target);
    if (sourceIndex === -1 || targetIndex === -1) return;

    cells.push(
      `<mxCell id="${edgeId}" value="${escapeXml(buildDrawioEdgeLabel(edge))}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=${preset.color};strokeWidth=${edge.data?.status === 'disputed' ? 3 : 2};dashed=${preset.dash ? 1 : 0};endArrow=block;endFill=1;fontColor=#cbd5e1;" edge="1" parent="1" source="node-${sourceIndex + 1}" target="node-${targetIndex + 1}">` +
      '<mxGeometry relative="1" as="geometry"/>' +
      '</mxCell>',
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="Codex" version="24.7.17">\n  <diagram id="nexus-evidence-network" name="${escapeXml(workspaceName)}">\n    <mxGraphModel dx="1780" dy="980" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2200" pageHeight="1400" math="0" shadow="0">\n      <root>\n        ${cells.join('\n        ')}\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>`;
}

function getKindColor(kind: string, fallback: string) {
  const kindColors: Record<string, string> = {
    chronology: '#a78bfa',
    fact: '#38bdf8',
    contradiction: '#f87171',
    motion: '#f59e0b',
    standard: '#10b981',
    quote: '#c084fc',
    evidence: '#94a3b8',
    card: '#60a5fa',
  };
  return kindColors[kind] || fallback;
}

function getEntityIcon(entity: Pick<DbEntity, 'type' | 'kind'>) {
  if (entity.kind === 'card') return <Building2 className="w-4 h-4" />;
  if (entity.kind === 'chronology') return <Calendar className="w-4 h-4" />;
  if (entity.type === 'person') return <Users className="w-4 h-4" />;
  if (entity.type === 'organization') return <Building2 className="w-4 h-4" />;
  if (entity.type === 'location') return <MapPin className="w-4 h-4" />;
  if (entity.type === 'event') return <Calendar className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

function createNodeFromEntity(entity: DbEntity, position: { x: number; y: number }): AppNode {
  const width = estimateNodeWidth(entity.name, entity.tags);
  const visibleMetaFields = getDefaultVisibleMetaFields(entity.meta);
  const height = estimateNodeHeightForContent(entity.description, entity.tags, visibleMetaFields);
  return {
    id: entity.id,
    type: 'default',
    position,
    style: {
      width,
      height,
    },
    data: {
      entityId: entity.id,
      label: entity.name,
      type: entity.type,
      kind: entity.kind,
      description: entity.description,
      tags: [...entity.tags],
      confidence: 85,
      status: 'verified',
      notes: entity.description,
      icon: getEntityIcon(entity),
      sourceTable: entity.sourceTable,
      sourcePk: entity.sourcePk,
      slug: entity.slug,
      meta: entity.meta,
      visibleMetaFields,
      width,
      height,
    },
  };
}

function createEdgeFromRelationship(relationship: DbRelationship): AppEdge {
  const preset = getConnectorPreset(relationship.type, relationship.label, relationship.status);
  return {
    id: relationship.id,
    source: relationship.sourceId,
    target: relationship.targetId,
    label: relationship.label || preset.label,
    type: 'default',
    data: {
      label: relationship.label || preset.label,
      type: relationship.type || preset.key,
      confidence: relationship.confidence,
      status: relationship.status || preset.status,
      notes: relationship.notes,
      direction: relationship.direction,
    },
    markerEnd: { type: MarkerType.ArrowClosed },
    style: buildEdgeStyle(relationship.type, relationship.status),
  };
}

function toHistorySnapshot(nodes: AppNode[], edges: AppEdge[]): HistorySnapshot {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type || 'default',
      position: node.position,
      data: {
        entityId: node.data.entityId,
        label: node.data.label,
        type: node.data.type,
        kind: node.data.kind,
        description: node.data.description,
        tags: [...node.data.tags],
        confidence: node.data.confidence,
        status: node.data.status,
        notes: node.data.notes,
        sourceTable: node.data.sourceTable,
        sourcePk: node.data.sourcePk,
        slug: node.data.slug,
        meta: { ...node.data.meta },
        visibleMetaFields: [...node.data.visibleMetaFields],
        width: node.data.width,
        height: node.data.height,
      },
      style: {
        width: typeof node.style?.width === 'number' ? node.style.width : node.data.width,
        height: typeof node.style?.height === 'number' ? node.style.height : node.data.height,
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: edge.type,
      data: edge.data,
    })),
  };
}

function fromHistorySnapshot(snapshot: HistorySnapshot): { nodes: AppNode[]; edges: AppEdge[] } {
  return {
    nodes: snapshot.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      style: {
        width: node.style?.width ?? node.data.width,
        height: node.style?.height ?? node.data.height,
      },
      data: {
        ...node.data,
        icon: getEntityIcon({ type: node.data.type, kind: node.data.kind }),
      },
    })),
    edges: snapshot.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: edge.type || 'default',
      data: edge.data,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: buildEdgeStyle(edge.data?.type, edge.data?.status),
    })),
  };
}

function getNodeColor(type: SourceType, kind: string, fallback?: string) {
  const kindColor = getKindColor(kind, fallback || '#64748b');
  if (kindColor) return kindColor;

  switch (type) {
    case 'person':
      return '#3b82f6';
    case 'organization':
      return '#10b981';
    case 'location':
      return '#f59e0b';
    case 'event':
      return '#8b5cf6';
    default:
      return '#64748b';
  }
}

function buildPositions(entities: DbEntity[]) {
  const grouped = new Map<string, DbEntity[]>();
  entities.forEach((entity) => {
    const group = grouped.get(entity.kind) || [];
    group.push(entity);
    grouped.set(entity.kind, group);
  });

  const positions = new Map<string, { x: number; y: number }>();
  const orderedKinds = [
    ...KIND_ORDER.filter((kind) => grouped.has(kind)),
    ...Array.from(grouped.keys()).filter((kind) => !KIND_ORDER.includes(kind)),
  ];

  orderedKinds.forEach((kind, columnIndex) => {
    const items = grouped.get(kind) || [];
    items.forEach((entity, rowIndex) => {
      positions.set(entity.id, {
        x: 180 + columnIndex * GRID_X_SPACING,
        y: 140 + rowIndex * GRID_Y_SPACING,
      });
    });
  });

  return positions;
}

function layoutNodesByKind(nodes: AppNode[]) {
  const grouped = new Map<string, AppNode[]>();
  nodes.forEach((node) => {
    const list = grouped.get(node.data.kind) || [];
    list.push(node);
    grouped.set(node.data.kind, list);
  });

  const orderedKinds = [
    ...KIND_ORDER.filter((kind) => grouped.has(kind)),
    ...Array.from(grouped.keys()).filter((kind) => !KIND_ORDER.includes(kind)),
  ];

  const groupOffsets = new Map<string, number>();
  let currentX = 180;
  orderedKinds.forEach((kind) => {
    groupOffsets.set(kind, currentX);
    const size = (grouped.get(kind) || []).length;
    currentX += GROUP_X_GAP + Math.floor(size / 6) * 70;
  });

  return nodes.map((node) => {
    const items = grouped.get(node.data.kind) || [];
    const rowIndex = items.findIndex((item) => item.id === node.id);
    return {
      ...node,
      position: {
        x: groupOffsets.get(node.data.kind) || 180,
        y: 140 + Math.max(rowIndex, 0) * GROUP_Y_GAP,
      },
    };
  });
}

function layoutNodesByGroup(nodes: AppNode[], getGroup: (node: AppNode) => string) {
  const grouped = new Map<string, AppNode[]>();
  nodes.forEach((node) => {
    const key = getGroup(node) || 'other';
    const list = grouped.get(key) || [];
    list.push(node);
    grouped.set(key, list);
  });

  const orderedGroups = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
  const groupOffsets = new Map<string, number>();
  let currentX = 180;
  orderedGroups.forEach((group) => {
    groupOffsets.set(group, currentX);
    const size = (grouped.get(group) || []).length;
    currentX += GROUP_X_GAP + Math.floor(size / 6) * 70;
  });

  return nodes.map((node) => {
    const group = getGroup(node) || 'other';
    const items = grouped.get(group) || [];
    const rowIndex = items.findIndex((item) => item.id === node.id);
    return {
      ...node,
      position: {
        x: groupOffsets.get(group) || 180,
        y: 140 + Math.max(rowIndex, 0) * GROUP_Y_GAP,
      },
    };
  });
}

function layoutNodesAlphabetically(nodes: AppNode[]) {
  const sorted = [...nodes].sort((a, b) => a.data.label.localeCompare(b.data.label));
  const columns = Math.max(3, Math.ceil(Math.sqrt(sorted.length || 1)));
  const positions = new Map<string, { x: number; y: number }>();

  sorted.forEach((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    positions.set(node.id, {
      x: 180 + column * GRID_X_SPACING,
      y: 140 + row * GRID_Y_SPACING,
    });
  });

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || node.position,
  }));
}

function layoutNodesSpread(nodes: AppNode[]) {
  const columns = Math.max(4, Math.ceil(Math.sqrt(nodes.length || 1)));
  return nodes.map((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      ...node,
      position: {
        x: 180 + column * (GRID_X_SPACING + 80),
        y: 140 + row * (GRID_Y_SPACING + 70),
      },
    };
  });
}

function buildGraphSlice(payload: GraphPayload, limit: number) {
  const degree = new Map<string, number>();
  payload.relationships.forEach((relationship) => {
    degree.set(relationship.sourceId, (degree.get(relationship.sourceId) || 0) + 1);
    degree.set(relationship.targetId, (degree.get(relationship.targetId) || 0) + 1);
  });

  const selectedEntities = payload.entities
    .slice()
    .sort((a, b) => {
      const degreeDelta = (degree.get(b.id) || 0) - (degree.get(a.id) || 0);
      if (degreeDelta !== 0) return degreeDelta;
      const kindDelta = KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
      if (kindDelta !== 0) return kindDelta;
      return a.name.localeCompare(b.name);
    })
    .slice(0, Math.max(1, limit));

  const selectedIds = new Set(selectedEntities.map((entity) => entity.id));
  const positions = buildPositions(selectedEntities);

  return {
    nodes: selectedEntities.map((entity) => createNodeFromEntity(entity, positions.get(entity.id) || { x: 0, y: 0 })),
    edges: payload.relationships
      .filter((relationship) => selectedIds.has(relationship.sourceId) && selectedIds.has(relationship.targetId))
      .map(createEdgeFromRelationship),
  };
}

function createWorkspaceNode(label: string, position: { x: number; y: number }): AppNode {
  const tags = ['workspace'];
  const width = estimateNodeWidth(label, tags);
  const entityId = `workspace-node:${uuidv4()}`;
  const visibleMetaFields = ['origin'];
  const height = estimateNodeHeightForContent('', tags, visibleMetaFields);
  return {
    id: entityId,
    type: 'default',
    position,
    style: {
      width,
      height,
    },
    data: {
      entityId,
      label,
      type: 'document',
      kind: 'note',
      description: '',
      tags,
      confidence: 50,
      status: 'hypothetical',
      notes: '',
      icon: <FileText className="w-4 h-4" />,
      sourceTable: 'workspace',
      sourcePk: 0,
      slug: null,
      meta: { origin: 'manual' },
      visibleMetaFields,
      width,
      height,
    },
  };
}

const CustomNode = ({ data, selected }: NodeProps<WorkspaceNodeData>) => {
  const color = getNodeColor(data.type, data.kind);
  const visibleMetaPairs = data.visibleMetaFields
    .map((key) => [key, data.meta[key]] as const)
    .filter(([, value]) => String(value ?? '').trim().length > 0);

  return (
    <div className="w-full h-full relative">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950" />
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-950" />
      <NodeResizer
        isVisible={Boolean(selected)}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        maxWidth={MAX_NODE_WIDTH}
        maxHeight={MAX_NODE_HEIGHT}
        lineClassName="!border-cyan-400/80"
        handleClassName="!h-3 !w-3 !rounded-full !border !border-slate-950 !bg-cyan-400"
      />
      <div
        className={cn(
          'w-full h-full px-4 py-3 rounded-2xl shadow-xl border-2 flex items-start gap-3 transition-all overflow-hidden',
          selected ? 'border-white shadow-2xl scale-[1.01]' : 'border-slate-700',
        )}
        style={{
          background: 'rgb(15 23 42)',
          boxShadow: selected ? `0 0 0 3px ${color}40` : 'none',
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}30`, color }}
        >
          {data.icon}
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="font-medium text-white text-sm leading-tight break-words whitespace-normal">
            {data.label}
          </div>
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">
            {data.kind.replace(/_/g, ' ')}
          </div>
          {data.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {data.tags.slice(0, 4).map((tag) => (
                <div key={tag} className="text-[9px] px-1.5 py-px bg-slate-800 text-slate-400 rounded max-w-full break-all">
                  {tag}
                </div>
              ))}
            </div>
          )}
          {visibleMetaPairs.length > 0 && (
            <div className="mt-2 space-y-1">
              {visibleMetaPairs.slice(0, 3).map(([key, value]) => (
                <div key={key} className="text-[10px] text-slate-300/90 leading-snug break-words">
                  <span className="text-slate-500 uppercase tracking-wide mr-1">{key}:</span>
                  {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="text-xs font-mono px-2 py-px rounded bg-black/60 text-emerald-400 flex-shrink-0"
          style={{ border: `1px solid ${color}50` }}
        >
          {data.confidence}%
        </div>
      </div>
    </div>
  );
};

const nodeTypes = { default: CustomNode };

function GraphEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const { project, fitView } = useReactFlow();

  const [payload, setPayload] = useState<GraphPayload | null>(null);
  const [sourceEntities, setSourceEntities] = useState<DbEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [workspaceName, setWorkspaceName] = useState('Evidence Network Analysis');
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<AppEdge | null>(null);
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_LEFT_PANEL_WIDTH);
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_RIGHT_PANEL_WIDTH);
  const [activeResizer, setActiveResizer] = useState<'left' | 'right' | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [connectorPicker, setConnectorPicker] = useState<ConnectorPickerState | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const syncSelectedState = useCallback((nextNodes: AppNode[], nextEdges: AppEdge[]) => {
    setSelectedNode((prev) => (prev ? nextNodes.find((node) => node.id === prev.id) || null : null));
    setSelectedEdge((prev) => (prev ? nextEdges.find((edge) => edge.id === prev.id) || null : null));
  }, []);

  const applySnapshot = useCallback((snapshot: HistorySnapshot, options?: { pushHistory?: boolean }) => {
    const hydrated = fromHistorySnapshot(snapshot);
    setNodes(hydrated.nodes);
    setEdges(hydrated.edges);
    syncSelectedState(hydrated.nodes, hydrated.edges);

    if (options?.pushHistory) {
      setHistory((prev) => [...prev, snapshot].slice(-24));
      setHistoryIndex((prev) => Math.min(prev + 1, 23));
    }

    window.setTimeout(() => fitView({ duration: 350, padding: 0.18 }), 40);
  }, [fitView, setEdges, setNodes, syncSelectedState]);

  const commitHistory = useCallback((nextNodes: AppNode[], nextEdges: AppEdge[]) => {
    const snapshot = toHistorySnapshot(nextNodes, nextEdges);
    setHistory((prev) => {
      const base = prev.slice(0, historyIndex + 1);
      return [...base, snapshot].slice(-24);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 23));
  }, [historyIndex]);

  const refreshFromDb = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/network-analysis', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const data = (await response.json()) as GraphPayload;
      setPayload(data);
      setSourceEntities(data.entities);

      const initial = buildGraphSlice(data, DEFAULT_GRAPH_LIMIT);
      setNodes(initial.nodes);
      setEdges(initial.edges);
      syncSelectedState(initial.nodes, initial.edges);

      const snapshot = toHistorySnapshot(initial.nodes, initial.edges);
      setHistory([snapshot]);
      setHistoryIndex(0);

      window.setTimeout(() => fitView({ duration: 350, padding: 0.18 }), 40);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load network data.');
    } finally {
      setLoading(false);
    }
  }, [fitView, setEdges, setNodes, syncSelectedState]);

  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  useEffect(() => {
    if (!activeResizer) return;

    const handlePointerMove = (event: MouseEvent) => {
      const wrapperBounds = reactFlowWrapper.current?.parentElement?.getBoundingClientRect();
      const wrapperWidth = wrapperBounds?.width || window.innerWidth;
      const relativeX = event.clientX - (wrapperBounds?.left || 0);

      if (activeResizer === 'left') {
        setLeftPanelWidth(clamp(relativeX, MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, wrapperWidth - MIN_PANEL_WIDTH - 200)));
        return;
      }

      const calculatedWidth = wrapperWidth - relativeX;
      setRightPanelWidth(clamp(calculatedWidth, MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, wrapperWidth - MIN_PANEL_WIDTH - 200)));
    };

    const handlePointerUp = () => setActiveResizer(null);

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [activeResizer]);

  const entityMap = useMemo(() => {
    const map = new Map<string, DbEntity>();
    sourceEntities.forEach((entity) => map.set(entity.id, entity));
    return map;
  }, [sourceEntities]);

  const relationshipMap = useMemo(() => {
    const byEntity = new Map<string, DbRelationship[]>();
    payload?.relationships.forEach((relationship) => {
      const sourceList = byEntity.get(relationship.sourceId) || [];
      sourceList.push(relationship);
      byEntity.set(relationship.sourceId, sourceList);

      const targetList = byEntity.get(relationship.targetId) || [];
      targetList.push(relationship);
      byEntity.set(relationship.targetId, targetList);
    });
    return byEntity;
  }, [payload]);

  const filteredSources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sourceEntities;

    return sourceEntities.filter((entity) => {
      return (
        entity.name.toLowerCase().includes(query)
        || entity.description.toLowerCase().includes(query)
        || entity.kind.toLowerCase().includes(query)
        || entity.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [searchTerm, sourceEntities]);

  const payloadInsights = useMemo(() => {
    if (!payload) return null;

    const degree = new Map<string, number>();
    payload.relationships.forEach((relationship) => {
      degree.set(relationship.sourceId, (degree.get(relationship.sourceId) || 0) + 1);
      degree.set(relationship.targetId, (degree.get(relationship.targetId) || 0) + 1);
    });

    const topConnected = payload.entities
      .map((entity) => ({ entity, degree: degree.get(entity.id) || 0 }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 5);

    const disputedLinks = payload.relationships.filter((relationship) => relationship.status === 'disputed').length;
    const evidenceCount = payload.entities.filter((entity) => entity.kind === 'evidence').length;
    const contradictionCount = payload.entities.filter((entity) => entity.kind === 'contradiction').length;

    return {
      topConnected,
      disputedLinks,
      evidenceCount,
      contradictionCount,
    };
  }, [payload]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const previous = history[historyIndex - 1];
    applySnapshot(previous);
    setHistoryIndex((prev) => prev - 1);
  }, [applySnapshot, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    applySnapshot(next);
    setHistoryIndex((prev) => prev + 1);
  }, [applySnapshot, history, historyIndex]);

  const addEntityToCanvas = useCallback((entity: DbEntity, position?: { x: number; y: number }) => {
    const existingNode = nodes.find((node) => node.id === entity.id);
    if (existingNode) {
      setSelectedNode(existingNode);
      setSelectedEdge(null);
      window.setTimeout(() => fitView({ nodes: [existingNode], duration: 250, padding: 0.7 }), 20);
      return;
    }

    const fallbackPosition = position || {
      x: 220 + (nodes.length % 4) * 260,
      y: 120 + Math.floor(nodes.length / 4) * 140,
    };

    const nextNodes = [...nodes, createNodeFromEntity(entity, fallbackPosition)];
    setNodes(nextNodes);
    setEdges(edges);
    syncSelectedState(nextNodes, edges);
    commitHistory(nextNodes, edges);
  }, [commitHistory, edges, fitView, nodes, setEdges, setNodes, syncSelectedState]);

  const onConnect = useCallback((params: Connection) => {
    const preset = getConnectorPreset('association');
    const newEdge: AppEdge = {
      ...params,
      id: uuidv4(),
      label: preset.label,
      type: 'default',
      data: {
        label: preset.label,
        type: preset.key,
        confidence: 50,
        status: preset.status,
        notes: '',
        direction: 'forward',
      },
      markerEnd: { type: MarkerType.ArrowClosed },
      style: buildEdgeStyle(preset.key, preset.status),
    } as AppEdge;

    const nextEdges = addEdge(newEdge, edges);
    setEdges(nextEdges);
    setNodes(nodes);
    syncSelectedState(nodes, nextEdges);
    setSelectedEdge(newEdge);
    setSelectedNode(null);
    setConnectorPicker({ edgeId: newEdge.id });
  }, [commitHistory, edges, nodes, setEdges, setNodes, syncSelectedState]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: AppEdge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setContextMenu(null);
  }, []);

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: { nodes: AppNode[]; edges: AppEdge[] }) => {
    setSelectedNode(selectedNodes[0] || null);
    setSelectedEdge(selectedEdges[0] || null);
    setContextMenu(null);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: AppNode) => {
    event.preventDefault();
    setSelectedNode(node);
    setSelectedEdge(null);
    setContextMenu({
      kind: 'node',
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: AppEdge) => {
    event.preventDefault();
    setSelectedEdge(edge);
    setSelectedNode(null);
    setContextMenu({
      kind: 'edge',
      x: event.clientX,
      y: event.clientY,
      edgeId: edge.id,
    });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!bounds) return;

    setSelectedNode(null);
    setSelectedEdge(null);
    setContextMenu({
      kind: 'pane',
      x: event.clientX,
      y: event.clientY,
      position: project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }),
    });
  }, [project]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    const newLabel = window.prompt('Edit node label:', node.data.label);
    if (!newLabel || newLabel === node.data.label) return;
    const nextWidth = Math.max(node.data.width, estimateNodeWidth(newLabel, node.data.tags));

    const nextNodes = nodes.map((item) => (
      item.id === node.id
        ? {
            ...item,
            style: {
              ...item.style,
              width: nextWidth,
            },
            data: {
              ...item.data,
              label: newLabel,
              width: nextWidth,
            },
          }
        : item
    ));

    setNodes(nextNodes);
    setEdges(edges);
    syncSelectedState(nextNodes, edges);
    commitHistory(nextNodes, edges);
  }, [commitHistory, edges, nodes, setEdges, setNodes, syncSelectedState]);

  const handleDragStart = (event: React.DragEvent, entity: DbEntity) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(entity));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const raw = event.dataTransfer.getData('application/reactflow');
    if (!bounds || !raw) return;

    try {
      const entity = JSON.parse(raw) as DbEntity;
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      addEntityToCanvas(entity, position);
      setContextMenu(null);
    } catch (dropError) {
      console.error(dropError);
    }
  }, [addEntityToCanvas, project]);

  const deleteSelected = useCallback(() => {
    if (!selectedNode && !selectedEdge) return;

    if (selectedNode) {
      const nextNodes = nodes.filter((node) => node.id !== selectedNode.id);
      const nextEdges = edges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id);
      setNodes(nextNodes);
      setEdges(nextEdges);
      setSelectedNode(null);
      commitHistory(nextNodes, nextEdges);
      return;
    }

    if (selectedEdge) {
      const nextEdges = edges.filter((edge) => edge.id !== selectedEdge.id);
      setNodes(nodes);
      setEdges(nextEdges);
      setSelectedEdge(null);
      commitHistory(nodes, nextEdges);
    }
  }, [commitHistory, edges, nodes, selectedEdge, selectedNode, setEdges, setNodes]);

  const deleteNodeById = useCallback((nodeId: string) => {
    const nextNodes = nodes.filter((node) => node.id !== nodeId);
    const nextEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNode(null);
    setSelectedEdge(null);
    commitHistory(nextNodes, nextEdges);
  }, [commitHistory, edges, nodes, setEdges, setNodes]);

  const deleteEdgeById = useCallback((edgeId: string) => {
    const nextEdges = edges.filter((edge) => edge.id !== edgeId);
    setNodes(nodes);
    setEdges(nextEdges);
    setSelectedNode(null);
    setSelectedEdge(null);
    commitHistory(nodes, nextEdges);
  }, [commitHistory, edges, nodes, setEdges, setNodes]);

  const updateSelectedNode = useCallback((updates: Partial<WorkspaceNodeData>) => {
    if (!selectedNode) return;
    const resolvedLabel = updates.label ?? selectedNode.data.label;
    const resolvedTags = updates.tags ?? selectedNode.data.tags;
    const resolvedVisibleMetaFields = updates.visibleMetaFields ?? selectedNode.data.visibleMetaFields;
    const resolvedWidth = updates.width ?? Math.max(selectedNode.data.width, estimateNodeWidth(resolvedLabel, resolvedTags));
    const resolvedHeight = updates.height ?? Math.max(
      selectedNode.data.height,
      estimateNodeHeightForContent(updates.description ?? selectedNode.data.description, resolvedTags, resolvedVisibleMetaFields),
    );

    const nextNodes = nodes.map((node) => (
      node.id === selectedNode.id
        ? {
            ...node,
            style: {
              ...node.style,
              width: resolvedWidth,
              height: resolvedHeight,
            },
            data: {
              ...node.data,
              ...updates,
              icon: updates.type || updates.kind ? getEntityIcon({
                type: (updates.type || node.data.type) as SourceType,
                kind: updates.kind || node.data.kind,
              }) : node.data.icon,
              visibleMetaFields: resolvedVisibleMetaFields,
              width: resolvedWidth,
              height: resolvedHeight,
            },
          }
        : node
    ));

    setNodes(nextNodes);
    setEdges(edges);
    syncSelectedState(nextNodes, edges);
    commitHistory(nextNodes, edges);
  }, [commitHistory, edges, nodes, selectedNode, setEdges, setNodes, syncSelectedState]);

  const updateSelectedEdge = useCallback((updates: Partial<WorkspaceEdgeData>) => {
    if (!selectedEdge) return;

    const nextEdges = edges.map((edge) => (
      edge.id === selectedEdge.id
        ? {
            ...edge,
            label: updates.label || edge.label,
            style: buildEdgeStyle(updates.type || edge.data?.type, updates.status || edge.data?.status),
            data: {
              ...edge.data,
              ...updates,
            },
          }
        : edge
    ));

    setNodes(nodes);
    setEdges(nextEdges);
    syncSelectedState(nodes, nextEdges);
    commitHistory(nodes, nextEdges);
  }, [commitHistory, edges, nodes, selectedEdge, setEdges, setNodes, syncSelectedState]);

  const applyConnectorType = useCallback((edgeId: string, connectorType: string) => {
    const preset = getConnectorPreset(connectorType);
    const nextEdges = edges.map((edge) => (
      edge.id === edgeId
        ? {
            ...edge,
            label: preset.label,
            style: buildEdgeStyle(preset.key, preset.status),
            data: {
              ...edge.data,
              label: preset.label,
              type: preset.key,
              status: preset.status,
            },
          }
        : edge
    ));

    setNodes(nodes);
    setEdges(nextEdges);
    syncSelectedState(nodes, nextEdges);
    commitHistory(nodes, nextEdges);
    setConnectorPicker(null);
  }, [commitHistory, edges, nodes, setEdges, setNodes, syncSelectedState]);

  const duplicateNode = useCallback((node: AppNode) => {
    const nextNodeId = `${node.id}:copy:${uuidv4()}`;
    const nextNode: AppNode = {
      ...node,
      id: nextNodeId,
      position: {
        x: node.position.x + 60,
        y: node.position.y + 60,
      },
      data: {
        ...node.data,
        entityId: nextNodeId,
        label: `${node.data.label} Copy`,
      },
      selected: false,
    };

    const nextNodes = [...nodes, nextNode];
    setNodes(nextNodes);
    setEdges(edges);
    setSelectedNode(nextNode);
    setSelectedEdge(null);
    commitHistory(nextNodes, edges);
  }, [commitHistory, edges, nodes, setEdges, setNodes]);

  const addWorkspaceNoteAt = useCallback((position?: { x: number; y: number }) => {
    const nextNode = createWorkspaceNode('New note', position || {
      x: 180 + (nodes.length % 4) * 220,
      y: 140 + Math.floor(nodes.length / 4) * 150,
    });
    const nextNodes = [...nodes, nextNode];
    setNodes(nextNodes);
    setEdges(edges);
    setSelectedNode(nextNode);
    setSelectedEdge(null);
    commitHistory(nextNodes, edges);
  }, [commitHistory, edges, nodes, setEdges, setNodes]);

  const reverseSelectedEdge = useCallback(() => {
    if (!selectedEdge) return;

    const nextEdges = edges.map((edge) => (
      edge.id === selectedEdge.id
        ? {
            ...edge,
            source: edge.target,
            target: edge.source,
          }
        : edge
    ));

    setNodes(nodes);
    setEdges(nextEdges);
    syncSelectedState(nodes, nextEdges);
    commitHistory(nodes, nextEdges);
  }, [commitHistory, edges, nodes, selectedEdge, setEdges, setNodes, syncSelectedState]);

  const reverseEdgeById = useCallback((edgeId: string) => {
    const nextEdges = edges.map((edge) => (
      edge.id === edgeId
        ? {
            ...edge,
            source: edge.target,
            target: edge.source,
          }
        : edge
    ));

    setNodes(nodes);
    setEdges(nextEdges);
    syncSelectedState(nodes, nextEdges);
    commitHistory(nodes, nextEdges);
  }, [commitHistory, edges, nodes, setEdges, setNodes, syncSelectedState]);

  const loadSuggestedGraph = useCallback((limit: number = DEFAULT_GRAPH_LIMIT) => {
    if (!payload) return;
    const next = buildGraphSlice(payload, limit);
    setNodes(next.nodes);
    setEdges(next.edges);
    syncSelectedState(next.nodes, next.edges);

    const snapshot = toHistorySnapshot(next.nodes, next.edges);
    setHistory([snapshot]);
    setHistoryIndex(0);

    window.setTimeout(() => fitView({ duration: 350, padding: 0.18 }), 40);
  }, [fitView, payload, setEdges, setNodes, syncSelectedState]);

  const addLinkedNeighbors = useCallback(() => {
    if (!selectedNode) return;

    const related = relationshipMap.get(selectedNode.id) || [];
    if (!related.length) return;

    const existingNodeIds = new Set(nodes.map((node) => node.id));
    const existingEdgeIds = new Set(edges.map((edge) => edge.id));
    const nextNodes = [...nodes];
    const nextEdges = [...edges];

    const missingNeighbors = related
      .map((relationship) => relationship.sourceId === selectedNode.id ? relationship.targetId : relationship.sourceId)
      .filter((entityId) => !existingNodeIds.has(entityId))
      .map((entityId) => entityMap.get(entityId))
      .filter((entity): entity is DbEntity => Boolean(entity));

    const radius = 260;
    missingNeighbors.forEach((entity, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(missingNeighbors.length, 1);
      const position = {
        x: selectedNode.position.x + Math.cos(angle) * radius,
        y: selectedNode.position.y + Math.sin(angle) * radius,
      };
      const node = createNodeFromEntity(entity, position);
      nextNodes.push(node);
      existingNodeIds.add(node.id);
    });

    related.forEach((relationship) => {
      if (existingEdgeIds.has(relationship.id)) return;
      if (!existingNodeIds.has(relationship.sourceId) || !existingNodeIds.has(relationship.targetId)) return;
      nextEdges.push(createEdgeFromRelationship(relationship));
      existingEdgeIds.add(relationship.id);
    });

    setNodes(nextNodes);
    setEdges(nextEdges);
    syncSelectedState(nextNodes, nextEdges);
    commitHistory(nextNodes, nextEdges);
    window.setTimeout(() => fitView({ duration: 300, padding: 0.22 }), 40);
  }, [commitHistory, edges, entityMap, fitView, nodes, relationshipMap, selectedNode, setEdges, setNodes, syncSelectedState]);

  const addLinkedNeighborsForNode = useCallback((node: AppNode) => {
    const related = relationshipMap.get(node.id) || [];
    if (!related.length) return;

    const existingNodeIds = new Set(nodes.map((item) => item.id));
    const existingEdgeIds = new Set(edges.map((item) => item.id));
    const nextNodes = [...nodes];
    const nextEdges = [...edges];

    const missingNeighbors = related
      .map((relationship) => relationship.sourceId === node.id ? relationship.targetId : relationship.sourceId)
      .filter((entityId) => !existingNodeIds.has(entityId))
      .map((entityId) => entityMap.get(entityId))
      .filter((entity): entity is DbEntity => Boolean(entity));

    const radius = 260;
    missingNeighbors.forEach((entity, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(missingNeighbors.length, 1);
      nextNodes.push(createNodeFromEntity(entity, {
        x: node.position.x + Math.cos(angle) * radius,
        y: node.position.y + Math.sin(angle) * radius,
      }));
    });

    related.forEach((relationship) => {
      if (existingEdgeIds.has(relationship.id)) return;
      nextEdges.push(createEdgeFromRelationship(relationship));
      existingEdgeIds.add(relationship.id);
    });

    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNode(node);
    setSelectedEdge(null);
    commitHistory(nextNodes, nextEdges);
    window.setTimeout(() => fitView({ duration: 300, padding: 0.22 }), 40);
  }, [commitHistory, edges, entityMap, fitView, nodes, relationshipMap, setEdges, setNodes]);

  const applyNodeLayout = useCallback((layout: 'kind' | 'alpha' | 'spread' | 'table' | 'status' | 'confidence') => {
    if (!nodes.length) return;

    const nextNodes = layout === 'kind'
      ? layoutNodesByKind(nodes)
      : layout === 'table'
        ? layoutNodesByGroup(nodes, (node) => node.data.sourceTable)
        : layout === 'status'
          ? layoutNodesByGroup(nodes, (node) => node.data.status)
          : layout === 'confidence'
            ? layoutNodesByGroup(nodes, (node) => (
                node.data.confidence >= 80 ? 'high confidence'
                  : node.data.confidence >= 50 ? 'medium confidence'
                    : 'low confidence'
              ))
      : layout === 'alpha'
        ? layoutNodesAlphabetically(nodes)
        : layoutNodesSpread(nodes);

    setNodes(nextNodes);
    setEdges(edges);
    syncSelectedState(nextNodes, edges);
    commitHistory(nextNodes, edges);
    window.setTimeout(() => fitView({ duration: 360, padding: 0.32, maxZoom: 0.9 }), 40);
  }, [commitHistory, edges, fitView, nodes, setEdges, setNodes, syncSelectedState]);

  const applyQuickView = useCallback((view: 'top-connected' | 'disputed' | 'evidence-core' | 'high-confidence') => {
    if (!payload) return;

    const degree = new Map<string, number>();
    payload.relationships.forEach((relationship) => {
      degree.set(relationship.sourceId, (degree.get(relationship.sourceId) || 0) + 1);
      degree.set(relationship.targetId, (degree.get(relationship.targetId) || 0) + 1);
    });

    let selectedIds = new Set<string>();

    if (view === 'top-connected') {
      payload.entities
        .slice()
        .sort((a, b) => (degree.get(b.id) || 0) - (degree.get(a.id) || 0))
        .slice(0, 18)
        .forEach((entity) => selectedIds.add(entity.id));
    } else if (view === 'disputed') {
      payload.relationships
        .filter((relationship) => relationship.status === 'disputed')
        .forEach((relationship) => {
          selectedIds.add(relationship.sourceId);
          selectedIds.add(relationship.targetId);
        });
    } else if (view === 'evidence-core') {
      payload.entities
        .filter((entity) => ['evidence', 'fact', 'contradiction', 'motion'].includes(entity.kind))
        .forEach((entity) => selectedIds.add(entity.id));
    } else if (view === 'high-confidence') {
      payload.entities
        .filter((entity) => {
          const matched = nodes.find((node) => node.id === entity.id);
          return matched ? matched.data.confidence >= 80 : true;
        })
        .slice(0, 30)
        .forEach((entity) => selectedIds.add(entity.id));
    }

    if (!selectedIds.size) {
      loadSuggestedGraph(DEFAULT_GRAPH_LIMIT);
      return;
    }

    const selectedEntities = payload.entities.filter((entity) => selectedIds.has(entity.id));
    const positions = buildPositions(selectedEntities);
    const nextNodes = selectedEntities.map((entity) => createNodeFromEntity(entity, positions.get(entity.id) || { x: 0, y: 0 }));
    const nextEdges = payload.relationships
      .filter((relationship) => selectedIds.has(relationship.sourceId) && selectedIds.has(relationship.targetId))
      .map(createEdgeFromRelationship);

    setNodes(nextNodes);
    setEdges(nextEdges);
    syncSelectedState(nextNodes, nextEdges);
    const snapshot = toHistorySnapshot(nextNodes, nextEdges);
    setHistory([snapshot]);
    setHistoryIndex(0);
    window.setTimeout(() => fitView({ duration: 360, padding: 0.32, maxZoom: 0.9 }), 40);
  }, [fitView, loadSuggestedGraph, nodes, payload, setEdges, setNodes, syncSelectedState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget = Boolean(
        target
        && (
          target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.isContentEditable
        )
      );

      if (event.metaKey || event.ctrlKey) {
        if (event.key === 'z') {
          event.preventDefault();
          if (event.shiftKey) redo();
          else undo();
        }
        if (event.key === 'k') {
          event.preventDefault();
          setShowFilters((current) => !current);
        }
      }

      if (!isTypingTarget && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        deleteSelected();
      }

      if (event.key === 'Escape') {
        setSelectedNode(null);
        setSelectedEdge(null);
        setContextMenu(null);
        setConnectorPicker(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, redo, undo]);

  const exportJSON = useCallback(() => {
    const exportData = {
      workspace: workspaceName,
      nodes: toHistorySnapshot(nodes, edges).nodes,
      edges: toHistorySnapshot(nodes, edges).edges,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const filename = `${workspaceName.toLowerCase().replace(/\s+/g, '-')}-analysis.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  }, [edges, nodes, workspaceName]);

  const exportDrawio = useCallback(() => {
    const xml = buildDrawioXml(workspaceName, nodes, edges);
    const dataUri = `data:application/xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const filename = `${workspaceName.toLowerCase().replace(/\s+/g, '-')}.drawio.xml`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  }, [edges, nodes, workspaceName]);

  const importWorkspaceJSON = useCallback((snapshot: ExportedWorkspace) => {
    if (!Array.isArray(snapshot.nodes) || !Array.isArray(snapshot.edges)) {
      throw new Error('This file does not contain a valid exported workspace.');
    }

    const hydratedSnapshot: HistorySnapshot = {
      nodes: snapshot.nodes,
      edges: snapshot.edges,
    };

    const hydrated = fromHistorySnapshot(hydratedSnapshot);
    setNodes(hydrated.nodes);
    setEdges(hydrated.edges);
    syncSelectedState(hydrated.nodes, hydrated.edges);
    setSelectedNode(null);
    setSelectedEdge(null);
    setContextMenu(null);
    setConnectorPicker(null);
    setWorkspaceName(snapshot.workspace?.trim() || 'Imported Evidence Network Analysis');
    setHistory([hydratedSnapshot]);
    setHistoryIndex(0);
    window.setTimeout(() => fitView({ duration: 360, padding: 0.32, maxZoom: 0.9 }), 40);
  }, [fitView, setEdges, setNodes, syncSelectedState]);

  const handleImportFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as ExportedWorkspace;
      importWorkspaceJSON(parsed);
    } catch (importError) {
      const message = importError instanceof Error ? importError.message : 'Unable to import workspace JSON.';
      window.alert(message);
    } finally {
      event.target.value = '';
    }
  }, [importWorkspaceJSON]);

  const selectedCount = (selectedNode ? 1 : 0) + (selectedEdge ? 1 : 0);
  const summary = payload?.summary;
  const contextNode = contextMenu?.nodeId ? nodes.find((node) => node.id === contextMenu.nodeId) || null : null;
  const contextEdge = contextMenu?.edgeId ? edges.find((edge) => edge.id === contextMenu.edgeId) || null : null;
  const handleNodeResizeStop = useCallback((_: React.MouseEvent, node: AppNode) => {
    const width = clamp(Number(node.width || node.style?.width || node.data.width), MIN_NODE_WIDTH, MAX_NODE_WIDTH);
    const height = clamp(Number(node.height || node.style?.height || node.data.height), MIN_NODE_HEIGHT, MAX_NODE_HEIGHT);

    const nextNodes = nodes.map((item) => (
      item.id === node.id
        ? {
            ...item,
            style: {
              ...item.style,
              width,
              height,
            },
            data: {
              ...item.data,
              width,
              height,
            },
          }
        : item
    ));

    setNodes(nextNodes);
    setEdges(edges);
    syncSelectedState(nextNodes, edges);
    commitHistory(nextNodes, edges);
  }, [commitHistory, edges, nodes, setEdges, setNodes, syncSelectedState]);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-200 overflow-hidden" onClick={() => setContextMenu(null)}>
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportFile}
        className="hidden"
      />
      <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-2">
            <div className="w-8 h-8 bg-cyan-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold tracking-tighter">N</span>
            </div>
            <div>
              <div className="font-semibold tracking-tighter text-2xl text-white">NEXUS</div>
              <div className="text-[10px] text-slate-500 -mt-1">EVIDENCE DB LINK ANALYSIS</div>
            </div>
          </div>

          <div className="ml-8 flex items-center bg-slate-900 border border-slate-700 rounded-3xl text-xs px-4 h-8">
            <input
              type="text"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              className="bg-transparent outline-none w-64 font-medium"
            />
            <div className="text-emerald-400 text-[10px] ml-2 font-mono">DB</div>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-900 rounded-xl disabled:opacity-40 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-900 rounded-xl disabled:opacity-40 transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-700 mx-2" />

          <button
            onClick={() => fitView({ duration: 400, padding: 0.35, maxZoom: 0.9 })}
            className="px-3 text-xs h-8 border border-slate-700 hover:border-slate-400 rounded-2xl flex items-center gap-x-1.5 hover:bg-slate-900"
          >
            <ZoomOut className="w-3.5 h-3.5" /> FIT
          </button>

          <button
            onClick={refreshFromDb}
            className="px-3 text-xs h-8 border border-slate-700 hover:border-cyan-400 rounded-2xl flex items-center gap-x-1.5 hover:bg-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" /> REFRESH DB
          </button>

          <button
            onClick={exportJSON}
            className="px-4 text-xs h-8 border border-slate-700 hover:border-emerald-400 hover:text-emerald-400 rounded-2xl flex items-center gap-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT
          </button>

          <button
            onClick={exportDrawio}
            className="px-4 text-xs h-8 border border-slate-700 hover:border-amber-400 hover:text-amber-300 rounded-2xl flex items-center gap-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT DRAWIO
          </button>

          <button
            onClick={() => importInputRef.current?.click()}
            className="px-4 text-xs h-8 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 rounded-2xl flex items-center gap-x-1.5 transition-all"
          >
            <FileUp className="w-3.5 h-3.5" /> IMPORT JSON
          </button>

          <button
            onClick={deleteSelected}
            disabled={selectedCount === 0}
            className="px-3 h-8 flex items-center gap-x-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded-2xl text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" /> DELETE
          </button>
          <button
            onClick={() => addWorkspaceNoteAt()}
            className="px-3 h-8 flex items-center gap-x-1.5 border border-slate-700 hover:border-cyan-400 rounded-2xl text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> NOTE
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className="border-r border-slate-800 bg-slate-950 flex flex-col flex-shrink-0 min-w-0"
          style={{ width: leftPanelWidth }}
        >
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="uppercase text-xs tracking-[1px] font-medium text-slate-400">Source Database</div>
              <div className="flex items-center gap-2">
                <div className="text-xs bg-slate-900 px-2 py-px rounded">SQLite</div>
                <div className="text-[10px] text-slate-500 font-mono">{Math.round(leftPanelWidth)}px</div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 pl-9 py-2 text-sm rounded-2xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loadSuggestedGraph(DEFAULT_GRAPH_LIMIT)}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Load Suggested Graph
              </button>
              <button
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                  setSelectedNode(null);
                  setSelectedEdge(null);
                  setHistory([toHistorySnapshot([], [])]);
                  setHistoryIndex(0);
                }}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-slate-400 hover:bg-slate-900 transition-colors"
              >
                Clear Canvas
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyNodeLayout('kind')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Sort By Type
              </button>
              <button
                onClick={() => applyNodeLayout('alpha')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                A-Z
              </button>
              <button
                onClick={() => applyNodeLayout('spread')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Spread Out
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyNodeLayout('table')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Group Table
              </button>
              <button
                onClick={() => applyNodeLayout('status')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Group Status
              </button>
              <button
                onClick={() => applyNodeLayout('confidence')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Group Confidence
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyQuickView('top-connected')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-emerald-400 hover:bg-slate-900 transition-colors"
              >
                Top Connected
              </button>
              <button
                onClick={() => applyQuickView('disputed')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-red-400 hover:bg-slate-900 transition-colors"
              >
                Disputed Only
              </button>
              <button
                onClick={() => applyQuickView('evidence-core')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors"
              >
                Evidence Core
              </button>
              <button
                onClick={() => applyQuickView('high-confidence')}
                className="px-3 py-2 text-xs rounded-2xl border border-slate-700 hover:border-amber-400 hover:bg-slate-900 transition-colors"
              >
                High Confidence
              </button>
            </div>

            {summary && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-400 space-y-1">
                <div>{summary.entityCount} entities • {summary.relationshipCount} relationships</div>
                <div className="leading-relaxed">
                  {Object.entries(summary.kinds)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([kind, count]) => `${kind}: ${count}`)
                    .join(' • ')}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-1 text-sm" onDragOver={onDragOver}>
            {loading && (
              <div className="p-6 text-center text-slate-500 text-sm">Loading graph data from evidence.db…</div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-3xl border border-red-900 bg-red-950/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && filteredSources.map((entity) => {
              const color = getNodeColor(entity.type, entity.kind, entity.color);
              return (
                <div
                  key={entity.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, entity)}
                  onClick={() => addEntityToCanvas(entity)}
                  className="group flex items-center gap-3 px-3 py-[13px] bg-slate-900 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-2xl cursor-grab active:cursor-grabbing transition-all"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}30`, color }}
                  >
                    {getEntityIcon(entity)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white break-words whitespace-normal leading-snug">{entity.name}</div>
                    <div className="text-xs text-slate-500 break-all">
                      {entity.kind} • {entity.sourceTable}
                    </div>
                  </div>

                  <div className="text-[10px] px-2 py-px bg-black/60 text-slate-400 rounded font-mono">
                    {entity.kind.slice(0, 4).toUpperCase()}
                  </div>
                </div>
              );
            })}

            {!loading && !error && filteredSources.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No matching entities</div>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <div>{filteredSources.length} visible sources</div>
            <button onClick={refreshFromDb} className="underline hover:text-slate-300">Refresh</button>
          </div>
        </div>

        <div
          className={cn(
            'w-2 cursor-col-resize bg-slate-950 hover:bg-cyan-500/30 transition-colors flex-shrink-0',
            activeResizer === 'left' ? 'bg-cyan-500/40' : '',
          )}
          onMouseDown={() => setActiveResizer('left')}
          title="Resize source panel"
        />

        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            onSelectionChange={onSelectionChange}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStop={() => commitHistory(nodes, edges)}
            onNodeResizeStop={handleNodeResizeStop}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.05}
            maxZoom={1.8}
            translateExtent={CANVAS_EXTENT}
            nodeExtent={CANVAS_EXTENT}
            defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
            panOnScroll
            selectionOnDrag
            className="bg-[#0a0f1c]"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#334155" size={1.5} />
            <Controls position="bottom-left" />
            <MiniMap
              position="bottom-right"
              className="border border-slate-700 !bg-slate-900"
              nodeColor={(node) => getNodeColor(node.data.type, node.data.kind)}
            />

            <Panel position="top-left" className="flex gap-2 !bg-transparent !shadow-none">
              <div
                onClick={() => setShowFilters((current) => !current)}
                className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-3xl flex items-center gap-x-2 text-xs cursor-pointer hover:border-cyan-400"
              >
                <span>DB GRAPH</span>
                {showFilters && <span className="text-emerald-400">ON</span>}
              </div>
            </Panel>
          </ReactFlow>

          {connectorPicker && (
            <div className="absolute inset-x-0 top-5 flex justify-center pointer-events-none z-50">
              <div className="pointer-events-auto rounded-3xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl min-w-[420px]">
                <div className="text-sm text-white font-medium mb-1">Choose connector type</div>
                <div className="text-xs text-slate-400 mb-3">Pick the relationship style for the new connector.</div>
                <div className="grid grid-cols-2 gap-2">
                  {CONNECTOR_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => applyConnectorType(connectorPicker.edgeId, preset.key)}
                      className="rounded-2xl border border-slate-700 hover:border-cyan-400 bg-slate-950 px-3 py-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm text-white">
                        <Route className="w-4 h-4" style={{ color: preset.color }} />
                        {preset.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{preset.key}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      const activeEdge = edges.find((edge) => edge.id === connectorPicker.edgeId) || null;
                      if (activeEdge) {
                        commitHistory(nodes, edges);
                        setSelectedEdge(activeEdge);
                      }
                      setConnectorPicker(null);
                    }}
                    className="px-3 py-2 rounded-2xl border border-slate-700 text-xs hover:bg-slate-800"
                  >
                    Keep Default
                  </button>
                </div>
              </div>
            </div>
          )}

          {contextMenu && (
            <div
              className="fixed z-50 min-w-[220px] rounded-3xl border border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-2xl p-2"
              style={{ left: contextMenu.x + 8, top: contextMenu.y - 56 }}
              onClick={(event) => event.stopPropagation()}
            >
              {contextMenu.kind === 'node' && contextNode && (
                <>
                  <div className="px-3 py-2 text-[11px] text-slate-400 font-mono">{contextNode.data.label}</div>
                  <button onClick={() => { duplicateNode(contextNode); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Duplicate card</button>
                  <button onClick={() => { addLinkedNeighborsForNode(contextNode); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Add linked neighbors</button>
                  <button onClick={() => { fitView({ nodes: [contextNode], duration: 250, padding: 0.8, maxZoom: 1.1 }); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Focus card</button>
                  <button onClick={() => { navigator.clipboard?.writeText(contextNode.data.label); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Copy label</button>
                  <button onClick={() => { deleteNodeById(contextNode.id); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-red-950 text-red-300 text-sm">Delete card</button>
                </>
              )}
              {contextMenu.kind === 'edge' && contextEdge && (
                <>
                  <div className="px-3 py-2 text-[11px] text-slate-400 font-mono">{contextEdge.label || contextEdge.data?.label}</div>
                  {CONNECTOR_PRESETS.map((preset) => (
                    <button key={preset.key} onClick={() => { setSelectedEdge(contextEdge); applyConnectorType(contextEdge.id, preset.key); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">
                      Set as {preset.label}
                    </button>
                  ))}
                  <button onClick={() => { reverseEdgeById(contextEdge.id); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Reverse direction</button>
                  <button onClick={() => { deleteEdgeById(contextEdge.id); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-red-950 text-red-300 text-sm">Delete connector</button>
                </>
              )}
              {contextMenu.kind === 'pane' && (
                <>
                  <div className="px-3 py-2 text-[11px] text-slate-400 font-mono">Canvas actions</div>
                  <button onClick={() => { addWorkspaceNoteAt(contextMenu.position); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Add note card here</button>
                  <button onClick={() => { exportDrawio(); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Export draw.io XML</button>
                  <button onClick={() => { importInputRef.current?.click(); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Import workspace JSON</button>
                  <button onClick={() => { loadSuggestedGraph(DEFAULT_GRAPH_LIMIT); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Reload suggested graph</button>
                  <button onClick={() => { fitView({ duration: 320, padding: 0.35, maxZoom: 0.9 }); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-slate-800 text-sm">Fit all cards</button>
                  <button onClick={() => { setNodes([]); setEdges([]); setSelectedNode(null); setSelectedEdge(null); setHistory([toHistorySnapshot([], [])]); setHistoryIndex(0); setContextMenu(null); }} className="w-full text-left px-3 py-2 rounded-2xl hover:bg-red-950 text-red-300 text-sm">Clear canvas</button>
                </>
                  )}
              </div>
            )}

            {payloadInsights && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300 space-y-3">
                <div className="text-[11px] uppercase tracking-[1px] text-slate-500">Value Signals</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 px-3 py-2">
                    <div className="text-slate-500">Disputed links</div>
                    <div className="text-red-300 font-mono text-sm">{payloadInsights.disputedLinks}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 px-3 py-2">
                    <div className="text-slate-500">Evidence nodes</div>
                    <div className="text-cyan-300 font-mono text-sm">{payloadInsights.evidenceCount}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-950/70 border border-slate-800 px-3 py-2 col-span-2">
                    <div className="text-slate-500">Contradiction nodes</div>
                    <div className="text-amber-300 font-mono text-sm">{payloadInsights.contradictionCount}</div>
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 mb-2">Most connected</div>
                  <div className="space-y-2">
                    {payloadInsights.topConnected.map(({ entity, degree }) => (
                      <button
                        key={`insight-${entity.id}`}
                        onClick={() => addEntityToCanvas(entity)}
                        className="w-full text-left rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-cyan-400 transition-colors"
                      >
                        <div className="text-slate-100 text-xs leading-snug">{entity.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{entity.kind} • {degree} links</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        <div
          className={cn(
            'w-2 cursor-col-resize bg-slate-950 hover:bg-cyan-500/30 transition-colors flex-shrink-0',
            activeResizer === 'right' ? 'bg-cyan-500/40' : '',
          )}
          onMouseDown={() => setActiveResizer('right')}
          title="Resize inspector panel"
        />

        <div
          className="border-l border-slate-800 bg-slate-950 flex flex-col overflow-hidden flex-shrink-0 min-w-0"
          style={{ width: rightPanelWidth }}
        >
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="font-medium text-sm flex items-center gap-x-2">
              {selectedNode && <span>ENTITY PROPERTIES</span>}
              {selectedEdge && <span>RELATIONSHIP</span>}
              {!selectedNode && !selectedEdge && <span className="text-slate-400">INSPECTOR</span>}
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[10px] text-slate-500 font-mono">{Math.round(rightPanelWidth)}px</div>
              {selectedCount > 0 && (
                <div className="text-xs bg-slate-800 text-slate-400 px-3 py-px rounded-full font-mono">1 SELECTED</div>
              )}
            </div>
          </div>

          {selectedNode ? (
            <div className="flex-1 p-5 space-y-6 overflow-auto text-sm">
              <div>
                <div className="text-xs text-slate-400 mb-1.5">DISPLAY NAME</div>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(event) => updateSelectedNode({ label: event.target.value })}
                  className="block w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <div>NODE WIDTH</div>
                    <div className="font-mono text-cyan-400">{selectedNode.data.width}px</div>
                  </div>
                  <input
                    type="range"
                    min={MIN_NODE_WIDTH}
                    max={MAX_NODE_WIDTH}
                    value={selectedNode.data.width}
                    onChange={(event) => updateSelectedNode({ width: parseInt(event.target.value, 10) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <div>NODE HEIGHT</div>
                    <div className="font-mono text-cyan-400">{selectedNode.data.height}px</div>
                  </div>
                  <input
                    type="range"
                    min={MIN_NODE_HEIGHT}
                    max={MAX_NODE_HEIGHT}
                    value={selectedNode.data.height}
                    onChange={(event) => updateSelectedNode({ height: parseInt(event.target.value, 10) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                  <div className="text-slate-400 mb-1">DB TABLE</div>
                  <div className="font-mono text-slate-200 break-all">{selectedNode.data.sourceTable}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                  <div className="text-slate-400 mb-1">ROW ID</div>
                  <div className="font-mono text-slate-200">{selectedNode.data.sourcePk}</div>
                </div>
              </div>

              {selectedNode.data.slug && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-xs">
                  <div className="text-slate-400 mb-1">SLUG</div>
                  <div className="font-mono text-slate-200 break-all">{selectedNode.data.slug}</div>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-400 mb-1.5">TYPE</div>
                <select
                  value={selectedNode.data.type}
                  onChange={(event) => updateSelectedNode({ type: event.target.value as SourceType })}
                  className="block w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 focus:outline-none"
                >
                  <option value="person">Person</option>
                  <option value="organization">Organization</option>
                  <option value="location">Location</option>
                  <option value="event">Event</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <div>CONFIDENCE</div>
                  <div className="font-mono text-emerald-400">{selectedNode.data.confidence}%</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedNode.data.confidence}
                  onChange={(event) => updateSelectedNode({ confidence: parseInt(event.target.value, 10) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-2">STATUS</div>
                <div className="flex gap-2">
                  {(['verified', 'disputed', 'hypothetical', 'archived'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateSelectedNode({ status })}
                      className={cn(
                        'flex-1 py-2 text-xs rounded-2xl border transition-all',
                        selectedNode.data.status === status
                          ? 'border-emerald-400 bg-emerald-950 text-emerald-300'
                          : 'border-slate-700 hover:bg-slate-900',
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1.5">DESCRIPTION</div>
                <textarea
                  value={selectedNode.data.description}
                  onChange={(event) => updateSelectedNode({ description: event.target.value })}
                  className="w-full h-28 resize-y bg-slate-900 border border-slate-700 rounded-3xl p-4 text-sm font-light focus:outline-none"
                />
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1.5">TAGS</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.data.tags.map((tag, index) => (
                    <div key={`${tag}-${index}`} className="bg-slate-800 text-xs px-3 py-1 rounded-3xl flex items-center gap-x-1">
                      #{tag}
                      <button
                        onClick={() => updateSelectedNode({ tags: selectedNode.data.tags.filter((_, tagIndex) => tagIndex !== index) })}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag... (press enter)"
                  className="mt-3 w-full text-xs bg-slate-900 border border-dashed border-slate-700 focus:border-white rounded-2xl px-4 py-3"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
                      updateSelectedNode({
                        tags: [...selectedNode.data.tags, event.currentTarget.value.trim()],
                      });
                      event.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {Object.keys(selectedNode.data.meta).length > 0 && (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-xs text-slate-400 mb-3">DB METADATA</div>
                  <div className="mb-4 space-y-2">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wide">Show On Card</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedNode.data.meta).map(([key, value]) => (
                        <label key={`visible-${key}`} className="flex items-center gap-2 text-xs rounded-2xl border border-slate-800 px-3 py-2 cursor-pointer hover:bg-slate-800/60">
                          <input
                            type="checkbox"
                            checked={selectedNode.data.visibleMetaFields.includes(key)}
                            onChange={(event) => {
                              const nextVisibleFields = event.target.checked
                                ? [...selectedNode.data.visibleMetaFields, key]
                                : selectedNode.data.visibleMetaFields.filter((field) => field !== key);
                              updateSelectedNode({ visibleMetaFields: nextVisibleFields });
                            }}
                            className="accent-cyan-500"
                          />
                          <span className="text-slate-200 truncate">{key}</span>
                          <span className="text-slate-500 truncate">{String(value ?? '')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    {Object.entries(selectedNode.data.meta).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-3">
                        <span className="text-slate-400">{key}</span>
                        <span className="text-slate-200 text-right break-all">{String(value ?? '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-400 mb-1.5">ANALYST NOTES</div>
                <textarea
                  value={selectedNode.data.notes}
                  onChange={(event) => updateSelectedNode({ notes: event.target.value })}
                  className="w-full h-28 resize-y bg-slate-900 border border-slate-700 rounded-3xl p-4 text-sm font-light focus:outline-none"
                  placeholder="Write observations, provenance, contradictions..."
                />
              </div>

              <button
                onClick={addLinkedNeighbors}
                className="w-full py-3 rounded-2xl border border-cyan-700 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-950/60 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add linked neighbors from DB
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => duplicateNode(selectedNode)}
                  className="w-full py-3 rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => fitView({ nodes: [selectedNode], duration: 240, padding: 0.8, maxZoom: 1.1 })}
                  className="w-full py-3 rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Focus className="w-4 h-4" />
                  Focus
                </button>
              </div>
            </div>
          ) : selectedEdge ? (
            <div className="flex-1 p-5 space-y-6 overflow-auto">
              <div>
                <div className="text-xs text-slate-400 mb-1.5">RELATIONSHIP TYPE</div>
                <div className="space-y-3">
                  <input
                    value={selectedEdge.data?.label || ''}
                    onChange={(event) => updateSelectedEdge({ label: event.target.value })}
                    className="block w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-base"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {CONNECTOR_PRESETS.map((preset) => (
                      <button
                        key={preset.key}
                        onClick={() => updateSelectedEdge({ type: preset.key, label: preset.label, status: preset.status })}
                        className="px-3 py-2 rounded-2xl border border-slate-700 hover:border-cyan-400 text-xs text-left"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1.5">CONFIDENCE</div>
                  <input
                    type="number"
                    value={selectedEdge.data?.confidence || 50}
                    onChange={(event) => updateSelectedEdge({ confidence: parseInt(event.target.value, 10) || 50 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1.5">STATUS</div>
                  <select
                    value={selectedEdge.data?.status}
                    onChange={(event) => updateSelectedEdge({ status: event.target.value as EdgeStatus })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm"
                  >
                    <option value="verified">Verified</option>
                    <option value="alleged">Alleged</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1.5">NOTES / EVIDENCE</div>
                <textarea
                  value={selectedEdge.data?.notes || ''}
                  onChange={(event) => updateSelectedEdge({ notes: event.target.value })}
                  className="w-full h-40 bg-slate-900 border border-slate-700 rounded-3xl p-4 text-sm"
                  placeholder="Evidence, dates, sources..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={reverseSelectedEdge}
                  className="w-full py-3 rounded-2xl border border-slate-700 hover:border-cyan-400 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Route className="w-4 h-4" />
                  Reverse
                </button>
                <button
                  onClick={deleteSelected}
                  className="w-full py-3 rounded-2xl border border-red-800 bg-red-950/40 text-red-300 hover:bg-red-950/60 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
                <Edit3 className="w-6 h-6 text-slate-500" />
              </div>
              <div className="text-slate-400">
                Select a node or edge
                <br />
                to inspect and edit
              </div>
              <div className="text-[10px] text-slate-600 mt-8">
                Drag DB entities from the left panel or load the suggested graph
              </div>
            </div>
          )}

          <div className="border-t border-slate-800 p-4 text-[10px] text-slate-500 font-mono flex justify-between items-center">
            <div>DB-DRIVEN GRAPH</div>
            <div className="flex items-center gap-1">
              <div className={cn('w-2 h-2 rounded-full', error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse')} />
              {error ? 'ERROR' : 'LIVE'}
            </div>
          </div>
        </div>
      </div>

      <div className="h-9 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center px-4 justify-between font-mono">
        <div className="flex items-center gap-x-5">
          <div>{nodes.length} NODES • {edges.length} EDGES</div>
          <div>{summary?.entityCount || 0} DB ENTITIES • {summary?.relationshipCount || 0} DB LINKS</div>
        </div>

        <div>Run the root server for `/api/network-analysis`, then use Vite or a built single-file app for the UI</div>

        <div className="flex gap-x-4">
          <span>CTRL+Z UNDO</span>
          <span>CTRL+SHIFT+Z REDO</span>
          <span>ESC CLEAR</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <GraphEditor />
    </ReactFlowProvider>
  );
}
