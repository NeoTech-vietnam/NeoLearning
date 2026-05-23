#include <stdio.h>
#include <math.h>

long long convertDecimalToBinary (int n);

int main (void)
{
    long long result = 0;
    int n = 0;
    printf ("Enter a decimal number: ");
    scanf ("%d", &n);

    result = convertDecimalToBinary (n);

    printf ("%d in decimal = %lld in binary\n", n, result);

    return 0;
}

long long convertDecimalToBinary (int n)
{
    long long binaryNumber = 0;
    int i = 1, remainder = 0;
    while (n != 0)
    {
        remainder = n % 2;
        n = n / 2;
        binaryNumber += remainder * i;
        i = i * 10;
    }
    return binaryNumber;
}

