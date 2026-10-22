import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, useEffect, useId, useRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`ui-button ui-button--${variant} ${className}`.trim()} type={props.type ?? "button"} {...props} />;
}

export function IconButton({ label, className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button aria-label={label} className={`ui-icon-button ${className}`.trim()} type={props.type ?? "button"} {...props}>{children}</button>;
}

export function Card({ interactive = false, className = "", ...props }: HTMLAttributes<HTMLElement> & { interactive?: boolean }) {
  return <section className={`ui-card ${interactive ? "ui-card--interactive" : ""} ${className}`.trim()} {...props} />;
}

export function Badge({ tone = "default", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "accent" | "muted" }) {
  return <span className={`ui-badge ${tone === "default" ? "" : `ui-badge--${tone}`} ${className}`.trim()} {...props} />;
}

export function Progress({ value, label }: { value: number; label: string }) {
  const boundedValue = Math.max(0, Math.min(100, value));
  return <div className="ui-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={boundedValue}>
    <div className="ui-progress__label"><span>{label}</span><span>{boundedValue}%</span></div>
    <div className="ui-progress__track"><div className="ui-progress__bar" style={{ width: `${boundedValue}%` }} /></div>
  </div>;
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return <span className="ui-tooltip"><span aria-describedby={id}>{children}</span><span className="ui-tooltip__content" id={id} role="tooltip">{label}</span></span>;
}

type OverlayProps = { open: boolean; title: string; children: ReactNode; onClose: () => void; mode?: "modal" | "drawer" };
export function Modal({ open, title, children, onClose, mode = "modal" }: OverlayProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);
  if (!open) return null;
  return <div className={`ui-overlay ui-overlay--${mode}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section aria-modal="true" aria-labelledby={titleId} className="ui-dialog" ref={dialogRef} role="dialog">
      <div className="ui-dialog__head"><h2 id={titleId}>{title}</h2><IconButton autoFocus label="Close dialog" onClick={onClose}>×</IconButton></div>{children}
    </section>
  </div>;
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return <div aria-busy="true" aria-label="Loading content">{Array.from({ length: lines }, (_, index) => <div className="ui-skeleton" key={index} style={{ width: `${100 - index * 12}%`, marginTop: index === 0 ? 0 : "var(--space-2)" }} />)}</div>;
}

function State({ title, children, kind = "empty" }: { title: string; children: ReactNode; kind?: "empty" | "error" }) {
  return <section className={`ui-state ${kind === "error" ? "ui-state--error" : ""}`} role={kind === "error" ? "alert" : "status"}><h2>{title}</h2><p>{children}</p></section>;
}
export function EmptyState({ title, children }: { title: string; children: ReactNode }) { return <State title={title}>{children}</State>; }
export function ErrorState({ title, children }: { title: string; children: ReactNode }) { return <State kind="error" title={title}>{children}</State>; }
