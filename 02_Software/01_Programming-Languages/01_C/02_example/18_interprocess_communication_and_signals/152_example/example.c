#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

/* Prototype function */
void handlier_divided_by_zero (int signum);

int main (void)
{
    int result = 0;
    int v1 = 0, v2 = 0;
    v1 = 121;
    v2 = 0;
    void (*sigHandlerReturn) (int);
    sigHandlerReturn = signal (SIGFPE, handlier_divided_by_zero);
    if (sigHandlerReturn == SIG_ERR)
    {
        perror ("Signal Error: ");
        return 1;
    }
    result = v1 / v2;
    printf ("result = %d\n", result);
    return 0;
}

void handlier_divided_by_zero (int signum)
{
    if (signum == SIGFPE)
    {
        printf ("Received SIGFPE, Divide by zero exception\n");
        exit (0);
    }
    else
    {
        printf ("Received %d Signal\n", signum);
        return;
    }
}