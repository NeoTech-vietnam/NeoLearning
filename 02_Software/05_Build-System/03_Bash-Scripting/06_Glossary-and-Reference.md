# Glossary and Reference

## Glossary

| Term | Meaning |
| --- | --- |
| Argument | One value passed to a command after shell expansion. |
| Builtin | A command implemented by the shell itself. |
| Command substitution | Replacing a construct with a command's captured standard output. |
| Environment | Named string values inherited by child processes. |
| Exit status | The integer result reported by a command; zero conventionally means success. |
| Expansion | A shell transformation applied to words before command execution. |
| Filename expansion | Replacing glob patterns with matching pathnames; also called globbing. |
| Function | A named group of shell commands executed by the shell. |
| `IFS` | The internal field separator used by word splitting and `read`. |
| Parameter | A shell value identified by a name, number, or special character. |
| Pipeline | Commands connected so that one command's standard output feeds the next command's standard input. |
| POSIX `sh` | The standardized shell language baseline; it is narrower than Bash. |
| Redirection | Shell syntax that connects a command's input or output to a file, descriptor, or other stream. |
| Shebang | The first-line interpreter directive for an executable script. |
| Subshell | A separate shell execution environment; changes to it do not normally affect its parent. |
| Word splitting | Dividing unquoted expansion results into fields according to `IFS`. |

## Primary source map

| Topic | Authoritative source |
| --- | --- |
| Complete Bash language reference | [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) |
| Parsing, simple commands, and execution | [Basic Shell Features](https://www.gnu.org/software/bash/manual/html_node/Basic-Shell-Features.html) |
| Expansion and quoting | [Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html), [Quoting](https://www.gnu.org/software/bash/manual/html_node/Quoting.html) |
| Parameters and arrays | [Shell Parameters](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html), [Arrays](https://www.gnu.org/software/bash/manual/html_node/Arrays.html) |
| Conditions and loops | [Conditional Constructs](https://www.gnu.org/software/bash/manual/html_node/Conditional-Constructs.html), [Looping Constructs](https://www.gnu.org/software/bash/manual/html_node/Looping-Constructs.html) |
| Streams and redirection | [Redirections](https://www.gnu.org/software/bash/manual/html_node/Redirections.html), [Pipelines](https://www.gnu.org/software/bash/manual/html_node/Pipelines.html) |
| Builtins and options | [Bourne Shell Builtins](https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html), [The Set Builtin](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html) |
| Portable shell baseline | [POSIX.1-2024 Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html) |

## Deferred examples and exercises

The first documentation phase is conceptual only. Future practical material can cover safe argument forwarding, structured file traversal, pipeline failures, temporary-resource cleanup, and a comparison of a Bash implementation with a portable POSIX `sh` implementation.

Return to the [Bash Scripting overview](README.md).
