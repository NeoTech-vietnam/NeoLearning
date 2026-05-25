/*
CHALLENGE 2:
- Write a program that defines a macro that accepts two parameters and returns
the sum of the given numbers
#define MACRO_NAME(params)MACRO_BODY
- MACRO_NAME should be SUM
- params are the parameters passed to macro
- MACRO_BODY is the code for the actual logic of the macro
- The program should have the user enter the two numbers
- Your program should then display the sum as output by invoking the above macro
*/
#include <stdio.h>

#define SUM(x,y) (x + y)

int main (void)
{
    int num1 = 0;
    int num2 = 0;
    printf ("Enter any two number: ");
    scanf ("%d%d", &num1, &num2);
    printf ("SUM(%d, %d) = %d\n", num1, num2, SUM (num1, num2));


    return 0;
}