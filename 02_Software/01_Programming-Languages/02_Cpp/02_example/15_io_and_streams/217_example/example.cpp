#include <cassert>
#include <fstream>
#include <numeric>
#include <vector>

int main() {
    const char *path{"numbers.txt"};
    {
        std::ofstream output{path};
        assert(output);
        output << "10 20 30\n";
        assert(output);
    }

    std::ifstream input{path};
    assert(input);
    std::vector<int> values;
    for (int value{}; input >> value;) {
        values.push_back(value);
    }
    assert(input.eof());
    assert(std::accumulate(values.begin(), values.end(), 0) == 60);
}
