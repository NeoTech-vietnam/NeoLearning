# Learning Web Markdown editor — implementation

1. Add editor route state and lazy route boundary.
2. Add safe Markdown renderer and lazy-loaded Monaco source surface.
3. Implement file loading, reading/split modes, dirty tracking, and navigation guard.
4. Implement server diff review followed by explicit conflict-aware write.
5. Add conflict recovery and persistent error/success feedback.
6. Link Atlas lesson nodes to the editor.
7. Add editor-focused tests, then run typecheck/build and verify chunk splitting
   in the deferred validation pass requested by the user.
