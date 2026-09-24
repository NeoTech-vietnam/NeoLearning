import { useEffect, useState } from "react";
import type { AllProgressResponse, Quest, QuestListResponse, QuestMilestoneStatus, QuestProgress, SetMilestoneProgressResponse } from "../shared";
import { ErrorState, Skeleton } from "../ui";
import { QuestBoard } from "./QuestBoard";
import { QuestDetail } from "./QuestDetail";

type QuestPageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; quests: Quest[]; progressByQuest: Record<string, QuestProgress | undefined> };

export function QuestPage() {
  const [state, setState] = useState<QuestPageState>({ status: "loading" });
  const [selected, setSelected] = useState<Quest>();
  const [saveError, setSaveError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/quests", { signal: controller.signal }),
      fetch("/api/progress", { signal: controller.signal })
    ]).then(async ([questResponse, progressResponse]) => {
      if (!questResponse.ok || !progressResponse.ok) throw new Error("Quest services are unavailable.");
      const questPayload = await questResponse.json() as QuestListResponse;
      const progressPayload = await progressResponse.json() as AllProgressResponse;
      setState({ status: "ready", quests: questPayload.quests, progressByQuest: progressPayload.progress.quests });
    }).catch((cause: unknown) => {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setState({ status: "error", message: cause instanceof Error ? cause.message : "Quests could not be loaded." });
      }
    });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") return <main className="quest-page"><Skeleton lines={6} /></main>;
  if (state.status === "error") return <main className="quest-page"><ErrorState title="Quest board unavailable">{state.message}</ErrorState></main>;

  const updateMilestone = async (quest: Quest, milestoneId: string, status: QuestMilestoneStatus, evidence?: string) => {
    setSaveError(undefined);
    try {
      const response = await fetch(`/api/progress/${encodeURIComponent(quest.id)}/milestones/${encodeURIComponent(milestoneId)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, ...(evidence?.trim() ? { evidence: evidence.trim() } : {}) })
      });
      if (!response.ok) throw new Error(`Progress update failed with ${response.status}.`);
      const payload = await response.json() as SetMilestoneProgressResponse;
      setState((current) => current.status === "ready" ? {
        ...current,
        progressByQuest: { ...current.progressByQuest, [quest.id]: payload.progress }
      } : current);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Progress could not be saved.");
    }
  };

  return <main className="quest-page">
    {selected ? <>
      {saveError && <ErrorState title="Progress not saved">{saveError} Try again.</ErrorState>}
      <QuestDetail
        onBack={() => { setSaveError(undefined); setSelected(undefined); }}
        onMilestoneChange={(milestoneId, status, evidence) => updateMilestone(selected, milestoneId, status, evidence)}
        progress={state.progressByQuest[selected.id] ?? { milestones: {} }}
        quest={selected}
      />
    </> : <>
      <header className="quest-page__heading"><p className="eyebrow">Learning by making</p><h1>Quest Board</h1><p>Start with a real problem, travel through the knowledge map, and leave evidence that the project works.</p></header>
      <QuestBoard onSelectQuest={(quest) => { setSaveError(undefined); setSelected(quest); }} progressByQuest={state.progressByQuest} quests={state.quests} />
    </>}
  </main>;
}
