/*

Given the head of a singly linked list and two integers left and right where left <= right, 
reverse the nodes of the list from position left to position right, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]

Example 2:

Input: head = [5], left = 1, right = 1
Output: [5]

Constraints:

The number of nodes in the list is n.
1 <= n <= 500
-500 <= Node.val <= 500
1 <= left <= right <= n

Follow up: Could you do it in one pass?

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
    ListNode *next;
    ListNode(int value = 0, ListNode *nextNode = nullptr) : val(value), next(nextNode) {}
};

class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        ListNode dummy(0, head);
        ListNode *before = &dummy;

        for (int position = 1; position < left; ++position) {
            before = before->next;
        }

        ListNode *current = before->next;
        for (int position = left; position < right; ++position) {
            ListNode *moved = current->next;
            current->next = moved->next;
            moved->next = before->next;
            before->next = moved;
        }

        return dummy.next;
    }
};
#ifdef LOCAL_TEST
#include <algorithm>
#include <cassert>
#include <iostream>
#include <string>
#include <vector>
static ListNode *build(const std::vector<int>& a,std::vector<ListNode *>& nodes){for(int v:a)nodes.push_back(new ListNode(v));for(std::size_t i=1;i<nodes.size();i++)nodes[i-1]->next=nodes[i];return nodes.front();}
static void print(const std::vector<int>& a){std::cout<<"[";std::size_t k=a.size()>12?6:a.size();for(std::size_t i=0;i<k;i++)std::cout<<(i?",":"")<<a[i];if(a.size()>12){std::cout<<",...("<<a.size()-12<<" omitted)...";for(std::size_t i=a.size()-6;i<a.size();i++)std::cout<<","<<a[i];}std::cout<<"]";}
static void test(const std::string& name,const std::vector<int>& input,int left,int right){
    auto expected=input;std::reverse(expected.begin()+left-1,expected.begin()+right);std::vector<ListNode *> nodes;Solution solution;ListNode *cur=solution.reverseBetween(build(input,nodes),left,right);std::vector<int> actual;bool passed=true;
    while(cur&&actual.size()<input.size()){std::size_t p=actual.size();actual.push_back(cur->val);std::size_t source=(p<static_cast<std::size_t>(left-1)||p>=static_cast<std::size_t>(right))?p:static_cast<std::size_t>(left+right-2)-p;if(cur!=nodes[source])passed=false;cur=cur->next;}
    passed=passed&&!cur&&actual==expected;std::cout<<"Test: "<<name<<"\nInput: head = ";print(input);std::cout<<", left = "<<left<<", right = "<<right<<"\nOutput: ";print(actual);std::cout<<"\n"<<(passed?"Passed":"Failed")<<"\n\n";assert(passed);for(auto node:nodes)delete node;
}
int main(){std::vector<int> stress(500);for(int i=0;i<500;i++)stress[static_cast<std::size_t>(i)]=i-250;
    test("Example1MiddleRange",{1,2,3,4,5},2,4);test("Example2SingleNode",{5},1,1);test("SmallestChangingTwoNodeList",{1,2},1,2);
    test("FullEvenLengthList",{1,2,3,4},1,4);test("PrefixIncludingFirstPosition",{1,2,3,4,5},1,3);test("SuffixIncludingLastPosition",{1,2,3,4,5},3,5);
    test("MiddleEvenLengthRange",{1,2,3,4,5,6},2,5);test("DuplicatesAndZero",{0,7,7,0,7},1,5);test("MinimumMaximumValues",{-500,0,500},1,3);
    test("FirstPositionNoOp",{-500,0,500},1,1);test("MiddlePositionNoOp",{-500,0,500},2,2);test("LastPositionNoOp",{-500,0,500},3,3);
    test("OddLengthInteriorRange",{9,8,7,6,5,4,3},2,6);test("MaximumSizeStress",stress,1,500);return 0;}
#endif