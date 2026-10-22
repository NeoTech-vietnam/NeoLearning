# Learning Web quality gates — design

Playwright starts a fixture-scoped server process with `NEOLEARNING_REPOSITORY_ROOT`
and `NEOLEARNING_DATA_ROOT` environment variables. The test fixture mirrors only
the small six-country taxonomy needed for browser journeys; it never points at
the real repository. Existing node tests remain responsible for filesystem and
content-index edge cases, while browser tests prove user-visible wiring.

The aggregate check runs independent commands in a fixed order and stops on the
first failure. Browser artifacts are retained only when a test fails.
