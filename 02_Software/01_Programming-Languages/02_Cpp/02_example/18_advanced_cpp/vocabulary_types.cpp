#include <cassert>
#include <charconv>
#include <optional>
#include <string_view>
#include <variant>

std::optional<int> parse_int(std::string_view text) {
    int value{};
    const auto [end, error] = std::from_chars(text.data(), text.data() + text.size(), value);
    if (error != std::errc{} || end != text.data() + text.size()) {
        return std::nullopt;
    }
    return value;
}

int main() {
    assert(parse_int("42") == 42);
    assert(!parse_int("42x"));

    std::variant<int, std::string_view> message{"ready"};
    assert(std::get<std::string_view>(message) == "ready");
}
