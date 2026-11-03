"""Strict temporary builds; independent identity-index oracle; semantic controls."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

HARNESS = r'''
#include <stddef.h>
#include <stdio.h>
static struct ListNode nodes[100];
static int values[100];
static int order[100];
int main(void)
{
    int cases = 0;
    for (int n = 0; n <= 100; ++n) {
        for (int pattern = 0; pattern < 3; ++pattern) {
            for (int i = 0; i < n; ++i) {
                values[i] = pattern == 0 ? 7 : (pattern == 1 ? i % 101 : (i % 2) * 100);
                nodes[i].val = values[i];
                nodes[i].next = i + 1 < n ? &nodes[i + 1] : NULL;
                /* Independent permutation by index parity, not pointer rewiring. */
                order[i] = i % 2 ? i - 1 : (i + 1 < n ? i + 1 : i);
            }
            struct ListNode *head = n ? &nodes[0] : NULL;
            struct ListNode *actual = CALL;
            if (actual != (n ? &nodes[order[0]] : NULL)) {
                fprintf(stderr, "semantic head mismatch n=%d pattern=%d\n", n, pattern);
                return 10;
            }
            /* Inspect owned storage; never follow untrusted output pointers. */
            for (int position = 0; position < n; ++position) {
                int index = order[position];
                struct ListNode *next = position + 1 < n ? &nodes[order[position + 1]] : NULL;
                if (nodes[index].next != next || nodes[index].val != values[index]) {
                    fprintf(stderr, "semantic edge/value mismatch n=%d pattern=%d node=%d\n", n, pattern, index);
                    return 10;
                }
            }
            ++cases;
        }
    }
    if (cases != 303) return 12;
    puts("303 cases: exact head, all identity edges, unchanged values passed");
    return 0;
}
'''


def execute(command, compiler, timeout=30):
    env = os.environ.copy()
    env['PATH'] = str(Path(compiler).resolve().parent) + os.pathsep + env.get('PATH', '')
    return subprocess.run(command, capture_output=True, text=True, timeout=timeout, env=env)


def build(source, binary, compiler, standard, local=False):
    command = [compiler, '-std=' + standard, '-Wall', '-Wextra', '-Werror', '-pedantic', '-UNDEBUG']
    if local:
        command.append('-DLOCAL_TEST')
    result = execute(command + [str(source), '-o', str(binary)], compiler)
    if result.returncode:
        raise RuntimeError('compile fault, not semantic rejection: ' + result.stdout + result.stderr)
    print('fresh build: ' + source.name + ' ' + standard + (' LOCAL_TEST' if local else ' oracle'), flush=True)


def harness(source, language):
    call = 'swapPairs(head)' if language == 'c' else 'Solution().swapPairs(head)'
    return '#include "' + source.resolve().as_posix() + '"\n' + HARNESS.replace('CALL', call)


def run(binary, compiler):
    return execute([str(binary)], compiler, 3)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--c-compiler', required=True)
    parser.add_argument('--cpp-compiler', required=True)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--exercise-dir', type=Path)
    group.add_argument('--invalid-fixtures', type=Path)
    args = parser.parse_args()
    languages = [('c', args.c_compiler, 'c11'), ('cpp', args.cpp_compiler, 'c++17')]
    with tempfile.TemporaryDirectory(prefix='verify_24_') as directory:
        root = Path(directory)
        if args.exercise_dir:
            for language, compiler, standard in languages:
                source = args.exercise_dir / ('24_swap_nodes_in_pairs.' + language)
                binary = root / ('local_' + language + '.exe')
                build(source, binary, compiler, standard, True)
                result = run(binary, compiler)
                if result.returncode:
                    raise RuntimeError('LOCAL_TEST failure: ' + result.stdout + result.stderr)
                print(language + ' LOCAL_TEST passed', flush=True)
                oracle = root / ('oracle.' + language)
                oracle.write_text(harness(source, language), encoding='utf-8')
                binary = root / ('oracle_' + language + '.exe')
                build(oracle, binary, compiler, standard)
                result = run(binary, compiler)
                if result.returncode:
                    raise RuntimeError('product oracle failure: ' + result.stdout + result.stderr)
                print(language + ': ' + result.stdout.strip(), flush=True)
            return 0
        fixtures = json.loads(args.invalid_fixtures.read_text(encoding='utf-8'))
        required = {'unchanged_list', 'value_only_swaps', 'dropped_odd_tail', 'lost_reconnection', 'cycle_introduction', 'value_mutation'}
        if len(fixtures) != 6 or {item['name'] for item in fixtures} != required:
            raise ValueError('require exactly six prescribed mutant categories')
        escaped = []
        for language, compiler, standard in languages:
            for item in fixtures:
                name = item['name'] + '_' + language
                source = root / (name + '.' + language)
                preamble = '#include <stddef.h>\nstruct ListNode { int val; struct ListNode *next; };\n'
                function = 'struct ListNode *swapPairs(struct ListNode *head) {' + item['body'] + '}\n'
                if language == 'cpp':
                    function = 'class Solution { public: ' + function + '};\n'
                source.write_text(preamble + function, encoding='utf-8')
                oracle = root / ('test_' + name + '.' + language)
                oracle.write_text(harness(source, language), encoding='utf-8')
                binary = root / (name + '.exe')
                build(oracle, binary, compiler, standard)
                result = run(binary, compiler)
                if result.returncode == 10 and 'semantic ' in result.stderr:
                    print(name + ': rejected: ' + result.stderr.strip(), flush=True)
                elif result.returncode == 0:
                    escaped.append(name)
                    print(name + ': ESCAPED', flush=True)
                else:
                    raise RuntimeError(name + ': execution fault, not semantic rejection: ' + str(result.returncode) + result.stderr)
        if escaped:
            print('Escaped: ' + ', '.join(escaped), flush=True)
            return 0
        print('All 12 compiling mutants semantically rejected; expected exit 1.', flush=True)
        return 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, TypeError, RuntimeError, subprocess.TimeoutExpired) as error:
        print('ERROR: ' + str(error), file=sys.stderr, flush=True)
        sys.exit(2)
