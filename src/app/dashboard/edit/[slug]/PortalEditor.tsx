"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ExternalLink, BarChart3, ChevronUp, ChevronDown,
  Trash2, Plus, X, Save, Pencil, Globe, Lock
} from 'lucide-react';

interface BlockData {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  personas: string[];
}

interface PortalData {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  personas: string[];
  accessMode: string;
  allowedEmails: string[];
  blocks: BlockData[];
}

// ── Default content shapes for each block type ──────────────────────────────
const DEFAULT_CONTENT: Record<string, unknown> = {
  hook: { title: 'New Hook', subtitle: 'Enter your subtitle here.' },
  proof: { caseStudies: [{ metric: '100%', summary: 'Enter a result.', logo: '' }] },
  roi: { estimatedSavings: 100000, targetMetric: 'Accounts', sliderMin: 10, sliderMax: 500 },
  timeline: { steps: [{ title: 'Step 1', duration: 'Week 1', description: 'Description.', status: 'pending' }] },
  drive: { files: [{ fileName: 'Document', fileType: 'PDF', url: '#' }] },
  tombstone_carousel: { tombstones: [{ dealName: 'Deal Name', acquirer: 'Acquirer', target: 'Target', dealValue: '$0', year: 2024, description: 'Description.' }] },
};

const BLOCK_TYPES = ['hook', 'proof', 'roi', 'timeline', 'drive', 'tombstone_carousel'];

const TYPE_LABELS: Record<string, string> = {
  hook: 'Hook', proof: 'Proof', roi: 'ROI Calculator',
  timeline: 'Timeline', drive: 'Drive', tombstone_carousel: 'Tombstone Carousel',
};

// ── Type-specific inline form components ────────────────────────────────────

function HookForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-neutral-300 text-xs">Title</Label>
        <Input value={String(content.title ?? '')} onChange={(e) => onChange({ ...content, title: e.target.value })} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-neutral-300 text-xs">Subtitle</Label>
        <Input value={String(content.subtitle ?? '')} onChange={(e) => onChange({ ...content, subtitle: e.target.value })} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
      </div>
    </div>
  );
}

function ProofForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const studies = (content.caseStudies as { metric: string; summary: string; logo: string }[]) ?? [];
  const update = (idx: number, field: string, val: string) => {
    const next = studies.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    onChange({ ...content, caseStudies: next });
  };
  const remove = (idx: number) => onChange({ ...content, caseStudies: studies.filter((_, i) => i !== idx) });
  const add = () => onChange({ ...content, caseStudies: [...studies, { metric: '', summary: '', logo: '' }] });

  return (
    <div className="space-y-3">
      {studies.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Metric</Label>
            <Input value={s.metric} onChange={(e) => update(i, 'metric', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Summary</Label>
            <Input value={s.summary} onChange={(e) => update(i, 'summary', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <button onClick={() => remove(i)} className="text-neutral-600 hover:text-red-400 transition-colors pb-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
        <Plus className="w-3 h-3" /> Add Case Study
      </button>
    </div>
  );
}

function RoiForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { key: 'estimatedSavings', label: 'Estimated Savings', type: 'number' },
        { key: 'targetMetric', label: 'Target Metric', type: 'text' },
        { key: 'sliderMin', label: 'Slider Min', type: 'number' },
        { key: 'sliderMax', label: 'Slider Max', type: 'number' },
      ].map(({ key, label, type }) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">{label}</Label>
          <Input
            type={type}
            value={String(content[key] ?? '')}
            onChange={(e) => onChange({ ...content, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-white text-sm"
          />
        </div>
      ))}
    </div>
  );
}

function TimelineForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const steps = (content.steps as { title: string; duration: string; description: string; status: string }[]) ?? [];
  const update = (idx: number, field: string, val: string) => {
    const next = steps.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    onChange({ ...content, steps: next });
  };
  const remove = (idx: number) => onChange({ ...content, steps: steps.filter((_, i) => i !== idx) });
  const add = () => onChange({ ...content, steps: [...steps, { title: '', duration: '', description: '', status: 'pending' }] });

  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Title</Label>
            <Input value={s.title} onChange={(e) => update(i, 'title', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Duration</Label>
            <Input value={s.duration} onChange={(e) => update(i, 'duration', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Description</Label>
            <Input value={s.description} onChange={(e) => update(i, 'description', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <select value={s.status} onChange={(e) => update(i, 'status', e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-md px-2 h-9 mt-auto">
            <option value="done">Done</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
          <button onClick={() => remove(i)} className="text-neutral-600 hover:text-red-400 transition-colors mt-auto pb-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
        <Plus className="w-3 h-3" /> Add Step
      </button>
    </div>
  );
}

function DriveForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const files = (content.files as { fileName: string; fileType: string; url: string }[]) ?? [];
  const update = (idx: number, field: string, val: string) => {
    const next = files.map((f, i) => i === idx ? { ...f, [field]: val } : f);
    onChange({ ...content, files: next });
  };
  const remove = (idx: number) => onChange({ ...content, files: files.filter((_, i) => i !== idx) });
  const add = () => onChange({ ...content, files: [...files, { fileName: '', fileType: 'PDF', url: '' }] });

  return (
    <div className="space-y-3">
      {files.map((f, i) => (
        <div key={i} className="grid grid-cols-[2fr_1fr_2fr_auto] gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">File Name</Label>
            <Input value={f.fileName} onChange={(e) => update(i, 'fileName', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Type</Label>
            <Input value={f.fileType} onChange={(e) => update(i, 'fileType', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">URL</Label>
            <Input value={f.url} onChange={(e) => update(i, 'url', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
          <button onClick={() => remove(i)} className="text-neutral-600 hover:text-red-400 transition-colors pb-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
        <Plus className="w-3 h-3" /> Add File
      </button>
    </div>
  );
}

function TombstoneForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  type TombstoneRow = { dealName: string; acquirer: string; target: string; dealValue: string; year: number; description: string; logoUrl?: string };
  const tombstones = (content.tombstones as TombstoneRow[]) ?? [];
  const update = (idx: number, field: string, val: string | number) => {
    const next = tombstones.map((t, i) => i === idx ? { ...t, [field]: val } : t);
    onChange({ ...content, tombstones: next });
  };
  const remove = (idx: number) => onChange({ ...content, tombstones: tombstones.filter((_, i) => i !== idx) });
  const add = () => onChange({ ...content, tombstones: [...tombstones, { dealName: '', acquirer: '', target: '', dealValue: '', year: new Date().getFullYear(), description: '' }] });

  return (
    <div className="space-y-4">
      {tombstones.map((t, i) => (
        <div key={i} className="bg-neutral-800/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-400 font-medium">Tombstone {i + 1}</span>
            <button onClick={() => remove(i)} className="text-neutral-600 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'dealName', label: 'Deal Name' },
              { key: 'dealValue', label: 'Deal Value' },
              { key: 'acquirer', label: 'Acquirer' },
              { key: 'target', label: 'Target' },
              { key: 'year', label: 'Year' },
              { key: 'logoUrl', label: 'Logo URL' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label className="text-neutral-400 text-xs">{label}</Label>
                <Input
                  type={key === 'year' ? 'number' : 'text'}
                  value={String(t[key as keyof TombstoneRow] ?? '')}
                  onChange={(e) => update(i, key, key === 'year' ? Number(e.target.value) : e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white text-sm h-8"
                />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-400 text-xs">Description</Label>
            <Input value={t.description} onChange={(e) => update(i, 'description', e.target.value)} className="bg-neutral-800 border-neutral-700 text-white text-sm" />
          </div>
        </div>
      ))}
      <button onClick={add} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
        <Plus className="w-3 h-3" /> Add Tombstone
      </button>
    </div>
  );
}

function BlockContentForm({ type, content, onChange }: { type: string; content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  switch (type) {
    case 'hook': return <HookForm content={content} onChange={onChange} />;
    case 'proof': return <ProofForm content={content} onChange={onChange} />;
    case 'roi': return <RoiForm content={content} onChange={onChange} />;
    case 'timeline': return <TimelineForm content={content} onChange={onChange} />;
    case 'drive': return <DriveForm content={content} onChange={onChange} />;
    case 'tombstone_carousel': return <TombstoneForm content={content} onChange={onChange} />;
    default: return <p className="text-neutral-500 text-sm">No form for block type: {type}</p>;
  }
}

// ── Main PortalEditor component ──────────────────────────────────────────────

export function PortalEditor({ portal }: { portal: PortalData }) {
  const [title, setTitle] = useState(portal.title);
  const [personas, setPersonas] = useState<string[]>(portal.personas);
  const [newPersona, setNewPersona] = useState('');
  const [accessMode, setAccessMode] = useState(portal.accessMode);
  const [allowedEmails, setAllowedEmails] = useState<string[]>(portal.allowedEmails);
  const [newEmail, setNewEmail] = useState('');
  const [blocks, setBlocks] = useState<BlockData[]>(portal.blocks);
  const [savingBlock, setSavingBlock] = useState<string | null>(null);

  // ── Title save ──
  const saveTitle = async () => {
    await fetch(`/api/portals/${portal.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  };

  // ── Persona management ──
  const savePersonas = async (updated: string[]) => {
    setPersonas(updated);
    await fetch(`/api/portals/${portal.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personas: updated }),
    });
  };

  const addPersona = () => {
    const trimmed = newPersona.trim();
    if (!trimmed || personas.includes(trimmed)) return;
    savePersonas([...personas, trimmed]);
    setNewPersona('');
  };

  const removePersona = (name: string) => savePersonas(personas.filter((p) => p !== name));

  // ── Access control ──
  const saveAccessSettings = async (mode: string, emails: string[]) => {
    await fetch(`/api/portals/${portal.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessMode: mode, allowedEmails: emails }),
    });
  };

  const setMode = (mode: string) => {
    setAccessMode(mode);
    saveAccessSettings(mode, allowedEmails);
  };

  const addEmail = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || allowedEmails.includes(trimmed)) return;
    const updated = [...allowedEmails, trimmed];
    setAllowedEmails(updated);
    setNewEmail('');
    saveAccessSettings(accessMode, updated);
  };

  const removeEmail = (email: string) => {
    const updated = allowedEmails.filter((e) => e !== email);
    setAllowedEmails(updated);
    saveAccessSettings(accessMode, updated);
  };

  // ── Block content edit ──
  const updateBlockContent = (id: string, content: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, content } : b));
  };

  const updateBlockPersonas = (id: string, bp: string[]) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, personas: bp } : b));
  };

  const saveBlock = async (block: BlockData) => {
    setSavingBlock(block.id);
    await fetch(`/api/portals/${portal.slug}/blocks/${block.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: block.content, personas: block.personas }),
    });
    setSavingBlock(null);
  };

  // ── Reorder ──
  const moveBlock = async (idx: number, dir: -1 | 1) => {
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setBlocks(next);
    await fetch(`/api/portals/${portal.slug}/blocks/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blockIds: next.map((b) => b.id) }),
    });
  };

  // ── Delete block ──
  const deleteBlock = async (id: string) => {
    if (!window.confirm('Delete this block? This cannot be undone.')) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/portals/${portal.slug}/blocks/${id}`, { method: 'DELETE' });
  };

  // ── Add block ──
  const addBlock = async (type: string) => {
    const res = await fetch(`/api/portals/${portal.slug}/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content: DEFAULT_CONTENT[type] ?? {}, personas: [] }),
    });
    if (res.ok) {
      const { block } = await res.json();
      setBlocks((prev) => [...prev, { ...block, content: block.content as Record<string, unknown>, personas: (block.personas as string[] | null) ?? [] }]);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-neutral-400 text-xs flex items-center gap-1.5"><Pencil className="w-3 h-3" /> Portal Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            className="bg-neutral-900 border-neutral-700 text-white text-2xl font-bold h-12"
          />
        </div>
        <div className="flex gap-2 mt-6">
          <Link href={`/dashboard/signals/${portal.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white">
              <BarChart3 className="w-4 h-4" /> Signals
            </Button>
          </Link>
          <Link href={`/p/${portal.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white">
              View Live <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Persona Manager */}
      <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-white">Persona Filters</h2>
          <p className="text-neutral-500 text-sm mt-0.5">Personas let viewers filter portal blocks by role. Leave empty for no filtering.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {personas.map((p) => (
            <span key={p} className="flex items-center gap-1.5 text-sm bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-full px-3 py-1">
              {p}
              <button onClick={() => removePersona(p)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
          {personas.length === 0 && <span className="text-neutral-600 text-sm">No personas yet.</span>}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={newPersona}
            onChange={(e) => setNewPersona(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPersona()}
            placeholder="e.g. CTO, General Counsel"
            className="bg-neutral-800 border-neutral-700 text-white max-w-xs"
          />
          <Button onClick={addPersona} size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
      </Card>

      {/* Sharing / Access Control */}
      <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-white">Sharing</h2>
          <p className="text-neutral-500 text-sm mt-0.5">Control who can view this portal.</p>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('open')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
              accessMode === 'open'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-sm font-medium">Anyone with the link</div>
              <div className="text-xs opacity-60 mt-0.5">No access control</div>
            </div>
          </button>
          <button
            onClick={() => setMode('restricted')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
              accessMode === 'restricted'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600'
            }`}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-sm font-medium">Restricted</div>
              <div className="text-xs opacity-60 mt-0.5">Email allowlist only</div>
            </div>
          </button>
        </div>

        {/* Allowlist — only shown in restricted mode */}
        {accessMode === 'restricted' && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-2">
              {allowedEmails.map((email) => (
                <span key={email} className="flex items-center gap-1.5 text-sm bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full px-3 py-1">
                  {email}
                  <button onClick={() => removeEmail(email)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {allowedEmails.length === 0 && (
                <span className="text-neutral-600 text-sm">No emails added yet — no one can access the portal.</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                placeholder="jane@prospect.com"
                className="bg-neutral-800 border-neutral-700 text-white max-w-xs"
              />
              <Button onClick={addEmail} size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Block list */}
      <div className="space-y-4">
        <h2 className="font-semibold text-white text-lg">Blocks</h2>
        {blocks.map((block, idx) => (
          <Card key={block.id} className="bg-neutral-900 border-neutral-800 overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/80">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 bg-neutral-800 rounded px-2 py-1">
                {TYPE_LABELS[block.type] ?? block.type}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveBlock(idx, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveBlock(idx, 1)}
                  disabled={idx === blocks.length - 1}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition-colors ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card body */}
            <div className="p-5 space-y-5">
              <BlockContentForm
                type={block.type}
                content={block.content}
                onChange={(c) => updateBlockContent(block.id, c)}
              />

              {/* Persona visibility */}
              {personas.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-neutral-800">
                  <Label className="text-neutral-400 text-xs">Visible to</Label>
                  <div className="flex flex-wrap gap-2">
                    {personas.map((persona) => {
                      const active = block.personas.includes(persona);
                      return (
                        <button
                          key={persona}
                          onClick={() => {
                            const next = active
                              ? block.personas.filter((p) => p !== persona)
                              : [...block.personas, persona];
                            updateBlockPersonas(block.id, next);
                          }}
                          className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                            active
                              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-600'
                          }`}
                        >
                          {persona}
                        </button>
                      );
                    })}
                    <span className="text-xs text-neutral-600 self-center ml-1">
                      {block.personas.length === 0 ? '(visible to all)' : ''}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => saveBlock(block)}
                disabled={savingBlock === block.id}
                size="sm"
                className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {savingBlock === block.id ? 'Saving...' : 'Save Block'}
              </Button>
            </div>
          </Card>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12 text-neutral-600 border border-dashed border-neutral-800 rounded-xl">
            No blocks. Add one below.
          </div>
        )}
      </div>

      {/* Add Block row */}
      <Card className="bg-neutral-900 border-neutral-800 p-5">
        <h3 className="text-sm font-semibold text-neutral-400 mb-3">Add Block</h3>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addBlock(type)}
              className="border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 text-neutral-300 gap-1.5"
            >
              <Plus className="w-3 h-3" /> {TYPE_LABELS[type]}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
