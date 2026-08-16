/*

Given the head of a singly linked list, return the middle node of the linked list.

If there are two middle nodes, return the second middle node.

Example 1:

Input: head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: The middle node of the list is node 3.

Example 2:
Input: head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.

Constraints:
- The number of nodes in the list is in the range [1, 100].
- 1 <= Node.val <= 100

*/

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */

struct ListNode {
    int val;
    struct ListNode *next;
};

typedef struct ListNode ListNode;
struct ListNode* middleNode(struct ListNode* head) {
    ListNode *slow = head;
    ListNode *fast = head;
    while(fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

#ifdef LOCAL_TEST
#include <stdio.h>
#include <stdlib.h>

// Reference implementation
struct ListNode* referenceMiddleNode(struct ListNode* head) {
    struct ListNode* slow = head;
    struct ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

struct ListNode* buildList(const int* vals, int size) {
    struct ListNode dummy;
    struct ListNode* tail = &dummy;
    for (int i = 0; i < size; ++i) {
        tail->next = (struct ListNode*)malloc(sizeof(struct ListNode));
        tail->next->val = vals[i];
        tail->next->next = NULL;
        tail = tail->next;
    }
    return dummy.next;
}

int* listToArray(struct ListNode* node, int* outSize) {
    int capacity = 16;
    int* arr = (int*)malloc(capacity * sizeof(int));
    int count = 0;
    while (node) {
        if (count == capacity) {
            capacity *= 2;
            arr = (int*)realloc(arr, capacity * sizeof(int));
        }
        arr[count++] = node->val;
        node = node->next;
    }
    *outSize = count;
    return arr;
}

int arraysEqual(const int* a, int aSize, const int* b, int bSize) {
    if (aSize != bSize) return 0;
    for (int i = 0; i < aSize; ++i) if (a[i] != b[i]) return 0;
    return 1;
}

void runTest(const char* name, const int* input, int inSize, const int* expected, int expSize) {
    struct ListNode* head = buildList(input, inSize);
    struct ListNode* out = middleNode(head);
    int outSize;
    int* actual = listToArray(out, &outSize);
    int pass = arraysEqual(actual, outSize, expected, expSize);
    printf("Test: %s\n", name);
    printf("Input: list = [");
    for (int i = 0; i < inSize; ++i) {
        if (i) printf(",");
        printf("%d", input[i]);
    }
    printf("]\n");
    printf("Output: [");
    for (int i = 0; i < outSize; ++i) {
        if (i) printf(",");
        printf("%d", actual[i]);
    }
    printf("]\n");
    printf("%s\n\n", pass ? "Passed" : "Failed");
    // cleanup omitted for brevity
}

int main() {
    int ex1[] = {1,2,3,4,5};
    int ex1exp[] = {3,4,5};
    runTest("Example1", ex1, 5, ex1exp, 3);
    int ex2[] = {1,2,3,4,5,6};
    int ex2exp[] = {4,5,6};
    runTest("Example2", ex2, 6, ex2exp, 3);
    int single[] = {42};
    int singleexp[] = {42};
    runTest("SingleNode", single, 1, singleexp, 1);
    int two[] = {1,2};
    int twoexp[] = {2};
    runTest("TwoNodes", two, 2, twoexp, 1);
    int allsame[] = {7,7,7,7,7};
    int allsameexp[] = {7,7,7};
    runTest("AllSame", allsame, 5, allsameexp, 3);
    int minmax[] = {1,100,1,100,1};
    int minmaxexp[] = {1,100,1};
    runTest("MinMaxValues", minmax, 5, minmaxexp, 3);
    int even[] = {10,20,30,40};
    int evenexp[] = {30,40};
    runTest("EvenLengthMiddleSecond", even, 4, evenexp, 2);
    int odd[] = {5,4,3,2,1};
    int oddexp[] = {3,2,1};
    runTest("OddLengthMiddle", odd, 5, oddexp, 3);
    int dup[] = {1,2,2,2,3,4};
    int dupexp[] = {2,3,4};
    runTest("DuplicateMiddle", dup, 6, dupexp, 3);
    // Long list test
    int* longlist = (int*)malloc(5000 * sizeof(int));
    for (int i = 0; i < 5000; ++i) longlist[i] = 1;
    int* longexp = (int*)malloc(2500 * sizeof(int));
    for (int i = 0; i < 2500; ++i) longexp[i] = 1;
    runTest("LongList", longlist, 5000, longexp, 2500);
    free(longlist);
    free(longexp);
    return 0;
}
#endif // LOCAL_TEST