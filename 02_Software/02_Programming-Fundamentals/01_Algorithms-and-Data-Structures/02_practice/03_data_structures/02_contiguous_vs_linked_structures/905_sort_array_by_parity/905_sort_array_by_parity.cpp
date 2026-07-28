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
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            if (nums[left] % 2 > nums[right] % 2) {
                swap(nums[left], nums[right]);
            }
            if (nums[left] % 2 == 0) left++;
            if (nums[right] % 2 != 0) right--;
        }
        return nums;
    }
};

#ifdef LOCAL_TEST
static string format_array(const vector<int>& nums) {
    string out = "[";
    for (size_t i = 0; i < nums.size(); ++i) {
        if (i > 0) out += ",";
        out += to_string(nums[i]);
    }
    return out + "]";
}

static bool verify_result(const vector<int>& result, const vector<int>& input) {
    if (result.size() != input.size()) {
        cout << "  FAIL: returned size=" << result.size() << ", expected size=" << input.size() << '\n';
        return false;
    }

    vector<int> expected = input;
    sort(expected.begin(), expected.end());
    vector<int> actual = result;
    sort(actual.begin(), actual.end());
    if (actual != expected) {
        cout << "  FAIL: output values differ from input\n";
        return false;
    }

    bool found_odd = false;
    for (int value : result) {
        if (value % 2 != 0) found_odd = true;
        else if (found_odd) {
            cout << "  FAIL: even value appears after odd value\n";
            return false;
        }
    }
    return true;
}

static void run_case(const string& name, const vector<int>& input, int& passed, int& total) {
    ++total;
    vector<int> nums = input;
    Solution solution;
    vector<int> result = solution.sortArrayByParity(nums);

    cout << name << '\n';
    cout << "Input: nums = " << format_array(input) << '\n';
    cout << "Output: " << format_array(result) << '\n';
    if (verify_result(result, input)) {
        cout << "Passed\n";
        ++passed;
    } else {
        cout << "Failed\n";
    }
    cout << '\n';
}

int main() {
    cout << "=== Sort Array By Parity Tests ===\n\n";
    int passed = 0;
    int total = 0;

    run_case("Test 1 (Example 1)", {3, 1, 2, 4}, passed, total);
    run_case("Test 2 (Example 2)", {0}, passed, total);
    run_case("Test 3 (All even)", {2, 4, 6}, passed, total);
    run_case("Test 4 (All odd)", {1, 3, 5}, passed, total);
    run_case("Test 5 (Already partitioned)", {2, 4, 1, 3}, passed, total);
    run_case("Test 6 (Reverse partitioned)", {1, 3, 2, 4}, passed, total);
    run_case("Test 7 (Duplicates and zero)", {0, 5, 2, 5, 0, 2}, passed, total);
    run_case("Test 8 (Constraint values)", {5000, 4999, 0, 1}, passed, total);

    cout << "=== Summary ===\n";
    cout << "Passed: " << passed << "/" << total << '\n';
    return passed == total ? 0 : 1;
}
#endif