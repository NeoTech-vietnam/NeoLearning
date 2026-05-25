/* CHALLENGE #1
- This challenge will test your understanding of random numbers
- Write a C program that generates 50 random numbers between -0.5 and 0.5
- You should ouput the random numbers
    - The first line of ouput should be the number of data
    - The next 50 lines should be the 50 random numbers
- You are required to use the srand function, passing in the time function
    - As a seed to using the rand() function

*/

#include <stdio.h> 
#include <stdlib.h> 
#include <time.h> 

#define N 50

int main ()
{
    int i = 0;
    char str = '\0';

    srand (time (NULL));

    printf ("%d\n", N);

    for (i = 1; i <= N; i++)
    {
        printf ("%0.4lf\n", (rand () % 2001 - 1000) / 2.e3);
    }

    return 0;
}