"use client";

import { useState } from "react";
import { PortalBlockProps } from "@/types";
import { Slider } from "@/components/ui/slider";

export function RoiBlock({ content }: PortalBlockProps) {
  const { estimatedSavings = 50000, targetMetric = "Transactions", sliderMin = 10, sliderMax = 1000 } = content;
  const [value, setValue] = useState([Math.floor((sliderMax - sliderMin) / 2)]);

  const calculatedRoi = (value[0] * estimatedSavings) / sliderMax;

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-950 border-y border-neutral-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Interactive ROI Explorer</h2>
        <p className="text-neutral-400 mb-12">Adjust the slider below to project your estimated impact.</p>
        
        <div className="relative bg-neutral-900/50 p-8 md:p-12 rounded-3xl border border-neutral-800 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-emerald-600 mb-12 tabular-nums">
            ${calculatedRoi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex justify-between text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              <span>{sliderMin} {targetMetric}</span>
              <span>{sliderMax} {targetMetric}</span>
            </div>
            
            <Slider 
              value={value} 
              onValueChange={setValue} 
              min={sliderMin} 
              max={sliderMax} 
              step={1}
              className="py-4"
            />
            
            <div className="text-lg font-medium text-white pt-4">
              Current Input: <span className="text-indigo-400">{value[0]} {targetMetric}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
