#include <cstddef>

/* Standalone definition. LeetCode supplies this: omit it when submitting.
 * Submit class Solution only; LOCAL_TEST enables the local assertion main.
 */
struct ListNode {
    int val;
    ListNode *next;
};

class Solution {
public:
    // Borrowed valid acyclic list; links only, no ownership transfer.
    // O(n) time, O(1) auxiliary space; retain an odd final node.
    ListNode *swapPairs(ListNode *head)
    {
        ListNode dummy{0, head};
        ListNode *prev = &dummy;

        while (prev->next != nullptr && prev->next->next != nullptr) {
            ListNode *first = prev->next;
            ListNode *second = first->next;
            first->next = second->next;
            second->next = first;
            prev->next = second;
            prev = first;
        }
        return dummy.next;
    }
};

#ifdef LOCAL_TEST
#include <cassert>

int main()
{
    Solution solution;
    // Storage indices label identities, not required physical adjacency.
    for (int n = 0; n <= 100; ++n) {
        ListNode nodes[100];
        ListNode *expected[100];
        int count = 0;
        for (int i = 0; i < n; ++i) {
            nodes[i].val = i % 2 == 0 ? 0 : 100;
            nodes[i].next = i + 1 < n ? &nodes[i + 1] : nullptr;
        }
        for (int i = 0; i < n; i += 2) {
            if (i + 1 < n) {
                expected[count++] = &nodes[i + 1];
            }
            expected[count++] = &nodes[i];
        }
        assert(solution.swapPairs(n == 0 ? nullptr : &nodes[0]) ==
               (n == 0 ? nullptr : expected[0]));
        for (int i = 0; i < n; ++i) {
            assert(expected[i]->next == (i + 1 < n ? expected[i + 1] : nullptr));
            assert(nodes[i].val == (i % 2 == 0 ? 0 : 100));
        }
    }
    return 0;
}
#endif
