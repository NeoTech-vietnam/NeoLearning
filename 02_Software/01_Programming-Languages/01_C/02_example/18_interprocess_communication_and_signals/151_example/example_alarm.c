#include <stdio.h>
#include <unistd.h>
#include <signal.h>

int main (void)
{
    alarm (5); // Set an alarm to go off in 5 seconds
    // NEED TO CATCH SIGALRM or process terminates
    // signal (SIGALRM, SIG_IGN); // Ignore the alarm signal
    for (int i = 0; i < 10; i++)
    {
        printf ("%d\n", i);
        sleep (1);
    }

    return 0;
}