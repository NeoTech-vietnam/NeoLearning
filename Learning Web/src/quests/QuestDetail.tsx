import { useState } from "react";
import type { Quest, QuestMilestone, QuestMilestoneStatus, QuestProgress } from "../shared";
import { Badge, Button, Card, Progress } from "../ui";
import { atlasHash } from "../app/routes";

export interface QuestDetailProps {
  quest: Quest;
  progress: QuestProgress;
  onBack?: () => void;
  onMilestoneChange: (milestoneId: string, status: QuestMilestoneStatus, evidence?: string) => void | Promise<void>;
}

function MilestoneChecklist({ milestone, progress, onChange }: { milestone: QuestMilestone; progress: QuestProgress["milestones"][string]; onChange: QuestDetailProps["onMilestoneChange"] }) {
  const [evidence, setEvidence] = useState(progress.evidence ?? "");
  const status = progress.status;
  return <li className="quest-detail__milestone">
    <div><h3>{milestone.order}. {milestone.title}</h3>{milestone.description && <p>{milestone.description}</p>}</div>
    <div className="quest-detail__milestone-meta"><Badge tone={status === "complete" ? "accent" : "muted"}>{status.replace("-", " ")}</Badge>{milestone.required && <span>Required</span>}</div>
    {milestone.evidenceRequired && <label>Evidence <input aria-label={`${milestone.title} evidence`} onChange={(event) => setEvidence(event.target.value)} placeholder="Artifact path or observation" value={evidence} /></label>}
    <div className="quest-detail__actions">
      <Button onClick={() => void onChange(milestone.id, "in-progress", evidence)} variant="secondary">Start</Button>
      <Button disabled={milestone.evidenceRequired && !evidence.trim()} onClick={() => void onChange(milestone.id, "complete", evidence)}>Complete</Button>
    </div>
    <div className="quest-detail__links"><strong>Knowledge links</strong><ul>{milestone.knowledgeLinks.map((link) => <li key={link}><a href={atlasHash(link)}>{link}</a></li>)}</ul></div>
  </li>;
}

export function QuestDetail({ quest, progress, onBack, onMilestoneChange }: QuestDetailProps) {
  const completed = quest.milestones.filter((milestone) => progress.milestones[milestone.id]?.status === "complete").length;
  const allRequiredComplete = quest.milestones.filter((milestone) => milestone.required).every((milestone) => progress.milestones[milestone.id]?.status === "complete" && (!milestone.evidenceRequired || progress.milestones[milestone.id]?.evidence));
  return <article className="quest-detail">
    <div className="quest-detail__navigation">
      {onBack && <Button onClick={onBack} variant="secondary">Back to quests</Button>}
      <a className="quest-detail__atlas-link" href={atlasHash(undefined, { mode: "quest", questId: quest.id })}>Trace on Atlas</a>
    </div>
    <header><p className="quest-board__eyebrow">Quest brief</p><h1>{quest.title}</h1>{quest.problem && <p>{quest.problem}</p>}<Progress label="Milestones completed" value={Math.round((completed / quest.milestones.length) * 100)} /></header>
    <Card><h2>Quest knowledge</h2><ul className="quest-detail__links">{quest.knowledgeLinks.map((link) => <li key={link}><a href={atlasHash(link)}>{link}</a></li>)}</ul></Card>
    <section><h2>Milestones</h2><ol className="quest-detail__checklist">{quest.milestones.map((milestone) => <MilestoneChecklist key={milestone.id} milestone={milestone} onChange={onMilestoneChange} progress={progress.milestones[milestone.id] ?? { status: "not-started", updatedAt: "" }} />)}</ol></section>
    <Card><h2>Completion</h2><p>{allRequiredComplete ? "Required milestones and evidence are complete." : "Complete every required milestone and attach its required evidence."}</p><ul>{quest.completionCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></Card>
  </article>;
}
