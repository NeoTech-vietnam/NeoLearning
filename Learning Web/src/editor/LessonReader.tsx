import { useEffect, useMemo, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  ActivityProgress, AttemptResponse, LessonHeading, LessonProgress, PublicLessonPlan
} from "../shared/learning";
import { lessonHeadings } from "../shared/learning";
import { ActivityCard } from "./ActivityCard";
import { markdownBody } from "./MarkdownPreview";
import "./learning.css";

type Block = { kind: "text"; source: string } | { kind: "section"; source: string; heading: LessonHeading };

function lessonBlocks(source: string, headings: LessonHeading[]): Block[] {
  const lines = markdownBody(source).split(/\r?\n/);
  if (headings.length === 0) return [{ kind: "text", source: lines.join("\n") }];
  const blocks: Block[] = [];
  const intro = lines.slice(0, headings[0].line - 1).join("\n");
  if (intro.trim()) blocks.push({ kind: "text", source: intro });
  headings.forEach((heading, index) => {
    const end = headings[index + 1]?.line ? headings[index + 1].line - 1 : lines.length;
    blocks.push({ kind: "section", source: lines.slice(heading.line - 1, end).join("\n"), heading });
  });
  return blocks;
}

export function LessonReader({ source, lesson, progress, onAttempt, onPosition }: {
  source: string;
  lesson: PublicLessonPlan;
  progress: LessonProgress;
  onAttempt: (activityId: string, response: unknown) => Promise<AttemptResponse>;
  onPosition: (heading?: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const headings = useMemo(() => lessonHeadings(source), [source]);
  const blocks = useMemo(() => lessonBlocks(source, headings), [source, headings]);
  const headingSlugs = new Set(headings.map((heading) => heading.slug));
  const unplaced = lesson.activities.filter((activity) => !headingSlugs.has(activity.afterHeading));
  const completed = lesson.activities.filter((activity) => Boolean(progress.activities[activity.id]?.completedAt)).length;
  const due = lesson.activities.filter((activity) => {
    const item: ActivityProgress | undefined = progress.activities[activity.id];
    return item && new Date(item.reviewAt).getTime() <= Date.now();
  });
  const resume = headings.find((heading) => heading.slug === progress.lastHeading);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });

  useEffect(() => { onPosition(); }, [lesson.lessonPath]);

  useEffect(() => {
    if (!root.current || !("IntersectionObserver" in window)) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      const slug = visible?.target.getAttribute("data-heading-slug");
      if (!slug) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onPosition(slug), 700);
    }, { rootMargin: "-88px 0px -65% 0px" });
    root.current.querySelectorAll("[data-heading-slug]").forEach((element) => observer.observe(element));
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, [source, lesson.lessonPath]);

  return <div className="lesson-reader" ref={root}>
    <aside aria-label="Lesson journey" className="lesson-reader__guide">
      <p className="eyebrow">Learning expedition</p>
      <h2>{lesson.title}</h2>
      <p>{completed}/{lesson.activities.length} activities practiced</p>
      <progress aria-label="Activities practiced" max={lesson.activities.length} value={completed} />
      {resume && <button onClick={() => scrollTo(`lesson-heading-${resume.line}`)} type="button">Resume: {resume.text}</button>}
      {due.length > 0 && <button onClick={() => scrollTo(`activity-${due[0].id}`)} type="button">{due.length} review{due.length === 1 ? "" : "s"} due ↓</button>}
      <details>
        <summary>Lesson sections</summary>
        <nav aria-label="Lesson sections"><ol>{headings.filter((heading) => heading.depth <= 3).map((heading) =>
          <li key={heading.line}><button className="lesson-reader__toc-link" onClick={() => { onPosition(heading.slug); scrollTo(`lesson-heading-${heading.line}`); }} type="button">{heading.text}</button></li>)}</ol></nav>
      </details>
      <small>Your notes and attempts stay on this device.</small>
    </aside>
    <article className="markdown-preview lesson-reader__body">
      {blocks.map((block, index) => block.kind === "text"
        ? <Markdown key={`text-${index}`} remarkPlugins={[remarkGfm]} skipHtml>{block.source}</Markdown>
        : <div className="lesson-reader__section" data-heading-slug={block.heading.slug} id={`lesson-heading-${block.heading.line}`} key={`heading-${block.heading.line}`}>
          <Markdown remarkPlugins={[remarkGfm]} skipHtml>{block.source}</Markdown>
          {lesson.activities.filter((activity) => activity.afterHeading === block.heading.slug).map((activity) =>
            <ActivityCard activity={activity} key={activity.id} onAttempt={onAttempt} progress={progress.activities[activity.id]} questEvidence={lesson.questEvidence} />)}
        </div>)}
      {unplaced.length > 0 && <section className="lesson-reader__unplaced" aria-label="Unplaced activities">
        <h2>Activities needing a location</h2>
        <p>The lesson heading changed, so these activities are shown here until their anchor is updated.</p>
        {unplaced.map((activity) => <ActivityCard activity={activity} key={activity.id} onAttempt={onAttempt} progress={progress.activities[activity.id]} questEvidence={lesson.questEvidence} />)}
      </section>}
    </article>
  </div>;
}
