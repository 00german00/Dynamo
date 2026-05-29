"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

interface PortalEmailGateProps {
  slug: string;
  companyName: string;
}

export function PortalEmailGate({ slug, companyName }: PortalEmailGateProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "denied">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setStatus("loading");
    const res = await fetch(`/api/portals/${slug}/access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setStatus("denied");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Required</h1>
            <p className="text-neutral-500 text-sm mt-2">
              This portal was prepared for <span className="text-neutral-300 font-medium">{companyName}</span>.
              Enter your work email to continue.
            </p>
          </div>
        </div>

        {status === "denied" ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-sm text-red-400">
            Your email isn&apos;t on the access list. Contact the sender to request access.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-neutral-400 text-xs">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="pl-9 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-indigo-500"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-500/20"
            >
              {status === "loading" ? "Checking..." : "View Portal"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
