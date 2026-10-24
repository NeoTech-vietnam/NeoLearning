# Bash Scripting

## Overview

Bash is a command interpreter commonly used to automate build steps, developer workflows, provisioning, and diagnostic tasks. In an embedded-software project, it is often the glue between compilers, build systems, debuggers, flash tools, and CI jobs.

This section teaches how to **read, review, and write maintainable Bash**. It does not replace the Bash manual, and it deliberately does not yet contain runnable exercises or example scripts.

## Audience and prerequisites

This material is for developers who can use a Unix-like terminal and need to understand automation scripts in a project. Familiarity with paths, files, processes, and standard input/output is helpful. It starts with shell behavior before relying on Bash-specific features.

## Learning path

1. [Shell execution and quoting](01_Shell-Execution-and-Quoting.md) — how Bash turns source text into a command, and why quoting is essential.
2. [Control flow and functions](02_Control-Flow-and-Functions.md) — decisions, loops, functions, and exit-status-based control flow.
3. [Parameters, arrays, and text](03_Parameters-Arrays-and-Text.md) — inputs, parameter expansion, arrays, and line-oriented data.
4. [Pipelines, redirection, and errors](04_Pipelines-Redirection-and-Errors.md) — streams, pipelines, failure propagation, and cleanup.
5. [Reliable and portable Bash](05_Reliable-and-Portable-Bash.md) — defensive practices and the boundary between Bash and POSIX `sh`.
6. [Glossary and reference](06_Glossary-and-Reference.md) — compact terminology and primary references.

## Scope and compatibility

The default subject is Bash, not a generic shell. Bash extensions such as arrays, `[[ ... ]]`, `(( ... ))`, process substitution, and `shopt` are useful but are not required by POSIX. A script that must run under `/bin/sh` needs a separate portability review; a Bash-compatible login shell is not proof that `/bin/sh` is Bash.

Target a declared Bash version when using version-dependent features. Prefer the system's documented interpreter path or the project's established shebang policy instead of assuming every host provides the same Bash release.

## Outcomes

After completing this section, a learner should be able to:

- Trace how a command's words are expanded and identify unsafe unquoted data.
- Use exit statuses rather than Boolean values to reason about conditions.
- Follow data through positional parameters, standard streams, pipelines, and redirections.
- Recognize Bash-only syntax and decide when POSIX compatibility matters.
- Review a small automation script for common reliability hazards.

## Primary references

- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) — the normative feature reference for Bash.
- [Shell Command Language, POSIX.1-2024](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html) — the portable `sh` language baseline.

## Deferred practical work

Runnable examples, exercises, and CI-verified scripts are intentionally deferred. Potential follow-up topics include argument parsing, robust file processing, stream separation, cleanup with `trap`, and Bash-versus-POSIX comparisons.
