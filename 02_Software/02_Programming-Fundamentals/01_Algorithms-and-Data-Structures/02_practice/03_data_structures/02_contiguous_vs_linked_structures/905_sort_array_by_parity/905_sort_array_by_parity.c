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

#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* sortArrayByParity(int* nums, int numsSize, int* returnSize) {
    *returnSize = numsSize;
    int* res = (int*)malloc(numsSize * sizeof(int));
    int l = 0, r = numsSize - 1;
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] % 2 == 0) res[l++] = nums[i];
        else res[r--] = nums[i];
    }
    return res;
}

#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>

int isValid(const int* original, int size, const int* result, int resultSize) {
    if (result == NULL || resultSize != size) return 0;
    int counts[5001] = {0};
    int seenOdd = 0;
    for (int i = 0; i < size; ++i) counts[original[i]]++;
    for (int i = 0; i < size; ++i) {
        if (result[i] < 0 || result[i] > 5000) return 0;
        if (result[i] % 2 != 0) seenOdd = 1;
        if (seenOdd && result[i] % 2 == 0) return 0;
        if (--counts[result[i]] < 0) return 0;
    }
    return 1;
}

void printNums(const int* nums, int size) {
    int limit = size > 20 ? 10 : size;
    printf("[");
    for (int i = 0; i < limit; ++i) printf("%s%d", i ? "," : "", nums[i]);
    if (size > 20) {
        printf(",... (%d omitted) ...", size - 20);
        for (int i = size - 10; i < size; ++i) printf(",%d", nums[i]);
    }
    printf("]");
}

void runTest(const int* input, int size, const char* name) {
    int retSize = 0;
    int* result = sortArrayByParity((int*)input, size, &retSize);
    int passed = isValid(input, size, result, retSize);
    printf("%s\nInput: nums = ", name);
    printNums(input, size);
    printf("\nOutput: ");
    printNums(result, retSize);
    printf("\n%s\n", passed ? "Passed" : "Failed");
    free(result);    assert(passed);}

int main(void) {
    const int t1[] = {3,1,2,4}; runTest(t1, 4, "Ex1");
    const int t2[] = {0}; runTest(t2, 1, "Ex2");
    const int t3[] = {1}; runTest(t3, 1, "SingleOdd");
    const int t4[] = {2}; runTest(t4, 1, "SingleEven");
    const int t5[] = {2,4,6}; runTest(t5, 3, "AllEven");
    const int t6[] = {1,3,5}; runTest(t6, 3, "AllOdd");
    const int t7[] = {2,4,1,3}; runTest(t7, 4, "AlreadyPartitioned");
    const int t8[] = {1,3,2,4}; runTest(t8, 4, "ReversePartitioned");
    const int t9[] = {2,1,4,3}; runTest(t9, 4, "AltEvenFirst");
    const int t10[] = {1,2,3,4}; runTest(t10, 4, "AltOddFirst");
    const int t11[] = {1,1,2,2,0,0}; runTest(t11, 6, "DuplicatesAndZero");
    const int t12[] = {0,5000}; runTest(t12, 2, "MinMax");
    const int t13[] = {1,2,1,1,1}; runTest(t13, 5, "OneEven");
    const int t14[] = {2,2,2,1,2}; runTest(t14, 5, "OneOdd");
    int stress[5000];
    for (int i = 0; i < 5000; ++i) stress[i] = i < 2500 ? 2 : 1;
    runTest(stress, 5000, "Stress");
    return 0;
}
#endif
