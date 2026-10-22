let sessionContext;

export function initializeBrowserSessions(context) {
  sessionContext = context;
}

/** Route an existing BrowserSessionService new-window event to an editor tab. */
export async function openWindowInBrowser(url, api = window.electronAPI, context = sessionContext) {
  const target = new URL(url);
  const opensInternally = ['http:', 'https:', 'nim-preview:'].includes(target.protocol)
    || target.href === 'about:blank';

  // Keep the host's existing handling for links to mail clients and other apps.
  if (!opensInternally) return api.invoke('open-external', url);

  if (!context?.extensionPath || !context.services?.filesystem?.writeFile) {
    throw new Error('Browser session storage is unavailable');
  }
  const title = target.hostname || 'Browser';
  const name = title.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${context.extensionPath.replace(/\\/g, '/')}/sessions/${name}-${crypto.randomUUID()}.browser.json`;
  // Editor tabs are watched and reloaded as disk files by the host. Persist the
  // supported Browser Session format before opening so reconciliation succeeds.
  await context.services.filesystem.writeFile(filePath, JSON.stringify({
    version: 1,
    mode: 'url',
    title,
    url: target.href,
    viewportPreset: 'desktop',
    autoReloadOnSave: false,
  }, null, 2) + '\n');
  const result = await api.invoke('workspace:open-file', { filePath });
  if (!result?.success) throw new Error(result?.error || 'Could not open Browser tab');
  return filePath;
}
