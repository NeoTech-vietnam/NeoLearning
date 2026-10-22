// Nimbalyst uses the provider ID as the icon on some session/workstream surfaces,
// ignoring the manifest icon there. Keep the ID stable for saved sessions.
export function installProviderIcon(): () => void {
  if (typeof document === 'undefined') return () => {};
  const className = 'antigravity-cli-provider-icon';
  const style = document.createElement('style');
  const star = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c.9 5.4 4.6 9.1 10 10-5.4.9-9.1 4.6-10 10-.9-5.4-4.6-9.1-10-10 5.4-.9 9.1-4.6 10-10z"/></svg>')}`;
  style.textContent = `.${className} { font-size: 0 !important; }
    .${className}::before {
      content: ''; display: inline-block; vertical-align: middle;
      width: var(--agy-icon-size, 20px); height: var(--agy-icon-size, 20px);
      background-color: #4285f4;
      mask: url("${star}") center / contain no-repeat;
    }`;
  document.head.append(style);
  const update = (root: Node) => {
    const element = root instanceof Element ? root : root.parentElement;
    if (!element) return;
    const symbols = element.matches('.material-symbols-outlined')
      ? [element] : element.querySelectorAll('.material-symbols-outlined');
    for (const symbol of symbols) {
      if (!(symbol instanceof HTMLElement)) continue;
      const matches = symbol.textContent?.trim() === 'antigravity-cli';
      const size = symbol.style.fontSize || '20px';
      if (matches && symbol.style.getPropertyValue('--agy-icon-size') !== size) symbol.style.setProperty('--agy-icon-size', size);
      if (symbol.classList.contains(className) !== matches) symbol.classList.toggle(className, matches);
      if (!matches && symbol.style.getPropertyValue('--agy-icon-size')) symbol.style.removeProperty('--agy-icon-size');
    }
  };
  update(document.body);
  const observer = new MutationObserver(changes => {
    for (const change of changes) {
      // Workstream tabs replace className when their active/opacity state
      // changes. Reapply the icon on that element without scanning the page
      // for unrelated class/style updates. Guarded writes prevent a loop.
      if (change.type === 'attributes') {
        if (change.target instanceof Element && change.target.matches('.material-symbols-outlined')) update(change.target);
        continue;
      }
      update(change.target);
      for (const node of change.addedNodes) update(node);
    }
  });
  observer.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style']});
  return () => {
    observer.disconnect();
    style.remove();
    document.querySelectorAll(`.${className}`).forEach(element => {
      element.classList.remove(className);
      (element as HTMLElement).style.removeProperty('--agy-icon-size');
    });
  };
}
