#include <cassert>
#include <iomanip>
#include <sstream>
#include <string>

std::string format_reading(double value) {
    std::ostringstream output;
    output << std::fixed << std::setprecision(2) << value;
    return output.str();
}

int main() {
    assert(format_reading(4.0) == "4.00");
    assert(format_reading(3.14159) == "3.14");
}
