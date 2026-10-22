import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { ExplorerProfile } from "../shared/explorer";
import "./explorer.css";
import { AnimatedExp } from "./AnimatedExp";

interface ExplorerContextValue {
  profile?: ExplorerProfile; error?: string; busy: boolean; announcement?: string;
  refresh: (checkIn?: boolean) => Promise<void>;
}
const Context = createContext<ExplorerContextValue | undefined>(undefined);
export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ExplorerProfile>();
  const [error, setError] = useState<string>(); const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const previous = useRef<ExplorerProfile>();
  const pending = useRef<Promise<void>>(Promise.resolve());
  const refresh = useCallback((checkIn = false) => {
    const operation = pending.current.then(async () => {
      setBusy(true); setError(undefined);
      try {
        const response = await fetch(`/api/explorer/${checkIn ? "check-in" : "sync"}`, { method: "POST" });
        if (!response.ok) throw new Error("Explorer progress could not be loaded. Your existing data has not been reset.");
        const next = await response.json() as ExplorerProfile;
        const old = previous.current;
        if (old && next.totalExp > old.totalExp) {
          setAnnouncement(`+${next.totalExp - old.totalExp} EXP${next.level > old.level ? ` · Level ${next.level} reached!` : " · Progress earned"}`);
        }
        previous.current = next; setProfile(next);
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Explorer service unavailable."); }
      finally { setBusy(false); }
    });
    pending.current = operation;
    return operation;
  }, []);
  useEffect(() => {
    const update = () => { void refresh(); };
    update(); window.addEventListener("neolearning:progress", update);
    const onFocus = () => { if (document.visibilityState === "visible") update(); };
    document.addEventListener("visibilitychange", onFocus);
    return () => { window.removeEventListener("neolearning:progress", update); document.removeEventListener("visibilitychange", onFocus); };
  }, [refresh]);
  useEffect(() => {
    if (!announcement) return;
    const timeout = setTimeout(() => setAnnouncement(undefined), 6000);
    return () => clearTimeout(timeout);
  }, [announcement]);
  return <Context.Provider value={{ profile, error, busy, refresh, announcement }}>{children}
    <div className="explorer-toast" role="status" aria-live="polite">{announcement && <span>{announcement}</span>}</div>
  </Context.Provider>;
}
function useExplorer() { const value = useContext(Context); if (!value) throw new Error("ExplorerProvider missing"); return value; }
export function ExplorerBadge() {
  const { profile, error } = useExplorer();
  return <a className="explorer-badge" href="#/" aria-label="Explorer profile">{profile ? <>Lv {profile.level} · <AnimatedExp value={profile.totalExp} /> EXP</> : error ? "EXP unavailable" : "Loading EXP…"}</a>;
}
export function ExplorerPanel() {
  const { profile, error, busy, refresh } = useExplorer();
  const [showHistory, setShowHistory] = useState(false);
  return <section className="explorer-panel" aria-labelledby="explorer-heading">
    <header><div><p className="eyebrow">Your expedition log</p><h2 id="explorer-heading">Explorer camp</h2></div>
      <button disabled={busy || !profile || profile.checkedIn} onClick={() => void refresh(true)} type="button">{profile?.checkedIn ? "Checked in today ✓" : "Daily check-in · +5 EXP"}</button>
    </header>
    {error && <p role="alert">{error} <button disabled={busy} onClick={() => void refresh()} type="button">Retry</button></p>}
    {!profile ? <p aria-live="polite">{error ? "Your progress remains saved on the server." : "Preparing your camp…"}</p> : <>
      <div className="explorer-panel__rank"><span className="explorer-panel__level">{profile.level}</span><div><strong>{profile.title}</strong><p>{profile.totalExp} EXP earned · {profile.levelExp}/{profile.nextLevelExp} to next level</p><progress aria-label="Experience to next level" value={profile.levelExp} max={profile.nextLevelExp} /></div></div>
      <div className="explorer-panel__streaks"><span><strong>{profile.checkInStreak}</strong> day check-in streak</span><span><strong>{profile.learningStreak}</strong> day learning streak</span></div>
      <p className="explorer-panel__hint">EXP records participation, not mastery. Explore every land freely; missing a day never takes EXP away.</p>
      <div className="explorer-calendar" aria-label="Last 14 days of activity">{Array.from({ length: 14 }, (_, index) => {
        const day = new Date(Date.parse(`${profile.today}T12:00:00Z`) - (13 - index) * 86_400_000).toISOString().slice(0, 10);
        const visited = profile.checkIns.includes(day); const learned = profile.learningDays.includes(day);
        return <span key={day} data-check-in={visited} data-learned={learned} data-today={day === profile.today} title={`${day}: ${visited ? "checked in" : "no check-in"}, ${learned ? "learning activity" : "no learning activity"}`} aria-label={`${day}: ${visited ? "checked in" : "no check-in"}, ${learned ? "learning activity" : "no learning activity"}`}><small>{day.slice(5)}</small><b aria-hidden="true">{learned ? "✦" : visited ? "✓" : "·"}</b></span>;
      })}</div>
      <small>✓ check-in · ✦ learning · Calendar: {profile.timeZone}</small>
      <button className="explorer-panel__history-toggle" aria-expanded={showHistory} onClick={() => setShowHistory(!showHistory)} type="button">{showHistory ? "Hide" : "Show"} reward history ({profile.rewards.length})</button>
      {showHistory && <div className="explorer-panel__history"><ul>{profile.rewards.map((reward) => <li key={reward.id}><div>{reward.label}<small>{Date.parse(reward.earnedAt) === 0 ? "Previous achievement" : new Date(reward.earnedAt).toLocaleDateString(undefined, { timeZone: profile.timeZone })}</small></div><strong>+{reward.exp} EXP</strong></li>)}</ul>{!profile.rewards.length && <p>Your first adventure starts today.</p>}</div>}
    </>}
  </section>;
}
