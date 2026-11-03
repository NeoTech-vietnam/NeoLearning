/* Borrowed input: pricesSize accessible values in 0..10000, size <= 100000.
 * No mutation/allocation. Null or size < 2 returns zero. */
int maxProfit(int *prices, int pricesSize)
{
    if (prices == 0 || pricesSize < 2) {
        return 0;
    }
    int minimum = prices[0];
    int best = 0;
    for (int j = 1; j < pricesSize; ++j) {
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

#ifdef LOCAL_TEST
#include <assert.h>
#include <string.h>

int main(void)
{
    int cases[][6] = {
        {7, 1, 5, 3, 6, 4}, {7, 6, 4, 3, 1}, {5},
        {2, 2, 2}, {1, 2, 3, 4}, {3, 1, 1, 5},
        {1, 8, 2}, {0, 10000}, {10000, 0}
    };
    const int sizes[] = {6, 5, 1, 3, 4, 4, 3, 2, 2};
    const int expected[] = {5, 0, 0, 0, 3, 4, 7, 10000, 0};
    for (int i = 0; i < 9; ++i) {
        int snapshot[6];
        memcpy(snapshot, cases[i], sizeof snapshot);
        assert(maxProfit(cases[i], sizes[i]) == expected[i]);
        assert(memcmp(snapshot, cases[i], sizeof snapshot) == 0);
    }
    assert(maxProfit(0, 5) == 0);
    assert(maxProfit(cases[0], 0) == 0);
    assert(maxProfit(cases[0], -1) == 0);
    return 0;
}
#endif
