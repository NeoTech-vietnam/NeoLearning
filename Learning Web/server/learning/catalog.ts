import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  ActivityDefinition, ActivityOption, LessonPlan, PublicActivity,
  PublicLessonPlan, QuestEvidenceLink
} from "../../src/shared/learning.js";
import { isSafeRelativePath } from "../content/index.js";

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ActivityValidationError extends Error {}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ActivityValidationError(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new ActivityValidationError(`${label} must be non-empty text.`);
  return value.trim();
}

function identifier(value: unknown, label: string): string {
  const result = text(value, label);
  if (!ID.test(result)) throw new ActivityValidationError(`${label} must use lowercase hyphenated IDs.`);
  return result;
}

function options(value: unknown, label: string): ActivityOption[] {
  if (!Array.isArray(value) || value.length < 2) throw new ActivityValidationError(`${label} needs at least two items.`);
  const result = value.map((raw, index) => {
    const item = object(raw, `${label}[${index}]`);
    return { id: identifier(item.id, "option id"), label: text(item.label, "option label") };
  });
  if (new Set(result.map((item) => item.id)).size !== result.length) throw new ActivityValidationError(`${label} has duplicate IDs.`);
  return result;
}

function parseActivity(value: unknown): ActivityDefinition {
  const raw = object(value, "activity");
  const base = {
    id: identifier(raw.id, "activity id"),
    title: text(raw.title, "activity title"),
    prompt: text(raw.prompt, "activity prompt"),
    afterHeading: text(raw.afterHeading, "afterHeading")
  };
  switch (raw.kind) {
    case "choice": {
      const choices = options(raw.options, "choice options");
      const answer = identifier(raw.answer, "choice answer");
      if (!choices.some((item) => item.id === answer)) throw new ActivityValidationError(`Unknown choice answer: ${answer}`);
      return { ...base, kind: "choice", options: choices, answer, explanation: text(raw.explanation, "choice explanation") };
    }
    case "order": {
      const items = options(raw.items, "order items");
      if (!Array.isArray(raw.answer) || raw.answer.some((item) => typeof item !== "string")) {
        throw new ActivityValidationError("Order answer must be an ID array.");
      }
      const answer = raw.answer as string[];
      if (answer.length !== items.length || new Set(answer).size !== items.length || answer.some((id) => !items.some((item) => item.id === id))) {
        throw new ActivityValidationError("Order answer must contain every item exactly once.");
      }
      return { ...base, kind: "order", items, answer, explanation: text(raw.explanation, "order explanation") };
    }
    case "self-check":
      return { ...base, kind: "self-check", modelAnswer: text(raw.modelAnswer, "model answer") };
    case "pwm-lab": {
      const frequency = raw.targetFrequencyHz;
      const duty = raw.targetDutyPercent;
      if (typeof frequency !== "number" || !Number.isFinite(frequency) || frequency < 100 || frequency > 5000 ||
          typeof duty !== "number" || !Number.isFinite(duty) || duty < 1 || duty > 99) {
        throw new ActivityValidationError("PWM target must have 100–5000 Hz and 1–99% duty.");
      }
      return { ...base, kind: "pwm-lab", targetFrequencyHz: frequency, targetDutyPercent: duty, explanation: text(raw.explanation, "PWM explanation") };
    }
    default:
      throw new ActivityValidationError(`Unknown activity kind: ${String(raw.kind)}`);
  }
}

export function publicLesson(plan: LessonPlan): PublicLessonPlan {
  const activities: PublicActivity[] = plan.activities.map((activity) => {
    switch (activity.kind) {
      case "choice": {
        const { answer: _answer, explanation: _explanation, ...publicActivity } = activity;
        return publicActivity;
      }
      case "order": {
        const { answer: _answer, explanation: _explanation, ...publicActivity } = activity;
        return publicActivity;
      }
      case "self-check": {
        const { modelAnswer: _modelAnswer, ...publicActivity } = activity;
        return publicActivity;
      }
      case "pwm-lab": {
        const { explanation: _explanation, ...publicActivity } = activity;
        return publicActivity;
      }
    }
  });
  return { ...plan, activities };
}

export class ActivityCatalog {
  constructor(
    readonly repositoryRoot = process.env.NEOLEARNING_REPOSITORY_ROOT ?? path.resolve(process.cwd(), ".."),
    readonly directory = process.env.NEOLEARNING_ACTIVITY_DIRECTORY ?? path.resolve(process.cwd(), "activities")
  ) {}

  async list(): Promise<LessonPlan[]> {
    let entries;
    try { entries = await fs.readdir(this.directory, { withFileTypes: true }); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    const root = await fs.realpath(this.repositoryRoot);
    const plans = await Promise.all(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map(async (entry) => {
      const raw = object(JSON.parse(await fs.readFile(path.join(this.directory, entry.name), "utf8")) as unknown, entry.name);
      const lessonPath = text(raw.lessonPath, "lessonPath");
      if (!isSafeRelativePath(lessonPath) || !lessonPath.endsWith(".md")) throw new ActivityValidationError(`Unsafe lessonPath: ${lessonPath}`);
      const target = await fs.realpath(path.join(root, lessonPath));
      if (path.relative(root, target).startsWith("..") || path.isAbsolute(path.relative(root, target))) {
        throw new ActivityValidationError(`Lesson escapes repository: ${lessonPath}`);
      }
      if (!Array.isArray(raw.activities) || raw.activities.length === 0) throw new ActivityValidationError("Lesson needs activities.");
      const activities = raw.activities.map(parseActivity);
      if (new Set(activities.map((activity) => activity.id)).size !== activities.length) throw new ActivityValidationError("Duplicate activity IDs.");
      const questEvidence: QuestEvidenceLink[] = Array.isArray(raw.questEvidence) ? raw.questEvidence.map((value) => {
        const item = object(value, "questEvidence item");
        const result = {
          questId: identifier(item.questId, "questId"),
          milestoneId: identifier(item.milestoneId, "milestoneId"),
          activityId: identifier(item.activityId, "activityId")
        };
        if (!activities.some((activity) => activity.id === result.activityId)) throw new ActivityValidationError("Quest evidence references an unknown activity.");
        return result;
      }) : [];
      return {
        id: identifier(raw.id, "lesson id"),
        lessonPath,
        title: text(raw.title, "lesson title"),
        activities,
        questEvidence
      } satisfies LessonPlan;
    }));
    if (new Set(plans.map((plan) => plan.lessonPath)).size !== plans.length) throw new ActivityValidationError("Duplicate lesson paths.");
    return plans.sort((a, b) => a.title.localeCompare(b.title));
  }

  async get(lessonPath: string): Promise<LessonPlan | undefined> {
    return (await this.list()).find((plan) => plan.lessonPath === lessonPath);
  }
}

let defaultCatalog: ActivityCatalog | undefined;
export function getActivityCatalog(): ActivityCatalog {
  defaultCatalog ??= new ActivityCatalog();
  return defaultCatalog;
}
