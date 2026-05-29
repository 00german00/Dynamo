import { PortalBlockProps } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function ProofBlock({ content }: PortalBlockProps) {
  const caseStudies = content.caseStudies || [];
  
  return (
    <section className="py-20 px-6 md:px-12 bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-tight text-white">Proven Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study: any, idx: number) => (
            <Card key={idx} className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors transform hover:-translate-y-1 duration-300 overflow-hidden group">
              <CardContent className="p-8 flex flex-col h-full relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/10 transition-colors" />
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500 mb-6">{study.metric}</div>
                <p className="text-neutral-300 text-base leading-relaxed flex-1">{study.summary}</p>
                {study.logo && <img src={study.logo} alt="Company Logo" className="h-8 object-contain mt-8 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
