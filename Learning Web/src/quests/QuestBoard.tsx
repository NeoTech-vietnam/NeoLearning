import type { Quest, QuestProgress } from "../shared";
import { Badge, Button, Card, Progress } from "../ui";

function completeCount(quest: Quest, progress: QuestProgress | undefined): number {
  return quest.milestones.filter((milestone) => progress?.milestones[milestone.id]?.status === "complete").length;
}

export function QuestBoard({ quests, progressByQuest, onSelectQuest }: { quests: Quest[]; progressByQuest: Record<string, QuestProgress | undefined>; onSelectQuest: (quest: Quest) => void }) {
  if (!quests.length) return <p className="quest-board__empty">No quests are available yet.</p>;
  return <section aria-label="Quest board" className="quest-board">
    {quests.map((quest) => {
      const completed = completeCount(quest, progressByQuest[quest.id]);
      const value = Math.round((completed / quest.milestones.length) * 100);
      return <Card className="quest-board__card" key={quest.id}>
        <div className="quest-board__heading"><div><p className="quest-board__eyebrow">Learning by making</p><h2>{quest.title}</h2></div>{quest.level && <Badge tone="accent">{quest.level}</Badge>}</div>
        {quest.problem && <p>{quest.problem}</p>}
        {quest.destination && <p className="quest-board__destination"><strong>Destination:</strong> {quest.destination}</p>}
        <Progress label={`${quest.title} milestones`} value={value} />
        <Button onClick={() => onSelectQuest(quest)}>View quest</Button>
      </Card>;
    })}
  </section>;
}
