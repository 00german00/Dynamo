"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { HookBlock } from '@/components/blocks/HookBlock';
import { ProofBlock } from '@/components/blocks/ProofBlock';
import { RoiBlock } from '@/components/blocks/RoiBlock';
import { TimelineBlock } from '@/components/blocks/TimelineBlock';
import { DriveBlock } from '@/components/blocks/DriveBlock';
import { TombstoneCarouselBlock } from '@/components/blocks/TombstoneCarouselBlock';
import { TrackedBlock } from '@/components/TrackedBlock';

interface Block {
  id: string;
  type: string;
  order: number;
  content: unknown;
  personas: string[];
}

interface PersonaFilteredPortalProps {
  portalId: string;
  blocks: Block[];
  personas: string[];
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function renderBlock(props: { id: string; type: string; order: number; content: unknown }) {
  switch (props.type) {
    case 'hook': return <HookBlock {...props} />;
    case 'proof': return <ProofBlock {...props} />;
    case 'roi': return <RoiBlock {...props} />;
    case 'timeline': return <TimelineBlock {...props} />;
    case 'drive': return <DriveBlock {...props} />;
    case 'tombstone_carousel': return <TombstoneCarouselBlock {...props} content={props.content as { tombstones: { dealName: string; acquirer: string; target: string; dealValue: string; year: number; description: string; logoUrl?: string }[] }} />;
    default: return <div className="text-white p-4">Unknown block type: {props.type}</div>;
  }
}

export function PersonaFilteredPortal({ portalId, blocks, personas }: PersonaFilteredPortalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activePersonaSlug = searchParams.get('persona') ?? '';

  const visibleBlocks = blocks.filter((block) => {
    if (!activePersonaSlug) return true;
    if (!block.personas || block.personas.length === 0) return true;
    return block.personas.some((p) => toSlug(p) === activePersonaSlug);
  });

  const setPersona = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name) {
      params.set('persona', toSlug(name));
    } else {
      params.delete('persona');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {personas.length > 0 && (
        <div className="sticky top-[49px] z-40 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800 px-6 py-3 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPersona('')}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              !activePersonaSlug
                ? 'bg-indigo-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          {personas.map((persona) => (
            <button
              key={persona}
              onClick={() => setPersona(persona)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activePersonaSlug === toSlug(persona)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {persona}
            </button>
          ))}
        </div>
      )}

      {visibleBlocks.map((block) => {
        const props = {
          id: block.id,
          type: block.type,
          order: block.order,
          content: block.content,
        };
        return (
          <TrackedBlock key={block.id} portalId={portalId} blockId={block.id} blockType={block.type}>
            {renderBlock(props)}
          </TrackedBlock>
        );
      })}
    </>
  );
}
