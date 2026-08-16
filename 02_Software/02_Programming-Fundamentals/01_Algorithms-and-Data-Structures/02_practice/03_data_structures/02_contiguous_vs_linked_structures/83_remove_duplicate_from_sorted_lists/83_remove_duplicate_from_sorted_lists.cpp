/*
Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.

Example 1:

Input: head = [1,1,2]
Output: [1,2]
Example 2:
Input: head = [1,1,2,3,3]
Output: [1,2,3]

Constraints:

The number of nodes in the list is in the range [0, 300].
-100 <= Node.val <= 100
The list is guaranteed to be sorted in ascending order.

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
#include <vector>
#ifdef LOCAL_TEST
#include <cstddef>
struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int value) : val(value), next(nullptr) {}
};
#endif

class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode* current = head;
        while(current != nullptr && current->next != nullptr) {
            if(current->val == current->next->val){
                current->next = current->next->next;
            } else {
                current = current->next;
            }
        }
        return head;
    }
};

#ifdef LOCAL_TEST
#include <cstdlib>
#include <iostream>
#include <string>
#include <unordered_set>
#include <vector>

static ListNode* makeList(
    const std::vector<int>& values,
    std::vector<ListNode*>& owned
)
{
    ListNode dummy;
    ListNode* tail = &dummy;
    for (int value : values) {
        owned.push_back(new ListNode(value));
        tail->next = owned.back();
        tail = tail->next;
    }
    return dummy.next;
}

static void printValues(const std::vector<int>& values)
{
    std::cout << '[';
    const std::size_t shown = values.size() > 12 ? 12 : values.size();
    for (std::size_t i = 0; i < shown; ++i) {
        std::cout << (i ? ", " : "") << values[i];
    }
    if (values.size() > shown) {
        std::cout << ", ... " << values.size() - shown << " omitted";
    }
    std::cout << ']';
}

static std::vector<int> readBounded(
    ListNode* head,
    std::size_t limit,
    bool& terminated,
    bool& cycle
)
{
    std::vector<int> values;
    std::unordered_set<ListNode*> seen;
    while (head != nullptr && values.size() <= limit) {
        if (!seen.insert(head).second) {
            cycle = true;
            break;
        }
        values.push_back(head->val);
        head = head->next;
    }
    terminated = head == nullptr;
    return values;
}

static bool runTest(
    const std::string& name,
    const std::vector<int>& input,
    const std::vector<int>& expected,
    int number
)
{
    std::vector<ListNode*> owned;
    ListNode* actualHead = Solution().deleteDuplicates(makeList(input, owned));
    bool terminated = false;
    bool cycle = false;
    const std::vector<int> actual = readBounded(
        actualHead,
        expected.size(),
        terminated,
        cycle
    );
    const std::unordered_set<ListNode*> originalNodes(owned.begin(), owned.end());
    bool nodesReused = true;
    for (ListNode* node = actualHead; node != nullptr && nodesReused;) {
        if (originalNodes.count(node) == 0) {
            nodesReused = false;
            break;
        }
        node = node->next;
    }
    const bool passed = !cycle && terminated && nodesReused && actual == expected;

    std::cout << number << (passed ? "a. Passed result: Input -> Actual -> Result\n"
                                  : "b. Failed result: Input -> Actual -> Result -> Expected\n");
    std::cout << name << "\n  Input:    ";
    printValues(input);
    std::cout << "\n  Actual:   ";
    printValues(actual);
    std::cout << "\n  Result:   " << (passed ? "PASS" : "FAIL") << '\n';
    if (!passed) {
        std::cout << "  Expected: ";
        printValues(expected);
        std::cout << '\n';
    }
    std::cout << '\n';

    for (ListNode* node : owned) {
        delete node;
    }
    return passed;
}

int main()
{
    int passed = 0;
    int total = 0;
    const auto test = [&passed, &total](
        const std::string& name,
        const std::vector<int>& input,
        const std::vector<int>& expected
    ) {
        ++total;
        passed += runTest(name, input, expected, total);
    };

    test("empty list", {}, {});
    test("single node", {1}, {1});
    test("smallest duplicate", {1, 1}, {1});
    test("example 1", {1, 1, 2}, {1, 2});
    test("example 2", {1, 1, 2, 3, 3}, {1, 2, 3});
    test("already unique", {1, 2, 3, 4}, {1, 2, 3, 4});
    test("all equal", {5, 5, 5, 5}, {5});
    test("duplicates at head", {-3, -3, -3, 0, 1}, {-3, 0, 1});
    test("duplicates in middle", {-2, 0, 0, 0, 1}, {-2, 0, 1});
    test("duplicates at tail", {-2, 0, 4, 4, 4}, {-2, 0, 4});
    test("value bounds", {-100, -100, 0, 100, 100}, {-100, 0, 100});
    test("several groups", {-3, -3, -2, -1, -1, 0, 0, 2, 2}, {-3, -2, -1, 0, 2});

    std::vector<int> maximumInput;
    std::vector<int> maximumExpected;
    maximumInput.reserve(300);
    maximumExpected.reserve(100);
    for (int value = -100; value < 0; ++value) {
        maximumExpected.push_back(value);
        maximumInput.insert(maximumInput.end(), 3, value);
    }
    test("maximum size", maximumInput, maximumExpected);

    std::cout << passed << '/' << total << " tests passed\n";
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
#endif