import { Dirent, promises as fs } from "node:fs";
import path from "node:path";
import type { Quest, QuestMilestone } from "../../src/shared/contracts.js";

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class QuestValidationError extends Error {}

interface RawQuest {
  id?: unknown;
  title?: unknown;
  level?: unknown;
  problem?: unknown;
  destination?: unknown;
  regions?: unknown;
  knowledgeLinks?: unknown;
  milestones?: unknown;
  completionCriteria?: unknown;
}

function scalar(value: string): string | boolean | number {
  const trimmed = value.trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  const number = Number(trimmed);
  return trimmed && Number.isFinite(number) ? number : trimmed;
}

function indentation(line: string): number {
  return line.length - line.trimStart().length;
}

/**
 * Small, strict subset of YAML deliberately matching the documented quest schema:
 * root scalars plus string lists and lists of scalar maps. This keeps quest files
 * dependency-free while rejecting structure that would otherwise be ambiguous.
 */
export function parseQuestFrontmatter(markdown: string): RawQuest {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) throw new QuestValidationError("Quest Markdown must begin with closed YAML frontmatter.");
  const lines = match[1].split(/\r?\n/);
  const result: Record<string, unknown> = {};
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) { index++; continue; }
    if (indentation(line) !== 0) throw new QuestValidationError(`Unexpected indentation in frontmatter: ${line}`);
    const property = /^([A-Za-z][A-Za-z0-9]*):(?:\s+(.*))?$/.exec(line);
    if (!property) throw new QuestValidationError(`Cannot parse frontmatter line: ${line}`);
    const [, key, inline] = property;
    if (inline?.trim()) { result[key] = scalar(inline); index++; continue; }
    index++;
    const entries: unknown[] = [];
    while (index < lines.length && (lines[index].trim() === "" || indentation(lines[index]) > 0)) {
      const current = lines[index];
      if (!current.trim()) { index++; continue; }
      if (indentation(current) !== 2) throw new QuestValidationError(`Expected two-space indentation: ${current}`);
      const listEntry = /^\s*-\s*(.*)$/.exec(current);
      if (!listEntry) throw new QuestValidationError(`Expected list item: ${current}`);
      const first = listEntry[1];
      if (!first) throw new QuestValidationError(`List item cannot be empty: ${current}`);
      const field = key === "milestones" ? /^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/.exec(first) : null;
      if (!field) { entries.push(scalar(first)); index++; continue; }
      const object: Record<string, unknown> = { [field[1]]: scalar(field[2]) };
      index++;
      while (index < lines.length && lines[index].trim() && indentation(lines[index]) > 2) {
        if (indentation(lines[index]) !== 4) throw new QuestValidationError(`Expected four-space map indentation: ${lines[index]}`);
        const nested = /^\s*([A-Za-z][A-Za-z0-9]*):\s*(.*)$/.exec(lines[index]);
        if (!nested) throw new QuestValidationError(`Cannot parse milestone field: ${lines[index]}`);
        if (nested[2]) {
          object[nested[1]] = scalar(nested[2]);
          index++;
          continue;
        }
        index++;
        const nestedEntries: unknown[] = [];
        while (index < lines.length && lines[index].trim() && indentation(lines[index]) > 4) {
          if (indentation(lines[index]) !== 6) throw new QuestValidationError(`Expected six-space nested list indentation: ${lines[index]}`);
          const nestedEntry = /^\s*-\s*(.+)$/.exec(lines[index]);
          if (!nestedEntry) throw new QuestValidationError(`Expected nested list item: ${lines[index]}`);
          nestedEntries.push(scalar(nestedEntry[1]));
          index++;
        }
        object[nested[1]] = nestedEntries;
      }
      entries.push(object);
    }
    result[key] = entries;
  }
  return result;
}

function strings(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new QuestValidationError(`${field} must be a non-empty list of strings.`);
  }
  return value.map((item) => (item as string).trim());
}

function text(value: unknown, field: string, required = true): string | undefined {
  if (value === undefined && !required) return undefined;
  if (typeof value !== "string" || !value.trim()) throw new QuestValidationError(`${field} must be a non-empty string.`);
  return value.trim();
}

