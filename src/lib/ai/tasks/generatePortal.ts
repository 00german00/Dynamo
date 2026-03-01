/**
 * AI Task: Portal Generation
 *
 * Encapsulates the prompt, schema, and model call for assembling
 * a complete portal from context. The provider + model used is
 * determined entirely by config.ts — this file doesn't care which.
 */

import { generateObject } from "ai";
import { getModel, hasApiKeyForTask } from "../registry";
import { PortalGenerationSchema, mockGeneratedPortal } from "@/lib/schema";
import type { z } from "zod";

const TASK_NAME = "portal:generate";

interface TombstoneInput {
  dealName: string;
  acquirer: string;
  target: string;
  dealValue: string;
  year: number;
  description: string;
  logoUrl?: string;
  tags: string[];
}

interface GeneratePortalInput {
  url: string;
  scrapedContent: string;
  kbContext: string;
  tombstones?: TombstoneInput[];
}

type PortalBlocks = z.infer<typeof PortalGenerationSchema>["blocks"];

/**
 * Select up to `max` tombstones that best match the scraped content via tag overlap.
 */
function selectTombstoneCandidates(
  tombstones: TombstoneInput[],
  scrapedContent: string,
  max = 8
): TombstoneInput[] {
  const contentWords = new Set(
    scrapedContent
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3)
  );

  return tombstones
    .map((t) => ({
      tombstone: t,
      score: (t.tags ?? []).filter((tag) =>
        contentWords.has(tag.toLowerCase())
      ).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.tombstone);
}

export async function generatePortalBlocks(
  input: GeneratePortalInput
): Promise<PortalBlocks> {
  // If the required API key for this task's provider isn't set, return mock data
  if (!hasApiKeyForTask(TASK_NAME)) {
    console.warn(
      `[${TASK_NAME}] No API key found for configured provider. Returning mock data.`
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockGeneratedPortal.blocks;
  }

  const model = getModel(TASK_NAME);

  const candidates = selectTombstoneCandidates(
    input.tombstones ?? [],
    input.scrapedContent
  );

  const tombstoneInstruction =
    candidates.length > 0
      ? `
6. "tombstone_carousel" - Include a block showcasing these representative transactions from our deal history. Use only the tombstones provided below — do not invent deals.
   Available tombstones:
   ${JSON.stringify(candidates, null, 2)}
`
      : "";

  const blockCount = candidates.length > 0 ? "6-block" : "5-block";

  const { object } = await generateObject({
    model,
    schema: PortalGenerationSchema,
    prompt: `
      You are an expert enterprise B2B sales orchestrator and copywriter.
      A sales rep has requested a hyper-personalized, context-driven sales portal.

      Target Prospect URL: ${input.url}
      Target Prospect Website Scraped Text:
      """
      ${input.scrapedContent}
      """

      User's Knowledge Base / CRM Context: ${input.kbContext}

      Assemble a ${blockCount} robust portal layout matching the exact schema.
      1. "hook" - Make it bold, directly linking our value to the prospect's presumed goals based on their URL.
      2. "proof" - Create 3 strong case studies that sound highly relevant to the prospect's industry.
      3. "roi" - Formulate a realistic interactive ROI calculator based on their metrics.
      4. "timeline" - Outline a rapid, risk-free implementation plan in 3-5 steps.
      5. "drive" - Provide a couple of standard enterprise document titles to share.
      ${tombstoneInstruction}

      Ensure copywriting is concise, punchy, and highly persuasive.
    `,
  });

  return object.blocks;
}
