/*
Given the head of a linked list, 
remove the nth node from the end of the list and return its head.

Example 1:

Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]

Example 2:

Input: head = [1], n = 1
Output: []

Example 3:

Input: head = [1,2], n = 1
Output: [1]

Constraints:

The number of nodes in the list is sz.
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz

Follow up: Could you do this in one pass?

*/

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
	int val;
	struct ListNode *next;
} ListNode;
#endif

struct ListNode* removeNthFromEnd(struct ListNode* head, int n) {
	struct ListNode dummy = {0, head};
	struct ListNode *fast = &dummy;
	struct ListNode *slow = &dummy;

	for (int i = 0; i < n; ++i) {
		fast = fast->next;
	}
	while (fast->next != NULL) {
		fast = fast->next;
		slow = slow->next;
	}
	slow->next = slow->next->next;

	return dummy.next;
}

#ifdef LOCAL_TEST
static void print_list(const struct ListNode *head)
{
	printf("[");
	for (const struct ListNode *node = head; node != NULL; node = node->next) {
		printf("%d%s", node->val, node->next == NULL ? "" : ",");
	}
	printf("]");
}

static struct ListNode *create_list(const int *values, size_t length,
									struct ListNode ***nodes)
{
	struct ListNode *head = NULL;
	struct ListNode *tail = NULL;

	*nodes = malloc(length * sizeof(**nodes));
	if (*nodes == NULL) {
		fprintf(stderr, "Unable to allocate test nodes.\n");
		exit(EXIT_FAILURE);
	}
	for (size_t i = 0; i < length; ++i) {
		(*nodes)[i] = malloc(sizeof(*(*nodes)[i]));
		if ((*nodes)[i] == NULL) {
			fprintf(stderr, "Unable to allocate test node.\n");
			exit(EXIT_FAILURE);
		}
		(*nodes)[i]->val = values[i];
		(*nodes)[i]->next = NULL;
		if (tail == NULL) {
			head = (*nodes)[i];
		} else {
			tail->next = (*nodes)[i];
		}
		tail = (*nodes)[i];
	}
	return head;
}

static int verify_result(const struct ListNode *actual, const int *expected,
						 size_t expectedLength, struct ListNode **nodes,
						 size_t inputLength, size_t removedIndex)
{
	size_t outputIndex = 0;
	for (size_t inputIndex = 0; inputIndex < inputLength; ++inputIndex) {
		if (inputIndex == removedIndex) {
			continue;
		}
		if (actual == NULL || actual != nodes[inputIndex] ||
			outputIndex >= expectedLength || actual->val != expected[outputIndex]) {
			return 0;
		}
		actual = actual->next;
		++outputIndex;
	}
	return actual == NULL && outputIndex == expectedLength;
}

static void run_case(const char *name, const int *input, size_t inputLength,
					 int n, const int *expected, size_t expectedLength,
					 int *passed, int *total)
{
	struct ListNode **nodes = NULL;
	struct ListNode *head = create_list(input, inputLength, &nodes);
	struct ListNode *actual = removeNthFromEnd(head, n);
	size_t removedIndex = inputLength - (size_t)n;
	int valid = verify_result(actual, expected, expectedLength, nodes,
							  inputLength, removedIndex);

	++(*total);
	printf("Test: %s\n", name);
	printf("Input: head = [");
	for (size_t i = 0; i < inputLength; ++i) {
		printf("%d%s", input[i], i + 1 == inputLength ? "" : ",");
	}
	printf("], n = %d\n", n);
	printf("Output: ");
	print_list(actual);
	printf("\n%s\n\n", valid ? "Passed" : "Failed");
	assert(valid);
	*passed += valid;

	for (size_t i = 0; i < inputLength; ++i) {
		free(nodes[i]);
	}
	free(nodes);
}

#define RUN_CASE(name, input, n, expected)                                  \
	run_case((name), (input), sizeof(input) / sizeof((input)[0]), (n),      \
			 (expected), sizeof(expected) / sizeof((expected)[0]),          \
			 &passed, &total)

int main(void)
{
	int passed = 0;
	int total = 0;

	const int exampleOne[] = {1, 2, 3, 4, 5};
	const int exampleOneExpected[] = {1, 2, 3, 5};
	RUN_CASE("Example 1 removes second from end", exampleOne, 2, exampleOneExpected);

	const int exampleTwo[] = {1};
	run_case("Example 2 removes only node", exampleTwo, 1, 1, NULL, 0, &passed, &total);

	const int exampleThree[] = {1, 2};
	const int exampleThreeExpected[] = {1};
	RUN_CASE("Example 3 removes tail", exampleThree, 1, exampleThreeExpected);

	const int twoNodesRemoveHead[] = {1, 2};
	const int twoNodesRemoveHeadExpected[] = {2};
	RUN_CASE("Two nodes remove head", twoNodesRemoveHead, 2, twoNodesRemoveHeadExpected);

	const int oddLengthMiddle[] = {10, 20, 30, 40, 50};
	const int oddLengthMiddleExpected[] = {10, 20, 40, 50};
	RUN_CASE("Odd length removes middle", oddLengthMiddle, 3, oddLengthMiddleExpected);

	const int evenLengthMiddle[] = {1, 2, 3, 4, 5, 6};
	const int evenLengthMiddleExpected[] = {1, 2, 3, 5, 6};
	RUN_CASE("Even length removes middle", evenLengthMiddle, 3, evenLengthMiddleExpected);

	const int duplicateValues[] = {7, 7, 7, 7};
	const int duplicateValuesExpected[] = {7, 7, 7};
	RUN_CASE("Duplicates preserve node identity", duplicateValues, 2, duplicateValuesExpected);

	const int zeroAtHead[] = {0, 1, 2};
	const int zeroAtHeadExpected[] = {1, 2};
	RUN_CASE("Minimum value at removed head", zeroAtHead, 3, zeroAtHeadExpected);

	const int maximumAtTail[] = {1, 2, 100};
	const int maximumAtTailExpected[] = {1, 2};
	RUN_CASE("Maximum value at removed tail", maximumAtTail, 1, maximumAtTailExpected);

	const int zeroInMiddle[] = {5, 0, 6};
	const int zeroInMiddleExpected[] = {5, 6};
	RUN_CASE("Zero removed from middle", zeroInMiddle, 2, zeroInMiddleExpected);

	const int removeFirstOfDuplicates[] = {9, 9, 8};
	const int removeFirstOfDuplicatesExpected[] = {9, 8};
	RUN_CASE("Head duplicate removal preserves second node", removeFirstOfDuplicates, 3,
			 removeFirstOfDuplicatesExpected);

	const int removeLastOfDuplicates[] = {8, 9, 9};
	const int removeLastOfDuplicatesExpected[] = {8, 9};
	RUN_CASE("Tail duplicate removal preserves first node", removeLastOfDuplicates, 1,
			 removeLastOfDuplicatesExpected);

	const int nearHead[] = {1, 2, 3, 4, 5, 6};
	const int nearHeadExpected[] = {1, 3, 4, 5, 6};
	RUN_CASE("Removes node adjacent to head", nearHead, 5, nearHeadExpected);

	int maximumSize[30];
	int maximumSizeExpected[29];
	for (int i = 0; i < 30; ++i) maximumSize[i] = i;
	for (int i = 0, write = 0; i < 30; ++i) {
		if (i != 15) maximumSizeExpected[write++] = i;
	}
	RUN_CASE("Maximum size removes middle node", maximumSize, 15, maximumSizeExpected);

	printf("=== Summary ===\nPassed: %d/%d\n", passed, total);
	return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}

#undef RUN_CASE
#endif