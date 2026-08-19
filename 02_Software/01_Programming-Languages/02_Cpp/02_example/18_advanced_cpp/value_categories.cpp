#include <cassert>
#include <string>
#include <utility>

template <typename T>
decltype(auto) forward_value(T&& value) {
    return std::forward<T>(value);
}

int main() {
    std::string text{"owned"};
    auto&& reference = forward_value(text);
    reference += " value";
    assert(text == "owned value");

    std::string moved = forward_value(std::move(text));
    assert(moved == "owned value");
}
