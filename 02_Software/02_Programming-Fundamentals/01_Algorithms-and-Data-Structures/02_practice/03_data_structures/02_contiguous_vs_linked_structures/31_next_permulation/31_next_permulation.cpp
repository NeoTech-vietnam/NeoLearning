/*

A permutation of an array of integers is an arrangement of its members into a sequence or linear order.
- For example, for arr = [1,2,3], the following are 
all the permutations of arr: [1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1].

The next permutation of an array of integers is the next lexicographically greater permutation 
of its integer. More formally, if all the permutations of the array are sorted in one container 
according to their lexicographical order, then the next permutation of that array is the permutation 
that follows it in the sorted container. If such arrangement is not possible, the array must be 
rearranged as the lowest possible order (i.e., sorted in ascending order).

- For example, the next permutation of arr = [1,2,3] is [1,3,2].
- Similarly, the next permutation of arr = [2,3,1] is [3,1,2].
- While the next permutation of arr = [3,2,1] is [1,2,3] because [3,2,1] 
does not have a lexicographical larger rearrangement.

Given an array of integers nums, find the next permutation of nums.

The replacement must be in place and use only constant extra memory.

Example 1:

Input: nums = [1,2,3]
Output: [1,3,2]

Example 2:

Input: nums = [3,2,1]
Output: [1,2,3]

Example 3:

Input: nums = [1,1,5]
Output: [1,5,1]

Constraints:

    1 <= nums.length <= 100
    0 <= nums[i] <= 100

*/

#include <algorithm>
#include <vector>

#ifdef LOCAL_TEST
#include <cassert>
#include <iostream>
#include <string>
using namespace std;
#endif

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int pivot = static_cast<int>(nums.size()) - 2;
        while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) --pivot;

        if (pivot >= 0) {
            int successor = static_cast<int>(nums.size()) - 1;
            while (nums[successor] <= nums[pivot]) --successor;
            swap(nums[pivot], nums[successor]);
        }

        reverse(nums.begin() + pivot + 1, nums.end());
    }
};

#ifdef LOCAL_TEST
static void printNums(const vector<int>& nums) {
    cout << "[";
    for (size_t i = 0; i < nums.size(); ++i) cout << (i ? "," : "") << nums[i];
    cout << "]";
}

static bool runTest(vector<int> input, const vector<int>& expected, const string& name) {
    const vector<int> original = input;
    int* identity = input.data();
    Solution().nextPermutation(input);
    bool passed = identity == input.data() && input == expected;
    cout << name << "\nInput: nums = "; printNums(original);
    cout << "\nOutput: "; printNums(input);
    cout << "\n" << (passed ? "Passed" : "Failed") << "\n\n";
    assert(passed);
    return passed;
}

int main() {
    int total = 0, passed = 0;
#define TEST(input, expected, name) do { ++total; passed += runTest(input, expected, name); } while (0)
    TEST((vector<int>{1,2,3}), (vector<int>{1,3,2}), "Example1");
    TEST((vector<int>{3,2,1}), (vector<int>{1,2,3}), "Example2");
    TEST((vector<int>{1,1,5}), (vector<int>{1,5,1}), "Example3");
    TEST((vector<int>{7}), (vector<int>{7}), "Single");
    TEST((vector<int>{1,2}), (vector<int>{2,1}), "Ascending2");
    TEST((vector<int>{2,1}), (vector<int>{1,2}), "Descending2");
    TEST((vector<int>{4,4,4}), (vector<int>{4,4,4}), "AllEqual");
    TEST((vector<int>{1,3,2}), (vector<int>{2,1,3}), "FirstPivot");
    TEST((vector<int>{1,2,3,6,5,4}), (vector<int>{1,2,4,3,5,6}), "MiddlePivot");
    TEST((vector<int>{1,2,2,3}), (vector<int>{1,2,3,2}), "DuplicateSuffix");
    TEST((vector<int>{0,0,100}), (vector<int>{0,100,0}), "Bounds");
    TEST((vector<int>{100,0,0}), (vector<int>{0,0,100}), "DescendingBounds");
    TEST((vector<int>{1,5,5,5}), (vector<int>{5,1,5,5}), "DuplicatePivot");
    TEST((vector<int>{0,1,0,1}), (vector<int>{0,1,1,0}), "Alternating");
    vector<int> stress(100); for (int i = 0; i < 100; ++i) stress[i] = i;
    vector<int> stressExpected = stress; swap(stressExpected[98], stressExpected[99]); TEST(stress, stressExpected, "Stress");
#undef TEST
    cout << "Passed " << passed << "/" << total << "\n";
}
#endif