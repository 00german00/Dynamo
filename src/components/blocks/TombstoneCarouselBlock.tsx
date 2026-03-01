"use client";

interface Tombstone {
  dealName: string;
  acquirer: string;
  target: string;
  dealValue: string;
  year: number;
  description: string;
  logoUrl?: string;
}

interface TombstoneCarouselBlockProps {
  id: string;
  type: string;
  order: number;
  content: {
    tombstones: Tombstone[];
  };
}

export function TombstoneCarouselBlock({ content }: TombstoneCarouselBlockProps) {
  const { tombstones } = content;

  return (
    <section className="py-20 px-6 bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Representative Transactions</h2>
        <p className="text-neutral-400 text-sm mb-8">Selected deals from our advisory track record.</p>

        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
          {tombstones.map((t, i) => (
            <div
              key={i}
              className="w-72 flex-shrink-0 snap-start bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden border-t-4 border-t-amber-500/60"
            >
              <div className="p-6 flex flex-col gap-3">
                <div className="font-mono text-3xl font-bold text-amber-400 tracking-tight">
                  {t.dealValue}
                </div>

                <div>
                  <div className="text-white font-semibold text-base leading-snug">{t.dealName}</div>
                  <div className="text-neutral-400 text-sm mt-1">
                    {t.acquirer} → {t.target}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-neutral-300 font-medium">
                    {t.year}
                  </span>
                </div>

                <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