function milestone(value: unknown): QuestMilestone {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new QuestValidationError("Each milestone must be a map.");
  const source = value as Record<string, unknown>;
  const id = text(source.id, "milestone id")!;
  if (!ID_PATTERN.test(id)) throw new QuestValidationError(`Invalid milestone id: ${id}`);
  if (!Number.isInteger(source.order) || (source.order as number) < 1) throw new QuestValidationError(`Milestone ${id} must have a positive integer order.`);
  if (typeof source.required !== "boolean") throw new QuestValidationError(`Milestone ${id} must declare required as true or false.`);
  if (source.evidenceRequired !== undefined && typeof source.evidenceRequired !== "boolean") throw new QuestValidationError(`Milestone ${id} evidenceRequired must be boolean.`);
  return {
    id,
    title: text(source.title, `Milestone ${id} title`)!,
    order: source.order as number,
    ...(text(source.description, `Milestone ${id} description`, false) ? { description: text(source.description, `Milestone ${id} description`, false) } : {}),
    ...(text(source.challenge, `Milestone ${id} challenge`, false) ? { challenge: text(source.challenge, `Milestone ${id} challenge`, false) } : {}),
    required: source.required,
    ...(source.evidenceRequired === true ? { evidenceRequired: true } : {}),
    knowledgeLinks: strings(source.knowledgeLinks, `Milestone ${id} knowledgeLinks`)
  };
}

async function validateKnowledgeLink(repositoryRoot: string, link: string): Promise<void> {
  if (!link || path.isAbsolute(link) || link.includes("\\") || link.split("/").includes("..")) throw new QuestValidationError(`Knowledge link must be repository-relative: ${link}`);
  const resolved = path.resolve(repositoryRoot, link);
  const rootRealPath = await fs.realpath(repositoryRoot);
  let targetRealPath: string;
  try { targetRealPath = await fs.realpath(resolved); } catch { throw new QuestValidationError(`Knowledge link does not exist: ${link}`); }
  if (path.relative(rootRealPath, targetRealPath).startsWith("..") || path.isAbsolute(path.relative(rootRealPath, targetRealPath))) {
    throw new QuestValidationError(`Knowledge link escapes repository root: ${link}`);
  }
}

export async function validateQuest(raw: RawQuest, repositoryRoot: string): Promise<Quest> {
  const id = text(raw.id, "id")!;
  if (!ID_PATTERN.test(id)) throw new QuestValidationError(`Invalid quest id: ${id}`);
  const milestones = !Array.isArray(raw.milestones) ? (() => { throw new QuestValidationError("milestones must be a list."); })() : raw.milestones.map(milestone);
  const ids = new Set<string>();
  for (const item of milestones) {
    if (ids.has(item.id)) throw new QuestValidationError(`Duplicate milestone id: ${item.id}`);
    ids.add(item.id);
  }
  const orders = milestones.map((item) => item.order).sort((left, right) => left - right);
  if (orders.some((order, index) => order !== index + 1)) throw new QuestValidationError("Milestone order must be unique and consecutive, starting at 1.");
  milestones.sort((left, right) => left.order - right.order);
  const knowledgeLinks = strings(raw.knowledgeLinks, "knowledgeLinks");
  const allLinks = [...knowledgeLinks, ...milestones.flatMap((item) => item.knowledgeLinks)];
  await Promise.all(allLinks.map((link) => validateKnowledgeLink(repositoryRoot, link)));
  return {
    id,
    title: text(raw.title, "title")!,
    ...(text(raw.level, "level", false) ? { level: text(raw.level, "level", false) } : {}),
    ...(text(raw.problem, "problem", false) ? { problem: text(raw.problem, "problem", false) } : {}),
    ...(text(raw.destination, "destination", false) ? { destination: text(raw.destination, "destination", false) } : {}),
    regionIds: strings(raw.regions, "regions"),
    knowledgeLinks,
    milestones,
    completionCriteria: strings(raw.completionCriteria, "completionCriteria")
  };
}

export class QuestCatalog {
  constructor(
    readonly repositoryRoot = process.env.NEOLEARNING_REPOSITORY_ROOT ?? path.resolve(process.cwd(), ".."),
    readonly questDirectory = process.env.NEOLEARNING_QUEST_DIRECTORY ?? path.resolve(process.cwd(), "quests")
  ) {}

  async list(): Promise<Quest[]> {
    let entries: Dirent[];
    try { entries = await fs.readdir(this.questDirectory, { withFileTypes: true }); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    const quests = await Promise.all(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md").sort((a, b) => a.name.localeCompare(b.name)).map(async (entry) => {
      const markdown = await fs.readFile(path.join(this.questDirectory, entry.name), "utf8");
      return validateQuest(parseQuestFrontmatter(markdown), this.repositoryRoot);
    }));
    const ids = new Set<string>();
    for (const quest of quests) {
      if (ids.has(quest.id)) throw new QuestValidationError(`Duplicate quest id: ${quest.id}`);
      ids.add(quest.id);
    }
    return quests;
  }

  async get(id: string): Promise<Quest | undefined> {
    return (await this.list()).find((quest) => quest.id === id);
  }
}

let defaultCatalog: QuestCatalog | undefined;
export function getQuestCatalog(): QuestCatalog {
  defaultCatalog ??= new QuestCatalog();
  return defaultCatalog;
}
