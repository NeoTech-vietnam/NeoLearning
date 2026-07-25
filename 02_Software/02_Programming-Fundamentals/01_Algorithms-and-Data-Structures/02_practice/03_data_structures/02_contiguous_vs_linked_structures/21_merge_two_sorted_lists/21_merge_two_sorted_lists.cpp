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

#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct ListNode {
    int val;
    ListNode *next;

    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *nextNode) : val(x), next(nextNode) {}
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
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy;
        ListNode* current = &dummy;

        while(list1 != nullptr && list2 != nullptr) {
            if(list1->val <= list2->val){
                current->next = list1;
                list1 = list1->next;
            }
            else {
                current->next = list2;
                list2 = list2->next;
            }
            current = current->next;
        }
        if(list1 != nullptr)
            current->next = list1;
        else
            current->next = list2;
        
        return dummy.next;
    }
};

static ListNode *createList(
    const std::vector<int>& values,
    std::vector<ListNode *>& allocatedNodes
)
{
    ListNode *head = nullptr;
    ListNode *tail = nullptr;

    allocatedNodes.reserve(allocatedNodes.size() + values.size());

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

static bool markOriginalNode(
    const ListNode *node,
    const std::vector<ListNode *>& allocatedNodes,
    std::vector<bool>& seen
)
{
    for (std::size_t i = 0; i < allocatedNodes.size(); ++i) {
        if (node == allocatedNodes[i]) {
            if (seen[i]) {
                return false;
            }
            seen[i] = true;
            return true;
        }
    }

    return false;
}

static bool mergedListMatches(
    const ListNode *head,
    const std::vector<int>& expected,
    const std::vector<ListNode *>& allocatedNodes
)
{
    const ListNode *current = head;
    std::vector<bool> seen(allocatedNodes.size(), false);

    if (expected.size() != allocatedNodes.size()) {
        return false;
    }

    for (int expectedValue : expected) {
        if (
            current == nullptr
            || !markOriginalNode(current, allocatedNodes, seen)
            || current->val != expectedValue
        ) {
            return false;
        }
        current = current->next;
    }

    if (current != nullptr) {
        return false;
    }

    for (bool wasSeen : seen) {
        if (!wasSeen) {
            return false;
        }
    }

    return true;
}

static void printArray(const std::vector<int>& values)
{
    constexpr std::size_t displayLimit = 12;

    std::cout << '[';
    for (
        std::size_t i = 0;
        i < values.size() && i < displayLimit;
        ++i
    ) {
        if (i > 0) {
            std::cout << ", ";
        }
        std::cout << values[i];
    }
    if (values.size() > displayLimit) {
        std::cout
            << ", ... "
            << values.size() - displayLimit
            << " values omitted";
    }
    std::cout << ']';
}

static void printListBounded(
    const ListNode *head,
    std::size_t expectedLength
)
{
    constexpr std::size_t displayLimit = 12;
    const ListNode *current = head;
    std::size_t visited = 0;

    std::cout << '[';
    while (
        current != nullptr
        && visited < expectedLength
        && visited < displayLimit
    ) {
        if (visited > 0) {
            std::cout << ", ";
        }
        std::cout << current->val;
        current = current->next;
        ++visited;
    }

    if (expectedLength > displayLimit && visited == displayLimit) {
        std::cout
            << ", ... "
            << expectedLength - displayLimit
            << " values omitted";
    } else if (current != nullptr) {
        std::cout << ", ... <extra nodes or cycle>";
    }
    std::cout << ']';
}

static void destroyOriginalNodes(std::vector<ListNode *>& allocatedNodes)
{
    for (ListNode *node : allocatedNodes) {
        delete node;
    }
}

static bool runTest(
    const std::string& name,
    const std::vector<int>& firstInput,
    const std::vector<int>& secondInput,
    const std::vector<int>& expected
)
{
    std::vector<ListNode *> allocatedNodes;
    ListNode *first = createList(firstInput, allocatedNodes);
    ListNode *second = createList(secondInput, allocatedNodes);

    Solution solution;
    ListNode *actual = solution.mergeTwoLists(first, second);
    const bool passed = mergedListMatches(
        actual,
        expected,
        allocatedNodes
    );

    std::cout << name << '\n';
    std::cout << "  Input:    ";
    printArray(firstInput);
    std::cout << " + ";
    printArray(secondInput);
    std::cout << "\n  Actual:   ";
    printListBounded(actual, expected.size());
    std::cout << "\n  Result:   " << (passed ? "PASS" : "FAIL") << '\n';
    if (!passed) {
        std::cout << "  Expected: ";
        printArray(expected);
        std::cout << '\n';
    }
    std::cout << '\n';

    destroyOriginalNodes(allocatedNodes);
    return passed;
}

int main()
{
    int passed = 0;
    int total = 0;

    const auto test = [&passed, &total](
        const std::string& name,
        const std::vector<int>& first,
        const std::vector<int>& second,
        const std::vector<int>& expected
    ) {
        ++total;
        passed += runTest(name, first, second, expected);
    };

    test(
        "example 1: overlapping values",
        {1, 2, 4},
        {1, 3, 4},
        {1, 1, 2, 3, 4, 4}
    );
    test("example 2: both lists empty", {}, {}, {});
    test("example 3: first list empty", {}, {0}, {0});
    test("second list empty", {0}, {}, {0});
    test("single nodes already ordered", {1}, {2}, {1, 2});
    test("single nodes require second first", {2}, {1}, {1, 2});
    test(
        "duplicate values",
        {1, 1, 1},
        {1, 1},
        {1, 1, 1, 1, 1}
    );
    test(
        "negative and boundary values",
        {-100, -50, 0, 100},
        {-100, -75, 50, 100},
        {-100, -100, -75, -50, 0, 50, 100, 100}
    );
    test(
        "alternating values",
        {1, 3, 5, 7},
        {2, 4, 6, 8},
        {1, 2, 3, 4, 5, 6, 7, 8}
    );
    test(
        "first list entirely smaller",
        {1, 2, 3},
        {4, 5, 6},
        {1, 2, 3, 4, 5, 6}
    );
    test(
        "second list entirely smaller",
        {4, 5, 6},
        {1, 2, 3},
        {1, 2, 3, 4, 5, 6}
    );

    {
        constexpr int halfSize = 25;
        constexpr int totalSize = 50;
        std::vector<int> first(halfSize);
        std::vector<int> second(halfSize);
        std::vector<int> expected(totalSize);

        for (int i = 0; i < halfSize; ++i) {
            first[i] = i * 2;
            second[i] = i * 2 + 1;
        }
        for (int i = 0; i < totalSize; ++i) {
            expected[i] = i;
        }

        test("maximum combined size", first, second, expected);
    }

    std::cout << passed << '/' << total << " tests passed\n";
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
