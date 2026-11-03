#include <stddef.h>

/* Standalone definition. LeetCode supplies this: omit it when submitting.
 * Submit swapPairs only; LOCAL_TEST enables the local assertion main.
 */
struct ListNode {
    int val;
    struct ListNode *next;
};

/* Borrowed valid acyclic list; rewire links only. No ownership transfer.
 * O(n) time, O(1) auxiliary space; an odd final node stays in place.
 */
struct ListNode *swapPairs(struct ListNode *head)
{
    struct ListNode dummy = {0, head};
    struct ListNode *prev = &dummy;

    while (prev->next != NULL && prev->next->next != NULL) {
        struct ListNode *first = prev->next;
        struct ListNode *second = first->next;
        first->next = second->next;
        second->next = first;
        prev->next = second;
        prev = first;
    }
    return dummy.next;
}

#ifdef LOCAL_TEST
#include <assert.h>

int main(void)
{
    /* Storage indices label identities, not an algorithmic adjacency assumption. */
    for (int n = 0; n <= 100; ++n) {
        struct ListNode nodes[100];
        struct ListNode *expected[100];
        int count = 0;
        for (int i = 0; i < n; ++i) {
            nodes[i].val = i % 2 == 0 ? 0 : 100;
            nodes[i].next = i + 1 < n ? &nodes[i + 1] : NULL;
        }
        for (int i = 0; i < n; i += 2) {
            if (i + 1 < n) {
                expected[count++] = &nodes[i + 1];
            }
            expected[count++] = &nodes[i];
        }
        assert(swapPairs(n == 0 ? NULL : &nodes[0]) ==
               (n == 0 ? NULL : expected[0]));
        for (int i = 0; i < n; ++i) {
            assert(expected[i]->next == (i + 1 < n ? expected[i + 1] : NULL));
            assert(nodes[i].val == (i % 2 == 0 ? 0 : 100));
        }
    }
    return 0;
}
#endif
