#include <cstddef>
#include <vector>

class Solution {
public:
    // Borrowed values in 0..10000, size <= 100000; no mutation/allocation.
    int maxProfit(std::vector<int>& prices)
    {
        if (prices.size() < 2) {
            return 0;
        }
        int minimum = prices[0];
        int best = 0;
        for (std::size_t j = 1; j < prices.size(); ++j) {
            const int profit = prices[j] - minimum;
            if (profit > best) {
                best = profit;
            }
            if (prices[j] < minimum) {
                minimum = prices[j];
            }
        }
        return best;
    }
};

#ifdef LOCAL_TEST
#include <cassert>

int main()
{
    std::vector<std::vector<int>> cases = {
        {7, 1, 5, 3, 6, 4}, {7, 6, 4, 3, 1}, {5},
        {2, 2, 2}, {1, 2, 3, 4}, {3, 1, 1, 5},
        {1, 8, 2}, {0, 10000}, {10000, 0}, {}
    };
    const int expected[] = {5, 0, 0, 0, 3, 4, 7, 10000, 0, 0};
    Solution solution;
    for (std::size_t i = 0; i < cases.size(); ++i) {
        const auto snapshot = cases[i];
        assert(solution.maxProfit(cases[i]) == expected[i]);
        assert(cases[i] == snapshot);
    }
    return 0;
}
#endif
