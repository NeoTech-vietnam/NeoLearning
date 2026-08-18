/*

Given the head of a singly linked list and two integers left and right where left <= right, 
reverse the nodes of the list from position left to position right, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]

Example 2:

Input: head = [5], left = 1, right = 1
Output: [5]

Constraints:

The number of nodes in the list is n.
1 <= n <= 500
-500 <= Node.val <= 500
1 <= left <= right <= n

Follow up: Could you do it in one pass?

*/

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
typedef struct ListNode {
    int val;
    struct ListNode *next;
} ListNode;

struct ListNode* reverseBetween(struct ListNode* head, int left, int right) {
    struct ListNode dummy = {0, head};
    struct ListNode *before = &dummy;

    for (int position = 1; position < left; ++position) {
        before = before->next;
    }

    struct ListNode *current = before->next;
    for (int position = left; position < right; ++position) {
        struct ListNode *moved = current->next;
        current->next = moved->next;
        moved->next = before->next;
        before->next = moved;
    }

    return dummy.next;
}
#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

static struct ListNode *build(const int *a, int n, struct ListNode ***owned) {
    struct ListNode **p = malloc((size_t)n * sizeof(*p)); assert(p);
    for (int i=0;i<n;i++) { p[i]=malloc(sizeof(*p[i])); assert(p[i]); p[i]->val=a[i]; }
    for (int i=0;i<n;i++) p[i]->next=i+1<n?p[i+1]:NULL;
    *owned=p; return p[0];
}
static void printArray(const int *a,int n) {
    printf("["); int k=n>12?6:n;
    for(int i=0;i<k;i++) printf("%s%d",i?",":"",a[i]);
    if(n>12){printf(",...(%d omitted)...",n-12);for(int i=n-6;i<n;i++)printf(",%d",a[i]);}
    printf("]");
}
static void test(const char *name,const int *input,int n,int left,int right) {
    int *expected=malloc((size_t)n*sizeof(*expected)),*actual=malloc((size_t)n*sizeof(*actual));
    struct ListNode **nodes; assert(expected&&actual);
    for(int i=0;i<n;i++)expected[i]=input[i];
    for(int i=left-1,j=right-1;i<j;i++,j--){int t=expected[i];expected[i]=expected[j];expected[j]=t;}
    struct ListNode *cur=reverseBetween(build(input,n,&nodes),left,right); int count=0,passed=1;
    while(cur&&count<n){actual[count]=cur->val;int source=(count<left-1||count>=right)?count:left+right-2-count;if(cur!=nodes[source]||actual[count]!=expected[count])passed=0;cur=cur->next;count++;}
    if(count!=n||cur)passed=0;
    printf("Test: %s\nInput: head = ",name);printArray(input,n);printf(", left = %d, right = %d\nOutput: ",left,right);printArray(actual,count);printf("\n%s\n\n",passed?"Passed":"Failed");assert(passed);
    for(int i=0;i<n;i++) free(nodes[i]);
    free(nodes);free(actual);free(expected);
}
int main(void) {
    const int ex1[]={1,2,3,4,5},ex2[]={5},two[]={1,2},even[]={1,2,3,4},six[]={1,2,3,4,5,6};
    const int duplicateZero[]={0,7,7,0,7},bounds[]={-500,0,500},odd[]={9,8,7,6,5,4,3}; int stress[500];
    for(int i=0;i<500;i++)stress[i]=i-250;
    test("Example1MiddleRange",ex1,5,2,4);test("Example2SingleNode",ex2,1,1,1);test("SmallestChangingTwoNodeList",two,2,1,2);
    test("FullEvenLengthList",even,4,1,4);test("PrefixIncludingFirstPosition",ex1,5,1,3);test("SuffixIncludingLastPosition",ex1,5,3,5);
    test("MiddleEvenLengthRange",six,6,2,5);test("DuplicatesAndZero",duplicateZero,5,1,5);test("MinimumMaximumValues",bounds,3,1,3);
    test("FirstPositionNoOp",bounds,3,1,1);test("MiddlePositionNoOp",bounds,3,2,2);test("LastPositionNoOp",bounds,3,3,3);
    test("OddLengthInteriorRange",odd,7,2,6);test("MaximumSizeStress",stress,500,1,500);return 0;
}
#endif