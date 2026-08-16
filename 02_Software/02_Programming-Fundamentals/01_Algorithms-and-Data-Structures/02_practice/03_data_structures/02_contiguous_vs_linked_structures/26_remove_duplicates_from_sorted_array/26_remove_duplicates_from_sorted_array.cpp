/*
Given an integer array nums sorted in non-decreasing order, 
remove the duplicates in-place such that each unique element appears only once. 

The relative order of the elements should be kept the same.
Consider the number of unique elements in nums to be k​​​​​​​​​​​​​​. After removing duplicates, 
return the number of unique elements k.

The first k elements of nums should contain the unique numbers in sorted order. 
The remaining elements beyond index k - 1 can be ignored.

Custom Judge:

The judge will test your solution with the following code:

int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}

If all assertions pass, then your solution will be accepted.

Example 1:

Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 
and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

Example 2:

Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums 
being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

Constraints:

    1 <= nums.length <= 3 * 10^4
    -100 <= nums[i] <= 100
    nums is sorted in non-decreasing order.
*/

/*
Strategy: Two-pointer approach

1. Keep track of position k for next unique element
2. Iterate from index 1 onwards
3. When nums[i] != nums[i-1], write nums[i] to nums[k] and increment k
4. Return k (count of unique elements)

Time: O(n), Space: O(1)
*/

#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if(nums.size() == 0) return 0;
        int k = 1; /* First element is unique, no need to check */
        /* Check for the iterative inside the nums array */
        for(int i = 1; i < static_cast<int>(nums.size()); i++){
            /* check for the duplication */
            if(nums.at(i) != nums.at(i - 1))
                nums.at(k++) = nums.at(i);
        }
        return k;
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

static bool verify_result(const vector<int>& nums, int k, const vector<int>& expected) {
    if (k != static_cast<int>(expected.size())) {
        cout << "  FAIL: returned k=" << k << ", expected k=" << expected.size() << '\n';
        return false;
    }
    for (int i = 0; i < k; ++i) {
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
    int k = solution.removeDuplicates(nums);

    cout << name << '\n';
    cout << "  Output: k=" << k << ", nums=" << format_prefix(nums, k) << '\n';
    if (verify_result(nums, k, expected)) {
        cout << "  PASS\n";
        ++passed;
    }
    cout << '\n';
}

int main() {
    cout << "=== Remove Duplicates from Sorted Array Tests ===\n\n";

    int passed = 0;
    int total = 0;

    run_case("Test 1 (Example 1): [1,1,2]", {1, 1, 2}, {1, 2}, passed, total);
    run_case("Test 2 (Example 2): [0,0,1,1,1,2,2,3,3,4]", {0, 0, 1, 1, 1, 2, 2, 3, 3, 4}, {0, 1, 2, 3, 4}, passed, total);
    run_case("Test 3 (Single element): [1]", {1}, {1}, passed, total);
    run_case("Test 4 (All duplicates): [5,5,5,5]", {5, 5, 5, 5}, {5}, passed, total);
    run_case("Test 5 (No duplicates): [1,2,3,4,5]", {1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}, passed, total);
    run_case("Test 6 (Negative numbers): [-3,-3,-1,0,0,2,2]", {-3, -3, -1, 0, 0, 2, 2}, {-3, -1, 0, 2}, passed, total);
    run_case("Test 7 (Duplicates at boundaries): [1,1,2,3,3]", {1, 1, 2, 3, 3}, {1, 2, 3}, passed, total);
    run_case("Test 8 (Boundary values -100 to 100): [-100,-100,0,100,100]", {-100, -100, 0, 100, 100}, {-100, 0, 100}, passed, total);
    run_case("Test 9 (Two identical elements): [1,1]", {1, 1}, {1}, passed, total);
    run_case("Test 10 (Two different elements): [1,2]", {1, 2}, {1, 2}, passed, total);
    run_case("Test 11 (Many repeats per value): [0,0,0,1,1,1,2,2,2]", {0, 0, 0, 1, 1, 1, 2, 2, 2}, {0, 1, 2}, passed, total);
    run_case("Test 12 (All boundary duplicates): [-100,-100,-100,100,100,100]", {-100, -100, -100, 100, 100, 100}, {-100, 100}, passed, total);

    cout << "=== Summary ===\n";
    cout << "Passed: " << passed << "/" << total << '\n';

    return passed == total ? 0 : 1;
}
#endif

