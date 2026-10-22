import { createElement, useEffect, useRef, useState } from 'react';

// A stable virtual path focuses the existing tab instead of creating duplicates.
// The built-in Browser extension owns rendering, navigation and URL persistence.
const BROWSER_TAB = 'virtual://com.nimbalyst.browser/launcher?title=Browser';

function BrowserLauncher({ host }) {
  const launched = useRef(false);
  const [error, setError] = useState(null);

  function openBrowser() {
    try {
      host.openFile(BROWSER_TAB);
      host.close();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  useEffect(() => {
    if (launched.current) return;
    launched.current = true;
    openBrowser();
  }, [host]);

  return createElement('div', {
    role: error ? 'alert' : 'status',
    style: {
      padding: '24px',
      color: 'var(--nim-text)',
      background: 'var(--nim-bg)',
      height: '100%',
    },
  }, error
    ? createElement('div', null,
      createElement('p', null, `Could not open Browser: ${error}`),
      createElement('button', { type: 'button', onClick: openBrowser }, 'Try again'))
    : 'Opening Browser…');
}

export const panels = {
  browser: { component: BrowserLauncher },
};
