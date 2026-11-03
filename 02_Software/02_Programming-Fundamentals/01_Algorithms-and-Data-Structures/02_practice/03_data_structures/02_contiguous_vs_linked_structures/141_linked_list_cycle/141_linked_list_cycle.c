/* LeetCode 141: https://leetcode.com/problems/linked-list-cycle/
 * LeetCode supplies ListNode; omit this local definition when submitting.
 */
#include <stdbool.h>
#include <stddef.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

/* Borrowed live nodes; no mutation, allocation, or ownership transfer. */
bool hasCycle(struct ListNode *head)
{
    struct ListNode *slow = head;
    struct ListNode *fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}

#ifdef LOCAL_TEST
#include <assert.h>

int main(void)
{
    struct ListNode nodes[] = {
        {-100000, NULL}, {100000, NULL}, {100000, NULL}, {7, NULL}
    };
    assert(!hasCycle(NULL));
    assert(!hasCycle(&nodes[0]));
    nodes[0].next = &nodes[0];
    assert(hasCycle(&nodes[0]));
    nodes[0].next = &nodes[1];
    assert(!hasCycle(&nodes[0]));
    nodes[1].next = &nodes[0];
    assert(hasCycle(&nodes[0]));
    nodes[1].next = &nodes[2];
    assert(!hasCycle(&nodes[0]));
    nodes[2].next = &nodes[3];
    assert(!hasCycle(&nodes[0]));
    nodes[3].next = &nodes[1];
    assert(hasCycle(&nodes[0]));
    nodes[3].next = &nodes[3];
    assert(hasCycle(&nodes[0]));
    assert(nodes[0].val == -100000 && nodes[1].val == 100000);
    assert(nodes[2].val == 100000 && nodes[3].val == 7);
    assert(nodes[0].next == &nodes[1] && nodes[1].next == &nodes[2]);
    assert(nodes[2].next == &nodes[3] && nodes[3].next == &nodes[3]);
    /* Stack storage needs no cyclic traversal or deallocation. */
    return 0;
}
#endif
