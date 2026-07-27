/*
Given an integer array nums sorted in non-decreasing order, 
remove the duplicates in-place such that each unique element appears only once. 

The relative order of the elements should be kept the same.
Consider the number of unique elements in nums to be k​​​​​​​​​​​​​​. After removing duplicates, 
return the number of unique elements k.

The first k elements of nums should contain the unique numbers in sorted order. 
The remaining elements beyond index k - 1 can be ignored.

Custom Judge:

The judge will test your solution with the following code:

int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}

If all assertions pass, then your solution will be accepted.

Example 1:

Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 
and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

Example 2:

Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums 
being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

Constraints:

    1 <= nums.length <= 3 * 104
    -100 <= nums[i] <= 100
    nums is sorted in non-decreasing order.
*/

/*
Strategy: Two-pointer approach

1. Keep track of position k for next unique element
2. Iterate from index 1 onwards
3. When nums[i] != nums[i-1], write nums[i] to nums[k] and increment k
4. Return k (count of unique elements)

Time: O(n), Space: O(1)
*/

int removeDuplicates(int* nums, int numsSize) {
    if (numsSize == 0) return 0;
    
    int k = 1;  // First element always unique
    for (int i = 1; i < numsSize; i++) {
        if (nums[i] != nums[i - 1]) {
            nums[k++] = nums[i];
        }
    }
    return k;
}

#ifdef LOCAL_TEST
#include <stdio.h>
#include <string.h>

static int verify_result(int* nums, int k, 
                         const int* expected, int expectedSize) {
    if (k != expectedSize) {
        printf("  FAIL: returned k=%d, expected k=%d\n", k, expectedSize);
        return 0;
    }
    for (int i = 0; i < k; i++) {
        if (nums[i] != expected[i]) {
            printf("  FAIL: nums[%d]=%d, expected %d\n", i, nums[i], expected[i]);
            return 0;
        }
    }
    return 1;
}

int main() {
    printf("=== Remove Duplicates from Sorted Array Tests ===\n\n");
    
    int passed = 0, total = 0;
    
    // Test 1: Example 1 - [1,1,2]
    {
        total++;
        int nums[] = {1, 1, 2};
        int expected[] = {1, 2};
        int k = removeDuplicates(nums, 3);
        printf("Test 1 (Example 1): [1,1,2]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 2)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 2: Example 2 - [0,0,1,1,1,2,2,3,3,4]
    {
        total++;
        int nums[] = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        int expected[] = {0, 1, 2, 3, 4};
        int k = removeDuplicates(nums, 10);
        printf("Test 2 (Example 2): [0,0,1,1,1,2,2,3,3,4]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 5)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 3: Single element
    {
        total++;
        int nums[] = {1};
        int expected[] = {1};
        int k = removeDuplicates(nums, 1);
        printf("Test 3 (Single element): [1]\n");
        printf("  Output: k=%d, nums=[%d]\n", k, nums[0]);
        if (verify_result(nums, k, expected, 1)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 4: All same elements
    {
        total++;
        int nums[] = {5, 5, 5, 5};
        int expected[] = {5};
        int k = removeDuplicates(nums, 4);
        printf("Test 4 (All duplicates): [5,5,5,5]\n");
        printf("  Output: k=%d, nums=[%d]\n", k, nums[0]);
        if (verify_result(nums, k, expected, 1)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 5: No duplicates
    {
        total++;
        int nums[] = {1, 2, 3, 4, 5};
        int expected[] = {1, 2, 3, 4, 5};
        int k = removeDuplicates(nums, 5);
        printf("Test 5 (No duplicates): [1,2,3,4,5]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 5)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 6: Negative numbers
    {
        total++;
        int nums[] = {-3, -3, -1, 0, 0, 2, 2};
        int expected[] = {-3, -1, 0, 2};
        int k = removeDuplicates(nums, 7);
        printf("Test 6 (Negative numbers): [-3,-3,-1,0,0,2,2]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 4)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 7: Duplicates at start and end
    {
        total++;
        int nums[] = {1, 1, 2, 3, 3};
        int expected[] = {1, 2, 3};
        int k = removeDuplicates(nums, 5);
        printf("Test 7 (Duplicates at boundaries): [1,1,2,3,3]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 3)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 8: Boundary values
    {
        total++;
        int nums[] = {-100, -100, 0, 100, 100};
        int expected[] = {-100, 0, 100};
        int k = removeDuplicates(nums, 5);
        printf("Test 8 (Boundary values -100 to 100): [-100,-100,0,100,100]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 3)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 9: Two elements same
    {
        total++;
        int nums[] = {1, 1};
        int expected[] = {1};
        int k = removeDuplicates(nums, 2);
        printf("Test 9 (Two identical elements): [1,1]\n");
        printf("  Output: k=%d, nums=[%d]\n", k, nums[0]);
        if (verify_result(nums, k, expected, 1)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    // Test 10: Two elements different
    {
        total++;
        int nums[] = {1, 2};
        int expected[] = {1, 2};
        int k = removeDuplicates(nums, 2);
        printf("Test 10 (Two different elements): [1,2]\n");
        printf("  Output: k=%d, nums=[", k);
        for (int i = 0; i < k; i++) printf("%d%s", nums[i], i < k-1 ? "," : "");
        printf("]\n");
        if (verify_result(nums, k, expected, 2)) {
            printf("  PASS\n");
            passed++;
        }
        printf("\n");
    }
    
    printf("=== Summary ===\n");
    printf("Passed: %d/%d\n", passed, total);
    
    return passed == total ? 0 : 1;
}
#endif
