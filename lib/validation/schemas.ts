import { z } from "zod";

export const TriageSchema = z.object({
  incidentType: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  urgency: z.enum(["routine", "urgent", "immediate"]),
  summary: z.string(),
  affectedPeople: z.object({
    estimatedCount: z.number().nullable().optional(),
    vulnerableGroups: z.array(z.string()).default([]),
  }),
  location: z.object({
    raw: z.string().nullable().optional(),
    confidence: z.number().min(0).max(1),
    missingPrecision: z.boolean(),
  }),
  keyRisks: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});

export const VerificationSchema = z.object({
  isActionable: z.boolean(),
  missingInformation: z.array(z.string()).default([]),
  clarifyingQuestions: z.array(z.string()).default([]),
  contradictions: z.array(z.string()).default([]),
  verificationRisk: z.enum(["low", "medium", "high"]),
  confidence: z.number().min(0).max(1),
});

export const DuplicateSchema = z.object({
  possibleDuplicates: z.array(
    z.object({
      incidentId: z.string(),
      similarityReason: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ).default([]),
  mergeRecommendation: z.enum(["review_merge", "no_merge", "auto_group_for_review"]),
  confidence: z.number().min(0).max(1),
});

export const ResourcePlannerSchema = z.object({
  recommendedResources: z.array(
    z.object({
      resourceType: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      reason: z.string(),
    })
  ).default([]),
  constraints: z.array(z.string()).default([]),
  firstActions: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});

export const CommunicationsSchema = z.object({
  internalDispatchNote: z.string(),
  publicAlertDraft: z.string(),
  followUpMessageToReporter: z.string(),
  requiresApproval: z.boolean(),
  sensitiveContentFlags: z.array(z.string()).default([]),
});

export const RiskSafetySchema = z.object({
  riskLevel: z.enum(["low", "medium", "high"]),
  riskFlags: z.array(z.string()).default([]),
  approvalRequired: z.boolean(),
  safeToPublishPublicAlert: z.boolean(),
  recommendedHumanReviewNotes: z.array(z.string()).default([]),
});

export const DecisionSummarySchema = z.object({
  finalSummary: z.string(),
  recommendedDecision: z.enum(["approve_with_edits", "approve", "reject", "request_more_info"]),
  operatorChecklist: z.array(z.string()).default([]),
  statusRecommendation: z.string(),
  confidence: z.number().min(0).max(1),
});

export type TriageOutput = z.infer<typeof TriageSchema>;
export type VerificationOutput = z.infer<typeof VerificationSchema>;
export type DuplicateOutput = z.infer<typeof DuplicateSchema>;
export type ResourcePlannerOutput = z.infer<typeof ResourcePlannerSchema>;
export type CommunicationsOutput = z.infer<typeof CommunicationsSchema>;
export type RiskSafetyOutput = z.infer<typeof RiskSafetySchema>;
export type DecisionSummaryOutput = z.infer<typeof DecisionSummarySchema>;
