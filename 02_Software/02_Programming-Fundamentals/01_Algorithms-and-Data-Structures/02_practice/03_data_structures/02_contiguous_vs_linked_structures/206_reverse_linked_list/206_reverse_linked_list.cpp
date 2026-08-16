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

#include <cstddef>
#include <cstdlib>
#include <iostream>
#include <string>
#include <utility>
#include <vector>

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *previous = nullptr;
        ListNode *current = head;

        while (current != nullptr) {
            ListNode *next = current->next;
            current->next = previous;
            previous = current;
            current = next;
        }

        return previous;
    }
};

static ListNode *createList(
    const std::vector<int>& values,
    std::vector<ListNode *>& allocatedNodes
)
{
    ListNode *head = nullptr;
    ListNode *tail = nullptr;

    allocatedNodes.clear();
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

static bool reversedListMatches(
    const ListNode *head,
    const std::vector<int>& input
)
{
    const ListNode *current = head;

    for (std::size_t i = 0; i < input.size(); ++i) {
        if (
            current == nullptr
            || current->val != input[input.size() - 1 - i]
        ) {
            return false;
        }
        current = current->next;
    }

    return current == nullptr;
}

static bool usesOriginalNodesInReverseOrder(
    const ListNode *head,
    const std::vector<ListNode *>& allocatedNodes
)
{
    const ListNode *current = head;

    for (std::size_t i = 0; i < allocatedNodes.size(); ++i) {
        if (current != allocatedNodes[allocatedNodes.size() - 1 - i]) {
            return false;
        }
        current = current->next;
    }

    return current == nullptr;
}

static void printInputList(const std::vector<int>& values)
{
    constexpr std::size_t edgeLength = 10;

    std::cout << '[';
    for (std::size_t i = 0; i < values.size(); ++i) {
        if (values.size() > edgeLength * 2 && i == edgeLength) {
            std::cout
                << ", ... "
                << values.size() - edgeLength * 2
                << " values omitted ...";
            i = values.size() - edgeLength;
        }

        if (i > 0) {
            std::cout << ", ";
        }
        std::cout << values[i];
    }
    std::cout << ']';
}

static void printOutputList(
    const ListNode *head,
    std::size_t expectedLength
)
{
    constexpr std::size_t edgeLength = 10;
    const ListNode *current = head;
    std::size_t visited = 0;

    std::cout << '[';
    while (current != nullptr && visited < expectedLength) {
        if (expectedLength > edgeLength * 2 && visited == edgeLength) {
            const std::size_t omitted = expectedLength - edgeLength * 2;

            std::cout << ", ... " << omitted << " values omitted ...";
            for (
                std::size_t i = 0;
                i < omitted && current != nullptr;
                ++i
            ) {
                current = current->next;
                ++visited;
            }
            if (current == nullptr) {
                break;
            }
        }

        if (visited > 0) {
            std::cout << ", ";
        }
        std::cout << current->val;
        current = current->next;
        ++visited;
    }

    if (visited < expectedLength) {
        if (visited > 0) {
            std::cout << ", ";
        }
        std::cout << "<ended early>";
    } else if (current != nullptr) {
        std::cout << ", ... <extra nodes or cycle>";
    }
    std::cout << ']';
}

static bool runTest(
    const std::string& name,
    const std::vector<int>& input
)
{
    std::vector<ListNode *> allocatedNodes;
    ListNode *head = createList(input, allocatedNodes);
    Solution solution;
    ListNode *actual = solution.reverseList(head);
    const bool valuesPassed = reversedListMatches(actual, input);
    const bool nodesPassed = input.empty()
        ? actual == nullptr
        : usesOriginalNodesInReverseOrder(actual, allocatedNodes);
    const bool passed = valuesPassed && nodesPassed;

    std::cout << name << '\n';
    std::cout << "  Input:  ";
    printInputList(input);
    std::cout << "\n  Output: ";
    printOutputList(actual, input.size());
    std::cout << "\n  Result: " << (passed ? "PASS" : "FAIL") << "\n\n";

    for (ListNode *node : allocatedNodes) {
        delete node;
    }

    return passed;
}

int main()
{
    std::vector<std::pair<std::string, std::vector<int>>> testCases = {
        {"empty list", {}},
        {"single node", {1}},
        {"two nodes", {1, 2}},
        {"example: odd-length list", {1, 2, 3, 4, 5}},
        {"even-length list", {1, 2, 3, 4}},
        {"duplicate values", {7, 7, 7, 7}},
        {"negative, zero, and boundary values", {-5000, -1, 0, 1, 5000}}
    };

    std::vector<int> maximumSizeInput(5000);
    for (std::size_t i = 0; i < maximumSizeInput.size(); ++i) {
        maximumSizeInput[i] = static_cast<int>(i % 10001) - 5000;
    }
    testCases.emplace_back("maximum-size list", std::move(maximumSizeInput));

    int passed = 0;
    for (const auto& [name, input] : testCases) {
        passed += runTest(name, input);
    }

    std::cout
        << passed
        << '/'
        << testCases.size()
        << " tests passed\n";

    return passed == static_cast<int>(testCases.size())
        ? EXIT_SUCCESS
        : EXIT_FAILURE;
}
