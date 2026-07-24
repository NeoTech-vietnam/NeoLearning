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

#include <stdio.h>

int findMaxConsecutiveOnes(int* nums, int numsSize) {
    int result = 0;
    int max_result = 0;
    for(int i = 0; i < numsSize; i++){
        if(nums[i] == 1){
            result++;
            max_result = (result > max_result) ? result : max_result;
        }
        else{
            result = 0;
        }
    }
    return max_result;
}

void runTest(int* nums, int numsSize, int expected, const char* description) {
    int result = findMaxConsecutiveOnes(nums, numsSize);
    
    int passed = (result == expected);
    
    printf("%s | Expected: %d, Got: %d | %s\n",
           passed ? "✓ PASS" : "✗ FAIL",
           expected, result, description);
    
    if (!passed) {
        printf("  Input: [");
        for (int i = 0; i < numsSize; i++) {
            printf("%d", nums[i]);
            if (i < numsSize - 1) printf(",");
        }
        printf("]\n");
    }
}

int main (void){
    printf("========== TESTING: Maximum Consecutive Ones (LeetCode 485) ==========\n");
    printf("\n");
    
    // Basic Examples
    printf("--- BASIC EXAMPLES ---\n");
    int test1[] = {1,1,0,1,1,1};
    runTest(test1, 6, 3, "Example 1: Last three 1's");
    
    int test2[] = {1,0,1,1,0,1};
    runTest(test2, 6, 2, "Example 2: Multiple pairs");
    printf("\n");
    
    // Edge Cases
    printf("--- EDGE CASES ---\n");
    int test3[] = {1};
    runTest(test3, 1, 1, "Single element (1)");
    
    int test4[] = {0};
    runTest(test4, 1, 0, "Single element (0)");
    
    int test5[] = {1,1,1,1,1};
    runTest(test5, 5, 5, "All ones");
    
    int test6[] = {0,0,0,0,0};
    runTest(test6, 5, 0, "All zeros");
    
    int test7[] = {0,1,1,1};
    runTest(test7, 4, 3, "Starts with 0");
    
    int test8[] = {1,1,1,0};
    runTest(test8, 4, 3, "Ends with 0");
    
    int test9[] = {0,0,1,1,1,0,0};
    runTest(test9, 7, 3, "Surrounded by zeros");
    printf("\n");
    
    // Variations in pattern
    printf("--- VARIATIONS IN PATTERN ---\n");
    int test10[] = {1,1,0,1,1,0,1,1};
    runTest(test10, 8, 2, "Multiple equal length sequences");
    
    int test11[] = {1,0,1,1,0,1,1,1};
    runTest(test11, 8, 3, "Increasing pattern");
    
    int test12[] = {1,0,1,0,1,0,1};
    runTest(test12, 7, 1, "Alternating");
    
    int test13[] = {1,1,1,0,1,1};
    runTest(test13, 6, 3, "Two consecutive sequences");
    printf("\n");
    
    // Larger arrays
    printf("--- LARGER ARRAYS ---\n");
    int test14[] = {1,1,1,1,1,0,1,1,1,0,0,1};
    runTest(test14, 12, 5, "Ones at start (5)");
    
    int test15[] = {0,0,1,0,1,1,1,0,1,1,1,1,1};
    runTest(test15, 13, 5, "Ones at end (5)");
    printf("\n");
    
    // Special patterns
    printf("--- SPECIAL PATTERNS ---\n");
    int test16[] = {1,1,0,0,0,0,1,1};
    runTest(test16, 8, 2, "Ones at boundaries");
    
    int test17[] = {1,0,0,0,0,0,1,1,1,1,1};
    runTest(test17, 11, 5, "One at start, many at end");
    
    int test18[] = {1,0,1,0,1,0,1,0,1};
    runTest(test18, 9, 1, "Single ones separated");
    printf("\n");
    
    printf("========== END OF TESTS ==========\n");
    
    return 0;
}