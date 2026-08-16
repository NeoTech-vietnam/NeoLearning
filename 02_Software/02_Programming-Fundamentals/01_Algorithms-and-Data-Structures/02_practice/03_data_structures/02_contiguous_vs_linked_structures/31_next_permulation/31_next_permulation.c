/*

A permutation of an array of integers is an arrangement of its members into a sequence or linear order.
- For example, for arr = [1,2,3], the following are 
all the permutations of arr: [1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1].

The next permutation of an array of integers is the next lexicographically greater permutation 
of its integer. More formally, if all the permutations of the array are sorted in one container 
according to their lexicographical order, then the next permutation of that array is the permutation 
that follows it in the sorted container. If such arrangement is not possible, the array must be 
rearranged as the lowest possible order (i.e., sorted in ascending order).

- For example, the next permutation of arr = [1,2,3] is [1,3,2].
- Similarly, the next permutation of arr = [2,3,1] is [3,1,2].
- While the next permutation of arr = [3,2,1] is [1,2,3] because [3,2,1] 
does not have a lexicographical larger rearrangement.

Given an array of integers nums, find the next permutation of nums.

The replacement must be in place and use only constant extra memory.

Example 1:

Input: nums = [1,2,3]
Output: [1,3,2]

Example 2:

Input: nums = [3,2,1]
Output: [1,2,3]

Example 3:

Input: nums = [1,1,5]
Output: [1,5,1]

Constraints:

    1 <= nums.length <= 100
    0 <= nums[i] <= 100

*/

void nextPermutation(int* nums, int numsSize) {
    int pivot = numsSize - 2;
    while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) --pivot;

    if (pivot >= 0) {
        int successor = numsSize - 1;
        while (nums[successor] <= nums[pivot]) --successor;
        int temp = nums[pivot];
        nums[pivot] = nums[successor];
        nums[successor] = temp;
    }

    for (int left = pivot + 1, right = numsSize - 1; left < right; ++left, --right) {
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
    }
}

#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>
#include <string.h>

static void printNums(const int *nums, int size) {
    printf("[");
    for (int i = 0; i < size; ++i) printf("%s%d", i ? "," : "", nums[i]);
    printf("]");
}

static int runTest(const int *input, int size, const int *expected, const char *name) {
    int actual[100];
    memcpy(actual, input, (size_t)size * sizeof(int));
    int *identity = actual;
    nextPermutation(actual, size);
    int passed = identity == actual && memcmp(actual, expected, (size_t)size * sizeof(int)) == 0;
    printf("%s\nInput: nums = ", name); printNums(input, size);
    printf("\nOutput: "); printNums(actual, size);
    printf("\n%s\n\n", passed ? "Passed" : "Failed");
    assert(passed);
    return passed;
}

int main(void) {
    int total = 0, passed = 0;
#define TEST(input, expected, name) do { ++total; passed += runTest(input, (int)(sizeof(input) / sizeof((input)[0])), expected, name); } while (0)
    int example1[] = {1,2,3}, example1Expected[] = {1,3,2}; TEST(example1, example1Expected, "Example1");
    int example2[] = {3,2,1}, example2Expected[] = {1,2,3}; TEST(example2, example2Expected, "Example2");
    int example3[] = {1,1,5}, example3Expected[] = {1,5,1}; TEST(example3, example3Expected, "Example3");
    int single[] = {7}, singleExpected[] = {7}; TEST(single, singleExpected, "Single");
    int ascending2[] = {1,2}, ascending2Expected[] = {2,1}; TEST(ascending2, ascending2Expected, "Ascending2");
    int descending2[] = {2,1}, descending2Expected[] = {1,2}; TEST(descending2, descending2Expected, "Descending2");
    int allEqual[] = {4,4,4}, allEqualExpected[] = {4,4,4}; TEST(allEqual, allEqualExpected, "AllEqual");
    int firstPivot[] = {1,3,2}, firstPivotExpected[] = {2,1,3}; TEST(firstPivot, firstPivotExpected, "FirstPivot");
    int middlePivot[] = {1,2,3,6,5,4}, middlePivotExpected[] = {1,2,4,3,5,6}; TEST(middlePivot, middlePivotExpected, "MiddlePivot");
    int duplicateSuffix[] = {1,2,2,3}, duplicateSuffixExpected[] = {1,2,3,2}; TEST(duplicateSuffix, duplicateSuffixExpected, "DuplicateSuffix");
    int bounds[] = {0,0,100}, boundsExpected[] = {0,100,0}; TEST(bounds, boundsExpected, "Bounds");
    int descendingBounds[] = {100,0,0}, descendingBoundsExpected[] = {0,0,100}; TEST(descendingBounds, descendingBoundsExpected, "DescendingBounds");
    int duplicatePivot[] = {1,5,5,5}, duplicatePivotExpected[] = {5,1,5,5}; TEST(duplicatePivot, duplicatePivotExpected, "DuplicatePivot");
    int alternating[] = {0,1,0,1}, alternatingExpected[] = {0,1,1,0}; TEST(alternating, alternatingExpected, "Alternating");
    int stress[100], stressExpected[100]; for (int i = 0; i < 100; ++i) stress[i] = stressExpected[i] = i; stressExpected[98] = 99; stressExpected[99] = 98; TEST(stress, stressExpected, "Stress");
#undef TEST
    printf("Passed %d/%d\n", passed, total);
    return 0;
}
#endif