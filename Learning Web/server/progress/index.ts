import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  ProgressState,
  Quest,
  QuestJournalEntry,
  QuestMilestoneProgress,
  QuestMilestoneStatus,
  QuestProgress
} from "../../src/shared/contracts.js";
import type { QuestCompletion } from "../../src/shared/quests.js";

export const PROGRESS_SCHEMA_VERSION = 1;

const EMPTY_PROGRESS: ProgressState = {
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  quests: {},
  updatedAt: ""
};

export class ProgressValidationError extends Error {}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isoNow(): string {
  return new Date().toISOString();
}

function isStatus(value: unknown): value is QuestMilestoneStatus {
  return value === "not-started" || value === "in-progress" || value === "complete";
}

function normalizeJournal(value: unknown): QuestJournalEntry | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entry = value as Record<string, unknown>;
  if (!(["tried", "result", "nextMeasurement"] as const).every((key) => typeof entry[key] === "string" && (entry[key] as string).trim().length > 0)) return undefined;
  return { tried: (entry.tried as string).trim(), result: (entry.result as string).trim(), nextMeasurement: (entry.nextMeasurement as string).trim() };
}

function validateJournal(value: QuestJournalEntry): QuestJournalEntry {
  const journal = normalizeJournal(value);
  if (!journal || Object.values(journal).some((text) => text.length > 2000)) {
    throw new ProgressValidationError("Journal needs tried, result and next measurement (1–2000 characters each).");
  }
  return journal;
}

function normalizeProgress(value: unknown): ProgressState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...EMPTY_PROGRESS };
  const source = value as Record<string, unknown>;
  const quests: ProgressState["quests"] = {};
  const sourceQuests = source.quests;
  if (sourceQuests && typeof sourceQuests === "object" && !Array.isArray(sourceQuests)) {
    for (const [questId, rawProgress] of Object.entries(sourceQuests)) {
      if (!rawProgress || typeof rawProgress !== "object" || Array.isArray(rawProgress)) continue;
      const raw = rawProgress as Record<string, unknown>;
      const milestones: QuestProgress["milestones"] = {};
      const rawMilestones = raw.milestones;
      if (rawMilestones && typeof rawMilestones === "object" && !Array.isArray(rawMilestones)) {
        for (const [milestoneId, rawMilestone] of Object.entries(rawMilestones)) {
          // Version 0 stored completion as a boolean. Keep migration deliberately narrow.
          if (typeof rawMilestone === "boolean") {
            milestones[milestoneId] = { status: rawMilestone ? "complete" : "not-started", updatedAt: "" };
            continue;
          }
          if (!rawMilestone || typeof rawMilestone !== "object" || Array.isArray(rawMilestone)) continue;
          const milestone = rawMilestone as Record<string, unknown>;
          if (!isStatus(milestone.status)) continue;
          const journal = normalizeJournal(milestone.journal);
          milestones[milestoneId] = {
            status: milestone.status,
            ...(typeof milestone.evidence === "string" && milestone.evidence.trim() ? { evidence: milestone.evidence.trim() } : {}),
            ...(journal ? { journal } : {}),
            updatedAt: typeof milestone.updatedAt === "string" ? milestone.updatedAt : ""
          };
        }
      }
      quests[questId] = {
        milestones,
        ...(typeof raw.completedAt === "string" && raw.completedAt ? { completedAt: raw.completedAt } : {})
      };
    }
  }
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    quests,
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : ""
  };
}

export function evaluateQuestCompletion(quest: Quest, progress: QuestProgress): QuestCompletion {
  const required = quest.milestones.filter((milestone) => milestone.required);
  const completedRequired = required.filter((milestone) => {
    const recorded = progress.milestones[milestone.id];
    return recorded?.status === "complete" && (!milestone.evidenceRequired || Boolean(recorded.evidence?.trim()));
  });
  return {
    complete: completedRequired.length === required.length,
    completedRequiredMilestones: completedRequired.length,
    requiredMilestones: required.length
  };
}

export function expandedQuestProgress(quest: Quest, stored: QuestProgress | undefined): QuestProgress {
  const milestones: Record<string, QuestMilestoneProgress> = {};
  for (const milestone of quest.milestones) {
    milestones[milestone.id] = stored?.milestones[milestone.id] ?? { status: "not-started", updatedAt: "" };
  }
  const progress: QuestProgress = { milestones };
  if (evaluateQuestCompletion(quest, progress).complete) {
    progress.completedAt = stored?.completedAt || undefined;
  }
  return progress;
}

export class ProgressStore {
  readonly filePath: string;

  constructor(filePath = path.join(process.env.NEOLEARNING_DATA_ROOT ?? path.resolve(process.cwd(), ".data"), "progress.json")) {
    this.filePath = filePath;
  }

  async readState(): Promise<ProgressState> {
    try {
      return normalizeProgress(JSON.parse(await fs.readFile(this.filePath, "utf8")) as unknown);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return { ...EMPTY_PROGRESS };
      if (error instanceof SyntaxError) throw new ProgressValidationError(`Progress data is not valid JSON: ${this.filePath}`);
      throw error;
    }
  }

  async readQuest(quest: Quest): Promise<QuestProgress> {
    const state = await this.readState();
    return expandedQuestProgress(quest, state.quests[quest.id]);
  }

  async writeState(state: ProgressState): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const serialized = `${JSON.stringify(state, null, 2)}\n`;
    const temporaryPath = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    try {
      await fs.writeFile(temporaryPath, serialized, { encoding: "utf8", flag: "wx" });
      await fs.rename(temporaryPath, this.filePath);
    } catch (error) {
      await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
      throw error;
    }
  }

  async setMilestone(quest: Quest, milestoneId: string, status: QuestMilestoneStatus, evidence?: string, journal?: QuestJournalEntry): Promise<QuestProgress> {
    const milestone = quest.milestones.find((item) => item.id === milestoneId);
    if (!milestone) throw new ProgressValidationError(`Unknown milestone: ${milestoneId}`);
    if (!isStatus(status)) throw new ProgressValidationError("Milestone status is invalid.");
    const normalizedEvidence = evidence?.trim();
    if (status === "complete" && milestone.evidenceRequired && !normalizedEvidence) {
      throw new ProgressValidationError(`Milestone ${milestone.id} requires evidence before it can be completed.`);
    }

    const normalizedJournal = journal === undefined ? undefined : validateJournal(journal);
    const state = await this.readState();
    const previous = state.quests[quest.id] ?? { milestones: {} };
    const next: QuestProgress = {
      milestones: {
        ...previous.milestones,
        [milestoneId]: {
          status,
          ...(normalizedEvidence ? { evidence: normalizedEvidence } : previous.milestones[milestoneId]?.evidence ? { evidence: previous.milestones[milestoneId].evidence } : {}),
          ...(normalizedJournal ? { journal: normalizedJournal } : previous.milestones[milestoneId]?.journal ? { journal: previous.milestones[milestoneId].journal } : {}),
          updatedAt: isoNow()
        }
      }
    };
    const completion = evaluateQuestCompletion(quest, expandedQuestProgress(quest, next));
    if (completion.complete) next.completedAt = previous.completedAt ?? isoNow();
    state.quests[quest.id] = next;
    state.schemaVersion = PROGRESS_SCHEMA_VERSION;
    state.updatedAt = isoNow();
    await this.writeState(state);
    return expandedQuestProgress(quest, next);
  }
}

let defaultStore: ProgressStore | undefined;
export function getProgressStore(): ProgressStore {
  defaultStore ??= new ProgressStore();
  return defaultStore;
}
