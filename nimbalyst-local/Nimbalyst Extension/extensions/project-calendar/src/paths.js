export function defaultCalendarPath(workspacePath) {
  if (typeof workspacePath !== 'string' || !workspacePath.trim()) {
    throw new Error('Nimbalyst chưa cung cấp đường dẫn workspace.');
  }
  const separator = workspacePath.includes('\\') ? '\\' : '/';
  const base = workspacePath.replace(/[\\/]+$/, '');
  return base + separator + ['nimbalyst-local', 'calendar', 'project.project-calendar.json'].join(separator);
}
