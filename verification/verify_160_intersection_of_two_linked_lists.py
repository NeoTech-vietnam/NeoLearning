"""Fresh strict builds; construction-derived identity/full-field oracle; semantic controls."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

HARNESS = r'''
#include <stdio.h>
#include <stdlib.h>
static int check(int a, int b, int s, int pattern)
{
    int n = a + b + s;
    struct ListNode *nodes = (struct ListNode *)malloc((size_t)(n + 1) * sizeof(*nodes));
    struct ListNode *saved = (struct ListNode *)malloc((size_t)(n + 1) * sizeof(*saved));
    if (!nodes || !saved) { free(nodes); free(saved); return 20; }
    struct ListNode *shared = s ? nodes + a + b : NULL;
    for (int i = 0; i < n; ++i) {
        nodes[i].val = pattern ? i + 1 : 7;
        if (i < a) nodes[i].next = i + 1 < a ? nodes + i + 1 : shared;
        else if (i < a + b) nodes[i].next = i + 1 < a + b ? nodes + i + 1 : shared;
        else nodes[i].next = i + 1 < n ? nodes + i + 1 : NULL;
        saved[i] = nodes[i];
    }
    struct ListNode *headA = a ? nodes : shared;
    struct ListNode *headB = b ? nodes + a : shared;
    struct ListNode *actual = CALL;
    int mismatch = actual != shared;
    /* Never traverse candidate output: inspect every original owned node. */
    for (int i = 0; i < n; ++i)
        if (nodes[i].val != saved[i].val || nodes[i].next != saved[i].next) mismatch = 1;
    free(saved);
    free(nodes);
    if (mismatch) {
        fprintf(stderr, "SEMANTIC_MISMATCH a=%d b=%d s=%d pattern=%d\n", a, b, s, pattern);
        return 10;
    }
    return 0;
}
int main(void)
{
    int cases = 0;
    for (int a = 0; a <= 8; ++a)
        for (int b = 0; b <= 8; ++b)
            for (int s = 0; s <= 8; ++s)
                for (int p = 0; p < 2; ++p) {
                    int result = check(a, b, s, p);
                    if (result) return result;
                    ++cases;
                }
    const int large[4][3] = {{30000,30000,0}, {0,0,30000}, {29999,29999,1}, {29992,0,8}};
    for (int i = 0; i < 4; ++i)
        for (int p = 0; p < 2; ++p) {
            int result = check(large[i][0], large[i][1], large[i][2], p);
            if (result) return result;
            ++cases;
        }
    if (cases != 1466) return 21;
    puts("1466 cases passed: exact identity; every original val/next unchanged");
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
    call = 'getIntersectionNode(headA, headB)' if language == 'c' else 'Solution().getIntersectionNode(headA, headB)'
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
    with tempfile.TemporaryDirectory(prefix='verify_160_') as directory:
        root = Path(directory)
        if args.exercise_dir:
            for language, compiler, standard in languages:
                source = args.exercise_dir / ('160_intersection_of_two_linked_lists.' + language)
                binary = root / ('local_' + language + '.exe')
                build(source, binary, compiler, standard, True)
                result = execute([str(binary)], compiler, 5)
                if result.returncode:
                    raise RuntimeError('LOCAL_TEST failure: ' + result.stdout + result.stderr)
                print(language + ' LOCAL_TEST passed', flush=True)
                oracle = root / ('oracle.' + language)
                oracle.write_text(harness(source, language), encoding='utf-8')
                binary = root / ('oracle_' + language + '.exe')
                build(oracle, binary, compiler, standard)
                result = execute([str(binary)], compiler, 5)
                if result.returncode:
                    print('product oracle failure: ' + result.stdout + result.stderr, file=sys.stderr)
                    return 1 if result.returncode == 10 and 'SEMANTIC_MISMATCH' in result.stderr else 20
                print(language + ': ' + result.stdout.strip(), flush=True)
            return 0
        fixtures = json.loads(args.invalid_fixtures.read_text(encoding='utf-8'))
        required = {'always_null', 'equal_value', 'later_shared', 'link_mutation', 'value_mutation'}
        if not isinstance(fixtures, list) or len(fixtures) != 5:
            raise ValueError('require five prescribed mutants')
        if any(not isinstance(item, dict) or set(item) != {'name', 'body'} or
               not isinstance(item['name'], str) or not isinstance(item['body'], str) or not item['body']
               for item in fixtures) or {item['name'] for item in fixtures} != required:
            raise ValueError('malformed mutant fixtures')
        escaped = []
        for item in fixtures:
            for language, compiler, standard in languages:
                source = root / (item['name'] + '.' + language)
                definition = 'struct ListNode { int val; struct ListNode *next; };\n'
                signature = 'struct ListNode *getIntersectionNode(struct ListNode *headA, struct ListNode *headB)'
                if language == 'cpp':
                    definition += 'class Solution { public:\n'
                    signature = 'ListNode *getIntersectionNode(ListNode *headA, ListNode *headB)'
                text = '#include <stddef.h>\n' + definition + signature + '{\n' + item['body'] + '\n}\n'
                if language == 'cpp':
                    text += '};\n'
                source.write_text(text, encoding='utf-8')
                oracle = root / ('h_' + item['name'] + '.' + language)
                oracle.write_text(harness(source, language), encoding='utf-8')
                binary = root / (item['name'] + '_' + language + '.exe')
                build(oracle, binary, compiler, standard)
                result = execute([str(binary)], compiler, 5)
                label = item['name'] + '/' + language
                if result.returncode == 10 and 'SEMANTIC_MISMATCH' in result.stderr:
                    print('semantic rejection: ' + label + ' ' + result.stderr.strip(), flush=True)
                elif result.returncode == 0:
                    escaped.append(label)
                else:
                    raise RuntimeError('technical fault, not semantic rejection: ' + label + ' exit=' + str(result.returncode) + result.stderr)
        if escaped:
            print('escaped mutants: ' + ', '.join(escaped))
            return 0
        print('All 10 mutants semantically rejected')
        return 10


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, RuntimeError, subprocess.TimeoutExpired) as error:
        print('CHECKER/EXECUTION FAULT: ' + str(error), file=sys.stderr)
        sys.exit(20)
