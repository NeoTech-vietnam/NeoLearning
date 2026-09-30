export const EXP_REWARDS = { checkIn: 5, activity: 20, milestone: 50, checkpoint: 100, quest: 200 } as const;
export interface ExplorerReward { id: string; label: string; exp: number; earnedAt: string }
export interface ExplorerLedger {
  schemaVersion: 1;
  checkIns: string[];
  learningDays: string[];
  rewards: Record<string, ExplorerReward>;
}
export interface ExplorerProfile {
  today: string; timeZone: string; totalExp: number; level: number; title: string;
  levelExp: number; nextLevelExp: number; checkedIn: boolean;
  checkInStreak: number; learningStreak: number; checkIns: string[]; learningDays: string[];
  rewards: ExplorerReward[];
}
export function explorerLevel(exp: number) {
  const level = Math.floor(exp / 250) + 1;
  const title = level < 3 ? "Newcomer" : level < 6 ? "Explorer" : level < 10 ? "Pathfinder" : "Maker";
  return { level, title, levelExp: exp % 250, nextLevelExp: 250 };
}
