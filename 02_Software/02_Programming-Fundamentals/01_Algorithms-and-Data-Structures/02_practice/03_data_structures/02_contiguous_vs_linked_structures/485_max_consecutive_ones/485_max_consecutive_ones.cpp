/*

Given a binary array nums, return the maximum number of consecutive 1's in the array.

Example 1:

Input: nums = [1,1,0,1,1,1]
Output: 3
Explanation: The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.

Example 2:

Input: nums = [1,0,1,1,0,1]
Output: 2

Constraints:

1 <= nums.length <= 10^5
nums[i] is either 0 or 1.

*/

#include <iostream>
#include <vector>

// using namespace std;

class Solution {
public:
    int findMaxConsecutiveOnes(std::vector<int>& nums) {
        int result {0};
        int max_result {0};
        for (int i = 0; i < (int) nums.size(); i++)
        {
            if(nums[i] == 1)
            {
                result += 1;
                max_result = (max_result > result) ? max_result : result;
            }
            else
                result = 0;
        }
        return max_result;
    }

};

void runTest(const std::vector<int>& nums, int expected, const std::string& description) {
    Solution sol;
    std::vector<int> numsCopy = nums;
    int result = sol.findMaxConsecutiveOnes(numsCopy);
    
    bool passed = (result == expected);
    
    std::cout << (passed ? "✓ PASS" : "✗ FAIL") << " | ";
    std::cout << "Expected: " << expected << ", Got: " << result << " | ";
    std::cout << description << std::endl;
    
    if (!passed) {
        std::cout << "  Input: [";
        for (size_t i = 0; i < nums.size(); i++) {
            std::cout << nums[i];
            if (i < nums.size() - 1) std::cout << ",";
        }
        std::cout << "]" << std::endl;
    }
}

int main (void) {
    std::cout << "========== TESTING: Maximum Consecutive Ones (LeetCode 485) ==========" << std::endl;
    std::cout << std::endl;
    
    // Basic Examples
    std::cout << "--- BASIC EXAMPLES ---" << std::endl;
    runTest({1,1,0,1,1,1}, 3, "Example 1: Last three 1's");
    runTest({1,0,1,1,0,1}, 2, "Example 2: Multiple pairs");
    std::cout << std::endl;
    
    // Edge Cases
    std::cout << "--- EDGE CASES ---" << std::endl;
    runTest({1}, 1, "Single element (1)");
    runTest({0}, 0, "Single element (0)");
    runTest({1,1,1,1,1}, 5, "All ones");
    runTest({0,0,0,0,0}, 0, "All zeros");
    runTest({0,1,1,1}, 3, "Starts with 0");
    runTest({1,1,1,0}, 3, "Ends with 0");
    runTest({0,0,1,1,1,0,0}, 3, "Surrounded by zeros");
    std::cout << std::endl;
    
    // Variations in pattern
    std::cout << "--- VARIATIONS IN PATTERN ---" << std::endl;
    runTest({1,1,0,1,1,0,1,1}, 2, "Multiple equal length sequences");
    runTest({1,0,1,1,0,1,1,1}, 3, "Increasing pattern");
    runTest({1,0,1,0,1,0,1}, 1, "Alternating");
    runTest({1,1,1,0,1,1}, 3, "Two consecutive sequences");
    std::cout << std::endl;
    
    // Larger arrays
    std::cout << "--- LARGER ARRAYS ---" << std::endl;
    runTest({1,1,1,1,1,0,1,1,1,0,0,1}, 5, "Ones at start (5)");
    runTest({0,0,1,0,1,1,1,0,1,1,1,1,1}, 5, "Ones at end (5)");
    std::cout << std::endl;
    
    // Special patterns
    std::cout << "--- SPECIAL PATTERNS ---" << std::endl;
    runTest({1,1,0,0,0,0,1,1}, 2, "Ones at boundaries");
    runTest({1,0,0,0,0,0,1,1,1,1,1}, 5, "One at start, many at end");
    runTest({1,0,1,0,1,0,1,0,1}, 1, "Single ones separated");
    std::cout << std::endl;
    
    std::cout << "========== END OF TESTS ==========" << std::endl;

    return 0;
}