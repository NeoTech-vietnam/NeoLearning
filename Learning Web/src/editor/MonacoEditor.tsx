import Editor, { loader, type EditorProps } from "@monaco-editor/react";
import * as monaco from "monaco-editor/editor/editor.api";
import "monaco-editor/languages/definitions/markdown/register";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";

type MonacoGlobal = typeof globalThis & {
  MonacoEnvironment?: { getWorker: () => Worker };
};

loader.config({ monaco });

const monacoGlobal = globalThis as MonacoGlobal;
monacoGlobal.MonacoEnvironment ??= {
  getWorker: () => new EditorWorker()
};

export function MonacoEditor(props: EditorProps) {
  return <Editor {...props} />;
}
