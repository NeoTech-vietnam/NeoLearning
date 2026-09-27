/*
Given an integer array nums of length n, you want to create an array ans of 
length 2n where ans[i] == nums[i] and ans[i + n] == nums[i] for 0 <= i < n (0-indexed).
Specifically, ans is the concatenation of two nums arrays.
Return the array ans.

Example 1:

Input: nums = [1,2,1]
Output: [1,2,1,1,2,1]
Explanation: The array ans is formed as follows:
- ans = [nums[0],nums[1],nums[2],nums[0],nums[1],nums[2]]
- ans = [1,2,1,1,2,1]
Example 2:

Input: nums = [1,3,2,1]
Output: [1,3,2,1,1,3,2,1]
Explanation: The array ans is formed as follows:
- ans = [nums[0],nums[1],nums[2],nums[3],nums[0],nums[1],nums[2],nums[3]]
- ans = [1,3,2,1,1,3,2,1]

Constraints:

n == nums.length
1 <= n <= 1000
1 <= nums[i] <= 1000
*/

#include <vector>
#include <iostream>

using std::cout;
using std::endl;
using std::vector;

class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        int n = static_cast<int>(nums.size());
        vector<int> ans (2*n); // {} is used for assign inital value
        for(int i = 0; i < n; i++){
            ans[i] = nums[i];
            ans[i + n] = nums[i];
        }
        return ans;
    }
    /* STL method
    vector<int> getConcatenation(vector<int>& nums) {
        vector<int> ans = nums;
        ans.insert(ans.end(), nums.begin(), nums.end());
        return ans;
    }
    */
};

static bool areEqual(const vector<int>& a, const vector<int>& b) {
    if (a.size() != b.size()) return false;
    for (size_t i = 0; i < a.size(); i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

static bool runTest(const char* name, vector<int> input, const vector<int>& expected) {
    Solution sol;
    vector<int> actual = sol.getConcatenation(input);
    bool ok = areEqual(actual, expected);
    cout << name << ": " << (ok ? "PASS" : "FAIL") << endl;
    return ok;
}

int main(void){
    bool allOk = true;

    allOk &= runTest("Test 1 (example 1)", {1, 2, 1}, {1, 2, 1, 1, 2, 1});
    allOk &= runTest("Test 2 (example 2)", {1, 3, 2, 1}, {1, 3, 2, 1, 1, 3, 2, 1});
    allOk &= runTest("Test 3 (single element)", {5}, {5, 5});
    allOk &= runTest("Test 4 (repeated value)", {7, 7, 7}, {7, 7, 7, 7, 7, 7});

    vector<int> big(1000);
    vector<int> bigExpected(2000);
    for (int i = 0; i < 1000; i++) {
        big[i] = (i % 1000) + 1;
        bigExpected[i] = big[i];
        bigExpected[i + 1000] = big[i];
    }
    allOk &= runTest("Test 5 (size 1000)", big, bigExpected);

    cout << (allOk ? "ALL TESTS PASSED" : "SOME TESTS FAILED") << endl;
    return allOk ? 0 : 1;
}