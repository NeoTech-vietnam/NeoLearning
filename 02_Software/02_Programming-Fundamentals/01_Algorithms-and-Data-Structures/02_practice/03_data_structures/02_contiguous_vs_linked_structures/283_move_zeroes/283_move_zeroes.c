/*

Given an integer array nums, move all 0's to the end of it 
while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.

Example 1:

Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]

Example 2:

Input: nums = [0]
Output: [0]

Constraints:

    1 <= nums.length <= 104
    -231 <= nums[i] <= 231 - 1

Follow up: Could you minimize the total number of operations done?

*/

void moveZeroes(int* nums, int numsSize) {
    int write = 0;
    for (int read = 0; read < numsSize; read++) {
        if (nums[read] != 0) {
            nums[write++] = nums[read];
        }
    }
    for (int i = write; i < numsSize; i++) {
        nums[i] = 0;
    }
}

#ifdef LOCAL_TEST
#include <stdio.h>

static int verify_result(const int* nums, int numsSize, const int* expected) {
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] != expected[i]) {
            printf("  FAIL: nums[%d]=%d, expected %d\n", i, nums[i], expected[i]);
            return 0;
        }
    }
    return 1;
}

static void run_case(const char* name, int* nums, int numsSize,
                     const int* expected, int* passed, int* total) {
    ++(*total);
    moveZeroes(nums, numsSize);

    printf("%s\n", name);
    printf("  Output: [");
    for (int i = 0; i < numsSize; i++) {
        printf("%d%s", nums[i], i < numsSize - 1 ? "," : "");
    }
    printf("]\n");
    if (verify_result(nums, numsSize, expected)) {
        printf("  PASS\n");
        ++(*passed);
    }
    printf("\n");
}

int main(void) {
    printf("=== Move Zeroes Tests ===\n\n");

    int passed = 0;
    int total = 0;

    int nums1[] = {0, 1, 0, 3, 12};
    int exp1[] = {1, 3, 12, 0, 0};
    run_case("Test 1 (Example 1): [0,1,0,3,12]", nums1, 5, exp1, &passed, &total);

    int nums2[] = {0};
    int exp2[] = {0};
    run_case("Test 2 (Example 2): [0]", nums2, 1, exp2, &passed, &total);

    int nums3[] = {1, 2, 3, 4, 5};
    int exp3[] = {1, 2, 3, 4, 5};
    run_case("Test 3 (No zeros): [1,2,3,4,5]", nums3, 5, exp3, &passed, &total);

    int nums4[] = {0, 0, 0, 0};
    int exp4[] = {0, 0, 0, 0};
    run_case("Test 4 (All zeros): [0,0,0,0]", nums4, 4, exp4, &passed, &total);

    int nums5[] = {1};
    int exp5[] = {1};
    run_case("Test 5 (Single nonzero): [1]", nums5, 1, exp5, &passed, &total);

    int nums6[] = {1, 0, 2, 0, 3, 0, 4, 0};
    int exp6[] = {1, 2, 3, 4, 0, 0, 0, 0};
    run_case("Test 6 (Alternating): [1,0,2,0,3,0,4,0]", nums6, 8, exp6, &passed, &total);

    int nums7[] = {0, 0, 1, 2, 3};
    int exp7[] = {1, 2, 3, 0, 0};
    run_case("Test 7 (Zeros at start): [0,0,1,2,3]", nums7, 5, exp7, &passed, &total);

    int nums8[] = {1, 2, 3, 0, 0};
    int exp8[] = {1, 2, 3, 0, 0};
    run_case("Test 8 (Zeros at end): [1,2,3,0,0]", nums8, 5, exp8, &passed, &total);

    int nums9[] = {5, 0, 0, 0, 5};
    int exp9[] = {5, 5, 0, 0, 0};
    run_case("Test 9 (Zeros in middle): [5,0,0,0,5]", nums9, 5, exp9, &passed, &total);

    int nums10[] = {1, 0, 0, 0, 0};
    int exp10[] = {1, 0, 0, 0, 0};
    run_case("Test 10 (One nonzero, many zeros): [1,0,0,0,0]", nums10, 5, exp10, &passed, &total);

    printf("=== Summary ===\n");
    printf("Passed: %d/%d\n", passed, total);

    return passed == total ? 0 : 1;
}
#endif
