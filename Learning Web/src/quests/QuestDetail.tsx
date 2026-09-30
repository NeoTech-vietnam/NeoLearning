import { useEffect, useState } from "react";
import type { Quest, QuestMilestone, QuestMilestoneStatus, QuestProgress, QuestJournalEntry } from "../shared";
import type { QuestEvidenceOption } from "../shared/learning";
import { Badge, Button, Card, Progress } from "../ui";
import { atlasHash } from "../app/routes";
import { EXP_REWARDS } from "../shared/explorer";
import type { ExpeditionClue } from "../shared/expedition";
import { FieldClue } from "./FieldClue";

export interface QuestDetailProps {
  quest: Quest;
  progress: QuestProgress;
  evidenceByMilestone?: Record<string, QuestEvidenceOption[]>;
  onBack?: () => void;
  onMilestoneChange: (milestoneId: string, status: QuestMilestoneStatus, evidence?: string, journal?: QuestJournalEntry) => void | Promise<void>;
}

function MilestoneChecklist({ milestone, progress, suggestions, onChange, blocked = false, current = false }: { milestone: QuestMilestone; progress: QuestProgress["milestones"][string]; suggestions: QuestEvidenceOption[]; onChange: QuestDetailProps["onMilestoneChange"]; blocked?: boolean; current?: boolean }) {
  const [evidence, setEvidence] = useState(progress.evidence ?? "");
  const [tried, setTried] = useState(progress.journal?.tried ?? "");
  const [result, setResult] = useState(progress.journal?.result ?? "");
  const [nextMeasurement, setNextMeasurement] = useState(progress.journal?.nextMeasurement ?? "");
  const journalReady = Boolean(tried.trim() && result.trim() && nextMeasurement.trim());
  const status = progress.status;
  return <li className="quest-detail__milestone" data-current={current} data-complete={status === "complete"}>
    <div><h3>{milestone.order}. {milestone.title}</h3>{milestone.description && <p>{milestone.description}</p>}{milestone.challenge && <p className="quest-detail__challenge"><strong>Challenge:</strong> {milestone.challenge}</p>}</div>
    <div className="quest-detail__milestone-meta"><Badge tone={status === "complete" ? "accent" : "muted"}>{status.replace("-", " ")}</Badge>{milestone.required && <span>Required</span>}</div>
    <small>{milestone.evidenceRequired ? "Evidence checkpoint" : "Trail challenge"} · +{milestone.evidenceRequired ? EXP_REWARDS.checkpoint : EXP_REWARDS.milestone} EXP once</small>
    {blocked && <p>Explore this region freely; finish the earlier required stages before recording progress here.</p>}
    {(milestone.evidenceRequired || suggestions.length > 0) && <>
      <label>Evidence <input aria-label={`${milestone.title} evidence`} onChange={(event) => setEvidence(event.target.value)} placeholder="Artifact path or observation" value={evidence} /></label>
      {suggestions.map((option) => <button className="quest-detail__use-evidence" key={option.activityId} onClick={() => setEvidence(option.evidence)} type="button">Use completed lab: {option.activityTitle}</button>)}
      {suggestions.length > 0 && <small>Simulation evidence is not proof from physical hardware. Review it before completing this milestone.</small>}
    </>}
    <fieldset className="quest-detail__journal"><legend>Field journal</legend><p>Capture the experiment, not just the completion checkmark.</p>
      <label>What did you try?<textarea aria-label={`${milestone.title} tried`} maxLength={2000} onChange={(event) => setTried(event.target.value)} value={tried} /></label>
      <label>What happened?<textarea aria-label={`${milestone.title} result`} maxLength={2000} onChange={(event) => setResult(event.target.value)} value={result} /></label>
      <label>What will you measure on hardware next?<textarea aria-label={`${milestone.title} next measurement`} maxLength={2000} onChange={(event) => setNextMeasurement(event.target.value)} value={nextMeasurement} /></label>
    </fieldset>
    <div className="quest-detail__actions">
      <Button disabled={blocked} onClick={() => void onChange(milestone.id, "in-progress", evidence)} variant="secondary">Start</Button>
      <Button disabled={blocked || !journalReady || (milestone.evidenceRequired && !evidence.trim())} onClick={() => void onChange(milestone.id, "complete", evidence, { tried: tried.trim(), result: result.trim(), nextMeasurement: nextMeasurement.trim() })}>Complete</Button>
    </div>
    <div className="quest-detail__links"><strong>Knowledge links</strong><ul>{milestone.knowledgeLinks.map((link) => <li key={link}><a href={atlasHash(link)}>{link}</a></li>)}</ul></div>
  </li>;
}

