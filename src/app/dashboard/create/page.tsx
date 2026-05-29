"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Globe, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreatePortalPage() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, kbContext: "Mocked internal enterprise documents." }),
      });
      const data = await res.json();
      if (data.slug) {
        router.push(`/p/${data.slug}`);
      } else {
        alert("Failed to generate: " + JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
      alert("Network Error generating portal context");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div>
         <h1 className="text-3xl font-bold tracking-tight mb-2 flex gap-3 items-center">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            Assemble New Portal
         </h1>
         <p className="text-neutral-400">
            Provide the Context Pool to AI. The engine will read the inputs, select the right blocks, and structure the narrative automatically.
         </p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
         <CardHeader>
            <CardTitle>1. Target Company Context</CardTitle>
            <CardDescription>We'll scrape this URL to understand the prospect's mission and positioning.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="url">Company URL / Website</Label>
               <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input 
                    id="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.targetcompany.com" 
                    className="pl-10 bg-neutral-950 border-neutral-800" 
                  />
               </div>
            </div>
         </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
         <CardHeader>
            <CardTitle>2. Knowledge Base (Mock CRM Files)</CardTitle>
            <CardDescription>Upload relevant case studies, pitch decks, or context docs for the AI to reference.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-neutral-700 rounded-lg p-10 flex flex-col justify-center items-center gap-3 bg-neutral-950/50 hover:bg-neutral-800 transition-colors cursor-default group">
               <div className="p-3 bg-neutral-800 rounded-full">
                  <Upload className="h-5 w-5 text-neutral-300" />
               </div>
               <p className="text-sm font-medium text-neutral-300">File upload is mocked for MVP</p>
               <p className="text-xs text-neutral-500">Pre-loaded demo context will be injected automatically.</p>
            </div>
         </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
         <Link href="/dashboard">
            <Button variant="ghost" className="hover:bg-neutral-800 hover:text-white" disabled={isGenerating}>Cancel</Button>
         </Link>
         <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || url.trim() === ""} 
            className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold px-8 shadow-xl shadow-white/10 w-64"
         >
            {isGenerating ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Injecting Intelligence...</> : "Generate Portal Context"}
         </Button>
      </div>
    </div>
  );
}
