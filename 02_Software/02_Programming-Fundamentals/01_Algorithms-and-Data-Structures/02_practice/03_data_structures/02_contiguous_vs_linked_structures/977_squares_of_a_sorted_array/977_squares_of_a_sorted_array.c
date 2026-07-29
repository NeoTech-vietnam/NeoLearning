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

#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* sortedSquares(int* nums, int numsSize, int* returnSize) {
    int* result = malloc((size_t)numsSize * sizeof(*result));
    int left = 0;
    int right = numsSize - 1;

    *returnSize = numsSize;

    for (int write = numsSize - 1; write >= 0; --write) {
        int leftSquare = nums[left] * nums[left];
        int rightSquare = nums[right] * nums[right];

        if (leftSquare > rightSquare) {
            result[write] = leftSquare;
            ++left;
        } else {
            result[write] = rightSquare;
            --right;
        }
    }

    return result;
}

#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void printNums(const int* nums, int size) {
    int limit = size > 20 ? 10 : size;
    printf("[");
    for (int i = 0; i < limit; ++i) printf("%s%d", i ? "," : "", nums[i]);
    if (size > 20) {
        printf(",... (%d omitted) ...", size - 20);
        for (int i = size - 10; i < size; ++i) printf(",%d", nums[i]);
    }
    printf("]");
}

static void runTest(const int* input, const int* expected, int size, const char* name) {
    int nums[10000];
    int returnSize = 0;
    memcpy(nums, input, (size_t)size * sizeof(*nums));
    int* result = sortedSquares(nums, size, &returnSize);
    int passed = result != NULL && returnSize == size &&
                 memcmp(nums, input, (size_t)size * sizeof(*nums)) == 0 &&
                 memcmp(result, expected, (size_t)size * sizeof(*result)) == 0;
    printf("%s\nInput: nums = ", name);
    printNums(input, size);
    printf("\nOutput: ");
    if (result != NULL && returnSize >= 0 && returnSize <= 10000) printNums(result, returnSize);
    else printf("[]");
    printf("\n%s\n", passed ? "Passed" : "Failed");
    free(result);
    assert(passed);
}

int main(void) {
    const int ex1[] = {-4,-1,0,3,10}, ex1Expected[] = {0,1,9,16,100};
    const int ex2[] = {-7,-3,2,3,11}, ex2Expected[] = {4,9,9,49,121};
    const int negative[] = {-5}, negativeExpected[] = {25};
    const int positive[] = {6}, positiveExpected[] = {36};
    const int allNegative[] = {-5,-4,-2}, allNegativeExpected[] = {4,16,25};
    const int allPositive[] = {1,2,5}, allPositiveExpected[] = {1,4,25};
    const int zeros[] = {0,0,0}, zerosExpected[] = {0,0,0};
    const int duplicates[] = {-3,-3,-1,0,1,3,3}, duplicatesExpected[] = {0,1,1,9,9,9,9};
    const int zeroSplit[] = {-2,0,2}, zeroSplitExpected[] = {0,4,4};
    const int equalAbs[] = {-4,4}, equalAbsExpected[] = {16,16};
    const int boundary[] = {-2,-1,0,1,2}, boundaryExpected[] = {0,1,1,4,4};
    const int extremes[] = {-10000,0,10000}, extremesExpected[] = {0,100000000,100000000};
    int stress[10000], stressExpected[10000];
    for (int i = 0; i < 10000; ++i) {
        stress[i] = i - 5000;
        stressExpected[i] = (i / 2 + (i & 1)) * (i / 2 + (i & 1));
    }
    runTest(ex1, ex1Expected, 5, "Example1");
    runTest(ex2, ex2Expected, 5, "Example2");
    runTest(negative, negativeExpected, 1, "SingleNegative");
    runTest(positive, positiveExpected, 1, "SinglePositive");
    runTest(allNegative, allNegativeExpected, 3, "AllNegative");
    runTest(allPositive, allPositiveExpected, 3, "AllPositive");
    runTest(zeros, zerosExpected, 3, "AllZero");
    runTest(duplicates, duplicatesExpected, 7, "DuplicateMagnitudes");
    runTest(zeroSplit, zeroSplitExpected, 3, "ZeroBetweenSigns");
    runTest(equalAbs, equalAbsExpected, 2, "EqualAbsoluteValues");
    runTest(boundary, boundaryExpected, 5, "SignBoundaries");
    runTest(extremes, extremesExpected, 3, "ConstraintExtremes");
    runTest(stress, stressExpected, 10000, "MaximumSizeStress");
    return 0;
}
#endif