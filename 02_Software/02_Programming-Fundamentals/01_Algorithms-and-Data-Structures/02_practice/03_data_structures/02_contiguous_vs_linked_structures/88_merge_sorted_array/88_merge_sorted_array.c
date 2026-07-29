/*
You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, 
and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, 
but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, 
where the first m elements denote the elements that should be merged, 
and the last n elements are set to 0 and should be ignored. nums2 has a length of n.

Example 1:

Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.

Example 2:

Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].

Example 3:

Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.

Constraints:

    nums1.length == m + n
    nums2.length == n
    0 <= m, n <= 200
    1 <= m + n <= 200
    -109 <= nums1[i], nums2[j] <= 109

 

Follow up: Can you come up with an algorithm that runs in O(m + n) time?

*/

void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}

#ifdef LOCAL_TEST
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

static int compare_ints(const void* a, const void* b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x > y) - (x < y);
}

static void print_array(const int* a, int size) {
    int shown = size > 12 ? 6 : size;
    printf("[");
    for (int i = 0; i < shown; ++i) printf("%s%d", i ? "," : "", a[i]);
    if (size > 12) {
        printf(",...(%d omitted)", size - 12);
        for (int i = size - 6; i < size; ++i) printf(",%d", a[i]);
    }
    printf("]");
}

static void run_case(const char* name, const int* input, int m, const int* nums2, int n) {
    int size = m + n;
    int* nums1 = malloc((size_t)size * sizeof(*nums1));
    int* expected = malloc((size_t)size * sizeof(*expected));
    assert(nums1 != NULL && expected != NULL);
    for (int i = 0; i < size; ++i) nums1[i] = input[i];
    for (int i = 0; i < m; ++i) expected[i] = input[i];
    for (int i = 0; i < n; ++i) expected[m + i] = nums2[i];
    qsort(expected, (size_t)size, sizeof(*expected), compare_ints);
    merge(nums1, size, m, (int*)nums2, n, n);
    int passed = 1;
    for (int i = 0; i < size; ++i) passed &= nums1[i] == expected[i];
    printf("%s\nInput: nums1 = ", name);
    print_array(input, size);
    printf(", m = %d, nums2 = ", m);
    print_array(nums2, n);
    printf(", n = %d\nOutput: ", n);
    print_array(nums1, size);
    printf("\n%s\n", passed ? "Passed" : "Failed");
    assert(passed);
    free(nums1);
    free(expected);
}

int main(void) {
    const int e1[] = {1, 2, 3, 0, 0, 0}, e2[] = {2, 5, 6};
    const int e3[] = {1}, one[] = {1};
    run_case("Example 1", e1, 3, e2, 3);
    run_case("Example 2", e3, 1, NULL, 0);
    run_case("Example 3", (int[]){0}, 0, one, 1);
    run_case("All duplicates and zero", (int[]){0, 0, 0, 0, 0}, 3, (int[]){0, 0}, 2);
    run_case("Already partitioned", (int[]){1, 2, 3, 4, 5, 6}, 3, (int[]){7, 8, 9}, 3);
    run_case("Reverse partitioned", (int[]){7, 8, 9, 0, 0, 0}, 3, (int[]){1, 2, 3}, 3);
    run_case("Interleaved balanced", (int[]){1, 3, 5, 0, 0, 0}, 3, (int[]){2, 4, 6}, 3);
    run_case("One from nums2", (int[]){1, 2, 3, 4, 0}, 4, (int[]){0}, 1);
    run_case("One from nums1", (int[]){0, 0, 0, 0, 5}, 1, (int[]){1, 2, 3, 4}, 4);
    run_case("Negative and boundaries", (int[]){-1000000000, -1, 0, 0, 0, 0}, 3, (int[]){0, 1, 1000000000}, 3);
    run_case("Equal boundary values", (int[]){-2, 0, 1000000000, 0, 0, 0}, 3, (int[]){-2, 0, 1000000000}, 3);
    run_case("Odd total lengths", (int[]){-5, 0, 0, 0, 0, 0, 0}, 1, (int[]){-4, -3, -2, -1, 0, 1}, 6);
    {
        int a[200], b[100];
        for (int i = 0; i < 100; ++i) { a[i] = i * 2; b[i] = i * 2 + 1; }
        for (int i = 100; i < 200; ++i) a[i] = 0;
        run_case("Maximum balanced stress", a, 100, b, 100);
    }
    return 0;
}
#endif

