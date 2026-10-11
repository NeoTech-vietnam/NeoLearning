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

/* LeetCode supplies this definition when LOCAL_TEST is absent. */
#ifdef LOCAL_TEST
struct ListNode {
    int val;
    ListNode *next;
};
#endif

class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head;
        ListNode *fast = head;

        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            // Compare identities after moving, not the initial shared head.
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
};

#ifdef LOCAL_TEST
#include <cstdlib>
#include <iostream>
#include <vector>

static int tests = 0;

static bool runTest(const char *name, const std::vector<int> &values, int pos) {
    ++tests;
    // Size once before linking so vector growth cannot invalidate pointers.
    std::vector<ListNode> nodes(values.size());
    for (std::size_t i = 0; i < nodes.size(); ++i) {
        nodes[i].val = values[i];
        nodes[i].next = i + 1 < nodes.size() ? &nodes[i + 1] : nullptr;
    }
    if (pos >= 0) {
        nodes.back().next = &nodes[static_cast<std::size_t>(pos)];
    }
    const auto before = nodes; // Copy values and original next addresses.
    const bool expected = pos >= 0; // Independent construction metadata.
    const bool actual = Solution().hasCycle(nodes.empty() ? nullptr : &nodes[0]);
    bool unchanged = true;
    for (std::size_t i = 0; i < nodes.size(); ++i) {
        if (nodes[i].val != before[i].val || nodes[i].next != before[i].next) {
            unchanged = false;
        }
    }
    const bool pass = actual == expected && unchanged;
    if (!pass) {
        std::cerr << "FAIL " << name << ": n=" << nodes.size() << " pos=" << pos
                  << " expected=" << expected << " actual=" << actual
                  << " unchanged=" << unchanged << '\n';
    }
    // Vector destruction releases owned storage without traversing next links.
    return pass;
}

int main() {
    int failures = 0;
    failures += !runTest("Example1", {3, 2, 0, -4}, 1);
    failures += !runTest("Example2", {1, 2}, 0);
    failures += !runTest("Example3", {1}, -1);
    failures += !runTest("Null", {}, -1);
    failures += !runTest("SelfLoop", {1}, 0);
    failures += !runTest("TwoNodesAcyclic", {1, 2}, -1);
    failures += !runTest("TwoNodesTailLoop", {1, 2}, 1);
    failures += !runTest("RepeatedValuesAcyclic", {7, 7, 7, 7}, -1);
    failures += !runTest("BoundaryValuesInteriorCycle", {-100000, 0, 100000}, 1);

    for (int n = 0; n <= 32; ++n) {
        const std::vector<int> values(static_cast<std::size_t>(n), 7);
        for (int pos = -1; pos < n; ++pos) {
            failures += !runTest("ExhaustiveSmall", values, pos);
        }
    }
    std::vector<int> maximum(10000);
    for (std::size_t i = 0; i < maximum.size(); ++i) {
        maximum[i] = i % 2 ? 100000 : -100000;
    }
    failures += !runTest("MaximumAcyclic", maximum, -1);
    failures += !runTest("MaximumHeadCycle", maximum, 0);
    failures += !runTest("MaximumInteriorCycle", maximum, 5000);
    failures += !runTest("MaximumTailLoop", maximum, 9999);

    std::cout << "C++: " << tests << " cases, " << failures
              << " failures (cycle status and unchanged values/links)\n";
    return failures ? EXIT_FAILURE : EXIT_SUCCESS;
}
#endif // LOCAL_TEST
