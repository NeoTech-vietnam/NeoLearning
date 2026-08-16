/*

Given an integer array nums sorted in non-decreasing order, 
return an array of the squares of each number sorted in non-decreasing order.

Example 1:

Input: nums = [-4,-1,0,3,10]
Output: [0,1,9,16,100]
Explanation: After squaring, the array becomes [16,1,0,9,100].
After sorting, it becomes [0,1,9,16,100].

Example 2:

Input: nums = [-7,-3,2,3,11]
Output: [4,9,9,49,121]

Constraints:

    1 <= nums.length <= 104
    -104 <= nums[i] <= 104
    nums is sorted in non-decreasing order.

 
Follow up: Squaring each element and sorting the new array is very trivial, 
could you find an O(n) solution using a different approach?

*/

#include <vector>

using namespace std;

class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        vector<int> result(nums.size());
        int left = 0;
        int right = static_cast<int>(nums.size()) - 1;

        for (int write = right; write >= 0; --write){
            int leftSquare = nums.at(left) * nums.at(left);
            int rightSquare = nums.at(right) * nums.at(right); 
            if(leftSquare > rightSquare){
                result[write] = leftSquare;
                ++left;
            }
            else {
                result[write] = rightSquare;
                --right;
            }
        }
        return result;
    }
};

#ifdef LOCAL_TEST
#include <cassert>
#include <iostream>
#include <string>

static void printNums(const vector<int>& nums) {
    size_t limit = nums.size() > 20 ? 10 : nums.size();
    cout << "[";
    for (size_t i = 0; i < limit; ++i) cout << (i ? "," : "") << nums[i];
    if (nums.size() > 20) {
        cout << ",... (" << nums.size() - 20 << " omitted) ...";
        for (size_t i = nums.size() - 10; i < nums.size(); ++i) cout << "," << nums[i];
    }
    cout << "]";
}

static void runTest(vector<int> input, const vector<int>& expected, const string& name) {
    const vector<int> original = input;
    vector<int> result = Solution().sortedSquares(input);
    bool passed = input == original && result == expected;
    cout << name << "\nInput: nums = ";
    printNums(original);
    cout << "\nOutput: ";
    printNums(result);
    cout << "\n" << (passed ? "Passed" : "Failed") << "\n";    assert(passed);}

int main() {
    runTest({-4,-1,0,3,10}, {0,1,9,16,100}, "Example1");
    runTest({-7,-3,2,3,11}, {4,9,9,49,121}, "Example2");
    runTest({-5}, {25}, "SingleNegative");
    runTest({6}, {36}, "SinglePositive");
    runTest({-5,-4,-2}, {4,16,25}, "AllNegative");
    runTest({1,2,5}, {1,4,25}, "AllPositive");
    runTest({0,0,0}, {0,0,0}, "AllZero");
    runTest({-3,-3,-1,0,1,3,3}, {0,1,1,9,9,9,9}, "DuplicateMagnitudes");
    runTest({-2,0,2}, {0,4,4}, "ZeroBetweenSigns");
    runTest({-4,4}, {16,16}, "EqualAbsoluteValues");
    runTest({-2,-1,0,1,2}, {0,1,1,4,4}, "SignBoundaries");
    runTest({-10000,0,10000}, {0,100000000,100000000}, "ConstraintExtremes");
    vector<int> stress(10000), stressExpected(10000);
    for (int i = 0; i < 10000; ++i) {
        stress[i] = i - 5000;
        stressExpected[i] = (i / 2 + (i & 1)) * (i / 2 + (i & 1));
    }
    runTest(stress, stressExpected, "MaximumSizeStress");
}
#endif