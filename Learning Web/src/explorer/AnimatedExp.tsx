import { useEffect, useRef, useState } from "react";
export function AnimatedExp({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  useEffect(() => {
    const start = previous.current; previous.current = value;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || start === value) { setDisplay(value); return; }
    const started = performance.now(); let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 450);
      setDisplay(Math.round(start + (value - start) * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span aria-label={String(value)}><span aria-hidden="true">{display}</span></span>;
}
