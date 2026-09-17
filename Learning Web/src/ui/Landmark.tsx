import type { ButtonHTMLAttributes } from "react";

export type LandmarkState = "default" | "selected" | "visited" | "active-quest" | "completed" | "locked" | "unavailable";

export function Landmark({ state = "default", icon, label, meta, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { state?: LandmarkState; icon: string; label: string; meta: string }) {
  const disabled = props.disabled || state === "locked" || state === "unavailable";
  return <button aria-label={`${label}. ${meta}. ${state.replace("-", " ")}`} className="map-landmark" data-state={state} disabled={disabled} type={props.type ?? "button"} {...props}>
    <span aria-hidden="true" className="map-landmark__crest">{icon}</span><span className="map-landmark__label">{label}</span><span className="map-landmark__meta">{meta}</span>
  </button>;
}
