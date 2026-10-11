/*
141. Linked List Cycle
Source: https://leetcode.com/problems/linked-list-cycle/description/

Return whether following next links from head revisits a node.
Examples: [3,2,0,-4], pos=1 -> true; [1,2], pos=0 -> true;
          [1], pos=-1 -> false.
Constraints: 0 <= node count <= 10000; -100000 <= Node.val <= 100000.
pos is -1 or a valid node index, and is NOT a function parameter.
The caller owns the nodes. Values and links remain unchanged.
*/

#include <stdbool.h>

/* LeetCode supplies this definition when LOCAL_TEST is absent. */
#ifdef LOCAL_TEST
struct ListNode {
    int val;
    struct ListNode *next;
};
#endif

bool hasCycle(struct ListNode *head) {
    struct ListNode *slow = head;
    struct ListNode *fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        /* Compare identities after moving, not the initial shared head. */
        if (slow == fast) {
            return true;
        }
    }
    return false;
}

#ifdef LOCAL_TEST
#include <stdio.h>
#include <stdlib.h>

static int tests = 0;

/* Expected status follows construction metadata, not another cycle detector.
   A null values pointer generates alternating constraint-boundary values. */
static bool runTest(const char *name, const int *values, int n, int pos) {
    ++tests;
    struct ListNode *nodes = NULL;
    struct ListNode *before = NULL;
    if (n > 0) {
        nodes = malloc((size_t)n * sizeof(*nodes));
        before = malloc((size_t)n * sizeof(*before));
        if (!nodes || !before) {
            fprintf(stderr, "FAIL %s: allocation failed\n", name);
            free(before);
            free(nodes);
            return false;
        }
        for (int i = 0; i < n; ++i) {
            nodes[i].val = values ? values[i] : (i % 2 ? 100000 : -100000);
            nodes[i].next = i + 1 < n ? &nodes[i + 1] : NULL;
        }
        if (pos >= 0) {
            nodes[n - 1].next = &nodes[pos];
        }
        for (int i = 0; i < n; ++i) {
            before[i] = nodes[i];
        }
    }

    const bool expected = pos >= 0;
    const bool actual = hasCycle(nodes);
    bool unchanged = true;
    for (int i = 0; i < n; ++i) {
        if (nodes[i].val != before[i].val || nodes[i].next != before[i].next) {
            unchanged = false;
        }
    }
    const bool pass = actual == expected && unchanged;
    if (!pass) {
        fprintf(stderr, "FAIL %s: n=%d pos=%d expected=%d actual=%d unchanged=%d\n",
                name, n, pos, expected, actual, unchanged);
    }
    /* Free owned storage directly; following cyclic links cannot clean it up. */
    free(before);
    free(nodes);
    return pass;
}

int main(void) {
    int failures = 0;
    const int example1[] = {3, 2, 0, -4};
    const int example2[] = {1, 2};
    const int example3[] = {1};
    const int repeated[] = {7, 7, 7, 7};
    const int boundary[] = {-100000, 0, 100000};
    failures += !runTest("Example1", example1, 4, 1);
    failures += !runTest("Example2", example2, 2, 0);
    failures += !runTest("Example3", example3, 1, -1);
    failures += !runTest("Null", NULL, 0, -1);
    failures += !runTest("SelfLoop", example3, 1, 0);
    failures += !runTest("TwoNodesAcyclic", example2, 2, -1);
    failures += !runTest("TwoNodesTailLoop", example2, 2, 1);
    failures += !runTest("RepeatedValuesAcyclic", repeated, 4, -1);
    failures += !runTest("BoundaryValuesInteriorCycle", boundary, 3, 1);

    /* Every legal tail entry for each small length, including no cycle. */
    for (int n = 0; n <= 32; ++n) {
        for (int pos = -1; pos < n; ++pos) {
            failures += !runTest("ExhaustiveSmall", NULL, n, pos);
        }
    }
    failures += !runTest("MaximumAcyclic", NULL, 10000, -1);
    failures += !runTest("MaximumHeadCycle", NULL, 10000, 0);
    failures += !runTest("MaximumInteriorCycle", NULL, 10000, 5000);
    failures += !runTest("MaximumTailLoop", NULL, 10000, 9999);

    printf("C: %d cases, %d failures (cycle status and unchanged values/links)\n",
           tests, failures);
    return failures ? EXIT_FAILURE : EXIT_SUCCESS;
}
#endif /* LOCAL_TEST */
