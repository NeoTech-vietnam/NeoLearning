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

#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
  vector<int> runningSum(vector<int> &nums) {
    vector<int> out(nums.size());
    int sum = 0;

    for (size_t i = 0; i < nums.size(); i++) {
      sum += nums[i];
      out[i] = sum;
    }

    return out;
  }
};

static bool areEqual(const vector<int> &a, const vector<int> &b) {
  if (a.size() != b.size())
    return false;
  for (size_t i = 0; i < a.size(); i++) {
    if (a[i] != b[i])
      return false;
  }
  return true;
}

static bool runTest(const char *name, vector<int> input,
                    const vector<int> &expected) {
  Solution sol;
  vector<int> actual = sol.runningSum(input);
  bool ok = areEqual(actual, expected);
  cout << name << ": " << (ok ? "PASS" : "FAIL") << endl;
  return ok;
}

int main(void) {
  bool allOk = true;

  allOk &= runTest("Test 1 (example 1)", {1, 2, 3, 4}, {1, 3, 6, 10});
  allOk &= runTest("Test 2 (example 2)", {1, 1, 1, 1, 1}, {1, 2, 3, 4, 5});
  allOk &= runTest("Test 3 (example 3)", {3, 1, 2, 10, 1}, {3, 4, 6, 16, 17});
  allOk &= runTest("Test 4 (negative values)", {-1, -2, -3}, {-1, -3, -6});

  vector<int> big(1000, 1);
  vector<int> bigExpected(1000);
  int sum = 0;
  for (int i = 0; i < 1000; i++) {
    sum += big[i];
    bigExpected[i] = sum;
  }
  allOk &= runTest("Test 5 (size 1000)", big, bigExpected);

  cout << (allOk ? "ALL TESTS PASSED" : "SOME TESTS FAILED") << endl;
  return allOk ? 0 : 1;
}