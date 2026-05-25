#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main (void)
{
    /* Generate and print 5 random numbers with rand() */
    // for (int i = 0; i < 5; i++)
    // {
    //     printf ("%d\n", rand ());
    // }

    /*srand(time(NULL))*/
    /* Seed the random number generator with the current time */
    srand (time (NULL));
    for (int i = 0; i < 10; i++)
    {
        printf ("%d\n", rand () % 5 + 1);
    }

    return 0;
}