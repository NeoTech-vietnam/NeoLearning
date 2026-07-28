/*

Given an integer array nums, move all 0's to the end of it 
while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.

Example 1:

Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]

Example 2:

Input: nums = [0]
Output: [0]

Constraints:

    1 <= nums.length <= 104
    -231 <= nums[i] <= 231 - 1

Follow up: Could you minimize the total number of operations done?

*/

#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int write = 0;
        for (int read = 0; read < static_cast<int>(nums.size()); read++) {
            if (nums[read] != 0) {
                nums[write++] = nums[read];
            }
        }
        for (int i = write; i < static_cast<int>(nums.size()); i++) {
            nums[i] = 0;
        }
    }
};

#ifdef LOCAL_TEST
static string format_prefix(const vector<int>& nums, int k) {
    string out = "[";
    for (int i = 0; i < k; ++i) {
        if (i > 0) out += ",";
        out += to_string(nums[i]);
    }
    out += "]";
    return out;
}

static bool verify_result(const vector<int>& nums, int numsSize, const vector<int>& expected) {
    if (numsSize != static_cast<int>(expected.size())) {
        cout << "  FAIL: returned size=" << numsSize << ", expected size=" << expected.size() << '\n';
        return false;
    }
    for (int i = 0; i < numsSize; ++i) {
        if (nums[i] != expected[i]) {
            cout << "  FAIL: nums[" << i << "]=" << nums[i] << ", expected " << expected[i] << '\n';
            return false;
        }
    }
    return true;
}

static void run_case(const string& name, vector<int> nums, const vector<int>& expected,
                     int& passed, int& total) {
    ++total;
    Solution solution;
    int numsSize = static_cast<int>(nums.size());
    solution.moveZeroes(nums);

    cout << name << '\n';
    cout << "  Output: " << format_prefix(nums, numsSize) << '\n';
    if (verify_result(nums, numsSize, expected)) {
        cout << "  PASS\n";
        ++passed;
    }
    cout << '\n';
}

int main(void) {
    cout << "=== Move Zeroes Tests ===\n\n";

    int passed = 0;
    int total = 0;

    run_case("Test 1 (Example 1): [0,1,0,3,12]", {0, 1, 0, 3, 12}, {1, 3, 12, 0, 0}, passed, total);
    run_case("Test 2 (Example 2): [0]", {0}, {0}, passed, total);
    run_case("Test 3 (No zeros): [1,2,3,4,5]", {1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}, passed, total);
    run_case("Test 4 (All zeros): [0,0,0,0]", {0, 0, 0, 0}, {0, 0, 0, 0}, passed, total);
    run_case("Test 5 (Single nonzero): [1]", {1}, {1}, passed, total);
    run_case("Test 6 (Alternating): [1,0,2,0,3,0,4,0]", {1, 0, 2, 0, 3, 0, 4, 0}, {1, 2, 3, 4, 0, 0, 0, 0}, passed, total);
    run_case("Test 7 (Zeros at start): [0,0,1,2,3]", {0, 0, 1, 2, 3}, {1, 2, 3, 0, 0}, passed, total);
    run_case("Test 8 (Zeros at end): [1,2,3,0,0]", {1, 2, 3, 0, 0}, {1, 2, 3, 0, 0}, passed, total);
    run_case("Test 9 (Zeros in middle): [5,0,0,0,5]", {5, 0, 0, 0, 5}, {5, 5, 0, 0, 0}, passed, total);
    run_case("Test 10 (One nonzero, many zeros): [1,0,0,0,0]", {1, 0, 0, 0, 0}, {1, 0, 0, 0, 0}, passed, total);

    cout << "=== Summary ===\n";
    cout << "Passed: " << passed << "/" << total << '\n';

    return passed == total ? 0 : 1;
}
#endif