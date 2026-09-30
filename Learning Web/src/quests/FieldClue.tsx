import { useState } from "react";
import type { ExpeditionClue, ClueResult } from "../shared/expedition";

export function FieldClue({ questId, clue }: { questId: string; clue: ExpeditionClue }) {
  const [choice, setChoice] = useState(""); const [result, setResult] = useState<ClueResult>();
  const [pending, setPending] = useState(false); const [error, setError] = useState<string>();
  const submit = async () => {
    setPending(true); setError(undefined);
    try {
      const response = await fetch(`/api/explorer/clues/${encodeURIComponent(questId)}/${encodeURIComponent(clue.milestoneId)}`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ response: choice })
      });
      if (!response.ok) throw new Error("The clue could not be checked. Please retry.");
      const feedback = await response.json() as ClueResult; setResult(feedback);
      if (feedback.correct) window.dispatchEvent(new Event("neolearning:progress"));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Clue unavailable."); }
    finally { setPending(false); }
  };
  return <section className="field-clue" aria-labelledby={`clue-${clue.milestoneId}`}>
    <small>Field encounter · +20 EXP once</small><h3 id={`clue-${clue.milestoneId}`}>{clue.title}</h3><p>{clue.prompt}</p>
    <fieldset><legend>Predict before you test</legend>{clue.options.map((option) => <label key={option.id}><input type="radio" name={`clue-${clue.milestoneId}`} checked={choice === option.id} onChange={() => setChoice(option.id)} /><span>{option.label}</span></label>)}</fieldset>
    <button disabled={!choice || pending} onClick={() => void submit()} type="button">{pending ? "Checking…" : "Check prediction"}</button>
    {error && <p role="alert">{error}</p>}
    {result && <div role="status" data-correct={result.correct}><strong>{result.feedback}</strong><p>{result.explanation}</p><small>This is a knowledge check, not proof of working hardware.</small></div>}
  </section>;
}
