"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Briefcase, FileText, X } from 'lucide-react';

interface Asset {
  id: string;
  type: string;
  dealName?: string | null;
  acquirer?: string | null;
  target?: string | null;
  dealValue?: string | null;
  year?: number | null;
  description?: string | null;
  logoUrl?: string | null;
  tags?: unknown;
  fileName?: string | null;
  fileType?: string | null;
  url?: string | null;
}

interface Props {
  initialAssets: Asset[];
}

const emptyTombstone = {
  dealName: '', acquirer: '', target: '', dealValue: '', year: '', description: '', logoUrl: '', tags: '',
};

const emptyDocument = {
  fileName: '', fileType: '', url: '', description: '',
};

export function AssetLibraryClient({ initialAssets }: Props) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [activeTab, setActiveTab] = useState<'tombstone' | 'document'>('tombstone');
  const [showForm, setShowForm] = useState(false);
  const [tombstoneForm, setTombstoneForm] = useState(emptyTombstone);
  const [documentForm, setDocumentForm] = useState(emptyDocument);
  const [saving, setSaving] = useState(false);

  const filtered = assets.filter((a) => a.type === activeTab);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this asset? This cannot be undone.')) return;
    setAssets((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/company/assets/${id}`, { method: 'DELETE' });
  };

  const handleSubmitTombstone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tags = tombstoneForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const res = await fetch('/api/company/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'tombstone',
        ...tombstoneForm,
        year: tombstoneForm.year ? Number(tombstoneForm.year) : undefined,
        tags,
      }),
    });
    if (res.ok) {
      const { asset } = await res.json();
      setAssets((prev) => [asset, ...prev]);
      setTombstoneForm(emptyTombstone);
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/company/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'document', ...documentForm }),
    });
    if (res.ok) {
      const { asset } = await res.json();
      setAssets((prev) => [asset, ...prev]);
      setDocumentForm(emptyDocument);
      setShowForm(false);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs + Add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <button
            onClick={() => { setActiveTab('tombstone'); setShowForm(false); }}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors ${
              activeTab === 'tombstone' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Tombstones
          </button>
          <button
            onClick={() => { setActiveTab('document'); setShowForm(false); }}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors ${
              activeTab === 'document' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Documents
          </button>
        </div>
        <Button
          onClick={() => setShowForm((s) => !s)}
          className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white border-0"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : `Add ${activeTab === 'tombstone' ? 'Tombstone' : 'Document'}`}
        </Button>
      </div>

      {/* Inline form */}
      {showForm && (
        <Card className="bg-neutral-900 border-neutral-800 p-6">
          {activeTab === 'tombstone' ? (
            <form onSubmit={handleSubmitTombstone} className="space-y-4">
              <h3 className="font-semibold text-white mb-4">New Tombstone</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">Deal Name *</Label>
                  <Input value={tombstoneForm.dealName} onChange={(e) => setTombstoneForm((p) => ({ ...p, dealName: e.target.value }))} required className="bg-neutral-800 border-neutral-700 text-white" placeholder="Acme + TechCo Merger" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">Deal Value</Label>
                  <Input value={tombstoneForm.dealValue} onChange={(e) => setTombstoneForm((p) => ({ ...p, dealValue: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="$2.4B" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">Acquirer *</Label>
                  <Input value={tombstoneForm.acquirer} onChange={(e) => setTombstoneForm((p) => ({ ...p, acquirer: e.target.value }))} required className="bg-neutral-800 border-neutral-700 text-white" placeholder="Acme Corp" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">Target *</Label>
                  <Input value={tombstoneForm.target} onChange={(e) => setTombstoneForm((p) => ({ ...p, target: e.target.value }))} required className="bg-neutral-800 border-neutral-700 text-white" placeholder="TechCo" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">Year</Label>
                  <Input type="number" value={tombstoneForm.year} onChange={(e) => setTombstoneForm((p) => ({ ...p, year: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="2024" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">Logo URL</Label>
                  <Input value={tombstoneForm.logoUrl} onChange={(e) => setTombstoneForm((p) => ({ ...p, logoUrl: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-neutral-300">Description</Label>
                <Input value={tombstoneForm.description} onChange={(e) => setTombstoneForm((p) => ({ ...p, description: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Strategic acquisition to expand cloud capabilities." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-neutral-300">Tags (comma-separated)</Label>
                <Input value={tombstoneForm.tags} onChange={(e) => setTombstoneForm((p) => ({ ...p, tags: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="fintech, saas, enterprise" />
              </div>
              <Button type="submit" disabled={saving} className="bg-indigo-500 hover:bg-indigo-600 text-white border-0">
                {saving ? 'Saving...' : 'Save Tombstone'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitDocument} className="space-y-4">
              <h3 className="font-semibold text-white mb-4">New Document</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">File Name *</Label>
                  <Input value={documentForm.fileName} onChange={(e) => setDocumentForm((p) => ({ ...p, fileName: e.target.value }))} required className="bg-neutral-800 border-neutral-700 text-white" placeholder="Security Whitepaper" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-neutral-300">File Type</Label>
                  <Input value={documentForm.fileType} onChange={(e) => setDocumentForm((p) => ({ ...p, fileType: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="PDF" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-neutral-300">URL</Label>
                <Input value={documentForm.url} onChange={(e) => setDocumentForm((p) => ({ ...p, url: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-neutral-300">Description</Label>
                <Input value={documentForm.description} onChange={(e) => setDocumentForm((p) => ({ ...p, description: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Overview of our security posture." />
              </div>
              <Button type="submit" disabled={saving} className="bg-indigo-500 hover:bg-indigo-600 text-white border-0">
                {saving ? 'Saving...' : 'Save Document'}
              </Button>
            </form>
          )}
        </Card>
      )}

      {/* Asset list */}
      {filtered.length === 0 ? (
        <Card className="bg-neutral-900 border-neutral-800 border-dashed flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-neutral-800/50 p-4 rounded-full mb-4 ring-1 ring-neutral-700">
            {activeTab === 'tombstone' ? <Briefcase className="h-8 w-8 text-neutral-400" /> : <FileText className="h-8 w-8 text-neutral-400" />}
          </div>
          <h3 className="font-semibold text-lg">No {activeTab === 'tombstone' ? 'tombstones' : 'documents'} yet</h3>
          <p className="text-neutral-500 text-sm mt-1">
            {activeTab === 'tombstone'
              ? 'Add representative transactions to include in AI-generated portals.'
              : 'Add documents to surface in your portal Drive blocks.'}
          </p>
        </Card>
      ) : activeTab === 'tombstone' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => {
            const tags = (asset.tags as string[] | null) ?? [];
            return (
              <Card key={asset.id} className="bg-neutral-900 border-neutral-800 overflow-hidden border-t-4 border-t-amber-500/60">
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-mono text-2xl font-bold text-amber-400">{asset.dealValue || '—'}</div>
                    <button onClick={() => handleDelete(asset.id)} className="text-neutral-600 hover:text-red-400 transition-colors mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{asset.dealName}</div>
                    <div className="text-neutral-400 text-sm mt-0.5">{asset.acquirer} → {asset.target}</div>
                  </div>
                  {asset.year && (
                    <span className="text-xs bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-neutral-300">
                      {asset.year}
                    </span>
                  )}
                  {asset.description && (
                    <p className="text-neutral-500 text-sm line-clamp-2">{asset.description}</p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className="text-xs bg-neutral-800 border border-neutral-700 rounded-full px-2 py-0.5 text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <Card key={asset.id} className="bg-neutral-900 border-neutral-800">
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="text-white font-semibold">{asset.fileName}</span>
                  </div>
                  <button onClick={() => handleDelete(asset.id)} className="text-neutral-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {asset.fileType && (
                  <span className="text-xs bg-neutral-800 border border-neutral-700 rounded-full px-2 py-0.5 text-neutral-400">
                    {asset.fileType}
                  </span>
                )}
                {asset.description && (
                  <p className="text-neutral-500 text-sm">{asset.description}</p>
                )}
                {asset.url && (
                  <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-xs hover:underline truncate block">
                    {asset.url}
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
