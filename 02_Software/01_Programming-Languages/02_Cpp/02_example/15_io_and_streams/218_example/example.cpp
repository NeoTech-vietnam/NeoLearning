#include <cassert>
#include <optional>
#include <sstream>
#include <string>
#include <string_view>

std::optional<int> parse_int(std::string_view text) {
    std::istringstream input{std::string{text}};
    int value{};
    input >> value;
    input >> std::ws;
    return input && input.eof() ? std::optional{value} : std::nullopt;
}

int main() {
    assert(parse_int("42") == 42);
    assert(parse_int("  -7  ") == -7);
    assert(!parse_int("42x"));
    assert(!parse_int(""));
}
