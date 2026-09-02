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
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
#ifdef LOCAL_TEST
#include <cassert>
#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
#endif

class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head);
        ListNode *groupPrevious = &dummy;

        while (true) {
            ListNode *groupEnd = groupPrevious;
            for (int i = 0; i < k && groupEnd != nullptr; ++i) {
                groupEnd = groupEnd->next;
            }
            if (groupEnd == nullptr) {
                return dummy.next;
            }

            ListNode *groupNext = groupEnd->next;
            ListNode *current = groupPrevious->next;
            ListNode *previous = groupNext;
            while (current != groupNext) {
                ListNode *next = current->next;
                current->next = previous;
                previous = current;
                current = next;
            }

            current = groupPrevious->next;
            groupPrevious->next = groupEnd;
            groupPrevious = current;
        }
    }
};

#ifdef LOCAL_TEST
static void printValues(const std::vector<int>& values)
{
    std::cout << '[';
    for (std::size_t i = 0; i < values.size(); ++i) {
        if (values.size() > 20 && i == 10) {
            std::cout << "..." << values.size() - 20 << " omitted...";
            i = values.size() - 10;
        }
        std::cout << (i == 0 ? "" : ",") << values[i];
    }
    std::cout << ']';
}

static ListNode *createList(const std::vector<int>& values,
                            std::vector<ListNode *>& nodes)
{
    ListNode *head = nullptr;
    ListNode *tail = nullptr;
    for (int value : values) {
        auto *node = new ListNode(value);
        nodes.push_back(node);
        if (tail == nullptr) head = node; else tail->next = node;
        tail = node;
    }
    return head;
}

static bool verifyResult(const ListNode *actual, const std::vector<int>& input,
                         int k, const std::vector<ListNode *>& nodes)
{
    for (std::size_t outputIndex = 0; outputIndex < input.size(); ++outputIndex) {
        std::size_t groupStart = outputIndex / static_cast<std::size_t>(k) * static_cast<std::size_t>(k);
        std::size_t expectedIndex = groupStart + static_cast<std::size_t>(k) <= input.size()
            ? groupStart + static_cast<std::size_t>(k) - 1 - outputIndex % static_cast<std::size_t>(k)
            : outputIndex;
        if (actual == nullptr || actual != nodes[expectedIndex] ||
            actual->val != input[expectedIndex]) return false;
        actual = actual->next;
    }
    return actual == nullptr;
}

static bool runCase(const std::string& name, const std::vector<int>& input, int k)
{
    std::vector<ListNode *> nodes;
    ListNode *head = createList(input, nodes);
    Solution solution;
    ListNode *actual = solution.reverseKGroup(head, k);
    bool valid = verifyResult(actual, input, k, nodes);
    std::vector<int> output;
    const ListNode *current = actual;
    for (std::size_t i = 0; i < input.size(); ++i) {
        output.push_back(current == nullptr ? -1 : current->val);
        if (current != nullptr) current = current->next;
    }

    std::cout << "Test: " << name << "\nInput: head = ";
    printValues(input);
    std::cout << ", k = " << k << "\nOutput: ";
    printValues(output);
    std::cout << '\n' << (valid ? "Passed" : "Failed") << "\n\n";
    assert(valid);
    for (ListNode *node : nodes) delete node;
    return valid;
}

int main()
{
    int passed = 0;
    int total = 0;
    const auto test = [&passed, &total](const std::string& name,
                                        const std::vector<int>& input, int k) {
        ++total;
        passed += runCase(name, input, k);
    };

    test("Example 1 reverses pairs with remainder", {1,2,3,4,5}, 2);
    test("Example 2 reverses one triple", {1,2,3,4,5}, 3);
    test("Minimum list and k", {42}, 1);
    test("k equals one preserves list", {0,1,1000,2}, 1);
    test("k equals length reverses entire list", {1,2,3,4,5}, 5);
    test("Exact multiple of pairs", {1,2,3,4,5,6}, 2);
    test("Exact multiple of triples", {1,2,3,4,5,6}, 3);
    test("Multiple groups with one-node remainder", {1,2,3,4,5,6,7}, 3);
    test("Remainder of k minus one stays ordered", {1,2,3,4,5,6,7,8}, 3);
    test("Incomplete second group stays ordered", {1,2,3,4,5}, 4);
    test("Duplicate values preserve node identity", {7,7,7,7,7,7}, 2);
    test("Minimum and maximum values", {0,1000,0,1000,500,500}, 3);
    std::vector<int> maximumSize(5000);
    for (int i = 0; i < 5000; ++i) maximumSize[static_cast<std::size_t>(i)] = i % 1001;
    test("Maximum-size deterministic stress", maximumSize, 37);

    std::cout << "=== Summary ===\nPassed: " << passed << '/' << total << '\n';
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
#endif