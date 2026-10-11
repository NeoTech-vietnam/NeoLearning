#include <cstddef>
#include <vector>

class Solution {
public:
    void reverseString(std::vector<char>& s)
    {
        std::size_t left = 0;
        std::size_t right = s.size() - 1;

        while (left < right) {
            const char saved = s[left];
            s[left] = s[right];
            s[right] = saved;
            ++left;
            --right;
        }
    }
};

#ifdef LOCAL_TEST
#include <cstdio>
#include <cstdlib>
#include <string>
#include <utility>

static int total_cases;
static int failed_cases;

static void run_case(const std::string& name, const std::vector<char>& input)
{
    ++total_cases;
    std::vector<char> actual = input;
    const std::vector<char> snapshot = input;
    const std::size_t original_size = actual.size();
    const std::size_t original_capacity = actual.capacity();
    const char *const original_data = actual.data();

    Solution solution;
    solution.reverseString(actual);

    bool passed = actual.size() == original_size
        && actual.capacity() == original_capacity
        && actual.data() == original_data;
    for (std::size_t i = 0; i < original_size; ++i) {
        if (actual[i] != snapshot[original_size - 1U - i]) {
            passed = false;
            break;
        }
    }

    if (!passed) {
        std::fprintf(stderr, "FAIL %s\n", name.c_str());
        ++failed_cases;
    }
}

static std::vector<char> from_ascii(const char *characters, std::size_t length)
{
    return std::vector<char>(characters, characters + length);
}

static void run_exhaustive_cases(void)
{
    static const char alphabet[] = {'a', 'M', '~'};
    char input[8];
    char name[64];

    for (int length = 1; length <= 8; ++length) {
        int combinations = 1;
        for (int i = 0; i < length; ++i) {
            combinations *= 3;
        }

        for (int value = 0; value < combinations; ++value) {
            int digits = value;
            for (int i = 0; i < length; ++i) {
                input[i] = alphabet[digits % 3];
                digits /= 3;
            }
            (void)std::snprintf(name, sizeof(name), "ternary length %d case %d",
                length, value);
            run_case(name, from_ascii(input, static_cast<std::size_t>(length)));
        }
    }
}

int main()
{
    const std::string all_printable_ascii =
        " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    run_case("official example: hello", from_ascii("hello", 5));
    run_case("official example: Hannah", from_ascii("Hannah", 6));
    run_case("singleton", from_ascii("x", 1));
    run_case("unequal pair", from_ascii("aZ", 2));
    run_case("distinct odd length", from_ascii("abcde", 5));
    run_case("distinct even length", from_ascii("abcd", 4));
    run_case("repeated characters", from_ascii("xxxxx", 5));
    run_case("palindrome", from_ascii("level", 5));
    run_case("space boundary", from_ascii(" !", 2));
    run_case("tilde boundary", from_ascii("~!", 2));
    run_case("punctuation and spaces", from_ascii("A, b!", 5));
    run_case("all 95 printable ASCII characters",
        std::vector<char>(all_printable_ascii.begin(), all_printable_ascii.end()));

    std::vector<char> maximum_input(100000);
    for (std::size_t i = 0; i < maximum_input.size(); ++i) {
        maximum_input[i] = static_cast<char>('!' + (i % 90U));
    }
    run_case("maximum non-palindrome length 100000", maximum_input);
    run_exhaustive_cases();

    std::printf("C++ LOCAL_TEST: %d cases, %d failures\n", total_cases, failed_cases);
    return failed_cases == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
#endif
