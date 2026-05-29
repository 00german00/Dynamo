import { PortalBlockProps } from "@/types";

export function HookBlock({ content }: PortalBlockProps) {
  const { title, subtitle, backgroundVideoUrl } = content;
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24 px-6 md:px-12 flex flex-col justify-center min-h-[50vh] border-b border-neutral-900">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {title || "Default Title"}
        </h1>
        <p className="text-lg md:text-2xl text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {subtitle || "Default subtitle."}
        </p>
      </div>
    </section>
  );
}
