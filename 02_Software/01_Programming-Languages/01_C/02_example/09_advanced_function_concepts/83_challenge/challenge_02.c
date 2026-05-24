/*
CHALLENGE 2:
- Write a program which will find GCD (greatest common denominator) of two numbers using recursion
*/
#include <stdio.h>

int findGCD (int num1, int num2);

int main (void)
{
    int num1 = 0, num2 = 0, gcd = 0;
    printf ("\n\n Recursion: Find GCD of two numbers :\n");
    printf ("---------------------------------------------------------\n");
    printf ("Input 1st number: ");
    scanf ("%d", &num1);
    printf ("Input 2nd number: ");
    scanf ("%d", &num2);
    gcd = findGCD (num1, num2);
    printf ("\nThe GCD of %d and %d is: %d\n\n", num1, num2, gcd);

    return 0;
}

int findGCD (int num1, int num2)
{
    while (num1 != num2)
    {
        if (num1 > num2)
            return findGCD (num1 - num2, num2);
        else
            return findGCD (num1, num2 - num1);
    }
    return num1;
}