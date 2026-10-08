# Branches and integrating changes

## Who is this for?

People working in parallel with a team, preparing a change for review, or handling differences between two branches.

## Why use branches?

A branch isolates a feature, bug fix, or experiment from the default branch. It is a pointer into history, not a full copy of the project. Before creating a branch, confirm that the base branch is correct and that the working tree is clean or its changes are understood.

Branch names should be short, describe their purpose, and follow project conventions, such as `feature/`, `fix/`, or a work-item identifier if the team uses one. Do not put secrets or sensitive data in a branch name because that name may be published to a remote.

## Recommended collaboration flow

1. Update your understanding of the base branch by fetching and reviewing changes before integrating.
2. Create a work branch from the team-approved base branch.
3. Create small, focused commits; push the work branch to back it up and collaborate.
4. Open a pull request to compare the work branch with the target branch.
5. Integrate only after review requirements, automated checks, and branch-protection policies are satisfied.

## Merge and rebase

**Merge** combines two histories and can create a merge commit. It is usually the safe choice for shared history because it does not change existing commits.

**Rebase** replays commits on a new base and therefore creates new commit identifiers. Rebase is useful for preparing a tidy personal branch, but it should not be used unilaterally on commits that other people may depend on. Talk with the team before rebasing a shared branch.

## Conflicts

A conflict occurs when Git cannot decide how to combine changes automatically. A safe resolution process is:

1. Read Git’s message and identify every conflicted file.
2. Understand the intent of both sides; do not simply pick one side to make the error disappear.
3. Edit the file, inspect the conflict markers, and run the project’s relevant checks.
4. Review the final diff before marking the conflict resolved and creating the integration commit.

If you do not understand a change’s intent, stop and ask its author or a maintainer. Do not remove conflict markers mechanically.

## Protected branches

On GitHub, protected branches can require reviews, status checks, code-owner approval, or signed commits before merging. These rules belong to the repository; local Git documentation cannot replace them. Check the requirements shown on the pull request instead of assuming that you can push or merge.

## Official documentation

- [Pro Git: Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [`git-switch` reference](https://git-scm.com/docs/git-switch)
- [`git-merge` reference](https://git-scm.com/docs/git-merge)
- [`git-rebase` reference](https://git-scm.com/docs/git-rebase)
- [GitHub Docs: Branches](https://docs.github.com/en/pull-requests/reference/branches)
