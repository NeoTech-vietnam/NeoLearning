#include <stdio.h>
#include <signal.h>

int main (void)
{
    printf ("Test signal SIGSTOP\n");
    raise (SIGSTOP);
    printf ("I am back\n");
    return 0;
}