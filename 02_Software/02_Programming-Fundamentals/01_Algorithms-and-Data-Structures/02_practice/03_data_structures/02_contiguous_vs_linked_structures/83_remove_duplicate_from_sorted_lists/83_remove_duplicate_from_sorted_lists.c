/*
Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.

Example 1:

Input: head = [1,1,2]
Output: [1,2]
Example 2:
Input: head = [1,1,2,3,3]
Output: [1,2,3]

Constraints:

The number of nodes in the list is in the range [0, 300].
-100 <= Node.val <= 100
The list is guaranteed to be sorted in ascending order.

*/

#include <stdio.h>
#include <stdlib.h>

struct ListNode { int val; struct ListNode *next; };

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* deleteDuplicates(struct ListNode* head) {
    struct ListNode *current = head;

    while (current != NULL && current->next != NULL) {
        if (current->val == current->next->val) {
            current->next = current->next->next;
        } else {
            current = current->next;
        }
    }

    return head;
}
static struct ListNode *make(const int *a, size_t n, struct ListNode ***owned)
{
    struct ListNode *head = NULL, **link = &head;
    *owned = n ? malloc(n * sizeof(**owned)) : NULL;
    if (n && !*owned) exit(EXIT_FAILURE);
    for (size_t i = 0; i < n; ++i) {
        (*owned)[i] = malloc(sizeof(***owned));
        if (!(*owned)[i]) exit(EXIT_FAILURE);
        (*owned)[i]->val = a[i]; (*owned)[i]->next = NULL;
        *link = (*owned)[i]; link = &(*owned)[i]->next;
    }
    return head;
}

static int ownedNode(struct ListNode *p, struct ListNode **nodes, size_t n)
{
    for (size_t i = 0; i < n; ++i) if (p == nodes[i]) return 1;
    return 0;
}

static void printValues(const int *a, size_t n)
{
    putchar('[');
    for (size_t i = 0; i < n && i < 12; ++i) printf("%s%d", i ? ", " : "", a[i]);
    if (n > 12) printf(", ... %zu omitted", n - 12);
    putchar(']');
}

static int test(const char *name, const int *a, size_t n, const int *e, size_t m)
{
    struct ListNode **nodes = NULL, *actual = deleteDuplicates(make(a, n, &nodes));
    struct ListNode *p = actual; int ok = 1;
    for (size_t i = 0; i < m; ++i) {
        if (!p || p->val != e[i] || !ownedNode(p, nodes, n)) { ok = 0; break; }
        p = p->next;
    }
    if (p) ok = 0; /* exact length, null termination, no cycle */
    printf("%s\n  Input: ", name); printValues(a, n);
    printf("\n  Actual: ["); p = actual;
    for (size_t i = 0; p && i <= m && i < 12; ++i) { printf("%s%d", i ? ", " : "", p->val); p=p->next; }
    if (p) printf(", ... extra nodes or cycle");
    printf("]\n  Result: %s\n", ok ? "PASS" : "FAIL");
    if (!ok) { printf("  Expected: "); printValues(e, m); putchar('\n'); }
    for (size_t i = 0; i < n; ++i) {
        free(nodes[i]);
    }
    free(nodes);
    return ok;
}

int main(void)
{
    int passed=0,total=0;
#define T(name,a,e) do{++total;passed+=test(name,a,sizeof(a)/sizeof(a[0]),e,sizeof(e)/sizeof(e[0]));}while(0)
    ++total; passed += test("empty list",NULL,0,NULL,0);
    {const int a[]={1},e[]={1};T("single node",a,e);}
    {const int a[]={1,1},e[]={1};T("smallest duplicate",a,e);}
    {const int a[]={1,1,2},e[]={1,2};T("example 1",a,e);}
    {const int a[]={1,1,2,3,3},e[]={1,2,3};T("example 2",a,e);}
    {const int a[]={1,2,3,4},e[]={1,2,3,4};T("already unique",a,e);}
    {const int a[]={5,5,5,5},e[]={5};T("all equal",a,e);}
    {const int a[]={-3,-3,-3,0,1},e[]={-3,0,1};T("duplicates at head",a,e);}
    {const int a[]={-2,0,0,0,1},e[]={-2,0,1};T("duplicates in middle",a,e);}
    {const int a[]={-2,0,4,4,4},e[]={-2,0,4};T("duplicates at tail",a,e);}
    {const int a[]={-100,-100,0,100,100},e[]={-100,0,100};T("value bounds",a,e);}
    {const int a[]={-3,-3,-2,-1,-1,0,0,2,2},e[]={-3,-2,-1,0,2};T("several groups",a,e);}
    {int a[300],e[100];for(int i=0;i<300;++i)a[i]=i/3-100;for(int i=0;i<100;++i)e[i]=i-100;T("maximum size",a,e);}
#undef T
    printf("%d/%d tests passed\n",passed,total);
    return passed==total?EXIT_SUCCESS:EXIT_FAILURE;
}

