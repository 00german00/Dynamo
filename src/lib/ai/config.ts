/**
 * AI Task → Provider + Model Configuration
 *
 * This is the single source of truth for which AI vendor and model
 * is used for each named task. Each task uses a discriminated union
 * config so TypeScript enforces the right shape per provider.
 *
 * Direct providers hit the vendor API directly.
 * Azure providers route through your Azure AI Foundry resource.
 *
 * Supported providers:
 *   Direct:  "openai" | "anthropic" | "google"
 *   Azure:   "azure" | "azure-serverless"
 */

// ─── Direct Provider Configs ─────────────────────────────────────────────────

interface OpenAIConfig {
  provider: "openai";
  model: string; // e.g. "gpt-4o", "gpt-4o-mini", "o3-mini"
}

interface AnthropicConfig {
  provider: "anthropic";
  model: string; // e.g. "claude-opus-4-5", "claude-sonnet-4-20250514"
}

interface GoogleConfig {
  provider: "google";
  model: string; // e.g. "gemini-2.0-flash", "gemini-2.5-pro"
}

// ─── Azure Provider Configs ───────────────────────────────────────────────────

/**
 * Azure OpenAI Service — for OpenAI models (GPT-4o, o3, etc.) deployed
 * via your Azure OpenAI resource. Uses deployment names, not model names.
 *
 * Required env vars:
 *   AZURE_OPENAI_API_KEY
 *   AZURE_OPENAI_RESOURCE_NAME  (e.g. "my-azure-resource")
 *   AZURE_OPENAI_API_VERSION    (e.g. "2024-08-01-preview")
 */
interface AzureOpenAIConfig {
  provider: "azure";
  deploymentName: string; // the name you gave it in Azure portal
  model?: string;         // optional — for documentation/logging only
}

/**
 * Azure AI Foundry Serverless Endpoints — for non-OpenAI models
 * (Llama, Mistral, Phi, Cohere, etc.) deployed via Foundry's
 * serverless inference. Each deployment has its own endpoint URL.
 * These are OpenAI API-compatible, so we use openai() with a custom baseURL.
 *
 * Required env vars:
 *   AZURE_SERVERLESS_API_KEY_<TASK_SUFFIX>  (or a shared key)
 *   The endpoint URL is specified directly in config below.
 */
interface AzureServerlessConfig {
  provider: "azure-serverless";
  endpoint: string;   // e.g. "https://my-llama.eastus.models.ai.azure.com"
  model?: string;     // for documentation/logging only
  apiKeyEnvVar: string; // name of the env var holding the key for this endpoint
}

// ─── Union & Registry ─────────────────────────────────────────────────────────

export type AITaskConfig =
  | OpenAIConfig
  | AnthropicConfig
  | GoogleConfig
  | AzureOpenAIConfig
  | AzureServerlessConfig;

/**
 * Per-task AI configuration.
 * Change a provider for any task by changing its entry here.
 * Only the env vars for the providers you actually use need to be set.
 */
export const AI_TASK_CONFIG: Record<string, AITaskConfig> = {
  // ── Active Tasks ─────────────────────────────────────────────────────────

  // Portal block assembly — structured JSON output from scraped context.
  // Switch to "azure" if you have a GPT-4o deployment in Azure Foundry.
  "portal:generate": {
    provider: "openai",
    model: "gpt-4o",
  },

  // ── Commented Examples (uncomment & configure to activate) ───────────────

  // Use Azure OpenAI for portal generation instead:
  // "portal:generate": {
  //   provider: "azure",
  //   deploymentName: "my-gpt4o-deployment",
  //   model: "gpt-4o",  // for docs only
  // },

  // Use Claude directly for copywriting (can't be done via Azure today):
  // "portal:copywrite": {
  //   provider: "anthropic",
  //   model: "claude-sonnet-4-20250514",
  // },

  // Use Gemini directly for summarizing scraped content:
  // "scraper:summarize": {
  //   provider: "google",
  //   model: "gemini-2.0-flash",
  // },

  // Use a Llama model from Azure Foundry serverless:
  // "portal:draft": {
  //   provider: "azure-serverless",
  //   endpoint: "https://my-llama.eastus.models.ai.azure.com",
  //   model: "meta-llama-3-70b-instruct",
  //   apiKeyEnvVar: "AZURE_LLAMA_API_KEY",
  // },
};
