# Parameters, Arrays, and Text

## Positional and special parameters

A script's input arrives as positional parameters: `$0` identifies the invoked script and `$1` through `$9` identify the first arguments. Braces are required for positions with more than one digit. `$#` is the argument count, `$?` is the most recent exit status, and `$$` identifies the current shell process.

`"$@"` is the safe default representation of the original argument list: it expands to one word per positional parameter when quoted. `$*` has different joining behavior and is rarely the right choice for forwarding arbitrary arguments.

The [Shell Parameters](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html) and [Special Parameters](https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html) sections give the complete rules.

## Parameter expansion

Braced parameter expansion, such as `${name}`, makes variable boundaries clear and enables Bash operations without a separate process. Important families are:

- Defaulting and validation forms that distinguish unset from null values.
- Prefix and suffix removal using shell patterns.
- Replacement, slicing, length, and case transformations.
- Indirect expansion and name references, which should be used sparingly because they make data flow harder to follow.

The word portions of many parameter-expansion operators themselves undergo expansion. Read the [parameter-expansion reference](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) before using complex nested forms.

## Arrays are Bash-specific

Bash provides indexed and associative arrays. An indexed array uses integer-like subscripts; an associative array maps string keys to values. Arrays avoid some ambiguity of space-separated strings, but they are not a POSIX shell feature.

When expanding an array, distinguish the elements from their indices, and use a quoted element-wise expansion when values must remain separate arguments. Consult [Bash Arrays](https://www.gnu.org/software/bash/manual/html_node/Arrays.html) for the exact subscript and expansion syntax.

## Text is not automatically a list

Shell variables hold strings. A newline-separated string, a space-separated string, and a list of command arguments are different representations. Do not convert between them implicitly by relying on word splitting.

`read` parses input according to `IFS`, unless configured otherwise. For line-oriented input, make delimiter and backslash handling deliberate. For file names or other arbitrary byte sequences, understand the producer's delimiter contract before choosing a loop; newline is not a universally safe separator.

## Input-handling checklist

- Decide whether the input is one value, a list of arguments, lines, or records.
- Preserve boundaries with quoting and arrays where Bash is allowed.
- Validate required arguments before performing side effects.
- Do not use a human-readable display format as a machine-readable transport.

Next: [Pipelines, redirection, and errors](04_Pipelines-Redirection-and-Errors.md).
