#include <stdio.h>

int main (void)
{
    short int w1 = 147;
    short int w2 = 61;
    short int wAND = 0;
    short int wOR = 0;
    short int wXOR = 0;

    // AND operator
    wAND = w1 & w2;

    // OR operator
    wOR = w1 | w2;

    // XOR operator
    wXOR = w1 ^ w2;

    // Exclusive Or operator (XOR), you can exchange the values without the need of temp variable
    w1 ^= w2;
    w2 ^= w1;
    w1 ^= w2;

    // Convert to signed number

    signed int wCompliment = 154;
    signed int result = 0;

    result = ~(wCompliment);
    printf ("%d\n", result);

    // printf ("%d\n", wXOR);

    return 0;
}