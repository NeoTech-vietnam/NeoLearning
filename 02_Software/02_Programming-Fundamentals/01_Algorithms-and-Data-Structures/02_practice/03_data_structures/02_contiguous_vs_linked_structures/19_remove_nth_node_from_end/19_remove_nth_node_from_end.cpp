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
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode *fast = &dummy;
        ListNode *slow = &dummy;

        while (n-- > 0) fast = fast->next;
        while (fast->next != nullptr) {
            fast = fast->next;
            slow = slow->next;
        }
        slow->next = slow->next->next;

        return dummy.next;
    }
};

#ifdef LOCAL_TEST
static void printList(const ListNode *head)
{
    std::cout << '[';
    for (const ListNode *node = head; node != nullptr; node = node->next) {
        std::cout << node->val << (node->next == nullptr ? "" : ",");
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
        if (tail == nullptr) head = node;
        else tail->next = node;
        tail = node;
    }
    return head;
}

static bool verifyResult(const ListNode *actual, const std::vector<int>& expected,
                         const std::vector<ListNode *>& nodes,
                         std::size_t removedIndex)
{
    std::size_t outputIndex = 0;
    for (std::size_t inputIndex = 0; inputIndex < nodes.size(); ++inputIndex) {
        if (inputIndex == removedIndex) continue;
        if (actual == nullptr || actual != nodes[inputIndex] ||
            outputIndex >= expected.size() || actual->val != expected[outputIndex]) {
            return false;
        }
        actual = actual->next;
        ++outputIndex;
    }
    return actual == nullptr && outputIndex == expected.size();
}

static bool runCase(const std::string& name, const std::vector<int>& input,
                    int n, const std::vector<int>& expected)
{
    std::vector<ListNode *> nodes;
    ListNode *head = createList(input, nodes);
    Solution solution;
    ListNode *actual = solution.removeNthFromEnd(head, n);
    bool valid = verifyResult(actual, expected, nodes, input.size() - static_cast<std::size_t>(n));

    std::cout << "Test: " << name << '\n';
    std::cout << "Input: head = [";
    for (std::size_t i = 0; i < input.size(); ++i) {
        std::cout << input[i] << (i + 1 == input.size() ? "" : ",");
    }
    std::cout << "], n = " << n << '\n';
    std::cout << "Output: ";
    printList(actual);
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
                                        const std::vector<int>& input, int n,
                                        const std::vector<int>& expected) {
        ++total;
        passed += runCase(name, input, n, expected);
    };

    test("Example 1 removes second from end", {1, 2, 3, 4, 5}, 2, {1, 2, 3, 5});
    test("Example 2 removes only node", {1}, 1, {});
    test("Example 3 removes tail", {1, 2}, 1, {1});
    test("Two nodes remove head", {1, 2}, 2, {2});
    test("Odd length removes middle", {10, 20, 30, 40, 50}, 3, {10, 20, 40, 50});
    test("Even length removes middle", {1, 2, 3, 4, 5, 6}, 3, {1, 2, 3, 5, 6});
    test("Duplicates preserve node identity", {7, 7, 7, 7}, 2, {7, 7, 7});
    test("Minimum value at removed head", {0, 1, 2}, 3, {1, 2});
    test("Maximum value at removed tail", {1, 2, 100}, 1, {1, 2});
    test("Zero removed from middle", {5, 0, 6}, 2, {5, 6});
    test("Head duplicate removal preserves second node", {9, 9, 8}, 3, {9, 8});
    test("Tail duplicate removal preserves first node", {8, 9, 9}, 1, {8, 9});
    test("Removes node adjacent to head", {1, 2, 3, 4, 5, 6}, 5, {1, 3, 4, 5, 6});

    std::vector<int> maximumSize(30);
    std::vector<int> maximumSizeExpected;
    for (int i = 0; i < 30; ++i) maximumSize[static_cast<std::size_t>(i)] = i;
    for (int i = 0; i < 30; ++i) if (i != 15) maximumSizeExpected.push_back(i);
    test("Maximum size removes middle node", maximumSize, 15, maximumSizeExpected);

    std::cout << "=== Summary ===\nPassed: " << passed << '/' << total << '\n';
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
#endif