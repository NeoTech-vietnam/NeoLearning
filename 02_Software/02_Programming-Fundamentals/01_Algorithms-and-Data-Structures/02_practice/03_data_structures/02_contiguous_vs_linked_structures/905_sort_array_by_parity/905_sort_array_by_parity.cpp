/*
Given an integer array nums, move all the even integers at the 
beginning of the array followed by all the odd integers.

Return any array that satisfies this condition.

Example 1:

Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: The outputs [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.

Example 2:

Input: nums = [0]
Output: [0]

Constraints:

    1 <= nums.length <= 5000
    0 <= nums[i] <= 5000

*/

#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Solution {
public:
    vector<int> sortArrayByParity(vector<int>& nums) {
        int l = 0, r = nums.size() - 1;
        while (l < r) {
            if (nums[l] % 2 > nums[r] % 2) swap(nums[l], nums[r]);
            if (nums[l] % 2 == 0) l++;
            if (nums[r] % 2 != 0) r--;
        }
        return nums;
    }
};

#ifdef LOCAL_TEST
#include <cassert>
#include <map>

bool isValid(const vector<int>& original, const vector<int>& result) {
    if (original.size() != result.size()) return false;
    map<int, int> counts;
    for (int x : original) counts[x]++;
    bool seenOdd = false;
    for (int x : result) {
        if (x % 2 != 0) seenOdd = true;
        if (seenOdd && x % 2 == 0) return false;
        if (--counts[x] < 0) return false;
    }
    for (const auto& [value, count] : counts) if (count != 0) return false;
    return true;
}

void printNums(const vector<int>& nums) {
    size_t limit = nums.size() > 20 ? 10 : nums.size();
    cout << "[";
    for (size_t i = 0; i < limit; ++i) cout << (i ? "," : "") << nums[i];
    if (nums.size() > 20) {
        cout << ",... (" << nums.size() - 20 << " omitted) ...";
        for (size_t i = nums.size() - 10; i < nums.size(); ++i) cout << "," << nums[i];
    }
    cout << "]";
}

void runTest(vector<int> input, const string& name) {
    const vector<int> original = input;
    vector<int> result = Solution().sortArrayByParity(input);
    bool passed = isValid(original, result);
    cout << name << "\nInput: nums = ";
    printNums(original);
    cout << "\nOutput: ";
    printNums(result);
    cout << "\n" << (passed ? "Passed" : "Failed") << "\n";
    assert(passed);
}

int main() {
    runTest({3,1,2,4}, "Ex1");
    runTest({0}, "Ex2");
    runTest({1}, "SingleOdd");
    runTest({2}, "SingleEven");
    runTest({2,4,6}, "AllEven");
    runTest({1,3,5}, "AllOdd");
    runTest({2,4,1,3}, "AlreadyPartitioned");
    runTest({1,3,2,4}, "ReversePartitioned");
    runTest({2,1,4,3}, "AltEvenFirst");
    runTest({1,2,3,4}, "AltOddFirst");
    runTest({1,1,2,2,0,0}, "DuplicatesAndZero");
    runTest({0,5000}, "MinMax");
    runTest({1,2,1,1,1}, "OneEven");
    runTest({2,2,2,1,2}, "OneOdd");
    vector<int> stress(5000, 1);
    for (int i = 0; i < 2500; ++i) stress[i] = 2;
    runTest(stress, "Stress");
}
#endif
