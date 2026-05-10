#include <stdio.h>

int main (void)
{
    const int maxInput = 5;
    int i = 0;
    double number, average, sum = 0.0;

    for (i = 1; i <= maxInput; ++i)
    {
        printf ("%d. Enter a number: ", i);
        scanf ("%lf", &number);

        if (number < 0.0)
            goto jump;
    }

jump:
    average = sum / (i - 1);
    printf ("Sum = %.2f\n", sum);
    printf ("Average = %.2f\n", average);
    return 0;
}