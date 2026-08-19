#include <cassert>

int main() {
    auto counter = [value = 0]() mutable { return ++value; };
    assert(counter() == 1);
    assert(counter() == 2);
}
