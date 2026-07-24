/*
Given the head of a linked list and an integer val, remove all the nodes of the
linked list that has Node.val == val, and return the new head.

Example 1:

Input: head = [1,2,6,3,4,5,6], val = 6
Output: [1,2,3,4,5]

Example 2:

Input: head = [], val = 1
Output: []

Example 3:

Input: head = [7,7,7,7], val = 7
Output: []

The number of nodes in the list is in the range [0, 10^4].
1 <= Node.val <= 50
0 <= val <= 50
*/

#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

// Definition for singly-linked list provided by LeetCode.
struct ListNode {
    int val;
    ListNode *next;

    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

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
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode dummyHead(0, head);
        ListNode *current = &dummyHead;

        while (current->next != nullptr) {
            if (current->next->val == val) {
                current->next = current->next->next;
            } else {
                current = current->next;
            }
        }

        return dummyHead.next;
    }
};

static ListNode *createList(
    const std::vector<int>& values,
    std::vector<ListNode *>& allocatedNodes
)
{
    ListNode *head = nullptr;
    ListNode *tail = nullptr;

    allocatedNodes.reserve(values.size());

    for (int value : values) {
        ListNode *node = new ListNode(value);
        allocatedNodes.push_back(node);

        if (tail == nullptr) {
            head = node;
        } else {
            tail->next = node;
        }
        tail = node;
    }

    return head;
}

static bool listMatches(
    const ListNode *head,
    const std::vector<int>& expected
)
{
    const ListNode *current = head;

    for (int expectedValue : expected) {
        if (current == nullptr || current->val != expectedValue) {
            return false;
        }
        current = current->next;
    }

    // Also detects extra nodes and cycles extending past the expected result.
    return current == nullptr;
}

static void destroyOriginalNodes(std::vector<ListNode *>& allocatedNodes)
{
    for (ListNode *node : allocatedNodes) {
        delete node;
    }
}

static bool runTest(
    const std::string& name,
    const std::vector<int>& input,
    int valueToRemove,
    const std::vector<int>& expected
)
{
    std::vector<ListNode *> allocatedNodes;
    ListNode *head = createList(input, allocatedNodes);

    Solution solution;
    ListNode *actual = solution.removeElements(head, valueToRemove);
    bool passed = listMatches(actual, expected);

    std::cout << name << ": " << (passed ? "PASS" : "FAIL") << '\n';
    destroyOriginalNodes(allocatedNodes);
    return passed;
}

int main()
{
    int passed = 0;
    int total = 0;

    const auto test = [&passed, &total](
        const std::string& name,
        const std::vector<int>& input,
        int valueToRemove,
        const std::vector<int>& expected
    ) {
        ++total;
        passed += runTest(name, input, valueToRemove, expected);
    };

    test("empty list", {}, 1, {});
    test("single matching node", {1}, 1, {});
    test("single non-matching node", {1}, 2, {1});

    test(
        "example: matches in middle and tail",
        {1, 2, 6, 3, 4, 5, 6},
        6,
        {1, 2, 3, 4, 5}
    );

    test("all nodes match", {7, 7, 7, 7}, 7, {});
    test("remove one head node", {6, 1, 2, 3}, 6, {1, 2, 3});
    test(
        "remove consecutive head nodes",
        {6, 6, 6, 1, 2},
        6,
        {1, 2}
    );
    test(
        "remove consecutive middle nodes",
        {1, 2, 6, 6, 6, 3},
        6,
        {1, 2, 3}
    );
    test(
        "remove consecutive tail nodes",
        {1, 2, 3, 6, 6, 6},
        6,
        {1, 2, 3}
    );
    test(
        "alternating matching nodes",
        {6, 1, 6, 2, 6, 3, 6},
        6,
        {1, 2, 3}
    );
    test("no nodes match", {1, 2, 3, 4, 5}, 6, {1, 2, 3, 4, 5});
    test("remove maximum node value", {1, 50, 1, 50, 1}, 50, {1, 1, 1});
    test("remove value zero", {1, 2, 3}, 0, {1, 2, 3});

    {
        constexpr int maxNodes = 10000;
        std::vector<int> input(maxNodes);
        std::vector<int> expected(maxNodes / 2, 2);

        for (int i = 0; i < maxNodes; ++i) {
            input[i] = (i % 2) + 1;
        }

        test(
            "maximum-size alternating list",
            input,
            1,
            expected
        );
    }

    std::cout << '\n' << passed << '/' << total << " tests passed\n";
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
