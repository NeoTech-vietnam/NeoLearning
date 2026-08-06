/*

Given the head of a singly linked list, return the middle node of the linked list.

If there are two middle nodes, return the second middle node.

Example 1:

Input: head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: The middle node of the list is node 3.

Example 2:
Input: head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.

Constraints:
- The number of nodes in the list is in the range [1, 100].
- 1 <= Node.val <= 100

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
struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};
class Solution {
public:
    ListNode* middleNode(ListNode* head) { 
        ListNode* slow = head;
        ListNode* fast = head;

        while(fast && fast->next){
            slow = slow->next;
            fast = fast->next->next;
        }

        return slow;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
#include <vector>

// Reference implementation
ListNode* referenceMiddleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

ListNode* buildList(const std::vector<int>& vals) {
    ListNode dummy;
    ListNode* tail = &dummy;
    for (int v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy.next;
}

std::vector<int> listToVector(ListNode* node) {
    std::vector<int> res;
    while (node) {
        res.push_back(node->val);
        node = node->next;
    }
    return res;
}

bool vectorsEqual(const std::vector<int>& a, const std::vector<int>& b) {
    return a == b;
}

void runTest(const std::string& name, const std::vector<int>& input, const std::vector<int>& expected) {
    ListNode* head = buildList(input);
    // Solution sol; // not used
    ListNode* out = referenceMiddleNode(head);
    std::vector<int> actual = listToVector(out);
    bool pass = vectorsEqual(actual, expected);
    std::cout << "Test: " << name << "\n";
    std::cout << "Input: list = [";
    for (size_t i = 0; i < input.size(); ++i) {
        if (i) std::cout << ",";
        std::cout << input[i];
    }
    std::cout << "]\n";
    std::cout << "Output: [";
    for (size_t i = 0; i < actual.size(); ++i) {
        if (i) std::cout << ",";
        std::cout << actual[i];
    }
    std::cout << "]\n";
    std::cout << (pass ? "Passed" : "Failed") << "\n\n";
    // Note: memory leak ignored for brevity
}

int main() {
    runTest("Example1", {1,2,3,4,5}, {3,4,5});
    runTest("Example2", {1,2,3,4,5,6}, {4,5,6});
    runTest("SingleNode", {42}, {42});
    runTest("TwoNodes", {1,2}, {2});
    runTest("AllSame", {7,7,7,7,7}, {7,7,7});
    runTest("MinMaxValues", {1,100,1,100,1}, {1,100,1});
    runTest("EvenLengthMiddleSecond", {10,20,30,40}, {30,40});
    runTest("OddLengthMiddle", {5,4,3,2,1}, {3,2,1});
    runTest("DuplicateMiddle", {1,2,2,2,3,4}, {2,3,4});
    runTest("LongList", std::vector<int>(5000, 1), std::vector<int>(2500, 1));
    return 0;
}
#endif // LOCAL_TEST