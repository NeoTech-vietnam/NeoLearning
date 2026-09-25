import { useState } from "react";
import type { PublicActivity } from "../shared/learning";

type PwmActivity = Extract<PublicActivity, { kind: "pwm-lab" }>;

export function PwmLab({ activity, pending, revealed, onCheck }: {
  activity: PwmActivity;
  pending: boolean;
  revealed: boolean;
  onCheck: (response: { frequencyHz: number; dutyPercent: number; predictedHighUs: number }) => void;
}) {
  const [frequencyHz, setFrequencyHz] = useState(800);
  const [dutyPercent, setDutyPercent] = useState(50);
  const [prediction, setPrediction] = useState("");
  const period = 1_000_000 / frequencyHz;
  const highWidth = 240 * dutyPercent / 100;
  const wave = `M 28 128 V 48 H ${28 + highWidth} V 128 H 268 V 48 H ${268 + highWidth} V 128 H 508`;
  const predicted = Number(prediction);

  return <div className="pwm-lab">
    <div className="pwm-lab__controls">
      <label>Frequency <strong>{frequencyHz.toLocaleString()} Hz</strong>
        <input max="5000" min="100" onChange={(event) => setFrequencyHz(Number(event.target.value))} step="100" type="range" value={frequencyHz} />
      </label>
      <label>Duty cycle <strong>{dutyPercent}%</strong>
        <input max="95" min="5" onChange={(event) => setDutyPercent(Number(event.target.value))} step="5" type="range" value={dutyPercent} />
      </label>
    </div>
    <div aria-label={`PWM waveform at ${frequencyHz} hertz and ${dutyPercent} percent duty`} className="pwm-lab__scope" role="img">
      <svg aria-hidden="true" viewBox="0 0 540 165">
        <path className="pwm-lab__grid" d="M 28 48 H 508 M 28 128 H 508 M 28 18 V 145 M 268 18 V 145 M 508 18 V 145" />
        <path className="pwm-lab__wave" d={wave} />
        <line className="pwm-lab__scan" x1="28" x2="28" y1="20" y2="145" />
        <text x="32" y="36">HIGH</text><text x="32" y="153">LOW</text>
      </svg>
    </div>
    <p className="pwm-lab__formula">Period = 1,000,000 ÷ frequency = {period.toFixed(1)} µs. Predict the HIGH interval before checking.</p>
    <label className="pwm-lab__prediction">Your predicted HIGH time (µs)
      <input inputMode="decimal" min="0" onChange={(event) => setPrediction(event.target.value)} step="any" type="number" value={prediction} />
    </label>
    {revealed && <p>For these settings: HIGH ≈ {(period * dutyPercent / 100).toFixed(1)} µs.</p>}
    <button disabled={pending || !prediction.trim() || !Number.isFinite(predicted) || predicted < 0} onClick={() => onCheck({ frequencyHz, dutyPercent, predictedHighUs: predicted })} type="button">
      Check waveform
    </button>
    <small>Simulation of timing only — not an electrical or hardware measurement.</small>
  </div>;
}
