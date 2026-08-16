/*
Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:

Input: head = []
Output: []

Constraints:
- The number of nodes in the list is the range [0, 5000].
- -5000 <= Node.val <= 5000

Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?
*/

#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
typedef struct ListNode ListNode;
struct ListNode* reverseList(struct ListNode* head) {
    ListNode *previous = NULL;
    ListNode *current = head;

    while (current != NULL) {
        ListNode *next = current->next;
        current->next = previous;
        previous = current;
        current = next;
    }

    return previous;
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

static int reversedListMatches(
    const struct ListNode *head,
    const int *input,
    size_t length
)
{
    const struct ListNode *current = head;

    for (size_t i = 0; i < length; ++i) {
        if (current == NULL || current->val != input[length - 1 - i]) {
            return 0;
        }
        current = current->next;
    }

    /*
     * Requiring NULL also catches extra nodes and cycles extending beyond
     * the expected reversed list.
     */
    return current == NULL;
}

static int usesOriginalNodesInReverseOrder(
    const struct ListNode *head,
    struct ListNode *const *allocatedNodes,
    size_t length
)
{
    const struct ListNode *current = head;

    for (size_t i = 0; i < length; ++i) {
        if (current != allocatedNodes[length - 1 - i]) {
            return 0;
        }
        current = current->next;
    }

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

static void printInputList(const int *values, size_t length)
{
    const size_t edgeLength = 10;

    putchar('[');
    for (size_t i = 0; i < length; ++i) {
        if (length > edgeLength * 2 && i == edgeLength) {
            printf(", ... %zu values omitted ...", length - edgeLength * 2);
            i = length - edgeLength;
        }

        if (i > 0) {
            printf(", ");
        }
        printf("%d", values[i]);
    }
    putchar(']');
}

static void printOutputList(
    const struct ListNode *head,
    size_t expectedLength
)
{
    const size_t edgeLength = 10;
    const struct ListNode *current = head;
    size_t visited = 0;

    putchar('[');
    while (current != NULL && visited < expectedLength) {
        if (expectedLength > edgeLength * 2 && visited == edgeLength) {
            size_t omitted = expectedLength - edgeLength * 2;

            printf(", ... %zu values omitted ...", omitted);
            for (size_t i = 0; i < omitted && current != NULL; ++i) {
                current = current->next;
                ++visited;
            }
            if (current == NULL) {
                break;
            }
        }

        if (visited > 0) {
            printf(", ");
        }
        printf("%d", current->val);
        current = current->next;
        ++visited;
    }

    if (visited < expectedLength) {
        printf("%s<ended early>", visited > 0 ? ", " : "");
    } else if (current != NULL) {
        printf(", ... <extra nodes or cycle>");
    }
    putchar(']');
}

static int runTest(
    const char *name,
    const int *input,
    size_t inputLength
)
{
    struct ListNode **allocatedNodes = NULL;
    struct ListNode *head = createList(input, inputLength, &allocatedNodes);
    struct ListNode *actual = reverseList(head);
    int valuesPassed = reversedListMatches(actual, input, inputLength);
    int nodesPassed = inputLength == 0
        ? actual == NULL
        : usesOriginalNodesInReverseOrder(actual, allocatedNodes, inputLength);
    int passed = valuesPassed && nodesPassed;

    printf("%s\n", name);
    printf("  Input:  ");
    printInputList(input, inputLength);
    printf("\n  Output: ");
    printOutputList(actual, inputLength);
    printf("\n  Result: %s\n\n", passed ? "PASS" : "FAIL");

    destroyOriginalNodes(allocatedNodes, inputLength);
    return passed;
}

int main(void)
{
    int passed = 0;
    int total = 0;

#define RUN_TEST(name, input)                                               \
    do {                                                                    \
        ++total;                                                            \
        passed += runTest(                                                  \
            (name),                                                         \
            (input),                                                        \
            sizeof(input) / sizeof((input)[0])                              \
        );                                                                  \
    } while (0)

    {
        ++total;
        passed += runTest("empty list", NULL, 0);
    }

    {
        const int input[] = {1};
        RUN_TEST("single node", input);
    }

    {
        const int input[] = {1, 2};
        RUN_TEST("two nodes", input);
    }

    {
        const int input[] = {1, 2, 3, 4, 5};
        RUN_TEST("example: odd-length list", input);
    }

    {
        const int input[] = {1, 2, 3, 4};
        RUN_TEST("even-length list", input);
    }

    {
        const int input[] = {7, 7, 7, 7};
        RUN_TEST("duplicate values", input);
    }

    {
        const int input[] = {-5000, -1, 0, 1, 5000};
        RUN_TEST("negative, zero, and boundary values", input);
    }

    {
        enum { MAX_NODES = 5000 };
        int *input = malloc(MAX_NODES * sizeof(*input));

        if (input == NULL) {
            fprintf(stderr, "Unable to allocate maximum-size test data.\n");
            return EXIT_FAILURE;
        }

        for (int i = 0; i < MAX_NODES; ++i) {
            input[i] = (i % 10001) - 5000;
        }

        ++total;
        passed += runTest("maximum-size list", input, MAX_NODES);
        free(input);
    }

#undef RUN_TEST

    printf("\n%d/%d tests passed\n", passed, total);
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
