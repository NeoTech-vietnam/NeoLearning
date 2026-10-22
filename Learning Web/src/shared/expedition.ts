export interface ExpeditionClue {
  milestoneId: string; title: string; prompt: string;
  options: { id: string; label: string }[];
}
export interface ClueResult { correct: boolean; feedback: string; explanation: string }
