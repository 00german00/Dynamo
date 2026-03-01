/**
 * AI Model Registry
 *
 * Resolves a named task to a Vercel AI SDK LanguageModel instance.
 * Handles all five provider types from config.ts.
 */

import { AI_TASK_CONFIG, type AITaskConfig } from "./config";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createAzure } from "@ai-sdk/azure";
import type { LanguageModel } from "ai";

/**
 * Resolve a config object to a Vercel AI SDK LanguageModel instance.
 */
function resolveModel(config: AITaskConfig): LanguageModel {
  switch (config.provider) {
    // ── Direct Providers ────────────────────────────────────────────────────

    case "openai":
      return openai(config.model);

    case "anthropic":
      return anthropic(config.model);

    case "google":
      return google(config.model);

    // ── Azure Providers ─────────────────────────────────────────────────────

    case "azure": {
      // Uses AZURE_OPENAI_API_KEY, AZURE_OPENAI_RESOURCE_NAME, AZURE_OPENAI_API_VERSION
      const azureClient = createAzure({
        resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-08-01-preview",
      });
      return azureClient(config.deploymentName);
    }

    case "azure-serverless": {
      // Uses an OpenAI-compatible endpoint unique to each Foundry deployment.
      // The API key env var name is specified per-task in config.
      const azureServerlessClient = createOpenAI({
        baseURL: config.endpoint,
        apiKey: process.env[config.apiKeyEnvVar] ?? "",
      });
      // Serverless endpoints typically use a fixed model path
      return azureServerlessClient.chat("azureai");
    }

    default:
      // TypeScript exhaustiveness check — this should never happen
      throw new Error(`Unknown AI provider in config`);
  }
}

/**
 * Get the AI model instance for a named task.
 *
 * @example
 * const model = getModel("portal:generate");
 * const { object } = await generateObject({ model, schema, prompt });
 */
export function getModel(taskName: string): LanguageModel {
  const config = AI_TASK_CONFIG[taskName];
  if (!config) {
    throw new Error(
      `No AI config found for task "${taskName}". ` +
        `Add it to src/lib/ai/config.ts`
    );
  }
  return resolveModel(config);
}

/**
 * Check whether the required API key(s) are set for a given task.
 * Used to gracefully fall back to mock data in development.
 */
export function hasApiKeyForTask(taskName: string): boolean {
  const config = AI_TASK_CONFIG[taskName];
  if (!config) return false;

  switch (config.provider) {
    case "openai":
      return !!process.env.OPENAI_API_KEY;
    case "anthropic":
      return !!process.env.ANTHROPIC_API_KEY;
    case "google":
      return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    case "azure":
      return !!(
        process.env.AZURE_OPENAI_API_KEY &&
        process.env.AZURE_OPENAI_RESOURCE_NAME
      );
    case "azure-serverless":
      return !!process.env[config.apiKeyEnvVar];
    default:
      return false;
  }
}
