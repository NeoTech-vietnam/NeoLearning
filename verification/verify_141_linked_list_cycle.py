"""Independent repeated-index oracle; strict fresh paired builds and mutant controls."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

HARNESS = r'''
#include <assert.h>
#include <stddef.h>
#include <stdio.h>
static struct ListNode nodes[10000];
static struct ListNode *links[10000];
static int values[10000];
static int successors[10000];
static unsigned char seen[10000];
static int cases = 0;
static int check_case(int n, int entry)
{
    const int pattern[] = {-100000, 100000, 7, 7};
    for (int i = 0; i < n; ++i) {
        successors[i] = i + 1 < n ? i + 1 : entry;
        nodes[i].val = pattern[i % 4];
        nodes[i].next = successors[i] < 0 ? NULL : &nodes[successors[i]];
        values[i] = nodes[i].val;
        links[i] = nodes[i].next;
        seen[i] = 0;
    }
    /* Oracle follows integer construction edges, recording visited indices. */
    int cursor = n == 0 ? -1 : 0;
    while (cursor >= 0 && !seen[cursor]) {
        seen[cursor] = 1;
        cursor = successors[cursor];
    }
    const int expected = cursor >= 0;
    struct ListNode *head = n == 0 ? NULL : &nodes[0];
    const int actual = CALL;
    /* Inspect owned storage, never potentially cyclic/mutated traversal. */
    for (int i = 0; i < n; ++i) {
        if (nodes[i].val != values[i] || nodes[i].next != links[i]) {
            fprintf(stderr, "topology/value mutation: n=%d entry=%d node=%d\n", n, entry, i);
            return 11;
        }
    }
    if (actual != expected) {
        fprintf(stderr, "semantic mismatch: n=%d entry=%d expected=%d actual=%d\n", n, entry, expected, actual);
        return 10;
    }
    ++cases;
    return 0;
}
int main(void)
{
    for (int n = 0; n <= 64; ++n) {
        for (int entry = -1; entry < n; ++entry) {
            int result = check_case(n, entry);
            if (result != 0) return result;
        }
    }
    const int entries[] = {-1, 0, 9999};
    for (int i = 0; i < 3; ++i) {
        int result = check_case(10000, entries[i]);
        if (result != 0) return result;
    }
    assert(cases == 2148);
    printf("2148 topologies: return values and complete snapshots passed\n");
    return 0;
}
'''


def execute(command, compiler, timeout=30):
    env = os.environ.copy()
    env['PATH'] = str(Path(compiler).resolve().parent) + os.pathsep + env.get('PATH', '')
    return subprocess.run(command, capture_output=True, text=True, timeout=timeout, env=env)


def build(source, binary, compiler, standard, local=False):
    command = [compiler, '-std=' + standard, '-Wall', '-Wextra', '-Werror',
               '-pedantic', '-UNDEBUG']
    if local:
        command.append('-DLOCAL_TEST')
    command += [str(source), '-o', str(binary)]
    result = execute(command, compiler)
    if result.returncode:
        raise RuntimeError('compile failure (not mutant detection): ' + ' '.join(command)
                           + '\n' + result.stdout + result.stderr)
    print('fresh build:', source.name, standard, 'LOCAL_TEST' if local else 'oracle', flush=True)


def run(binary, compiler):
    return execute([str(binary)], compiler, timeout=3)


def harness(source, language):
    call = 'hasCycle(head)' if language == 'c' else 'Solution().hasCycle(head)'
    return '#include "' + source.resolve().as_posix() + '"\n' + HARNESS.replace('CALL', call)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--c-compiler', required=True)
    parser.add_argument('--cpp-compiler', required=True)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--exercise-dir', type=Path)
    group.add_argument('--invalid-fixtures', type=Path)
    args = parser.parse_args()
    languages = [('c', args.c_compiler, 'c11'), ('cpp', args.cpp_compiler, 'c++17')]
    with tempfile.TemporaryDirectory(prefix='verify_141_') as temporary:
        root = Path(temporary)
        if args.exercise_dir:
            for language, compiler, standard in languages:
                source = args.exercise_dir / ('141_linked_list_cycle.' + language)
                local_binary = root / ('local_' + language + '.exe')
                build(source, local_binary, compiler, standard, local=True)
                result = run(local_binary, compiler)
                if result.returncode:
                    raise RuntimeError('LOCAL_TEST failed: ' + result.stdout + result.stderr)
                print(language + ' LOCAL_TEST passed', flush=True)
                oracle_source = root / ('oracle.' + language)
                oracle_source.write_text(harness(source, language), encoding='utf-8')
                binary = root / ('oracle_' + language + '.exe')
                build(oracle_source, binary, compiler, standard)
                result = run(binary, compiler)
                if result.returncode:
                    raise RuntimeError('product oracle failure: ' + result.stdout + result.stderr)
                print(language + ': ' + result.stdout.strip(), flush=True)
            return 0
        fixtures = json.loads(args.invalid_fixtures.read_text(encoding='utf-8'))
        required = {'always_false', 'always_true', 'value_comparison',
                    'input_link_mutation', 'infinite_loop'}
        if len(fixtures) != 5 or {item['name'] for item in fixtures} != required:
            raise ValueError('fixture manifest must contain exactly five prescribed categories')
        escaped = []
        for language, compiler, standard in languages:
            for item in fixtures:
                name = item['name'] + '_' + language
                source = root / (name + '.' + language)
                preamble = '#include <stdbool.h>\n#include <stddef.h>\nstruct ListNode { int val; struct ListNode *next; };\n'
                function = 'bool hasCycle(struct ListNode *head) {' + item['body'] + '}\n'
                if language == 'cpp':
                    function = 'class Solution { public: ' + function + '};\n'
                source.write_text(preamble + function, encoding='utf-8')
                oracle_source = root / ('test_' + name + '.' + language)
                oracle_source.write_text(harness(source, language), encoding='utf-8')
                binary = root / (name + '.exe')
                build(oracle_source, binary, compiler, standard)
                try:
                    result = run(binary, compiler)
                except subprocess.TimeoutExpired:
                    print(name + ': rejected by timeout', flush=True)
                    continue
                if result.returncode in (10, 11):
                    print(name + ': rejected: ' + result.stderr.strip(), flush=True)
                elif result.returncode == 0:
                    escaped.append(name)
                    print(name + ': ESCAPED', flush=True)
                else:
                    raise RuntimeError(name + ': unexpected execution fault, not detection: '
                                       + str(result.returncode) + ' ' + result.stderr)
        if escaped:
            print('Negative controls escaped: ' + ', '.join(escaped), flush=True)
            return 0
        print('All 10 compiling mutants rejected; expected fixture exit 1.', flush=True)
        return 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, RuntimeError, subprocess.TimeoutExpired) as error:
        print('ERROR: ' + str(error), file=sys.stderr, flush=True)
        sys.exit(2)
