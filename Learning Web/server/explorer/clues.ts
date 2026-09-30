import type { ExpeditionClue, ClueResult } from "../../src/shared/expedition.js";
interface Clue extends ExpeditionClue { answer: string; explanation: string }
function clue(milestoneId: string, title: string, prompt: string, good: string, bad: string, explanation: string): Clue {
  return { milestoneId, title, prompt, options: [{ id: "a", label: good }, { id: "b", label: bad }], answer: "a", explanation };
}
const clues: Clue[] = [
  clue("choose-electrical-contract", "The silent sensor", "A sensor output can reach 5 V, but the MCU input is rated only for 3.3 V. What should you do before connecting it?", "Check voltage ratings and design compatible level shifting", "Connect directly and compensate in firmware", "Firmware cannot protect a pin from overvoltage. Check the electrical contract before powering the circuit."),
  clue("measure-the-bench", "A dangerous measurement", "How should a multimeter be connected to measure a supply voltage?", "Voltage mode, in parallel across the supply and ground", "Current mode, directly across the supply", "Voltage is measured in parallel. A current-mode connection across a supply can short it; verify probe sockets and mode first."),
  clue("build-the-prototype", "Before first power", "Your prototype has never been powered. Which check comes first?", "Inspect polarity, supply connections and possible shorts with power off", "Power it immediately and look for smoke", "An unpowered inspection can reveal reversed polarity and shorts. Use an appropriate current limit during initial power-up."),
  clue("characterize-the-sensor", "A suspicious zero", "A disconnected sensor returns zero. Should the system label that as a valid measurement?", "Separate sensor validity/error state from the numeric value", "Treat every zero as a normal reading", "A number alone does not establish validity. Record units, expected range and sensor/communication status."),
  clue("schedule-sampling", "The stalled sampler", "A network request can block for seconds. How do you keep periodic sampling responsive?", "Separate sampling from transmission using scheduling and a bounded queue", "Wait for transmission to finish before taking each sample", "Separate responsibilities so network latency does not dictate sampling. Define a policy for a full queue."),
  clue("verify-sampling", "Proof beyond happy paths", "Which test set gives useful evidence about the sampler?", "Normal values, out-of-range values and communication failures", "Only the first successful reading", "A repeatable test should cover both nominal behavior and failures, with expected results and logs."),
  clue("define-the-local-bus", "The missing acknowledgement", "An I2C read receives a NACK. What should firmware do?", "Handle it as a communication outcome with bounded retry/error reporting", "Retry forever without yielding", "Bound retries and report failure; an unbounded retry can starve the rest of the system. Check addressing and wiring too."),
  clue("keep-wireless-connected", "The lost connection", "Wi-Fi disappears while your station is sampling. What is a robust response?", "Keep sampling with bounded buffering and reconnect backoff", "Pause all sampling until Wi-Fi returns", "Separate acquisition from connection management. Choose a bounded buffering or drop policy and avoid reconnect busy loops."),
  clue("deliver-the-reading", "The journey of one reading", "What proves that one reading reached its intended destination?", "Trace a timestamp/sequence ID from acquisition through the receiver and check it", "A successful Wi-Fi association alone", "A network connection is not end-to-end delivery evidence. Correlate the acquired reading with the receiver output and document the test.")
];
export function expeditionClues(questId: string): ExpeditionClue[] {
  return questId === "environmental-watchtower" ? clues.map(({ answer: _answer, explanation: _explanation, ...publicClue }, index) => ({ ...publicClue, options: index % 2 ? [...publicClue.options].reverse() : publicClue.options })) : [];
}
export function gradeClue(questId: string, milestoneId: string, response: unknown): ClueResult | undefined {
  const item = questId === "environmental-watchtower" ? clues.find((entry) => entry.milestoneId === milestoneId) : undefined;
  if (!item) return undefined;
  if (typeof response !== "string" || !item.options.some((option) => option.id === response)) throw new Error("Choose one of the offered answers.");
  const correct = response === item.answer;
  return { correct, feedback: correct ? "Clue understood — now prove it in your project." : "Not yet — follow the clue and try again.", explanation: item.explanation };
}
