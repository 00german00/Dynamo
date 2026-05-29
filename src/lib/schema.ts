import { z } from "zod";

export const HookBlockSchema = z.object({
  type: z.literal("hook"),
  content: z.object({
    title: z.string().describe("The main bold headline connecting our value proposition to their needs."),
    subtitle: z.string().describe("A concise paragraph elaborating on why this solution is perfect right now."),
    backgroundVideoUrl: z.string().optional().describe("Optional URL to a background video."),
  }),
});

export const ProofBlockSchema = z.object({
  type: z.literal("proof"),
  content: z.object({
    caseStudies: z.array(
      z.object({
        metric: z.string().describe("A short, impressive metric (e.g. '300% ROI', '+45% Conversion')"),
        summary: z.string().describe("A single sentence explaining the result achieved."),
        logo: z.string().optional().describe("Optional URL to the company logo."),
      })
    ).max(3).describe("Provide up to 3 highly relevant case studies based on their industry."),
  }),
});

export const RoiBlockSchema = z.object({
  type: z.literal("roi"),
  content: z.object({
    estimatedSavings: z.number().describe("The total estimated annual savings or revenue generated at max scale."),
    targetMetric: z.string().describe("The unit they are measuring (e.g. 'Employees', 'Transactions', 'API Calls')."),
    sliderMin: z.number().describe("The realistic minimum value for the interactive slider."),
    sliderMax: z.number().describe("The max realistic value for the slider."),
  }),
});

export const TimelineBlockSchema = z.object({
  type: z.literal("timeline"),
  content: z.object({
    steps: z.array(
      z.object({
        title: z.string().describe("The name of the implementation step."),
        duration: z.string().describe("The estimated time (e.g. 'Week 1', 'Day 1-14')."),
        description: z.string().describe("A short explanation of what happens during this step."),
        status: z.enum(["done", "in-progress", "pending"]).describe("The current status of this step."),
      })
    ).describe("A 3-5 step roadmap showing how easy implementation will be."),
  }),
});

export const DriveBlockSchema = z.object({
  type: z.literal("drive"),
  content: z.object({
    files: z.array(
      z.object({
        fileName: z.string(),
        fileType: z.string().describe("Extension like 'PDF' or 'DOCX'"),
        url: z.string().describe("The URL to download or view the file."),
      })
    ).describe("A list of relevant resources to share securely."),
  }),
});

export const TombstoneCarouselBlockSchema = z.object({
  type: z.literal("tombstone_carousel"),
  content: z.object({
    tombstones: z.array(z.object({
      dealName: z.string(),
      acquirer: z.string(),
      target: z.string(),
      dealValue: z.string(),
      year: z.number().int(),
      description: z.string(),
      logoUrl: z.string().optional(),
    })).min(1).max(6),
  }),
});

export const BlockSchema = z.discriminatedUnion("type", [
  HookBlockSchema,
  ProofBlockSchema,
  RoiBlockSchema,
  TimelineBlockSchema,
  DriveBlockSchema,
  TombstoneCarouselBlockSchema,
]);

export const PortalGenerationSchema = z.object({
  blocks: z.array(BlockSchema).describe("An array of modular blocks configured specifically for the target prospect."),
});

// A mock payload so we can test the UI without an OpenAI Key
export const mockGeneratedPortal: z.infer<typeof PortalGenerationSchema> = {
  blocks: [
    {
      type: "hook",
      content: {
        title: "Dynamo + Acme Corp",
        subtitle: "A tailored blueprint for Acme Corp to automate context mapping, increase conversions by 40%, and achieve a single source of truth across your sales motions in under 30 days.",
      },
    },
    {
      type: "proof",
      content: {
        caseStudies: [
          { metric: "$2M+", summary: "Annual revenue generated through personalized context portals.", logo: "" },
          { metric: "60 sec", summary: "Average time saved per SDR when building a bespoke portal.", logo: "" },
          { metric: "35%", summary: "Increase in enterprise deal velocity from discovery to closed won.", logo: "" }
        ]
      },
    },
    {
      type: "roi",
      content: {
        estimatedSavings: 150000,
        targetMetric: "Target Accounts",
        sliderMin: 10,
        sliderMax: 500,
      },
    },
    {
      type: "timeline",
      content: {
        steps: [
          { title: "Kickoff & Discovery", duration: "Week 1", description: "Mapping data sources and identifying high-impact block templates.", status: "done" },
          { title: "Integration & Learning", duration: "Weeks 2-3", description: "Connecting your CRM and scraping legacy collateral into the Context Pool.", status: "in-progress" },
          { title: "Live Handoff", duration: "Week 4", description: "Your sales team begins generating live portals natively.", status: "pending" },
        ]
      },
    },
    {
      type: "drive",
      content: {
        files: [
          { fileName: "MSA Template", fileType: "PDF", url: "#" },
          { fileName: "Security Whitepaper", fileType: "PDF", url: "#" }
        ]
      },
    },
    {
      type: "tombstone_carousel",
      content: {
        tombstones: [
          { dealName: "Acme + TechCo Merger", acquirer: "Acme Corp", target: "TechCo", dealValue: "$2.4B", year: 2023, description: "Strategic acquisition to expand cloud infrastructure capabilities." },
          { dealName: "GlobalBank Acquisition", acquirer: "GlobalBank", target: "FinServ Ltd", dealValue: "$850M", year: 2022, description: "Cross-border deal enabling entry into European retail banking." },
          { dealName: "MedGroup Growth Capital", acquirer: "MedGroup", target: "CareNet", dealValue: "$320M", year: 2024, description: "Growth equity round to scale telehealth platform nationally." },
        ]
      },
    },
  ]
};
