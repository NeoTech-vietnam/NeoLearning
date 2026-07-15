/*

Given an integer array nums and an integer val, 
remove all occurrences of val in nums in-place. 
The order of the elements may be changed. 
Then return the number of elements in nums which are not equal to val.

Consider the number of elements in nums which are not equal to val be k, 
to get accepted, you need to do the following things:

- Change the array nums such that the first k elements of nums contain 
the elements which are not equal to val. The remaining elements 
of nums are not important as well as the size of nums.
- Return k.

Custom Judge:

The judge will test your solution with the following code:

int[] nums = [...]; // Input array
int val = ...; // Value to remove
int[] expectedNums = [...]; // The expected answer with correct length.
                            // It is sorted with no values equaling val.

int k = removeElement(nums, val); // Calls your implementation

assert k == expectedNums.length;
sort(nums, 0, k); // Sort the first k elements of nums
for (int i = 0; i < actualLength; i++) {
    assert nums[i] == expectedNums[i];
}

If all assertions pass, then your solution will be accepted.

Example 1:

Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).

Example 2:

Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).

Constraints:

0 <= nums.length <= 100
0 <= nums[i] <= 50
0 <= val <= 100

*/

#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int left = 0;
        for (int right = 0; right < nums.size(); right++) {
            if (nums[right] != val) {
                nums[left] = nums[right];
                left++;
            }
        }
        return left;
    }
};

void printArray(const vector<int>& nums, int k) {
    cout << "[";
    for (int i = 0; i < k; i++) {
        cout << nums[i];
        if (i < k - 1) cout << ", ";
    }
    cout << "]";
}

void runTest(vector<int> nums, int val, int expected, const string& description) {
    Solution sol;
    int k = sol.removeElement(nums, val);
    
    bool passed = (k == expected);
    
    cout << (passed ? "✓ PASS" : "✗ FAIL") << " | ";
    cout << "Expected: " << expected << ", Got: " << k << " | ";
    cout << description << endl;
    
    if (!passed) {
        cout << "  First " << k << " elements: ";
        printArray(nums, k);
        cout << " (val=" << val << ")" << endl;
    }
}

int main (void){
    cout << "========== TESTING: Remove Element (LeetCode 27) ==========" << endl;
    cout << endl;
    
    // Basic Examples
    cout << "--- BASIC EXAMPLES ---" << endl;
    runTest({3,2,2,3}, 3, 2, "Example 1: val=3, expected k=2");
    runTest({0,1,2,2,3,0,4,2}, 2, 5, "Example 2: val=2, expected k=5");
    cout << endl;
    
    // Edge Cases
    cout << "--- EDGE CASES ---" << endl;
    runTest({}, 1, 0, "Empty array");
    runTest({1}, 1, 0, "Single element equals val");
    runTest({1}, 2, 1, "Single element not equals val");
    runTest({1,1,1,1,1}, 1, 0, "All elements equal val");
    runTest({2,3,4,5,6}, 1, 5, "No elements equal val");
    cout << endl;
    
    // Different positions
    cout << "--- DIFFERENT POSITIONS ---" << endl;
    runTest({3,3,3,2}, 3, 1, "val at start, different at end");
    runTest({2,3,3,3}, 3, 1, "different at start, val at end");
    runTest({3,1,3,2,3}, 3, 2, "val mixed throughout");
    cout << endl;
    
    // Variations
    cout << "--- VARIATIONS ---" << endl;
    runTest({1,2,3}, 2, 2, "Remove middle element");
    runTest({1,1,2,2,3,3}, 2, 4, "Pairs with one val");
    runTest({5,4,3,2,1}, 3, 4, "Descending order");
    runTest({1,2,1,2,1,2}, 1, 3, "Alternating pattern");
    cout << endl;
    
    // Boundary values
    cout << "--- BOUNDARY VALUES ---" << endl;
    runTest({0,0,0}, 0, 0, "All zeros, remove 0");
    runTest({50,50,50}, 50, 0, "All max values, remove max");
    runTest({0,1,2,3,4,5}, 100, 6, "val out of range");
    cout << endl;
    
    cout << "========== END OF TESTS ==========" << endl;
    
    return 0;
}