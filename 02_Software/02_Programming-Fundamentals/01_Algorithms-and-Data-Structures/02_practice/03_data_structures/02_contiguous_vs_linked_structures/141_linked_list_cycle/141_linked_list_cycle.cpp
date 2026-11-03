// LeetCode 141: https://leetcode.com/problems/linked-list-cycle/
// LeetCode supplies ListNode; omit this local definition when submitting.
struct ListNode {
    int val;
    ListNode *next;
};

class Solution {
public:
    // Borrowed live nodes; no mutation, allocation, or ownership transfer.
    bool hasCycle(ListNode *head)
    {
        ListNode *slow = head;
        ListNode *fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
};

#ifdef LOCAL_TEST
#include <cassert>

int main()
{
    Solution solution;
    ListNode nodes[] = {
        {-100000, nullptr}, {100000, nullptr}, {100000, nullptr}, {7, nullptr}
    };
    assert(!solution.hasCycle(nullptr));
    assert(!solution.hasCycle(&nodes[0]));
    nodes[0].next = &nodes[0];
    assert(solution.hasCycle(&nodes[0]));
    nodes[0].next = &nodes[1];
    assert(!solution.hasCycle(&nodes[0]));
    nodes[1].next = &nodes[0];
    assert(solution.hasCycle(&nodes[0]));
    nodes[1].next = &nodes[2];
    assert(!solution.hasCycle(&nodes[0]));
    nodes[2].next = &nodes[3];
    assert(!solution.hasCycle(&nodes[0]));
    nodes[3].next = &nodes[1];
    assert(solution.hasCycle(&nodes[0]));
    nodes[3].next = &nodes[3];
    assert(solution.hasCycle(&nodes[0]));
    assert(nodes[0].val == -100000 && nodes[1].val == 100000);
    assert(nodes[2].val == 100000 && nodes[3].val == 7);
    assert(nodes[0].next == &nodes[1] && nodes[1].next == &nodes[2]);
    assert(nodes[2].next == &nodes[3] && nodes[3].next == &nodes[3]);
    // Stack storage needs no cyclic traversal or deallocation.
    return 0;
}
#endif
