#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "$0")" && pwd)
out="$root/out"
trap 'rm -rf "$out"' EXIT

command -v javac >/dev/null || {
    echo "javac not found; install JDK 21 or newer" >&2
    exit 127
}

mkdir -p "$out"

for module in "$root"/[0-9][0-9]_*; do
    module_out="$out/$(basename "$module")"
    mkdir -p "$module_out"

    for source in "$module"/*.java; do
        class=$(basename "$source" .java)
        javac -d "$module_out" "$source"
        java -ea -cp "$module_out" "$class" >/dev/null
    done

done

echo "All Java examples passed"
