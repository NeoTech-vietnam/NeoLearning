import { useState } from "react";
import type { ActivityProgress, AttemptResponse, PublicActivity, QuestEvidenceLink } from "../shared/learning";
import { PwmLab } from "./PwmLab";

export function ActivityCard({ activity, progress, questEvidence, onAttempt }: {
  activity: PublicActivity;
  progress?: ActivityProgress;
  questEvidence: QuestEvidenceLink[];
  onAttempt: (activityId: string, response: unknown) => Promise<AttemptResponse>;
}) {
  const [choice, setChoice] = useState("");
  const [order, setOrder] = useState<string[]>(activity.kind === "order" ? activity.items.map((item) => item.id) : []);
  const [note, setNote] = useState(progress?.note ?? "");
  const [result, setResult] = useState<AttemptResponse>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const due = progress && new Date(progress.reviewAt).getTime() <= Date.now();

  const submit = async (response: unknown) => {
    setPending(true);
    setError(undefined);
    try { setResult(await onAttempt(activity.id, response)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Activity could not be saved."); }
    finally { setPending(false); }
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    setOrder(next);
  };

  return <section aria-labelledby={`activity-title-${activity.id}`} className="activity-card" id={`activity-${activity.id}`}>
    <div className="activity-card__top">
      <span className="activity-card__eyebrow">{activity.kind === "pwm-lab" ? "Interactive lab" : "Checkpoint"}</span>
      {progress && <span className={`activity-card__status${due ? " activity-card__status--due" : ""}`}>
        {due ? "Review due" : progress.completedAt ? "Practiced" : "Try again"}
      </span>}
    </div>
    <h3 id={`activity-title-${activity.id}`}>{activity.title}</h3>
    <p>{activity.prompt}</p>

    {activity.kind === "choice" && <fieldset className="activity-card__choices">
      <legend>Choose one answer</legend>
      {activity.options.map((option) => <label key={option.id}>
        <input checked={choice === option.id} name={activity.id} onChange={() => setChoice(option.id)} type="radio" />
        <span>{option.label}</span>
      </label>)}
      <button disabled={!choice || pending} onClick={() => void submit(choice)} type="button">Check answer</button>
    </fieldset>}

    {activity.kind === "order" && <div className="activity-card__order">
      <p>Move each step up or down, then check your sequence.</p>
      <ol>{order.map((id, index) => <li key={id}>
        <span>{activity.items.find((item) => item.id === id)?.label}</span>
        <div><button aria-label={`Move step ${index + 1} up`} disabled={index === 0 || pending} onClick={() => move(index, -1)} type="button">↑</button>
          <button aria-label={`Move step ${index + 1} down`} disabled={index === order.length - 1 || pending} onClick={() => move(index, 1)} type="button">↓</button></div>
      </li>)}</ol>
      <button disabled={pending} onClick={() => void submit(order)} type="button">Check sequence</button>
    </div>}

    {activity.kind === "self-check" && <div className="activity-card__reflection">
      <label>Explain it in your own words
        <textarea maxLength={2000} minLength={10} onChange={(event) => setNote(event.target.value)} rows={4} value={note} />
      </label>
      <div className="activity-card__actions">
        <button disabled={note.trim().length < 10 || pending} onClick={() => void submit({ note, confident: false })} type="button">Need another look</button>
        <button disabled={note.trim().length < 10 || pending} onClick={() => void submit({ note, confident: true })} type="button">I can explain it</button>
      </div>
      <small>Self-rating is not an automatically graded answer.</small>
    </div>}

    {activity.kind === "pwm-lab" && <PwmLab activity={activity} onCheck={(response) => void submit(response)} pending={pending} revealed={Boolean(result)} />}

    {error && <p aria-live="assertive" className="activity-card__error">{error}</p>}
    {result && <div aria-live="polite" className={`activity-card__feedback${result.correct ? " activity-card__feedback--correct" : ""}`}>
      <strong>{result.feedback}</strong><p>{result.explanation}</p>
      {result.correct && questEvidence.some((link) => link.activityId === activity.id) && <a href="#/quests">Use this simulation result in its Quest →</a>}
    </div>}
  </section>;
}
