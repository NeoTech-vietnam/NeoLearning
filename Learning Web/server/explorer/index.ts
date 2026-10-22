import { promises as fs } from "node:fs";
import path from "node:path";
import { EXP_REWARDS, explorerLevel, type ExplorerLedger, type ExplorerProfile, type ExplorerReward } from "../../src/shared/explorer.js";
import { getActivityCatalog, type ActivityCatalog } from "../learning/catalog.js";
import { getLearningProgressStore, type LearningProgressStore } from "../learning/progress.js";
import { getQuestCatalog, type QuestCatalog } from "../quests/index.js";
import { evaluateQuestCompletion, getProgressStore, type ProgressStore } from "../progress/index.js";

export function calendarDay(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function previousDay(day: string): string {
  return new Date(Date.parse(`${day}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
}
export function dayStreak(days: string[], today: string): number {
  const dates = new Set(days);
  let cursor = dates.has(today) ? today : previousDay(today);
  let count = 0;
  while (dates.has(cursor)) { count++; cursor = previousDay(cursor); }
  return count;
}
const empty = (): ExplorerLedger => ({ schemaVersion: 1, checkIns: [], learningDays: [], rewards: {} });
const validDay = (day: unknown): day is string => typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day) && new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day;

export class ExplorerStore {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(
    readonly filePath = path.join(process.env.NEOLEARNING_DATA_ROOT ?? path.resolve(process.cwd(), ".data"), "explorer.json"),
    readonly timeZone = process.env.NEOLEARNING_TIME_ZONE ?? "Asia/Jakarta",
    readonly clock: () => Date = () => new Date()
  ) { calendarDay(clock(), timeZone); }

  private async read(): Promise<ExplorerLedger> {
    try {
      const raw = JSON.parse(await fs.readFile(this.filePath, "utf8")) as ExplorerLedger;
      if (!raw || raw.schemaVersion !== 1 || !Array.isArray(raw.checkIns) || !Array.isArray(raw.learningDays) ||
          !raw.checkIns.every(validDay) || !raw.learningDays.every(validDay) || !raw.rewards || typeof raw.rewards !== "object" || Array.isArray(raw.rewards) ||
          !Object.entries(raw.rewards).every(([id, item]) => item && item.id === id && typeof item.label === "string" && Number.isSafeInteger(item.exp) && item.exp > 0 && typeof item.earnedAt === "string" && Number.isFinite(Date.parse(item.earnedAt)))) {
        throw new Error("Explorer data is invalid. Restore explorer.json from backup; it has not been reset.");
      }
      return raw;
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code === "ENOENT") return empty();
      throw cause;
    }
  }
  private profile(state: ExplorerLedger): ExplorerProfile {
    const today = calendarDay(this.clock(), this.timeZone);
    const rewards = Object.values(state.rewards).sort((a, b) => b.earnedAt.localeCompare(a.earnedAt) || a.id.localeCompare(b.id));
    const totalExp = rewards.reduce((sum, item) => sum + item.exp, 0);
    return { today, timeZone: this.timeZone, totalExp, ...explorerLevel(totalExp), checkedIn: state.checkIns.includes(today),
      checkInStreak: dayStreak(state.checkIns, today), learningStreak: dayStreak(state.learningDays, today),
      checkIns: [...new Set(state.checkIns)].sort(), learningDays: [...new Set(state.learningDays)].sort(), rewards };
  }
  async snapshot(): Promise<ExplorerProfile> { await this.pending; return this.profile(await this.read()); }

  async sync(achievements: ExplorerReward[], learningDays: string[], checkIn = false): Promise<ExplorerProfile> {
    const operation = this.pending.then(async () => {
      const state = await this.read();
      let changed = false;
      const grant = (reward: ExplorerReward) => {
        if (Object.hasOwn(state.rewards, reward.id)) return;
        state.rewards[reward.id] = reward; changed = true;
      };
      for (const reward of achievements) grant(reward);
      for (const day of learningDays) if (validDay(day) && !state.learningDays.includes(day)) { state.learningDays.push(day); changed = true; }
      if (checkIn) {
        const now = this.clock(); const day = calendarDay(now, this.timeZone);
        if (!state.checkIns.includes(day)) { state.checkIns.push(day); changed = true; }
        grant({ id: `check-in:${day}`, label: `Daily check-in · ${day}`, exp: EXP_REWARDS.checkIn, earnedAt: now.toISOString() });
      }
      if (changed) {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        const temporary = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
        try {
          await fs.writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
          await fs.rename(temporary, this.filePath);
        } catch (cause) { await fs.rm(temporary, { force: true }).catch(() => undefined); throw cause; }
      }
      return this.profile(state);
    });
    this.pending = operation.then(() => undefined, () => undefined);
    return operation;
  }
}

export async function collectAchievements(
  timeZone: string, activities: ActivityCatalog = getActivityCatalog(), learning: LearningProgressStore = getLearningProgressStore(),
  quests: QuestCatalog = getQuestCatalog(), progress: ProgressStore = getProgressStore()
): Promise<{ rewards: ExplorerReward[]; learningDays: string[] }> {
  const [plans, study, catalogue, journeys] = await Promise.all([activities.list(), learning.readState(), quests.list(), progress.readState()]);
  const rewards: ExplorerReward[] = []; const days = new Set<string>();
  const learn = (stamp?: string) => { if (stamp && Number.isFinite(Date.parse(stamp))) days.add(calendarDay(new Date(stamp), timeZone)); };
  const add = (id: string, label: string, exp: number, stamp?: string) => {
    // Legacy boolean quest completion has no timestamp: credit it without fabricating a learning day.
    rewards.push({ id, label, exp, earnedAt: stamp && Number.isFinite(Date.parse(stamp)) ? stamp : new Date(0).toISOString() });
    learn(stamp);
  };
  for (const plan of plans) for (const activity of plan.activities) {
    const item = study.lessons[plan.lessonPath]?.activities[activity.id];
    if (!item?.completedAt) continue;
    add(`activity:${plan.lessonPath}:${activity.id}`, `${plan.title} · ${activity.title}`, EXP_REWARDS.activity, item.completedAt);
    if (item.successStreak > 0) learn(item.lastAttemptAt);
  }
  for (const quest of catalogue) {
    const stored = journeys.quests[quest.id]; if (!stored) continue;
    for (const milestone of quest.milestones) {
      const item = stored.milestones[milestone.id];
      if (item?.status !== "complete" || (milestone.evidenceRequired && !item.evidence?.trim())) continue;
      add(`milestone:${quest.id}:${milestone.id}`, `${quest.title} · ${milestone.title}`, milestone.evidenceRequired ? EXP_REWARDS.checkpoint : EXP_REWARDS.milestone, item.updatedAt);
    }
    if (evaluateQuestCompletion(quest, stored).complete && quest.milestones.some((item) => item.required)) {
      add(`quest:${quest.id}`, `Destination reached · ${quest.title}`, EXP_REWARDS.quest, stored.completedAt);
    }
  }
  return { rewards, learningDays: [...days] };
}
let store: ExplorerStore | undefined;
export function getExplorerStore() { return store ??= new ExplorerStore(); }
