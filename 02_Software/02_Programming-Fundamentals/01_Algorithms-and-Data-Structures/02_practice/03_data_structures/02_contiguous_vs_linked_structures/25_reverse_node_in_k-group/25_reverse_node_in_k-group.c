/*
Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.
k is a positive integer and is less than or equal to the length of the linked list. 
If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.

You may not alter the values in the list's nodes, only nodes themselves may be changed.

Example 1:

Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]

Example 2:

Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]

Constraints:

The number of nodes in the list is n.
1 <= k <= n <= 5000
0 <= Node.val <= 1000

Follow-up: Can you solve the problem in O(1) extra memory space?

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

struct ListNode {
	int val;
	struct ListNode *next;
};
#endif

struct ListNode* reverseKGroup(struct ListNode* head, int k) {
	struct ListNode dummy = {0, head};
	struct ListNode *groupPrevious = &dummy;

	for (;;) {
		struct ListNode *groupEnd = groupPrevious;
		for (int i = 0; i < k && groupEnd != NULL; ++i) {
			groupEnd = groupEnd->next;
		}
		if (groupEnd == NULL) {
			return dummy.next;
		}

		struct ListNode *groupNext = groupEnd->next;
		struct ListNode *current = groupPrevious->next;
		struct ListNode *previous = groupNext;
		while (current != groupNext) {
			struct ListNode *next = current->next;
			current->next = previous;
			previous = current;
			current = next;
		}

		current = groupPrevious->next;
		groupPrevious->next = groupEnd;
		groupPrevious = current;
	}
}

#ifdef LOCAL_TEST
static void print_values(const int *values, size_t length)
{
	printf("[");
	for (size_t i = 0; i < length; ++i) {
		if (length > 20 && i == 10) {
			printf("...%zu omitted...", length - 20);
			i = length - 10;
		}
		printf("%s%d", i == 0 ? "" : ",", values[i]);
	}
	printf("]");
}

static struct ListNode *create_list(const int *values, size_t length,
									struct ListNode ***nodes)
{
	struct ListNode *head = NULL;
	struct ListNode *tail = NULL;
	*nodes = malloc(length * sizeof(**nodes));
	if (*nodes == NULL) exit(EXIT_FAILURE);
	for (size_t i = 0; i < length; ++i) {
		(*nodes)[i] = malloc(sizeof(*(*nodes)[i]));
		if ((*nodes)[i] == NULL) exit(EXIT_FAILURE);
		(*nodes)[i]->val = values[i];
		(*nodes)[i]->next = NULL;
		if (tail == NULL) head = (*nodes)[i]; else tail->next = (*nodes)[i];
		tail = (*nodes)[i];
	}
	return head;
}

static int verify_result(const struct ListNode *actual, const int *input,
						 size_t length, int k, struct ListNode **nodes)
{
	for (size_t outputIndex = 0; outputIndex < length; ++outputIndex) {
		size_t groupStart = outputIndex / (size_t)k * (size_t)k;
		size_t expectedIndex = groupStart + (size_t)k <= length
			? groupStart + (size_t)k - 1 - outputIndex % (size_t)k
			: outputIndex;
		if (actual == NULL || actual != nodes[expectedIndex] ||
			actual->val != input[expectedIndex]) return 0;
		actual = actual->next;
	}
	return actual == NULL;
}

static void run_case(const char *name, const int *input, size_t length, int k,
					 int *passed, int *total)
{
	struct ListNode **nodes = NULL;
	struct ListNode *head = create_list(input, length, &nodes);
	struct ListNode *actual = reverseKGroup(head, k);
	int valid = verify_result(actual, input, length, k, nodes);
	int *output = malloc(length * sizeof(*output));
	if (output == NULL) exit(EXIT_FAILURE);
	const struct ListNode *current = actual;
	for (size_t i = 0; i < length; ++i) {
		output[i] = current == NULL ? -1 : current->val;
		if (current != NULL) current = current->next;
	}

	++(*total);
	printf("Test: %s\nInput: head = ", name);
	print_values(input, length);
	printf(", k = %d\nOutput: ", k);
	print_values(output, length);
	printf("\n%s\n\n", valid ? "Passed" : "Failed");
	assert(valid);
	*passed += valid;
	free(output);
	for (size_t i = 0; i < length; ++i) free(nodes[i]);
	free(nodes);
}

#define RUN_CASE(name, input, k)                                            \
	run_case((name), (input), sizeof(input) / sizeof((input)[0]), (k),       \
			 &passed, &total)

int main(void)
{
	int passed = 0;
	int total = 0;
	const int exampleOne[] = {1, 2, 3, 4, 5};
	RUN_CASE("Example 1 reverses pairs with remainder", exampleOne, 2);
	const int exampleTwo[] = {1, 2, 3, 4, 5};
	RUN_CASE("Example 2 reverses one triple", exampleTwo, 3);
	const int singleNode[] = {42};
	RUN_CASE("Minimum list and k", singleNode, 1);
	const int unchangedKOne[] = {0, 1, 1000, 2};
	RUN_CASE("k equals one preserves list", unchangedKOne, 1);
	const int entireList[] = {1, 2, 3, 4, 5};
	RUN_CASE("k equals length reverses entire list", entireList, 5);
	const int exactPairs[] = {1, 2, 3, 4, 5, 6};
	RUN_CASE("Exact multiple of pairs", exactPairs, 2);
	const int exactTriples[] = {1, 2, 3, 4, 5, 6};
	RUN_CASE("Exact multiple of triples", exactTriples, 3);
	const int oneNodeRemainder[] = {1, 2, 3, 4, 5, 6, 7};
	RUN_CASE("Multiple groups with one-node remainder", oneNodeRemainder, 3);
	const int largestRemainder[] = {1, 2, 3, 4, 5, 6, 7, 8};
	RUN_CASE("Remainder of k minus one stays ordered", largestRemainder, 3);
	const int noCompleteSecondGroup[] = {1, 2, 3, 4, 5};
	RUN_CASE("Incomplete second group stays ordered", noCompleteSecondGroup, 4);
	const int duplicates[] = {7, 7, 7, 7, 7, 7};
	RUN_CASE("Duplicate values preserve node identity", duplicates, 2);
	const int boundaryValues[] = {0, 1000, 0, 1000, 500, 500};
	RUN_CASE("Minimum and maximum values", boundaryValues, 3);

	enum { MAX_NODES = 5000 };
	int *maximumSize = malloc(MAX_NODES * sizeof(*maximumSize));
	if (maximumSize == NULL) return EXIT_FAILURE;
	for (int i = 0; i < MAX_NODES; ++i) maximumSize[i] = i % 1001;
	run_case("Maximum-size deterministic stress", maximumSize, MAX_NODES, 37,
			 &passed, &total);
	free(maximumSize);

	printf("=== Summary ===\nPassed: %d/%d\n", passed, total);
	return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}

#undef RUN_CASE
#endif