#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <time.h>

/* Prototype function */
void signalHandler (int signalValue);

int main (void)
{
    int i; /* Counter used to loop 100 times */
    int x; /* Variable to hold random values between 1-50 */
    signal (SIGINT, signalHandler); /* Register signal handler */
    srand (clock ()); /* Seed the random number generator */
    /* Output numbers 1 to 100 */
    for (i = 1; i <= 100; i++)
    {
        x = rand () % 50 + 1; /* Generate random number between 1 and 50 */
        /* Raise SIGINT when x is 25 */
        if (x == 25)
        {
            raise (SIGINT);
        }
        printf ("%4d ", i);
        if (i % 10 == 0)
        {
            printf ("\n");
        }
    }
    return 0;
}

void signalHandler (int signalValue)
{
    int response;
    printf ("%s%d%s\n%s", "\nInterrupt signal ( ", signalValue, " ) received.", "Do you want to continue? (1 = Yes, 2 = No): ");
    scanf ("%d", &response);
    /* Check for invalid responses */
    while (response != 1 && response != 2)
    {
        printf ("( 1 = yes or 2 = no )? ");
        scanf ("%d", &response);
    } /* End while */
    /* Determine if it is time to exit */
    if (response == 1)
    {
        /* Register signal handler for next SIGINT */
        signal (SIGINT, signalHandler);
    } /* End if */
    else /* Exit for the successful completion */
    {
        exit (EXIT_SUCCESS);
    } /* End else */
} /* End function signalHandler */