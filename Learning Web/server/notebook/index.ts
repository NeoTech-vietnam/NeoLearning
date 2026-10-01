import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NotebookEntry, ReadingNotebook } from "../../src/shared/notebook.js";

interface Ledger { schemaVersion: 1; documents: Record<string, ReadingNotebook> }
export class NotebookStore {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(readonly filePath = path.join(process.env.NEOLEARNING_DATA_ROOT ?? path.resolve(process.cwd(), ".data"), "notebook.json")) {}
  private async read(): Promise<Ledger> {
    try {
      const data = JSON.parse(await fs.readFile(this.filePath, "utf8")) as Ledger;
      if (data?.schemaVersion !== 1 || !data.documents || typeof data.documents !== "object" || Array.isArray(data.documents) ||
        !Object.values(data.documents).every((doc) => doc && (doc.position === undefined || typeof doc.position === "string") && (doc.positionRevision === undefined || typeof doc.positionRevision === "string") && Array.isArray(doc.entries) &&
          doc.entries.every((entry) => entry && ["note", "bookmark"].includes(entry.kind) &&
            (entry.sourceRevision === undefined || typeof entry.sourceRevision === "string") && [entry.id, entry.heading, entry.quote, entry.prefix, entry.suffix, entry.note, entry.createdAt].every((value) => typeof value === "string"))))
        throw new Error("Notebook data is invalid; restore notebook.json from backup. It has not been reset.");
      return data;
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code === "ENOENT") return { schemaVersion: 1, documents: {} };
      throw cause;
    }
  }
  async snapshot(documentPath: string): Promise<ReadingNotebook> {
    await this.pending;
    return (await this.read()).documents[documentPath] ?? { entries: [] };
  }
  private mutate(documentPath: string, edit: (doc: ReadingNotebook) => void): Promise<ReadingNotebook> {
    const operation = this.pending.then(async () => {
      const ledger = await this.read();
      const doc = ledger.documents[documentPath] ?? { entries: [] };
      edit(doc); ledger.documents[documentPath] = doc;
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const temporary = `${this.filePath}.${randomUUID()}.tmp`;
      try {
        await fs.writeFile(temporary, JSON.stringify(ledger, null, 2) + "\n", { flag: "wx" });
        await fs.rename(temporary, this.filePath);
      } catch (cause) { await fs.rm(temporary, { force: true }).catch(() => undefined); throw cause; }
      return doc;
    });
    this.pending = operation.then(() => undefined, () => undefined);
    return operation;
  }
  position(documentPath: string, heading: string, revision?: string) { return this.mutate(documentPath, (doc) => { doc.position = heading; doc.positionRevision = revision; }); }
  add(documentPath: string, input: Omit<NotebookEntry, "id" | "createdAt">) {
    return this.mutate(documentPath, (doc) => {
      if (doc.entries.length >= 500) throw new Error("Notebook entry limit reached for this document.");
      if (input.kind === "bookmark") {
        const existing = doc.entries.find((entry) => entry.kind === "bookmark" && entry.heading === input.heading);
        if (existing) { existing.sourceRevision = input.sourceRevision; return; }
      }
      doc.entries.push({ ...input, id: randomUUID(), createdAt: new Date().toISOString() });
    });
  }
  remove(documentPath: string, id: string) { return this.mutate(documentPath, (doc) => { doc.entries = doc.entries.filter((entry) => entry.id !== id); }); }
  update(documentPath: string, id: string, note: string) { return this.mutate(documentPath, (doc) => {
    const entry = doc.entries.find((item) => item.id === id);
    if (!entry) throw new Error("Notebook entry was not found.");
    entry.note = note;
  }); }
}
let store: NotebookStore | undefined;
export const getNotebookStore = () => store ??= new NotebookStore();
