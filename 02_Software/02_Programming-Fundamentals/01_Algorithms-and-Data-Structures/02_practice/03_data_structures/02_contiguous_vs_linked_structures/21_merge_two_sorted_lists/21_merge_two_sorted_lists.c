/*

You are given the heads of two sorted linked lists list1 and list2.
Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: list1 = [], list2 = []
Output: []

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]

Constraints:
- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.

*/

#include <stdio.h>
#include <stdlib.h>

struct ListNode
{
    int val;
    struct ListNode* next;
};

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
typedef struct ListNode ListNode;
struct ListNode* mergeTwoLists (struct ListNode* list1, struct ListNode* list2)
{
    ListNode dummy;
    ListNode* current = &dummy;

    dummy.next = NULL;

    while (list1 != NULL && list2 != NULL)
    {
        if (list1->val <= list2->val)
        {
            current->next = list1;
            list1 = list1->next;
        }
        else
        {
            current->next = list2;
            list2 = list2->next;
        }
        current = current->next;
    }
    if (list1 != NULL)
    {
        current->next = list1;
    }
    else
    {
        current->next = list2;
    }
    return dummy.next;
}

static struct ListNode* createList (
    const int* values,
    size_t length,
    struct ListNode*** allocatedNodes
)
{
    struct ListNode* head = NULL;
    struct ListNode* tail = NULL;

    *allocatedNodes = NULL;
    if (length == 0)
    {
        return NULL;
    }

    *allocatedNodes = malloc (length * sizeof (**allocatedNodes));
    if (*allocatedNodes == NULL)
    {
        fprintf (stderr, "Unable to allocate node tracking array.\n");
        exit (EXIT_FAILURE);
    }

    for (size_t i = 0; i < length; ++i)
    {
        struct ListNode* node = malloc (sizeof (*node));
        if (node == NULL)
        {
            fprintf (stderr, "Unable to allocate a test node.\n");
            exit (EXIT_FAILURE);
        }

        node->val = values[i];
        node->next = NULL;
        (*allocatedNodes)[i] = node;

        if (tail == NULL)
        {
            head = node;
        }
        else
        {
            tail->next = node;
        }
        tail = node;
    }

    return head;
}

static int markOriginalNode (
    const struct ListNode* node,
    struct ListNode* const* firstNodes,
    size_t firstLength,
    struct ListNode* const* secondNodes,
    size_t secondLength,
    unsigned char* firstSeen,
    unsigned char* secondSeen
)
{
    for (size_t i = 0; i < firstLength; ++i)
    {
        if (node == firstNodes[i])
        {
            if (firstSeen[i] != 0)
            {
                return 0;
            }
            firstSeen[i] = 1;
            return 1;
        }
    }

    for (size_t i = 0; i < secondLength; ++i)
    {
        if (node == secondNodes[i])
        {
            if (secondSeen[i] != 0)
            {
                return 0;
            }
            secondSeen[i] = 1;
            return 1;
        }
    }

    return 0;
}

static int mergedListMatches (
    const struct ListNode* head,
    const int* expected,
    size_t expectedLength,
    struct ListNode* const* firstNodes,
    size_t firstLength,
    struct ListNode* const* secondNodes,
    size_t secondLength
)
{
    const struct ListNode* current = head;
    unsigned char* firstSeen = calloc (firstLength, sizeof (*firstSeen));
    unsigned char* secondSeen = calloc (secondLength, sizeof (*secondSeen));
    int passed = 1;

    if (
        (firstLength > 0 && firstSeen == NULL)
        || (secondLength > 0 && secondSeen == NULL)
    )
    {
        fprintf (stderr, "Unable to allocate node-visit tracking arrays.\n");
        free (firstSeen);
        free (secondSeen);
        exit (EXIT_FAILURE);
    }

    if (expectedLength != firstLength + secondLength)
    {
        passed = 0;
    }

    for (size_t i = 0; passed && i < expectedLength; ++i)
    {
        if (
            current == NULL
            || !markOriginalNode (
                current,
                firstNodes,
                firstLength,
                secondNodes,
                secondLength,
                firstSeen,
                secondSeen
            )
            || current->val != expected[i]
        )
        {
            passed = 0;
            break;
        }
        current = current->next;
    }

    if (passed && current != NULL)
    {
        passed = 0;
    }

    for (size_t i = 0; passed && i < firstLength; ++i)
    {
        if (firstSeen[i] == 0)
        {
            passed = 0;
        }
    }
    for (size_t i = 0; passed && i < secondLength; ++i)
    {
        if (secondSeen[i] == 0)
        {
            passed = 0;
        }
    }

    free (firstSeen);
    free (secondSeen);
    return passed;
}

static void printArray (const int* values, size_t length)
{
    const size_t displayLimit = 12;

    putchar ('[');
    for (size_t i = 0; i < length && i < displayLimit; ++i)
    {
        if (i > 0)
        {
            printf (", ");
        }
        printf ("%d", values[i]);
    }
    if (length > displayLimit)
    {
        printf (", ... %zu values omitted", length - displayLimit);
    }
    putchar (']');
}

static void printListBounded (
    const struct ListNode* head,
    size_t expectedLength
)
{
    const size_t displayLimit = 12;
    const struct ListNode* current = head;
    size_t visited = 0;

    putchar ('[');
    while (
        current != NULL
        && visited < expectedLength
        && visited < displayLimit
    )
    {
        if (visited > 0)
        {
            printf (", ");
        }
        printf ("%d", current->val);
        current = current->next;
        ++visited;
    }

    if (expectedLength > displayLimit && visited == displayLimit)
    {
        printf (", ... %zu values omitted", expectedLength - displayLimit);
    }
    else if (current != NULL)
    {
        printf (", ... <extra nodes or cycle>");
    }
    putchar (']');
}

