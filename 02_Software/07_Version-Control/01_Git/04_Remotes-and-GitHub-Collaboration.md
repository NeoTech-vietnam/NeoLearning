# Remotes and GitHub collaboration

## Who is this for?

People who can work with local commits and need to synchronize a repository, authenticate with GitHub, or submit changes for review.

## The remote concept

A remote is a local name that points to another repository URL. `origin` is only a common convention, not a required name. After cloning, Git usually creates an `origin` remote and configures an upstream for the default branch.

- **Fetch** downloads information and commits from a remote, updating remote-tracking branches without changing the current branch.
- **Pull** fetches and then integrates into the current branch, so inspect status and understand the integration strategy before using it.
- **Push** publishes local commits to a remote; it affects collaborators.

Inspect the remote before synchronizing or publishing:

```sh
git remote -v
git status
git fetch <remote-name>
```

These three commands do not rewrite local history. `git fetch` can update local remote-tracking branches, but it does not merge into the checked-out branch.

## Authenticating with GitHub

GitHub supports HTTPS and SSH for Git operations. HTTPS typically uses a credential helper to store credentials; SSH uses a key pair on each machine and a public key added to the GitHub account. Choose the method required by organizational policy; never send a private key, token, or password through chat, a commit, or a pull request.

If you use SSH, verify the server fingerprint using GitHub’s documentation before trusting the first connection. A successful SSH authentication result can return exit code 1 because GitHub does not provide shell access; read the message rather than relying only on the exit code.

## The pull request as a collaboration space

A pull request compares the source (head) branch with the target (base) branch, allowing review and automated checks before merging. Before creating a pull request:

1. Review the commits and diff on the work branch.
2. Confirm the base branch is correct and the change is small enough to review.
3. Describe the purpose, impact, verification approach, and any remaining limitations.
4. Follow the repository’s template, review process, and branch protections.

After receiving feedback, add clear commits or update the branch according to team conventions. Do not force-push to a shared or protected branch unless repository policy and the responsible maintainer explicitly allow it.

## When it is not safe to pull immediately

Stop and inspect before pulling if the working tree has uncommitted changes, the branch has diverged from its upstream, or you do not know whether the repository uses merge, rebase, or fast-forward-only. `git status`, `git log`, and `git diff` help you understand the state first. For valuable local changes, commit, store them according to team conventions, or back them up before integrating.

## Official documentation

- [`git-fetch` reference](https://git-scm.com/docs/git-fetch)
- [`git-pull` reference](https://git-scm.com/docs/git-pull)
- [`git-push` reference](https://git-scm.com/docs/git-push)
- [GitHub Docs: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)
- [GitHub Docs: Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [GitHub Docs: Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
