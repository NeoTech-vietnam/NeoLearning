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
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* getConcatenation(int* nums, int numsSize, int* returnSize) {
    
    int* result = (int*)malloc(sizeof(int)*(2*numsSize));

    *returnSize = 2 * numsSize;
    for (int i = 0; i < numsSize; i++) {
        result[i] = nums[i];
        result[i + numsSize] = nums[i];
    }
    return result;
}

static int check_array(const int *arr, int arrSize, const int *expected, int expectedSize) {
    if (arrSize != expectedSize) return 0;
    for (int i = 0; i < arrSize; i++) if (arr[i] != expected[i]) return 0;
    return 1;
}

int main(void) {
    int returnSize;
    int ok = 1;

    // Test 1: example [1,2,1]
    int a1[] = {1,2,1};
    int exp1[] = {1,2,1,1,2,1};
    int *out1 = getConcatenation(a1, 3, &returnSize);
    ok &= check_array(out1, returnSize, exp1, 6);
    free(out1);

    // Test 2: example [1,3,2,1]
    int a2[] = {1,3,2,1};
    int exp2[] = {1,3,2,1,1,3,2,1};
    int *out2 = getConcatenation(a2, 4, &returnSize);
    ok &= check_array(out2, returnSize, exp2, 8);
    free(out2);

    // Test 3: single element
    int a3[] = {5};
    int exp3[] = {5,5};
    int *out3 = getConcatenation(a3, 1, &returnSize);
    ok &= check_array(out3, returnSize, exp3, 2);
    free(out3);

    // Test 4: larger programmatic test (size 1000)
    int N = 1000;
    int *big = (int*)malloc(sizeof(int)*N);
    for (int i = 0; i < N; i++) big[i] = (i % 1000) + 1;
    int *out4 = getConcatenation(big, N, &returnSize);
    if (returnSize != 2*N) ok = 0;
    for (int i = 0; i < 2*N && ok; i++) {
        if (out4[i] != big[i % N]) ok = 0;
    }
    free(out4);
    free(big);

    if (ok) {
        puts("ALL TESTS PASSED");
        return 0;
    } else {
        puts("SOME TESTS FAILED");
        return 1;
    }
}
