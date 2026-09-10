# Git foundations and setup

## Who is this for?

People new to Git or setting up a new development machine. The goal is to understand where Git stores changes before running commands that have an effect.

## The minimum model

- The **working tree** is the set of files you are editing on your machine.
- The **staging area / index** is the set of changes selected for the next commit.
- A **commit** is an immutable history checkpoint with an author, timestamp, and link to a preceding commit.
- A **branch** is a name that points to a line of history; creating one does not copy the whole project.
- A **remote** is a short name for another repository, often on GitHub.

Git is local-first: you can inspect history and create commits without a network connection. Git communicates with a remote only for operations such as fetch, pull, or push.

## Install and verify

Install the current Git version for your operating system from the [Git downloads page](https://git-scm.com/downloads). Then verify that the tool is available:

```sh
git --version
```

This command only reads information; it does not change a repository or configuration.

## Commit identity and configuration scope

Every commit records its author’s name and email address. Git reads configuration at three scopes, with the more specific scope overriding the broader one:

1. **System**: applies to every user on the machine; changing it requires administrator privileges.
2. **Global**: applies to one user on the machine.
3. **Local**: applies only to the current repository.

Check values before changing configuration:

```sh
git config --global --get user.name
git config --global --get user.email
```

If the current values are not correct, set your global identity with information you are allowed to publish in project history:

```sh
git config --global user.name "<display name>"
git config --global user.email "<email@example.com>"
```

The last two commands change the current user’s **global** configuration, not a repository. For a repository that needs a different identity, omit `--global` after entering the correct repository; the configuration then applies only to that repository.

## Initial branch name

When creating a repository, follow your organization’s convention. Git supports setting the default initial branch name through `init.defaultBranch`; many services, including GitHub for new repositories, use `main` by default. Do not rename the default branch of a shared repository unless the team agrees.

## Help and inspection

These safe read operations are useful when you are unsure:

```sh
git help <command>
git status
git config --show-origin --get <configuration-key>
```

`git status` must run in a repository’s working tree. `--show-origin` identifies the configuration file that provides the final value, helping you avoid changing the wrong scope.

## Official documentation

- [Pro Git: First-Time Git Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
- [`git-config` reference](https://git-scm.com/docs/git-config)
- [GitHub Docs: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)
