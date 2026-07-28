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
    int left = 0, right = numsSize - 1;
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] % 2 == 0) res[left++] = nums[i];
        else res[right--] = nums[i];
    }
    return res;
}

#ifdef LOCAL_TEST
#include <stdio.h>
#include <string.h>

static void print_array(const int* nums, int size) {
    printf("[");
    for (int i = 0; i < size; ++i) printf("%d%s", nums[i], i + 1 < size ? "," : "");
    printf("]");
}

static int compare_ints(const void* a, const void* b) {
    int x = *(const int*)a;
    int y = *(const int*)b;
    return (x > y) - (x < y);
}

static int verify_result(const int* result, int resultSize, const int* input, int inputSize) {
    if (resultSize != inputSize) {
        printf("  FAIL: returned size=%d, expected size=%d\n", resultSize, inputSize);
        return 0;
    }

    int* expected = malloc((size_t)inputSize * sizeof(int));
    int* actual = malloc((size_t)resultSize * sizeof(int));
    if (expected == NULL || actual == NULL) {
        printf("  FAIL: test allocation failed\n");
        free(expected);
        free(actual);
        return 0;
    }
    memcpy(expected, input, (size_t)inputSize * sizeof(int));
    memcpy(actual, result, (size_t)resultSize * sizeof(int));
    qsort(expected, (size_t)inputSize, sizeof(int), compare_ints);
    qsort(actual, (size_t)resultSize, sizeof(int), compare_ints);
    int same_values = memcmp(expected, actual, (size_t)inputSize * sizeof(int)) == 0;
    free(expected);
    free(actual);
    if (!same_values) {
        printf("  FAIL: output values differ from input\n");
        return 0;
    }

    int found_odd = 0;
    for (int i = 0; i < resultSize; ++i) {
        if (result[i] % 2 != 0) found_odd = 1;
        else if (found_odd) {
            printf("  FAIL: even value appears after odd value\n");
            return 0;
        }
    }
    return 1;
}

static void run_case(const char* name, int* input, int inputSize, int* passed, int* total) {
    ++(*total);
    int returnSize = 0;
    int* result = sortArrayByParity(input, inputSize, &returnSize);

    printf("%s\n", name);
    printf("Input: nums = ");
    print_array(input, inputSize);
    printf("\nOutput: ");
    if (result != NULL) print_array(result, returnSize);
    else printf("NULL");
    printf("\n");

    if (result != NULL && verify_result(result, returnSize, input, inputSize)) {
        printf("Passed\n");
        ++(*passed);
    } else {
        if (result == NULL) printf("FAIL: returned NULL\n");
        printf("Failed\n");
    }
    printf("\n");
    free(result);
}

int main(void) {
    printf("=== Sort Array By Parity Tests ===\n\n");
    int passed = 0;
    int total = 0;

    int nums1[] = {3, 1, 2, 4};
    int nums2[] = {0};
    int nums3[] = {2, 4, 6};
    int nums4[] = {1, 3, 5};
    int nums5[] = {2, 4, 1, 3};
    int nums6[] = {1, 3, 2, 4};
    int nums7[] = {0, 5, 2, 5, 0, 2};
    int nums8[] = {5000, 4999, 0, 1};

    run_case("Test 1 (Example 1)", nums1, 4, &passed, &total);
    run_case("Test 2 (Example 2)", nums2, 1, &passed, &total);
    run_case("Test 3 (All even)", nums3, 3, &passed, &total);
    run_case("Test 4 (All odd)", nums4, 3, &passed, &total);
    run_case("Test 5 (Already partitioned)", nums5, 4, &passed, &total);
    run_case("Test 6 (Reverse partitioned)", nums6, 4, &passed, &total);
    run_case("Test 7 (Duplicates and zero)", nums7, 6, &passed, &total);
    run_case("Test 8 (Constraint values)", nums8, 4, &passed, &total);

    printf("=== Summary ===\n");
    printf("Passed: %d/%d\n", passed, total);
    return passed == total ? 0 : 1;
}
#endif