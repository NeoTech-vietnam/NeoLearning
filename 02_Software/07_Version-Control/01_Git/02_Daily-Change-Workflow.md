# Daily change workflow

## Who is this for?

People who already have a local repository and need to turn reviewed changes into small, clear, reviewable commits.

## A safe loop

1. **Establish context** — be in the correct repository and branch; run `git status`.
2. **Review changes** — use `git diff` for unstaged changes or `git diff --staged` for selected changes.
3. **Select deliberately** — stage each reviewed path; do not automatically stage the entire workspace.
4. **Record** — create a commit that describes one complete change.
5. **Verify** — review status and recent history before sharing.

## Reference commands

```sh
git status
git diff
git add -- <reviewed-path>
git diff --staged
git commit -m "<short imperative description>"
git log --oneline -n 5
```

`git status`, `git diff`, and `git log` only read data. `git add` changes the staging area; `git commit` creates new local history. Use `--` before a path so Git can distinguish it from a branch or revision name.

## Writing clear commits

A good commit has one purpose, is small enough to review, and has a message that states what the change does. Avoid mixing formatting-only changes, broad renames, and unrelated functional changes in one commit. If there are non-obvious constraints or reasons, record them in the commit body or pull request.

## `.gitignore` is not a security mechanism

`.gitignore` tells Git which **untracked** files to ignore. It does not automatically remove a file that has already been committed, protect a secret that has appeared in history, or replace secret management. Inspect content before staging; never commit a private key, token, or credential.

## Correcting mistakes: stop and inspect first

- Staged the wrong content: inspect `git diff --staged` before committing; you can unstage without deleting working-tree content using `git restore --staged -- <path>`.
- Edited the wrong file: copy content you need to keep somewhere safe before using any restore command.
- Created a local commit that has not been shared: inspect the diff and history, then speak with a mentor or maintainer before rewriting history.
- Already pushed: prefer a new corrective commit; do not force-push to a shared branch without explicit approval.

`git restore` can discard changes when used on the working tree. Read the command scope carefully and run it only after confirming that content you need has been preserved.

## Official documentation

- [`git-status` reference](https://git-scm.com/docs/git-status)
- [`git-diff` reference](https://git-scm.com/docs/git-diff)
- [`git-add` reference](https://git-scm.com/docs/git-add)
- [`git-commit` reference](https://git-scm.com/docs/git-commit)
- [`git-restore` reference](https://git-scm.com/docs/git-restore)
- [`gitignore` reference](https://git-scm.com/docs/gitignore)
