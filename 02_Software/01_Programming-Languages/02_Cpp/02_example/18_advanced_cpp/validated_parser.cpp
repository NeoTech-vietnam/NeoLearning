#include <cassert>
#include <charconv>
#include <optional>
#include <string_view>

struct Reading {
    int sensor_id;
    int value;
};

std::optional<Reading> parse_reading(std::string_view input) {
    const auto separator = input.find(':');
    if (separator == std::string_view::npos) {
        return std::nullopt;
    }

    Reading reading{};
    const auto parse = [](std::string_view text, int& output) {
        const auto [end, error] = std::from_chars(text.data(), text.data() + text.size(), output);
        return error == std::errc{} && end == text.data() + text.size();
    };

    if (!parse(input.substr(0, separator), reading.sensor_id) ||
        !parse(input.substr(separator + 1), reading.value)) {
        return std::nullopt;
    }
    return reading;
}

int main() {
    const auto reading = parse_reading("7:-12");
    assert(reading && reading->sensor_id == 7 && reading->value == -12);
    assert(!parse_reading("7"));
    assert(!parse_reading("7:12x"));
    assert(!parse_reading(":12"));
}
