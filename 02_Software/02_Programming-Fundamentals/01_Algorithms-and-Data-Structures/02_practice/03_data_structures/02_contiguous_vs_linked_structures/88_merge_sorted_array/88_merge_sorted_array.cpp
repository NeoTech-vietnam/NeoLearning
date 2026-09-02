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

#include <vector>
using namespace std;

class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
};

#ifdef LOCAL_TEST
#include <algorithm>
#include <cassert>
#include <iostream>

static void print_array(const vector<int>& values) {
    size_t shown = values.size() > 12 ? 6 : values.size();
    cout << "[";
    for (size_t i = 0; i < shown; ++i) cout << (i ? "," : "") << values[i];
    if (values.size() > 12) {
        cout << ",...(" << values.size() - 12 << " omitted)";
        for (size_t i = values.size() - 6; i < values.size(); ++i) cout << ',' << values[i];
    }
    cout << "]";
}

static void run_case(const char* name, vector<int> nums1, int m, vector<int> nums2) {
    vector<int> input = nums1, expected(nums1.begin(), nums1.begin() + m);
    expected.insert(expected.end(), nums2.begin(), nums2.end());
    sort(expected.begin(), expected.end());
    Solution().merge(nums1, m, nums2, static_cast<int>(nums2.size()));
    bool passed = nums1 == expected && nums1.size() == input.size();
    cout << name << "\nInput: nums1 = ";
    print_array(input);
    cout << ", m = " << m << ", nums2 = ";
    print_array(nums2);
    cout << ", n = " << nums2.size() << "\nOutput: ";
    print_array(nums1);
    cout << "\n" << (passed ? "Passed" : "Failed") << '\n';
}

int main() {
    run_case("Example 1", {1, 2, 3, 0, 0, 0}, 3, {2, 5, 6});
    run_case("Example 2", {1}, 1, {});
    run_case("Example 3", {0}, 0, {1});
    run_case("All duplicates and zero", {0, 0, 0, 0, 0}, 3, {0, 0});
    run_case("Already partitioned", {1, 2, 3, 4, 5, 6}, 3, {7, 8, 9});
    run_case("Reverse partitioned", {7, 8, 9, 0, 0, 0}, 3, {1, 2, 3});
    run_case("Interleaved balanced", {1, 3, 5, 0, 0, 0}, 3, {2, 4, 6});
    run_case("One from nums2", {1, 2, 3, 4, 0}, 4, {0});
    run_case("One from nums1", {0, 0, 0, 0, 5}, 1, {1, 2, 3, 4});
    run_case("Negative and boundaries", {-1000000000, -1, 0, 0, 0, 0}, 3, {0, 1, 1000000000});
    run_case("Equal boundary values", {-2, 0, 1000000000, 0, 0, 0}, 3, {-2, 0, 1000000000});
    run_case("Odd total lengths", {-5, 0, 0, 0, 0, 0, 0}, 1, {-4, -3, -2, -1, 0, 1});
    vector<int> a(200), b(100);
    for (int i = 0; i < 100; ++i) { a[i] = i * 2; b[i] = i * 2 + 1; }
    run_case("Maximum balanced stress", a, 100, b);
    return 0;
}
#endif

