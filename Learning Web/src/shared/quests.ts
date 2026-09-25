import type {
  ProgressState,
  Quest,
  QuestJournalEntry,
  QuestMilestoneProgress,
  QuestMilestoneStatus,
  QuestProgress
} from "./contracts.js";

/** Transport contracts for the Markdown-backed quest catalogue and local state. */
export interface QuestListResponse {
  quests: Quest[];
}

export interface QuestDetailResponse {
  quest: Quest;
}

export interface QuestProgressResponse {
  progress: QuestProgress;
}

export interface AllProgressResponse {
  progress: ProgressState;
}

export interface SetMilestoneProgressRequest {
  status: QuestMilestoneStatus;
  /** Required when the selected milestone declares evidenceRequired. */
  evidence?: string;
  journal?: QuestJournalEntry;
}

export interface SetMilestoneProgressResponse {
  progress: QuestProgress;
}

export interface QuestCompletion {
  complete: boolean;
  completedRequiredMilestones: number;
  requiredMilestones: number;
}

export type {
  ProgressState,
  Quest,
  QuestJournalEntry,
  QuestMilestoneProgress,
  QuestMilestoneStatus,
  QuestProgress
};
