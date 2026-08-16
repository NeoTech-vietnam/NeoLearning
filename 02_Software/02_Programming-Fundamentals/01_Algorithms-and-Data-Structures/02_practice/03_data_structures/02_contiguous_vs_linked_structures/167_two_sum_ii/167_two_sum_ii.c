/*
Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, 
find two numbers such that they add up to a specific target number. 
Let these two numbers be numbers[index1] and 
numbers[index2] where 1 <= index1 < index2 <= numbers.length.

Return the indices of the two numbers index1 and index2, each incremented by one, 
as an integer array [index1, index2] of length 2.

The tests are generated such that there is exactly one solution. 
You may not use the same element twice.

Your solution must use only constant extra space.

Example 1:

Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].

Example 2:

Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].

Example 3:

Input: numbers = [-1,0], target = -1
Output: [1,2]
Explanation: The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].

Constraints:
    2 <= numbers.length <= 3 * 104
    -1000 <= numbers[i] <= 1000
    numbers is sorted in non-decreasing order.
    -1000 <= target <= 1000
    The tests are generated such that there is exactly one solution.

*/
#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* numbers, int numbersSize, int target, int* returnSize) {
    int left = 0;
    int right = numbersSize - 1;

    while(left < right) {
        int sum = numbers[left] + numbers[right];
        if(sum == target) {
            int* result = (int*) malloc(2 * sizeof(int));
            if(result == NULL) {
                *returnSize = 0;
                return NULL;
            }
            result[0] = left + 1;
            result[1] = right + 1;
            *returnSize = 2;
            return result;
        }
        if(sum < target) {
            ++left;
        }
        else {
            --right;
        }
    }
    /* Expect not to reach this line */
    *returnSize = 0;
    return NULL;
}

#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>
#include <string.h>

int validTwoSum(const int* numbers, int size, int target, const int* result, int resultSize) {
    return result != NULL && resultSize == 2 && result[0] >= 1 && result[0] < result[1]
        && result[1] <= size && numbers[result[0] - 1] + numbers[result[1] - 1] == target;
}

void printNumbers(const int* values, int size) {
    int limit = size > 20 ? 10 : size;
    printf("[");
    for (int i = 0; i < limit; ++i) printf("%s%d", i ? "," : "", values[i]);
    if (size > 20) {
        printf(",... (%d omitted) ...", size - 20);
        for (int i = size - 10; i < size; ++i) printf(",%d", values[i]);
    }
    printf("]");
}

void runTest(const int* input, int size, int target, const char* name) {
    int copy[30000];
    memcpy(copy, input, (size_t)size * sizeof(int));
    int resultSize = 0;
    int* result = twoSum(copy, size, target, &resultSize);
    int passed = validTwoSum(input, size, target, result, resultSize)
        && memcmp(copy, input, (size_t)size * sizeof(int)) == 0;
    printf("%s\nInput: numbers = ", name);
    printNumbers(input, size);
    printf(", target = %d\nOutput: [", target);
    if (result != NULL && resultSize == 2) printf("%d,%d", result[0], result[1]);
    printf("]\n%s\n", passed ? "Passed" : "Failed");
    free(result);
}

int main(void) {
    const int t1[] = {2,7,11,15}; runTest(t1, 4, 9, "Ex1");
    const int t2[] = {2,3,4}; runTest(t2, 3, 6, "Ex2");
    const int t3[] = {-1,0}; runTest(t3, 2, -1, "Ex3");
    const int t4[] = {1,2}; runTest(t4, 2, 3, "MinimumPositive");
    const int t5[] = {-2,-1}; runTest(t5, 2, -3, "MinimumNegative");
    const int t6[] = {5,5}; runTest(t6, 2, 10, "DuplicatePair");
    const int t7[] = {-10,-3,-1,2,7}; runTest(t7, 5, -11, "AllNegativePair");
    const int t8[] = {-8,-3,0,4,9}; runTest(t8, 5, 1, "MixedSigns");
    const int t9[] = {1,4,7,10,13}; runTest(t9, 5, 14, "MiddlePair");
    const int t10[] = {1,2,3,4,9,11}; runTest(t10, 6, 20, "LastPair");
    const int t11[] = {-1000,-500,0,500,1000}; runTest(t11, 5, 0, "MinMaxValues");
    const int t12[] = {-5,-5,-2,1,3,8}; runTest(t12, 6, -4, "DuplicateValues");
    const int t13[] = {-4,-1,0,0,0,6}; runTest(t13, 6, 0, "ZeroPair");
    const int t14[] = {-20,-10,-1,2,3,4,100}; runTest(t14, 7, 90, "OuterPair");
    const int t15[] = {-3,-2,-1,0,1,2,3}; runTest(t15, 7, -1, "FirstAndLastCandidates");
    const int t16[] = {-1000,-999,-998,0,1,999,1000}; runTest(t16, 7, 1, "BoundaryTarget");
    int stress[28014];
    int index = 0;
    for (int value = -1000; value <= 1000; ++value)
        for (int repeat = 0; repeat < 14; ++repeat) stress[index++] = value;
    runTest(stress, 28014, 1999, "Stress");
    return 0;
}
#endif