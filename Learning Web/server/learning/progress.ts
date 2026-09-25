import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  ActivityDefinition, ActivityProgress, AtlasLearningState, AttemptResponse, LearningProgressState,
  LessonPlan, LessonProgress, QuestEvidenceOption, ReviewItem
} from "../../src/shared/learning.js";

export class LearningValidationError extends Error {}

const EMPTY: LearningProgressState = { schemaVersion: 1, lessons: {}, atlasVisits: {}, updatedAt: "" };
const REVIEW_DAYS = [1, 3, 7, 14, 30];

export function gradeActivity(activity: ActivityDefinition, response: unknown): {
  correct: boolean; feedback: string; explanation: string; note?: string;
} {
  switch (activity.kind) {
    case "choice": {
      if (typeof response !== "string" || !activity.options.some((option) => option.id === response)) {
        throw new LearningValidationError("Choose one of the offered answers.");
      }
      const correct = response === activity.answer;
      return { correct, feedback: correct ? "Correct — explain why before moving on." : "Not quite. Compare the event and output action, then retry.", explanation: activity.explanation };
    }
    case "order": {
      if (!Array.isArray(response) || response.length !== activity.items.length ||
          response.some((item) => typeof item !== "string") ||
          new Set(response).size !== response.length ||
          response.some((item) => !activity.items.some((option) => option.id === item))) {
        throw new LearningValidationError("Order every item exactly once.");
      }
      const correct = activity.answer.every((item, index) => item === response[index]);
      return { correct, feedback: correct ? "Sequence correct." : "Sequence needs another pass. Start from resource allocation.", explanation: activity.explanation };
    }
    case "self-check": {
      if (!response || typeof response !== "object" || Array.isArray(response)) throw new LearningValidationError("Write a reflection and rate your confidence.");
      const answer = response as Record<string, unknown>;
      const note = typeof answer.note === "string" ? answer.note.trim() : "";
      if (note.length < 10 || note.length > 2000 || typeof answer.confident !== "boolean") {
        throw new LearningValidationError("Reflection must be 10–2000 characters and include a confidence choice.");
      }
      return {
        correct: answer.confident,
        feedback: answer.confident ? "Saved. Revisit this explanation tomorrow." : "Saved as a knowledge gap for a quick review.",
        explanation: activity.modelAnswer,
        note
      };
    }
    case "pwm-lab": {
      if (!response || typeof response !== "object" || Array.isArray(response)) throw new LearningValidationError("Set the waveform and predict the high time.");
      const answer = response as Record<string, unknown>;
      const frequency = answer.frequencyHz;
      const duty = answer.dutyPercent;
      const predicted = answer.predictedHighUs;
      if (typeof frequency !== "number" || !Number.isFinite(frequency) || frequency < 100 || frequency > 5000 ||
          typeof duty !== "number" || !Number.isFinite(duty) || duty < 1 || duty > 99 ||
          typeof predicted !== "number" || !Number.isFinite(predicted) || predicted < 0) {
        throw new LearningValidationError("Use 100–5000 Hz, 1–99% duty, and a non-negative high-time prediction.");
      }
      const highUs = 1_000_000 / frequency * duty / 100;
      const correct = Math.abs(frequency - activity.targetFrequencyHz) <= Math.max(5, activity.targetFrequencyHz * .01) &&
        Math.abs(duty - activity.targetDutyPercent) <= 1 &&
        Math.abs(predicted - highUs) <= Math.max(2, highUs * .05);
      return {
        correct,
        feedback: correct ? "Waveform matched your target and prediction." : `Check target settings and the high interval: about ${highUs.toFixed(1)} µs for your current waveform.`,
        explanation: activity.explanation
      };
    }
  }
}

function normalize(raw: unknown): LearningProgressState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ...EMPTY, lessons: {}, atlasVisits: {} };
  const source = raw as Record<string, unknown>;
  const lessons: LearningProgressState["lessons"] = {};
  if (source.lessons && typeof source.lessons === "object" && !Array.isArray(source.lessons)) {
    for (const [path, value] of Object.entries(source.lessons)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const lesson = value as Record<string, unknown>;
      const activities: LessonProgress["activities"] = {};
      if (lesson.activities && typeof lesson.activities === "object" && !Array.isArray(lesson.activities)) {
        for (const [id, entry] of Object.entries(lesson.activities)) {
          if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
          const item = entry as Record<string, unknown>;
          if (typeof item.attempts !== "number" || typeof item.successStreak !== "number" ||
              typeof item.lastAttemptAt !== "string" || typeof item.reviewAt !== "string") continue;
          activities[id] = {
            attempts: item.attempts,
            successStreak: item.successStreak,
            lastAttemptAt: item.lastAttemptAt,
            reviewAt: item.reviewAt,
            ...(typeof item.completedAt === "string" ? { completedAt: item.completedAt } : {}),
            ...(typeof item.note === "string" ? { note: item.note } : {})
          };
        }
      }
      lessons[path] = {
        activities,
        ...(typeof lesson.lastOpenedAt === "string" ? { lastOpenedAt: lesson.lastOpenedAt } : {}),
        ...(typeof lesson.lastHeading === "string" ? { lastHeading: lesson.lastHeading } : {})
      };
    }
  }
  const atlasVisits: Record<string, string> = {};
  if (source.atlasVisits && typeof source.atlasVisits === "object" && !Array.isArray(source.atlasVisits)) {
    for (const [path, date] of Object.entries(source.atlasVisits)) {
      if (typeof date === "string" && !Number.isNaN(Date.parse(date))) atlasVisits[path] = date;
    }
  }
  return { schemaVersion: 1, lessons, atlasVisits, updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : "" };
}

