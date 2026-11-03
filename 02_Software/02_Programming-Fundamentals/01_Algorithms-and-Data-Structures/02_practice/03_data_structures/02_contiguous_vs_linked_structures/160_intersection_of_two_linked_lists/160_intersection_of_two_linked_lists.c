#include <stddef.h>

/* Local definition: LeetCode supplies this struct; submit only the function. */
struct ListNode {
    int val;
    struct ListNode *next;
};

/* Borrowed finite acyclic lists; null heads also supported.
 * Return the first shared address or NULL. No writes or ownership transfer.
 * O(m+n) time, O(1) auxiliary space. Cycles/dangling pointers are out of scope.
 */
struct ListNode *getIntersectionNode(struct ListNode *headA,
                                     struct ListNode *headB)
{
    struct ListNode *p = headA;
    struct ListNode *q = headB;
    while (p != q) {
        p = p ? p->next : headB;
        q = q ? q->next : headA;
    }
    return p;
}

#ifdef LOCAL_TEST
#include <assert.h>

int main(void)
{
    struct ListNode tail = {5, NULL};
    struct ListNode shared = {8, &tail};
    struct ListNode a = {1, &shared};
    struct ListNode b1 = {1, &shared};
    struct ListNode b0 = {4, &b1};
    struct ListNode separate = {8, NULL};

    assert(getIntersectionNode(&a, &b0) == &shared);
    assert(getIntersectionNode(&b0, &a) == &shared);
    assert(getIntersectionNode(&shared, &shared) == &shared);
    assert(getIntersectionNode(&a, &tail) == &tail);
    assert(getIntersectionNode(&a, &separate) == NULL);
    assert(getIntersectionNode(NULL, &a) == NULL);
    assert(getIntersectionNode(&a, NULL) == NULL);
    assert(getIntersectionNode(NULL, NULL) == NULL);
    assert(a.val == 1 && a.next == &shared);
    assert(b0.val == 4 && b0.next == &b1);
    assert(b1.val == 1 && b1.next == &shared);
    assert(shared.val == 8 && shared.next == &tail);
    assert(tail.val == 5 && tail.next == NULL);
    assert(separate.val == 8 && separate.next == NULL);
    return 0;
}
#endif
