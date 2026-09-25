export type ActivityKind = "choice" | "order" | "self-check" | "pwm-lab";

export interface ActivityOption {
  id: string;
  label: string;
}

interface ActivityBase {
  id: string;
  kind: ActivityKind;
  title: string;
  prompt: string;
  afterHeading: string;
}

export interface ChoiceActivity extends ActivityBase {
  kind: "choice";
  options: ActivityOption[];
  answer: string;
  explanation: string;
}

export interface OrderActivity extends ActivityBase {
  kind: "order";
  items: ActivityOption[];
  answer: string[];
  explanation: string;
}

export interface SelfCheckActivity extends ActivityBase {
  kind: "self-check";
  modelAnswer: string;
}

export interface PwmLabActivity extends ActivityBase {
  kind: "pwm-lab";
  targetFrequencyHz: number;
  targetDutyPercent: number;
  explanation: string;
}

export type ActivityDefinition = ChoiceActivity | OrderActivity | SelfCheckActivity | PwmLabActivity;
export type PublicActivity =
  | Omit<ChoiceActivity, "answer" | "explanation">
  | Omit<OrderActivity, "answer" | "explanation">
  | Omit<SelfCheckActivity, "modelAnswer">
  | Omit<PwmLabActivity, "explanation">;

export interface QuestEvidenceLink {
  questId: string;
  milestoneId: string;
  activityId: string;
}

export interface LessonPlan {
  id: string;
  lessonPath: string;
  title: string;
  activities: ActivityDefinition[];
  questEvidence: QuestEvidenceLink[];
}

export interface PublicLessonPlan extends Omit<LessonPlan, "activities"> {
  activities: PublicActivity[];
}

export interface ActivityProgress {
  attempts: number;
  successStreak: number;
  lastAttemptAt: string;
  completedAt?: string;
  reviewAt: string;
  note?: string;
}

export interface LessonProgress {
  lastOpenedAt?: string;
  lastHeading?: string;
  activities: Record<string, ActivityProgress>;
}

export interface LearningProgressState {
  schemaVersion: 1;
  lessons: Record<string, LessonProgress>;
  atlasVisits: Record<string, string>;
  updatedAt: string;
}

export interface AtlasLearningState {
  visits: Record<string, string>;
  practiced: Record<string, string>;
}

export interface LessonResponse {
  lesson: PublicLessonPlan | null;
  progress: LessonProgress;
}

export interface AttemptResponse {
  correct: boolean;
  feedback: string;
  explanation: string;
  progress: LessonProgress;
}

export interface ReviewItem {
  lessonPath: string;
  lessonTitle: string;
  activityId: string;
  activityTitle: string;
  reviewAt: string;
}

export interface QuestEvidenceOption {
  lessonPath: string;
  activityId: string;
  activityTitle: string;
  completedAt: string;
  evidence: string;
}

export interface LessonHeading {
  line: number;
  depth: number;
  text: string;
  slug: string;
}

export function headingSlug(text: string): string {
  return text.toLocaleLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function lessonHeadings(markdown: string): LessonHeading[] {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
  const headings: LessonHeading[] = [];
  let fenced = false;
  for (const [index, line] of body.split(/\r?\n/).entries()) {
    if (/^\s*\`{3,}/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[\`*_]/g, "").trim();
    headings.push({ line: index + 1, depth: match[1].length, text, slug: headingSlug(text) });
  }
  return headings;
}