export function QuestDetail({ quest, progress, evidenceByMilestone = {}, onBack, onMilestoneChange }: QuestDetailProps) {
  const [focused, setFocused] = useState(Boolean(quest.ordered));
  const [clues, setClues] = useState<ExpeditionClue[]>([]);
  const [clueError, setClueError] = useState<string>();
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setClues([]); setClueError(undefined);
    fetch(`/api/explorer/clues/${encodeURIComponent(quest.id)}`, { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("Field encounters could not be loaded."); return await response.json() as { clues: ExpeditionClue[] }; })
      .then((payload) => setClues(payload.clues)).catch((cause: unknown) => { if (!controller.signal.aborted) setClueError(cause instanceof Error ? cause.message : "Field encounters unavailable."); });
    return () => controller.abort();
  }, [quest.id, retry]);
  const active = quest.milestones.find((item) => progress.milestones[item.id]?.status !== "complete");
  const clue = clues.find((item) => item.milestoneId === active?.id);
  const completed = quest.milestones.filter((milestone) => progress.milestones[milestone.id]?.status === "complete").length;
  const allRequiredComplete = quest.milestones.filter((milestone) => milestone.required).every((milestone) => progress.milestones[milestone.id]?.status === "complete" && (!milestone.evidenceRequired || progress.milestones[milestone.id]?.evidence));
  return <article className="quest-detail">
    <div className="quest-detail__navigation">
      {onBack && <Button onClick={onBack} variant="secondary">Back to quests</Button>}
      <a className="quest-detail__atlas-link" href={atlasHash(undefined, { mode: "quest", questId: quest.id })}>Trace on Atlas</a>
    </div>
    <header><p className="quest-board__eyebrow">Quest brief</p><h1>{quest.title}</h1>{quest.problem && <p>{quest.problem}</p>}{quest.destination && <p className="quest-detail__destination"><strong>Destination:</strong> {quest.destination}</p>}<Progress label="Milestones completed" value={Math.round((completed / quest.milestones.length) * 100)} /></header>
    <section className="expedition-brief" aria-label="Current expedition stage">
      <div className="expedition-brief__trail" aria-label="Expedition stages">{quest.milestones.map((item) => <a key={item.id} href={atlasHash(item.knowledgeLinks[0], { mode: "quest", questId: quest.id })} aria-label={`Stage ${item.order}: ${item.title}`} aria-current={active?.id === item.id ? "step" : undefined} data-complete={progress.milestones[item.id]?.status === "complete"} data-checkpoint={Boolean(item.evidenceRequired)}>{progress.milestones[item.id]?.status === "complete" ? "✓" : item.order}</a>)}</div>
      {active ? <><p className="eyebrow">You are here · Stage {active.order}/{quest.milestones.length}</p><h2>{active.title}</h2><p>{active.challenge ?? active.description}</p><p>{active.evidenceRequired ? "Checkpoint: bring project evidence and your field notes." : "Explore the linked knowledge, try an idea, and record what happened."}</p><a className="quest-detail__atlas-link" href={atlasHash(active.knowledgeLinks[0], { mode: "quest", questId: quest.id })}>Explore this stage →</a></> : <><h2>Destination reached ✦</h2><p>{quest.destination ?? "Your journey has left a trail of practical evidence."}</p><p>{completed} stages documented · +{EXP_REWARDS.quest} EXP quest reward, awarded once. Revisit your experiments and measurements below.</p></>}
      {clueError && <p role="alert">{clueError} <button type="button" onClick={() => setRetry(retry + 1)}>Retry encounters</button></p>}
      {clue && <FieldClue key={clue.milestoneId} questId={quest.id} clue={clue} />}
    </section>
    <Card><h2>Quest knowledge</h2><ul className="quest-detail__links">{quest.knowledgeLinks.map((link) => <li key={link}><a href={atlasHash(link)}>{link}</a></li>)}</ul></Card>
    <section><div className="expedition-brief__controls"><h2>Milestones</h2>{active && <Button variant="secondary" onClick={() => setFocused(!focused)}>{focused ? "Show all stages" : "Focus current stage"}</Button>}</div><ol className="quest-detail__checklist">{quest.milestones.filter((item) => !active || !focused || item.id === active.id).map((milestone) => <MilestoneChecklist current={milestone.id === active?.id} blocked={Boolean(quest.ordered && quest.milestones.some((item) => item.required && item.order < milestone.order && progress.milestones[item.id]?.status !== "complete"))} key={milestone.id} milestone={milestone} onChange={onMilestoneChange} progress={progress.milestones[milestone.id] ?? { status: "not-started", updatedAt: "" }} suggestions={evidenceByMilestone[milestone.id] ?? []} />)}</ol></section>
    <Card><h2>Completion</h2><p>{allRequiredComplete ? "Required milestones and evidence are complete." : "Complete every required milestone and attach its required evidence."}</p><ul>{quest.completionCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></Card>
  </article>;
}
