// Local definition: LeetCode supplies ListNode; submit only Solution.
struct ListNode {
    int val;
    ListNode *next;
};

class Solution {
public:
    // Borrow finite acyclic lists; null heads also supported.
    // Return first shared address or nullptr; no writes/ownership transfer.
    // O(m+n) time, O(1) space. Cycles/dangling pointers are out of scope.
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB)
    {
        ListNode *p = headA;
        ListNode *q = headB;
        while (p != q) {
            p = p ? p->next : headB;
            q = q ? q->next : headA;
        }
        return p;
    }
};

#ifdef LOCAL_TEST
#include <cassert>

int main()
{
    ListNode tail{5, nullptr};
    ListNode shared{8, &tail};
    ListNode a{1, &shared};
    ListNode b1{1, &shared};
    ListNode b0{4, &b1};
    ListNode separate{8, nullptr};
    Solution solution;

    assert(solution.getIntersectionNode(&a, &b0) == &shared);
    assert(solution.getIntersectionNode(&b0, &a) == &shared);
    assert(solution.getIntersectionNode(&shared, &shared) == &shared);
    assert(solution.getIntersectionNode(&a, &tail) == &tail);
    assert(solution.getIntersectionNode(&a, &separate) == nullptr);
    assert(solution.getIntersectionNode(nullptr, &a) == nullptr);
    assert(solution.getIntersectionNode(&a, nullptr) == nullptr);
    assert(solution.getIntersectionNode(nullptr, nullptr) == nullptr);
    assert(a.val == 1 && a.next == &shared);
    assert(b0.val == 4 && b0.next == &b1);
    assert(b1.val == 1 && b1.next == &shared);
    assert(shared.val == 8 && shared.next == &tail);
    assert(tail.val == 5 && tail.next == nullptr);
    assert(separate.val == 8 && separate.next == nullptr);
}
#endif
