import { emptyCalendar, serializeCalendar } from './model.js';
import { defaultCalendarPath } from './paths.js';

const pendingCreates = new Map();
const workspaceByCalendarFile = new Map();
const fileOperations = new Map();

function calendarFileKey(filePath) {
  if (typeof filePath !== 'string') return '';
  const normalized = filePath.replace(/\\/g, '/').replace(/\/+$/, '');
  return /^[A-Za-z]:\//.test(normalized) ? normalized.toLowerCase() : normalized;
}

export function withCalendarFileLock(filePath, operation) {
  const key = calendarFileKey(filePath);
  const previous = fileOperations.get(key) || Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  fileOperations.set(key, current);
  return current.finally(() => {
    if (fileOperations.get(key) === current) fileOperations.delete(key);
  });
}

export function rememberWorkspaceForCalendarFile(filePath, workspacePath) {
  if (typeof filePath !== 'string' || !filePath.trim() || typeof workspacePath !== 'string' || !workspacePath.trim()) return;
  workspaceByCalendarFile.set(calendarFileKey(filePath), workspacePath);
}

export function workspaceForCalendarFile(filePath) {
  return workspaceByCalendarFile.get(calendarFileKey(filePath)) || null;
}

export function resolveEditorWorkspacePath(host, filePath) {
  // Host v0.80.4 sets EditorHost.workspaceId to the workspace path.
  if (typeof host?.workspaceId === 'string' && host.workspaceId.trim()) return host.workspaceId.trim();
  return workspaceForCalendarFile(filePath);
}

export async function ensureWorkspaceCalendarFile(filesystem, workspacePath) {
  if (typeof filesystem?.fileExists !== 'function' || typeof filesystem?.writeFile !== 'function') {
    throw new Error('Host không cấp filesystem service cho extension.');
  }
  const filePath = defaultCalendarPath(workspacePath);
  const pending = pendingCreates.get(filePath);
  if (pending) return pending;

  const creating = withCalendarFileLock(filePath, async () => {
    if (await filesystem.fileExists(filePath)) return filePath;
    await filesystem.writeFile(filePath, serializeCalendar(emptyCalendar()));
    return filePath;
  });
  pendingCreates.set(filePath, creating);
  try {
    return await creating;
  } finally {
    if (pendingCreates.get(filePath) === creating) pendingCreates.delete(filePath);
  }
}
