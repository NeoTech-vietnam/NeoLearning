#include <array>
#include <cassert>
#include <cstddef>
#include <optional>

template <typename T, std::size_t Capacity>
class FixedQueue {
    static_assert(Capacity > 0);

public:
    [[nodiscard]] bool push(const T& value) {
        if (size_ == Capacity) {
            return false;
        }
        data_[(head_ + size_) % Capacity] = value;
        ++size_;
        return true;
    }

    [[nodiscard]] std::optional<T> pop() {
        if (size_ == 0) {
            return std::nullopt;
        }
        T value = data_[head_];
        head_ = (head_ + 1) % Capacity;
        --size_;
        return value;
    }

private:
    std::array<T, Capacity> data_{};
    std::size_t head_{};
    std::size_t size_{};
};

int main() {
    FixedQueue<int, 2> queue;
    assert(queue.push(10));
    assert(queue.push(20));
    assert(!queue.push(30));
    assert(queue.pop() == 10);
    assert(queue.pop() == 20);
    assert(!queue.pop());
}
