#include <iostream>
#include <chrono>
#include <thread>

int main() {
    using namespace std::chrono;

    auto next = high_resolution_clock::now();

    for (int i = 0; i < 100; i++) {
        next += milliseconds(10);  // expect 10 ms interval

        std::this_thread::sleep_until(next);

        auto now = high_resolution_clock::now();
        auto diff = duration_cast<microseconds>(now - next).count();

        std::cout << "Jitter (us): " << diff << std::endl;
    }

    return 0;
}