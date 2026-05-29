import { PortalBlockProps } from "@/types";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export function TimelineBlock({ content }: PortalBlockProps) {
  const steps = content.steps || [];

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-950">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-16 text-white text-center tracking-tight">Implementation Path</h2>
        
        <div className="space-y-10 pl-4 md:pl-0">
          {steps.map((step: any, idx: number) => {
            const isLast = idx === steps.length - 1;
            const isDone = step.status === "done";
            const isInProgress = step.status === "in-progress";

            return (
              <div key={idx} className="relative flex gap-8 group">
                {!isLast && (
                  <div className={`absolute left-4 top-10 bottom-[-2.5rem] w-[2px] transition-colors ${isDone ? 'bg-indigo-500' : 'bg-neutral-800'}`} />
                )}
                
                <div className="relative z-10 flex-shrink-0 mt-1 bg-neutral-950 h-8">
                  {isDone ? (
                    <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                  ) : isInProgress ? (
                    <Clock className="w-8 h-8 text-amber-500" />
                  ) : (
                    <Circle className="w-8 h-8 text-neutral-700" />
                  )}
                </div>
                
                <div className={`flex-1 pb-4 transition-all ${isDone || isInProgress ? 'opacity-100 transform translate-x-0' : 'opacity-60 grayscale'}`}>
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                    <h3 className={`text-2xl font-bold ${isDone || isInProgress ? 'text-white' : 'text-neutral-400'}`}>
                      {step.title}
                    </h3>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-400">
                      {step.duration}
                    </div>
                  </div>
                  {step.description && (
                    <p className="text-neutral-400 text-base leading-relaxed mt-2">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
