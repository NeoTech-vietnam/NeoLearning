import { createElement, useEffect, useRef, useState } from 'react';
import { useEditorLifecycle } from '@nimbalyst/runtime';
import { mountCalendarApp, todayInHoChiMinh } from './calendar-app.js';
import { emptyCalendar, parseCalendar, serializeCalendar } from './model.js';
import { getTrackerSnapshot, refreshWorkspaceTrackers, subscribeTrackerSnapshot } from './tracker-adapter.js';
import { ensureWorkspaceCalendarFile, rememberWorkspaceForCalendarFile, resolveEditorWorkspacePath } from './workspace-storage.js';
import { createLifecycleSaveBridge } from './save-bridge.js';
import { calendarAITools, registerCalendarEditor } from './calendar-ai.js';

let workspaceFilesystem = null;

export async function activate(context) {
  workspaceFilesystem = context?.services?.filesystem || null;
}

function CalendarLauncher({ host }) {
  const launched = useRef(false);
  const openCalendarRef = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (launched.current) return undefined;
    launched.current = true;
    let active = true;
    const openCalendar = async () => {
      try {
        setError('');
        const filePath = await ensureWorkspaceCalendarFile(workspaceFilesystem, host.workspacePath);
        if (!active) return;
        rememberWorkspaceForCalendarFile(filePath, host.workspacePath);
        void refreshWorkspaceTrackers(host);
        host.openFile(filePath);
        host.close();
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : String(cause));
      }
    };
    openCalendarRef.current = openCalendar;
    void openCalendar();
    return () => {
      active = false;
      openCalendarRef.current = null;
    };
  }, [host]);

  if (error) {
    return createElement('div', { className: 'pc-launch-error', role: 'alert' },
      createElement('p', null, 'Không mở được lịch: ' + error),
      createElement('button', { type: 'button', onClick: () => {
        void openCalendarRef.current?.();
      } }, 'Thử lại'));
  }
  return createElement('div', { className: 'pc-launch-status', role: 'status' }, 'Đang mở lịch workspace…');
}

function CalendarEditor({ host }) {
  const rootRef = useRef(null);
  const appRef = useRef(null);
  const documentRef = useRef(emptyCalendar());
  const markDirtyRef = useRef(null);
  const isDirtyRef = useRef(false);
  const saveBridgeRef = useRef(null);
  if (!saveBridgeRef.current || saveBridgeRef.current.originalHost !== host) {
    saveBridgeRef.current = createLifecycleSaveBridge(host, {
      beforeSave: () => appRef.current?.prepareSave() !== false,
    });
  }
  const saveBridge = saveBridgeRef.current;
  const [, setLifecycleNotice] = useState(0);
  const { isLoading, error, theme, markDirty, isDirty } = useEditorLifecycle(saveBridge.host, {
    applyContent: (content) => {
      documentRef.current = content;
      appRef.current?.replaceDocument(content);
    },
    getCurrentContent: () => documentRef.current,
    parse: parseCalendar,
    serialize: serializeCalendar,
    onExternalChange: () => {
      appRef.current?.notifyExternalChange();
      setLifecycleNotice((value) => value + 1);
    },
  });
  markDirtyRef.current = markDirty;
  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (isLoading || error || !rootRef.current) return undefined;
    const workspacePath = resolveEditorWorkspacePath(host, host.filePath);
    const app = mountCalendarApp(rootRef.current, {
      today: todayInHoChiMinh(),
      workspacePath,
      getDocument: () => documentRef.current,
      onDocumentChange: (next) => {
        documentRef.current = next;
        markDirtyRef.current?.();
      },
      getTrackerSnapshot,
      subscribeTrackerSnapshot,
      onSave: saveBridge.requestSave,
      getSaveState: saveBridge.getState,
      subscribeSaveState: saveBridge.subscribe,
    });
    appRef.current = app;
    const unregisterEditor = registerCalendarEditor(host.filePath, () => isDirtyRef.current || app.hasPendingEdits());
    return () => {
      unregisterEditor();
      app.destroy();
      appRef.current = null;
    };
  }, [isLoading, error, saveBridge]);

  if (error) {
    return createElement('div', { className: 'pc-editor-error', role: 'alert' },
      createElement('h1', null, 'Không mở được file lịch'),
      createElement('p', null, error.message),
      createElement('p', null, 'Nội dung file chưa được ghi đè. Sửa JSON hoặc khôi phục bản sao rồi mở lại.'));
  }
  if (isLoading) return createElement('div', { className: 'pc-editor-loading', role: 'status' }, 'Đang tải lịch…');
  return createElement('div', { className: 'pc-editor-host', 'data-theme': theme || '' }, createElement('div', { ref: rootRef }));
}

export const components = { CalendarEditor };
export const panels = { calendar: { component: CalendarLauncher } };
export const aiTools = calendarAITools;
