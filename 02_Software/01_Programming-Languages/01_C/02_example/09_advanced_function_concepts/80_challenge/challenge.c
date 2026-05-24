/*
- This challenge will test your understanding of variadic functions (functions that take a variable number of arguments)
- Write a program that creates a variadic function that will alow a programmer to add any amount of numbers (integers)
that they would like to be added together
- In order to know how many numbers are being passed to this variadic function, you can use the first argument as the number
of arguments
- Instead of using integers to add, use doubles as the data type and calculate the sum
- You can also change the function prototype to include two fixed doubles as two fixed arguments and require the user to enter 0.0
as the last argument in their variable list (to indicate the end of the list)
- You can add functions that calculate average value and sum of unknown number of numbers, max or min of a list of numbers
- Create your own function printf (takes a variable number of arguments)
- You would need a character to specify the format
- You can use `%`, as it is implemented in printf and scanf or some other character
*/
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>

int addingNumbers (int nHowMany, ...);

int main (void)
{
    printf ("\n\n Variadic functions: \n\n");
    printf ("\n 10 + 20 = %d", addingNumbers (2, 10, 20));
    printf ("\n 10 + 20 + 30 = %d", addingNumbers (3, 10, 20, 30));
    printf ("\n 10 + 20 + 30 + 40 = %d", addingNumbers (4, 10, 20, 30, 40));
    printf ("\n\n");

    return 0;
}

int addingNumbers (int nHowMany, ...)
{
    int nSum = 0;
    va_list intArgumentPointer;
    va_start (intArgumentPointer, nHowMany);

    for (int i = 0; i < nHowMany; i++)
    {
        nSum += va_arg (intArgumentPointer, int);
    }
    va_end (intArgumentPointer);
    return nSum;

}