export class LearningProgressStore {
  private pending: Promise<void> = Promise.resolve();

  constructor(readonly filePath = path.join(process.env.NEOLEARNING_DATA_ROOT ?? path.resolve(process.cwd(), ".data"), "learning-progress.json")) {}

  async readState(): Promise<LearningProgressState> {
    try { return normalize(JSON.parse(await fs.readFile(this.filePath, "utf8")) as unknown); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return { ...EMPTY, lessons: {}, atlasVisits: {} };
      throw error;
    }
  }

  async readLesson(lessonPath: string): Promise<LessonProgress> {
    const state = await this.readState();
    return state.lessons[lessonPath] ?? { activities: {} };
  }

  private update<T>(change: (state: LearningProgressState) => T | Promise<T>): Promise<T> {
    const run = this.pending.then(async () => {
      const state = await this.readState();
      const result = await change(state);
      state.updatedAt = new Date().toISOString();
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const temporary = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
      try {
        await fs.writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
        await fs.rename(temporary, this.filePath);
      } catch (error) {
        await fs.rm(temporary, { force: true }).catch(() => undefined);
        throw error;
      }
      return result;
    });
    this.pending = run.then(() => undefined, () => undefined);
    return run;
  }

  async atlasState(): Promise<AtlasLearningState> {
    const state = await this.readState();
    const practiced: Record<string, string> = {};
    const visits = { ...state.atlasVisits };
    for (const [lessonPath, lesson] of Object.entries(state.lessons)) {
      if (lesson.lastOpenedAt) visits[lessonPath] ??= lesson.lastOpenedAt;
      const completed = Object.values(lesson.activities).map((activity) => activity.completedAt).filter((date): date is string => Boolean(date)).sort();
      if (completed.length) practiced[lessonPath] = completed[0];
    }
    return { visits, practiced };
  }

  async visitAtlas(relativePath: string): Promise<AtlasLearningState> {
    await this.update((state) => { state.atlasVisits[relativePath] ??= new Date().toISOString(); });
    return this.atlasState();
  }

  async visit(lessonPath: string, heading?: string): Promise<LessonProgress> {
    return this.update((state) => {
      const progress = state.lessons[lessonPath] ?? { activities: {} };
      progress.lastOpenedAt = new Date().toISOString();
      if (heading !== undefined) progress.lastHeading = heading;
      state.lessons[lessonPath] = progress;
      return structuredClone(progress);
    });
  }

  async attempt(plan: LessonPlan, activity: ActivityDefinition, response: unknown): Promise<AttemptResponse> {
    const result = gradeActivity(activity, response);
    return this.update((state) => {
      const progress = state.lessons[plan.lessonPath] ?? { activities: {} };
      const previous = progress.activities[activity.id];
      const now = new Date();
      const streak = result.correct ? (previous?.successStreak ?? 0) + 1 : 0;
      const delay = result.correct ? REVIEW_DAYS[Math.min(streak - 1, REVIEW_DAYS.length - 1)] * 86_400_000 : 3_600_000;
      const next: ActivityProgress = {
        attempts: (previous?.attempts ?? 0) + 1,
        successStreak: streak,
        lastAttemptAt: now.toISOString(),
        reviewAt: new Date(now.getTime() + delay).toISOString(),
        ...(result.correct ? { completedAt: previous?.completedAt ?? now.toISOString() } : previous?.completedAt ? { completedAt: previous.completedAt } : {}),
        ...(result.note ? { note: result.note } : previous?.note ? { note: previous.note } : {})
      };
      progress.activities[activity.id] = next;
      state.lessons[plan.lessonPath] = progress;
      return { ...result, progress: structuredClone(progress) };
    });
  }

  async due(plans: LessonPlan[], now = new Date()): Promise<ReviewItem[]> {
    const state = await this.readState();
    return plans.flatMap((plan) => plan.activities.flatMap((activity) => {
      const item = state.lessons[plan.lessonPath]?.activities[activity.id];
      return item && new Date(item.reviewAt).getTime() <= now.getTime()
        ? [{ lessonPath: plan.lessonPath, lessonTitle: plan.title, activityId: activity.id, activityTitle: activity.title, reviewAt: item.reviewAt }]
        : [];
    })).sort((a, b) => a.reviewAt.localeCompare(b.reviewAt));
  }

  async evidence(plans: LessonPlan[], questId: string, milestoneId: string): Promise<QuestEvidenceOption[]> {
    const state = await this.readState();
    return plans.flatMap((plan) => plan.questEvidence.flatMap((link) => {
      if (link.questId !== questId || link.milestoneId !== milestoneId) return [];
      const activity = plan.activities.find((item) => item.id === link.activityId);
      const completedAt = state.lessons[plan.lessonPath]?.activities[link.activityId]?.completedAt;
      if (!activity || !completedAt) return [];
      return [{
        lessonPath: plan.lessonPath,
        activityId: activity.id,
        activityTitle: activity.title,
        completedAt,
        evidence: `NeoLearning simulation: ${activity.title} completed ${completedAt}; lesson ${plan.lessonPath}. This is simulation evidence, not a hardware measurement.`
      }];
    }));
  }
}

let defaultStore: LearningProgressStore | undefined;
export function getLearningProgressStore(): LearningProgressStore {
  defaultStore ??= new LearningProgressStore();
  return defaultStore;
}
