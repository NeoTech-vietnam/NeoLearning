/*

Given an integer array nums and an integer val, 
remove all occurrences of val in nums in-place. 
The order of the elements may be changed. 
Then return the number of elements in nums which are not equal to val.

Consider the number of elements in nums which are not equal to val be k, 
to get accepted, you need to do the following things:

- Change the array nums such that the first k elements of nums contain 
the elements which are not equal to val. The remaining elements 
of nums are not important as well as the size of nums.
- Return k.

Custom Judge:

The judge will test your solution with the following code:

int[] nums = [...]; // Input array
int val = ...; // Value to remove
int[] expectedNums = [...]; // The expected answer with correct length.
                            // It is sorted with no values equaling val.

int k = removeElement(nums, val); // Calls your implementation

assert k == expectedNums.length;
sort(nums, 0, k); // Sort the first k elements of nums
for (int i = 0; i < actualLength; i++) {
    assert nums[i] == expectedNums[i];
}

If all assertions pass, then your solution will be accepted.

Example 1:

Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).

Example 2:

Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).

Constraints:

0 <= nums.length <= 100
0 <= nums[i] <= 50
0 <= val <= 100

*/

#include <stdio.h>

int removeElement(int* nums, int numsSize, int val) {
    int left = 0;
    for (int right = 0; right < numsSize; right++) {
        if (nums[right] != val) {
            nums[left] = nums[right];
            left++;
        }
    }
    return left;
}

void printArray(int* nums, int k) {
    printf("[");
    for (int i = 0; i < k; i++) {
        printf("%d", nums[i]);
        if (i < k - 1) printf(", ");
    }
    printf("]");
}

void runTest(int* nums, int numsSize, int val, int expected, const char* description) {
    int k = removeElement(nums, numsSize, val);
    
    int passed = (k == expected);
    
    printf("%s | Expected: %d, Got: %d | %s\n",
           passed ? "✓ PASS" : "✗ FAIL",
           expected, k, description);
    
    if (!passed) {
        printf("  First %d elements: ", k);
        printArray(nums, k);
        printf(" (val=%d)\n", val);
    }
}

int main (void){
    printf("========== TESTING: Remove Element (LeetCode 27) ==========\n");
    printf("\n");
    
    // Basic Examples
    printf("--- BASIC EXAMPLES ---\n");
    int test1[] = {3,2,2,3};
    runTest(test1, 4, 3, 2, "Example 1: val=3, expected k=2");
    
    int test2[] = {0,1,2,2,3,0,4,2};
    runTest(test2, 8, 2, 5, "Example 2: val=2, expected k=5");
    printf("\n");
    
    // Edge Cases
    printf("--- EDGE CASES ---\n");
    int test3[] = {};
    runTest(test3, 0, 1, 0, "Empty array");
    
    int test4[] = {1};
    runTest(test4, 1, 1, 0, "Single element equals val");
    
    int test5[] = {1};
    runTest(test5, 1, 2, 1, "Single element not equals val");
    
    int test6[] = {1,1,1,1,1};
    runTest(test6, 5, 1, 0, "All elements equal val");
    
    int test7[] = {2,3,4,5,6};
    runTest(test7, 5, 1, 5, "No elements equal val");
    printf("\n");
    
    // Different positions
    printf("--- DIFFERENT POSITIONS ---\n");
    int test8[] = {3,3,3,2};
    runTest(test8, 4, 3, 1, "val at start, different at end");
    
    int test9[] = {2,3,3,3};
    runTest(test9, 4, 3, 1, "different at start, val at end");
    
    int test10[] = {3,1,3,2,3};
    runTest(test10, 5, 3, 2, "val mixed throughout");
    printf("\n");
    
    // Variations
    printf("--- VARIATIONS ---\n");
    int test11[] = {1,2,3};
    runTest(test11, 3, 2, 2, "Remove middle element");
    
    int test12[] = {1,1,2,2,3,3};
    runTest(test12, 6, 2, 4, "Pairs with one val");
    
    int test13[] = {5,4,3,2,1};
    runTest(test13, 5, 3, 4, "Descending order");
    
    int test14[] = {1,2,1,2,1,2};
    runTest(test14, 6, 1, 3, "Alternating pattern");
    printf("\n");
    
    // Boundary values
    printf("--- BOUNDARY VALUES ---\n");
    int test15[] = {0,0,0};
    runTest(test15, 3, 0, 0, "All zeros, remove 0");
    
    int test16[] = {50,50,50};
    runTest(test16, 3, 50, 0, "All max values, remove max");
    
    int test17[] = {0,1,2,3,4,5};
    runTest(test17, 6, 100, 6, "val out of range");
    printf("\n");
    
    printf("========== END OF TESTS ==========\n");
    
    return 0;
}