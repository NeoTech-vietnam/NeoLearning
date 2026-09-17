import { useEffect, useState } from "react";
import type { HealthResponse } from "../shared";
import { AtlasPage } from "../atlas/AtlasPage";
import { WorldMapPreview } from "../atlas/WorldMapPreview";
import { DesignSystemPage } from "../dev/design-system/DesignSystemPage";
import { QuestPage } from "../quests";
import { parseHashRoute, type AppRoute } from "./routes";
import "./app.css";

export function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute(window.location.hash));
  useEffect(() => {
    const updateRoute = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const isDevelopmentServer = window.location.hostname === "localhost" && window.location.port === "5173";
  if (route.name === "design-system" && isDevelopmentServer) return <DesignSystemPage />;
  if (route.name === "map-preview") return <WorldMapPreview />;

  return <div className="application">
    <header className="application__bar">
      <a className="application__brand" href="#/">NeoLearning</a>
      <nav aria-label="Primary navigation">
        <a aria-current={route.name === "atlas" ? "page" : undefined} href="#/atlas">Atlas</a>
        <a aria-current={route.name === "quests" ? "page" : undefined} href="#/quests">Quests</a>
      </nav>
    </header>
    {route.name === "atlas" ? <AtlasPage selectedPath={route.path} /> : route.name === "quests" ? <QuestPage /> : <HomePage />}
  </div>;
}

type HealthState = "checking" | "ready" | "unavailable";

function HomePage() {
  const [health, setHealth] = useState<HealthState>("checking");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then(async (response) => ({ ok: response.ok, payload: await response.json() as HealthResponse }))
      .then(({ ok, payload }) => setHealth(ok && payload.status === "ok" ? "ready" : "unavailable"))
      .catch((cause: unknown) => {
        if (!(cause instanceof DOMException && cause.name === "AbortError")) setHealth("unavailable");
      });
    return () => controller.abort();
  }, []);

  return <main className="home-page">
    <section className="home-page__hero">
      <p className="eyebrow">A world of embedded engineering</p>
      <h1>Learn the land.<br />Build the proof.</h1>
      <p>Explore the complete curriculum as a map, then take project quests that connect theory, architecture, implementation, and testing.</p>
      <div className="home-page__actions"><a href="#/atlas">Enter the Atlas</a><a href="#/quests">Choose a Quest</a></div>
      <p aria-live="polite" className={`health health--${health}`}>Local API: {health}</p>
    </section>
  </main>;
}
