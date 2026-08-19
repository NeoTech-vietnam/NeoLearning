#include <algorithm>
#include <cassert>
#include <vector>

int main() {
    std::vector<int> values{4, 1, 7, 2, 9};
    const int minimum{4};

    std::erase_if(values, [minimum](int value) { return value < minimum; });
    std::ranges::sort(values, std::greater{});

    assert((values == std::vector<int>{9, 7, 4}));
}
