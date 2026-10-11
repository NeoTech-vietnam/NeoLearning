/*
Given a character array s, reverse its elements in place.

Constraints: 1 <= sSize <= 100000; every element is a printable ASCII
character. The caller owns the writable array and supplies its length.
*/

void reverseString(char *s, int sSize)
{
    int left = 0;
    int right = sSize - 1;

    while (left < right) {
        const char saved = s[left];
        s[left] = s[right];
        s[right] = saved;
        ++left;
        --right;
    }
}

#ifdef LOCAL_TEST
#include <stdio.h>
#include <stdlib.h>

static int total_cases;
static int failed_cases;

static void run_case(const char *name, const char *input, int length)
{
    const unsigned char left_guard = 0xA5U;
    const unsigned char right_guard = 0x5AU;
    unsigned char *storage = malloc((size_t)length + 2U);
    char *snapshot = malloc((size_t)length);

    ++total_cases;
    if (storage == NULL || snapshot == NULL) {
        fprintf(stderr, "FAIL %s: test allocation failed\n", name);
        ++failed_cases;
        free(storage);
        free(snapshot);
        return;
    }

    storage[0] = left_guard;
    for (int i = 0; i < length; ++i) {
        storage[(size_t)i + 1U] = (unsigned char)input[i];
        snapshot[i] = input[i];
    }
    storage[(size_t)length + 1U] = right_guard;

    reverseString((char *)(storage + 1U), length);

    int passed = storage[0] == left_guard
        && storage[(size_t)length + 1U] == right_guard;
    for (int i = 0; i < length; ++i) {
        if ((unsigned char)storage[(size_t)i + 1U]
            != (unsigned char)snapshot[length - 1 - i]) {
            passed = 0;
            break;
        }
    }

    if (!passed) {
        fprintf(stderr, "FAIL %s\n", name);
        ++failed_cases;
    }

    free(snapshot);
    free(storage);
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
            (void)snprintf(name, sizeof(name), "ternary length %d case %d",
                length, value);
            run_case(name, input, length);
        }
    }
}

int main(void)
{
    static const char all_printable_ascii[] =
        " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    static char maximum_input[100000];

    run_case("official example: hello", "hello", 5);
    run_case("official example: Hannah", "Hannah", 6);
    run_case("singleton", "x", 1);
    run_case("unequal pair", "aZ", 2);
    run_case("distinct odd length", "abcde", 5);
    run_case("distinct even length", "abcd", 4);
    run_case("repeated characters", "xxxxx", 5);
    run_case("palindrome", "level", 5);
    run_case("space boundary", " !", 2);
    run_case("tilde boundary", "~!", 2);
    run_case("punctuation and spaces", "A, b!", 5);
    run_case("all 95 printable ASCII characters", all_printable_ascii, 95);

    for (int i = 0; i < 100000; ++i) {
        maximum_input[i] = (char)('!' + (i % 90));
    }
    run_case("maximum non-palindrome length 100000", maximum_input, 100000);
    run_exhaustive_cases();

    printf("C LOCAL_TEST: %d cases, %d failures\n", total_cases, failed_cases);
    return failed_cases == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
#endif
