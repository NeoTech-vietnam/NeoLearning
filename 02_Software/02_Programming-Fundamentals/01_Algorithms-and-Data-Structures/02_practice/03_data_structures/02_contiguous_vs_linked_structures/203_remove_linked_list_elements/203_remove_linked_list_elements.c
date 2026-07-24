/*
Given the head of a linked list and an integer val, remove all the nodes of the linked list that has Node.val == val, and return the new head.

Example 1:

Input: head = [1,2,6,3,4,5,6], val = 6
Output: [1,2,3,4,5]

Example 2:

Input: head = [1,2,6,3,4,5,6], val = 6
Output: [1,2,3,4,5]

Example 3:

Input: head = [7,7,7,7], val = 7
Output: []

The number of nodes in the list is in the range [0, 10^4].
1 <= Node.val <= 50
0 <= val <= 50

*/

#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

typedef struct ListNode ListNode;

struct ListNode* removeElements(struct ListNode* head, int val) {
    ListNode dummyHead = {0, head};
    ListNode *current = &dummyHead;

    while (current->next != NULL) {
        if (current->next->val == val) {
            current->next = current->next->next;
        } else {
            current = current->next;
        }
    }
    return dummyHead.next;
}

static struct ListNode *createList(
    const int *values,
    size_t length,
    struct ListNode ***allocatedNodes
)
{
    struct ListNode *head = NULL;
    struct ListNode *tail = NULL;

    *allocatedNodes = NULL;
    if (length == 0) {
        return NULL;
    }

    *allocatedNodes = malloc(length * sizeof(**allocatedNodes));
    if (*allocatedNodes == NULL) {
        fprintf(stderr, "Unable to allocate test node tracking array.\n");
        exit(EXIT_FAILURE);
    }

    for (size_t i = 0; i < length; ++i) {
        struct ListNode *node = malloc(sizeof(*node));
        if (node == NULL) {
            fprintf(stderr, "Unable to allocate a test node.\n");
            exit(EXIT_FAILURE);
        }

        node->val = values[i];
        node->next = NULL;
        (*allocatedNodes)[i] = node;

        if (tail == NULL) {
            head = node;
        } else {
            tail->next = node;
        }
        tail = node;
    }

    return head;
}

static int listMatches(
    const struct ListNode *head,
    const int *expected,
    size_t expectedLength
)
{
    const struct ListNode *current = head;

    for (size_t i = 0; i < expectedLength; ++i) {
        if (current == NULL || current->val != expected[i]) {
            return 0;
        }
        current = current->next;
    }

    /*
     * Requiring NULL here also catches extra nodes and cycles that extend
     * beyond the expected result.
     */
    return current == NULL;
}

static void destroyOriginalNodes(
    struct ListNode **allocatedNodes,
    size_t length
)
{
    for (size_t i = 0; i < length; ++i) {
        free(allocatedNodes[i]);
    }
    free(allocatedNodes);
}

static int runTest(
    const char *name,
    const int *input,
    size_t inputLength,
    int valueToRemove,
    const int *expected,
    size_t expectedLength
)
{
    struct ListNode **allocatedNodes = NULL;
    struct ListNode *head = createList(input, inputLength, &allocatedNodes);
    struct ListNode *actual = removeElements(head, valueToRemove);
    int passed = listMatches(actual, expected, expectedLength);

    printf("%s: %s\n", name, passed ? "PASS" : "FAIL");
    destroyOriginalNodes(allocatedNodes, inputLength);
    return passed;
}

int main(void)
{
    int passed = 0;
    int total = 0;

#define RUN_TEST(name, input, value, expected)                              \
    do {                                                                    \
        ++total;                                                            \
        passed += runTest(                                                  \
            (name),                                                         \
            (input),                                                        \
            sizeof(input) / sizeof((input)[0]),                             \
            (value),                                                        \
            (expected),                                                     \
            sizeof(expected) / sizeof((expected)[0])                        \
        );                                                                  \
    } while (0)

    {
        ++total;
        passed += runTest("empty list", NULL, 0, 1, NULL, 0);
    }

    {
        const int input[] = {1};
        ++total;
        passed += runTest("single matching node", input, 1, 1, NULL, 0);
    }

    {
        const int input[] = {1};
        const int expected[] = {1};
        RUN_TEST("single non-matching node", input, 2, expected);
    }

    {
        const int input[] = {1, 2, 6, 3, 4, 5, 6};
        const int expected[] = {1, 2, 3, 4, 5};
        RUN_TEST("example: matches in middle and tail", input, 6, expected);
    }

    {
        const int input[] = {7, 7, 7, 7};
        ++total;
        passed += runTest("all nodes match", input, 4, 7, NULL, 0);
    }

    {
        const int input[] = {6, 1, 2, 3};
        const int expected[] = {1, 2, 3};
        RUN_TEST("remove one head node", input, 6, expected);
    }

    {
        const int input[] = {6, 6, 6, 1, 2};
        const int expected[] = {1, 2};
        RUN_TEST("remove consecutive head nodes", input, 6, expected);
    }

    {
        const int input[] = {1, 2, 6, 6, 6, 3};
        const int expected[] = {1, 2, 3};
        RUN_TEST("remove consecutive middle nodes", input, 6, expected);
    }

    {
        const int input[] = {1, 2, 3, 6, 6, 6};
        const int expected[] = {1, 2, 3};
        RUN_TEST("remove consecutive tail nodes", input, 6, expected);
    }

    {
        const int input[] = {6, 1, 6, 2, 6, 3, 6};
        const int expected[] = {1, 2, 3};
        RUN_TEST("alternating matching nodes", input, 6, expected);
    }

    {
        const int input[] = {1, 2, 3, 4, 5};
        const int expected[] = {1, 2, 3, 4, 5};
        RUN_TEST("no nodes match", input, 6, expected);
    }

    {
        const int input[] = {1, 50, 1, 50, 1};
        const int expected[] = {1, 1, 1};
        RUN_TEST("remove maximum node value", input, 50, expected);
    }

    {
        const int input[] = {1, 2, 3};
        const int expected[] = {1, 2, 3};
        RUN_TEST("remove value zero", input, 0, expected);
    }

    {
        enum { MAX_NODES = 10000 };
        int *input = malloc(MAX_NODES * sizeof(*input));
        int *expected = malloc((MAX_NODES / 2) * sizeof(*expected));

        if (input == NULL || expected == NULL) {
            fprintf(stderr, "Unable to allocate maximum-size test data.\n");
            free(input);
            free(expected);
            return EXIT_FAILURE;
        }

        for (int i = 0; i < MAX_NODES; ++i) {
            input[i] = (i % 2) + 1;
        }
        for (int i = 0; i < MAX_NODES / 2; ++i) {
            expected[i] = 2;
        }

        ++total;
        passed += runTest(
            "maximum-size alternating list",
            input,
            MAX_NODES,
            1,
            expected,
            MAX_NODES / 2
        );

        free(input);
        free(expected);
    }

#undef RUN_TEST

    printf("\n%d/%d tests passed\n", passed, total);
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
