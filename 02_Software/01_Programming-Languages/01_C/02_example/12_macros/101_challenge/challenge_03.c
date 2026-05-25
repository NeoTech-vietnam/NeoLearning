/*
CHALLENGE 3:
- Write a program to fine the square and cube of a number using macros
- You should create two macros
    - A SQUARE macro
    - a CUBE macro
- You need to figure out how many parameters there should be
- Your program should have the user enter any number
- Your program should then display the square and cube of the number
as output by invoking the above macros
*/
#include <stdio.h>

// Define macro to find square and cube
#define SQUARE(x) (x * x)
#define CUBE(x) (x * x * x)

int main ()
{
    int num;

    // Input a number from user
    printf ("Enter any number to find square and cube: ");
    scanf ("%d", &num);

    // Calculate and print square
    printf ("SQUARE(%d) = %d\n", num, SQUARE (num));

    // Calculate and print cube
    printf ("CUBE(%d) = %d\n", num, CUBE (num));

    return 0;
}