static void destroyOriginalNodes (
    struct ListNode** nodes,
    size_t length
)
{
    for (size_t i = 0; i < length; ++i)
    {
        free (nodes[i]);
    }
    free (nodes);
}

static int runTest (
    const char* name,
    const int* firstInput,
    size_t firstLength,
    const int* secondInput,
    size_t secondLength,
    const int* expected,
    size_t expectedLength
)
{
    struct ListNode** firstNodes = NULL;
    struct ListNode** secondNodes = NULL;
    struct ListNode* first = createList (
        firstInput,
        firstLength,
        &firstNodes
    );
    struct ListNode* second = createList (
        secondInput,
        secondLength,
        &secondNodes
    );
    struct ListNode* actual = mergeTwoLists (first, second);
    int passed = mergedListMatches (
        actual,
        expected,
        expectedLength,
        firstNodes,
        firstLength,
        secondNodes,
        secondLength
    );

    printf ("%s\n", name);
    printf ("  Input:    ");
    printArray (firstInput, firstLength);
    printf (" + ");
    printArray (secondInput, secondLength);
    printf ("\n  Actual:   ");
    printListBounded (actual, expectedLength);
    printf ("\n  Result:   %s\n", passed ? "PASS" : "FAIL");
    if (!passed)
    {
        printf ("  Expected: ");
        printArray (expected, expectedLength);
        putchar ('\n');
    }
    putchar ('\n');

    destroyOriginalNodes (firstNodes, firstLength);
    destroyOriginalNodes (secondNodes, secondLength);
    return passed;
}

int main (void)
{
    int passed = 0;
    int total = 0;

#define RUN_TEST(name, first, second, expected)                             \
    do {                                                                    \
        ++total;                                                            \
        passed += runTest(                                                  \
            (name),                                                         \
            (first),                                                        \
            sizeof(first) / sizeof((first)[0]),                             \
            (second),                                                       \
            sizeof(second) / sizeof((second)[0]),                           \
            (expected),                                                     \
            sizeof(expected) / sizeof((expected)[0])                        \
        );                                                                  \
    } while (0)

    {
        const int first[] = { 1, 2, 4 };
        const int second[] = { 1, 3, 4 };
        const int expected[] = { 1, 1, 2, 3, 4, 4 };
        RUN_TEST ("example 1: overlapping values", first, second, expected);
    }

    {
        ++total;
        passed += runTest (
            "example 2: both lists empty",
            NULL,
            0,
            NULL,
            0,
            NULL,
            0
        );
    }

    {
        const int second[] = { 0 };
        const int expected[] = { 0 };

        ++total;
        passed += runTest (
            "example 3: first list empty",
            NULL,
            0,
            second,
            sizeof (second) / sizeof (second[0]),
            expected,
            sizeof (expected) / sizeof (expected[0])
        );
    }

    {
        const int first[] = { 0 };
        const int expected[] = { 0 };

        ++total;
        passed += runTest (
            "second list empty",
            first,
            sizeof (first) / sizeof (first[0]),
            NULL,
            0,
            expected,
            sizeof (expected) / sizeof (expected[0])
        );
    }

    {
        const int first[] = { 1 };
        const int second[] = { 2 };
        const int expected[] = { 1, 2 };
        RUN_TEST ("single nodes already ordered", first, second, expected);
    }

    {
        const int first[] = { 2 };
        const int second[] = { 1 };
        const int expected[] = { 1, 2 };
        RUN_TEST ("single nodes require second first", first, second, expected);
    }

    {
        const int first[] = { 1, 1, 1 };
        const int second[] = { 1, 1 };
        const int expected[] = { 1, 1, 1, 1, 1 };
        RUN_TEST ("duplicate values", first, second, expected);
    }

    {
        const int first[] = { -100, -50, 0, 100 };
        const int second[] = { -100, -75, 50, 100 };
        const int expected[] = { -100, -100, -75, -50, 0, 50, 100, 100 };
        RUN_TEST ("negative and boundary values", first, second, expected);
    }

    {
        const int first[] = { 1, 3, 5, 7 };
        const int second[] = { 2, 4, 6, 8 };
        const int expected[] = { 1, 2, 3, 4, 5, 6, 7, 8 };
        RUN_TEST ("alternating values", first, second, expected);
    }

    {
        const int first[] = { 1, 2, 3 };
        const int second[] = { 4, 5, 6 };
        const int expected[] = { 1, 2, 3, 4, 5, 6 };
        RUN_TEST ("first list entirely smaller", first, second, expected);
    }

    {
        const int first[] = { 4, 5, 6 };
        const int second[] = { 1, 2, 3 };
        const int expected[] = { 1, 2, 3, 4, 5, 6 };
        RUN_TEST ("second list entirely smaller", first, second, expected);
    }

    {
        enum { HALF_SIZE = 25, TOTAL_SIZE = 50 };
        int first[HALF_SIZE];
        int second[HALF_SIZE];
        int expected[TOTAL_SIZE];

        for (int i = 0; i < HALF_SIZE; ++i)
        {
            first[i] = i * 2;
            second[i] = i * 2 + 1;
        }
        for (int i = 0; i < TOTAL_SIZE; ++i)
        {
            expected[i] = i;
        }

        RUN_TEST ("maximum combined size", first, second, expected);
    }

#undef RUN_TEST

    printf ("%d/%d tests passed\n", passed, total);
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
