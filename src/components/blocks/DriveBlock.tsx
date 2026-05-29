import { PortalBlockProps } from "@/types";
import { FileText, Download, ShieldCheck } from "lucide-react";

export function DriveBlock({ content }: PortalBlockProps) {
  const files = content.files || [];

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <div className="p-3 bg-neutral-900 rounded-2xl mb-2">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Secure Shared Drive</h2>
          <p className="text-neutral-400">All necessary onboarding and legal documents are centralized here securely.</p>
        </div>
        
        <div className="grid gap-4">
          {files.map((file: any, idx: number) => (
            <a 
              key={idx} 
              href={file.url || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800 hover:border-neutral-600 hover:-translate-y-1 transition-all group shadow-sm hover:shadow-indigo-500/10 cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-neutral-800/80 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 text-neutral-400 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{file.fileName}</h3>
                  <p className="text-sm font-medium text-neutral-500 mt-1 uppercase tracking-wider">{file.fileType}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Download className="w-5 h-5 text-neutral-400 group-hover:text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
