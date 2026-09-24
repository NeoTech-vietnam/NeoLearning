/**
 * Cross-layer transport contracts. Domain tasks extend these data shapes rather
 * than creating browser- or server-only payload variants.
 */

export type ContentNodeKind =
  | "world"
  | "country"
  | "region"
  | "topic"
  | "lesson"
  | "unindexed";

export interface ContentHeading {
  depth: number;
  text: string;
  slug: string;
}

export interface ContentNode {
  id: string;
  title: string;
  kind: ContentNodeKind;
  relativePath?: string;
  section?: string;
  summary?: string;
  headings: ContentHeading[];
  children: ContentNode[];
  modifiedAt?: string;
  unindexed?: boolean;
}

export interface ContentDocument {
  id: string;
  relativePath: string;
  title: string;
  content: string;
  revision: string;
  modifiedAt: string;
  headings: ContentHeading[];
  frontmatter: Record<string, string | number | boolean | null>;
}

export type QuestMilestoneStatus = "not-started" | "in-progress" | "complete";

export interface QuestMilestone {
  id: string;
  title: string;
  order: number;
  description?: string;
  challenge?: string;
  required: boolean;
  evidenceRequired?: boolean;
  knowledgeLinks: string[];
}

export interface Quest {
  id: string;
  title: string;
  level?: string;
  problem?: string;
  destination?: string;
  regionIds: string[];
  knowledgeLinks: string[];
  milestones: QuestMilestone[];
  completionCriteria: string[];
}

export interface QuestMilestoneProgress {
  status: QuestMilestoneStatus;
  evidence?: string;
  updatedAt: string;
}

export interface QuestProgress {
  milestones: Record<string, QuestMilestoneProgress>;
  completedAt?: string;
}

export interface ProgressState {
  schemaVersion: number;
  quests: Record<string, QuestProgress>;
  updatedAt: string;
}

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string | number | boolean | null>;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface HealthResponse {
  status: "ok";
}
