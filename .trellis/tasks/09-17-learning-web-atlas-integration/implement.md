# Learning Web atlas integration — implementation

1. Mount file, quest, and progress routers in the main Express app.
2. Add a post-write hook to refresh the content index and cover it with tests.
3. Add small hash-route helpers and a navigation shell for Home, Atlas, Quests,
   and existing development previews.
4. Build a data-driven Atlas page over the approved SVG country geometry.
5. Mount the existing Quest Board against quest and progress APIs.
6. Add URL-backed quest-route mode with ordered landmark resolution and country
   highlighting.
7. Test route parsing, hierarchy selection, loading/error/empty projections,
   and server integration.
8. Run all tests, typecheck, production build, and browser smoke validation.

Rollback points: server route mounting is verified before UI work; Atlas and
Quest routes are validated independently before replacing the default shell.
