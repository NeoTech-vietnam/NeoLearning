# Git

Git is a distributed version control system. Each repository stores its history locally; a remote such as GitHub lets a team share that history. Git and GitHub are related concepts, but neither replaces the other.

## Reading path

1. [Foundations and setup](01_Fundamentals-and-Setup.md) — understand Git’s model and configure your identity.
2. [Daily change workflow](02_Daily-Change-Workflow.md) — inspect changes, select what to include, and create commits.
3. [Branches and integration](03_Branches-and-Integration.md) — isolate work, integrate it, and resolve conflicts.
4. [Remotes and GitHub collaboration](04_Remotes-and-GitHub-Collaboration.md) — synchronize safely and open pull requests.

## Learning objectives

- Distinguish the working tree, staging area (index), commit, branch, and remote.
- Read status and differences before changing history or synchronizing with a remote.
- Collaborate through small branches and pull requests instead of working directly on protected branches.

## Safety principles

- Always begin with `git status`; review the diff before staging, committing, pulling, or pushing.
- Use `git add -- <path>` to stage only files you have reviewed.
- Do not force-push, rewrite shared history, or discard unsaved changes unless you understand the consequences.
- Commands that can change configuration, the working tree, or a remote state their scope. Replace values in `<…>` with your own values.

## Scope of this documentation set

This set covers concepts and workflows. Labs, sample repositories, and executable examples are deferred to a later implementation scope.

## Official documentation

- [Git Reference](https://git-scm.com/docs) — Git’s command index and reference documentation.
- [Pro Git: What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git) — Git’s data model and mental model.
- [GitHub Docs: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git) — Git setup and GitHub authentication.
