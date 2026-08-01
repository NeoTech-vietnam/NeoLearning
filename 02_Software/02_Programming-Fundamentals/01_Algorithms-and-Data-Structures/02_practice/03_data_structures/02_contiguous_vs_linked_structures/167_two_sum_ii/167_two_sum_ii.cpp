/*
Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, 
find two numbers such that they add up to a specific target number. 
Let these two numbers be numbers[index1] and 
numbers[index2] where 1 <= index1 < index2 <= numbers.length.

Return the indices of the two numbers index1 and index2, each incremented by one, 
as an integer array [index1, index2] of length 2.

The tests are generated such that there is exactly one solution. 
You may not use the same element twice.

Your solution must use only constant extra space.

Example 1:

Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].

Example 2:

Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].

Example 3:

Input: numbers = [-1,0], target = -1
Output: [1,2]
Explanation: The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].

Constraints:
    2 <= numbers.length <= 3 * 104
    -1000 <= numbers[i] <= 1000
    numbers is sorted in non-decreasing order.
    -1000 <= target <= 1000
    The tests are generated such that there is exactly one solution.

*/
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0;
        int right = static_cast<int>(numbers.size()) - 1;
        while(left < right) {
            int sum = numbers.at(left) + numbers.at(right);
            if(sum == target){
                return {left + 1, right + 1};
            }
            if(sum < target) {
                ++left;
            } else {
                --right;
            }
        }
        return {};
    }
};

#ifdef LOCAL_TEST
#include <cassert>
#include <iostream>
#include <string>

bool validTwoSum(const vector<int>& numbers, int target, const vector<int>& result) {
    return result.size() == 2 && result[0] >= 1 && result[0] < result[1]
        && result[1] <= static_cast<int>(numbers.size())
        && numbers[result[0] - 1] + numbers[result[1] - 1] == target;
}

void printNumbers(const vector<int>& values) {
    size_t limit = values.size() > 20 ? 10 : values.size();
    cout << "[";
    for (size_t i = 0; i < limit; ++i) cout << (i ? "," : "") << values[i];
    if (values.size() > 20) {
        cout << ",... (" << values.size() - 20 << " omitted) ...";
        for (size_t i = values.size() - 10; i < values.size(); ++i) cout << "," << values[i];
    }
    cout << "]";
}

void runTest(const vector<int>& input, int target, const string& name) {
    vector<int> numbers = input;
    vector<int> result = Solution().twoSum(numbers, target);
    bool passed = numbers == input && validTwoSum(input, target, result);
    cout << name << "\nInput: numbers = ";
    printNumbers(input);
    cout << ", target = " << target << "\nOutput: [";
    for (size_t i = 0; i < result.size(); ++i) cout << (i ? "," : "") << result[i];
    cout << "]\n" << (passed ? "Passed" : "Failed") << "\n";
}

int main() {
    runTest({2,7,11,15}, 9, "Ex1");
    runTest({2,3,4}, 6, "Ex2");
    runTest({-1,0}, -1, "Ex3");
    runTest({1,2}, 3, "MinimumPositive");
    runTest({-2,-1}, -3, "MinimumNegative");
    runTest({5,5}, 10, "DuplicatePair");
    runTest({-10,-3,-1,2,7}, -11, "AllNegativePair");
    runTest({-8,-3,0,4,9}, 1, "MixedSigns");
    runTest({1,4,7,10,13}, 14, "MiddlePair");
    runTest({1,2,3,4,9,11}, 20, "LastPair");
    runTest({-1000,-500,0,500,1000}, 0, "MinMaxValues");
    runTest({-5,-5,-2,1,3,8}, -4, "DuplicateValues");
    runTest({-4,-1,0,0,0,6}, 0, "ZeroPair");
    runTest({-20,-10,-1,2,3,4,100}, 90, "OuterPair");
    runTest({-3,-2,-1,0,1,2,3}, -1, "FirstAndLastCandidates");
    runTest({-1000,-999,-998,0,1,999,1000}, 1, "BoundaryTarget");
    vector<int> stress;
    for (int value = -1000; value <= 1000; ++value) stress.insert(stress.end(), 7, value);
    stress.push_back(1000);
    runTest(stress, 1999, "Stress");
}
#endif