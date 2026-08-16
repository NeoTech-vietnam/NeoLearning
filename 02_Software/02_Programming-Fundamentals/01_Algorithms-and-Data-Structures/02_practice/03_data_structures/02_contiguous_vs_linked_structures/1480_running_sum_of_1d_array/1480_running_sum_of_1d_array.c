/*

Given an array nums. We define a running sum of an array
as runningSum[i] = sum(nums[0]…nums[i]).
Return the running sum of nums.

Example 1:

Input: nums = [1,2,3,4]
Output: [1,3,6,10]
Explanation: Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4].

Example 2:

Input: nums = [1,1,1,1,1]
Output: [1,2,3,4,5]
Explanation: Running sum is obtained as follows: [1, 1+1, 1+1+1, 1+1+1+1,
1+1+1+1+1]. Example 3:

Input: nums = [3,1,2,10,1]
Output: [3,4,6,16,17]

Constraints:

1 <= nums.length <= 1000
-10^6 <= nums[i] <= 10^6

*/

#include <stdio.h>
#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int *runningSum(int *nums, int numsSize, int *returnSize) {
  int *out = (int *)malloc(sizeof(int) * numsSize);
  int sum = 0;

  for (int i = 0; i < numsSize; i++) {
    sum += nums[i];
    out[i] = sum;
  }

  *returnSize = numsSize;
  return out;
}

static int check_array(const int *actual, int actualSize, const int *expected,
                       int expectedSize) {
  if (actualSize != expectedSize)
    return 0;
  for (int i = 0; i < actualSize; i++) {
    if (actual[i] != expected[i])
      return 0;
  }
  return 1;
}

static int run_test(const char *name, int *input, int size, const int *expected,
                    int expectedSize) {
  int returnSize = 0;
  int *actual = runningSum(input, size, &returnSize);
  int ok = check_array(actual, returnSize, expected, expectedSize);
  printf("%s: %s\n", name, ok ? "PASS" : "FAIL");
  free(actual);
  return ok;
}

int main(void) {
  int all_ok = 1;

  int a1[] = {1, 2, 3, 4};
  int e1[] = {1, 3, 6, 10};
  all_ok &= run_test("Test 1 (example 1)", a1, 4, e1, 4);

  int a2[] = {1, 1, 1, 1, 1};
  int e2[] = {1, 2, 3, 4, 5};
  all_ok &= run_test("Test 2 (example 2)", a2, 5, e2, 5);

  int a3[] = {3, 1, 2, 10, 1};
  int e3[] = {3, 4, 6, 16, 17};
  all_ok &= run_test("Test 3 (example 3)", a3, 5, e3, 5);

  int a4[] = {-1, -2, -3};
  int e4[] = {-1, -3, -6};
  all_ok &= run_test("Test 4 (negative values)", a4, 3, e4, 3);

  int n = 1000;
  int *a5 = (int *)malloc(sizeof(int) * n);
  int *e5 = (int *)malloc(sizeof(int) * n);
  int sum = 0;
  for (int i = 0; i < n; i++) {
    a5[i] = 1;
    sum += a5[i];
    e5[i] = sum;
  }
  all_ok &= run_test("Test 5 (size 1000)", a5, n, e5, n);
  free(a5);
  free(e5);

  puts(all_ok ? "ALL TESTS PASSED" : "SOME TESTS FAILED");

  return all_ok ? 0 : 1;
}