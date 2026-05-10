#define _GNU_SOURCE
#include <stdio.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>

/* Prototype Function */
// Handler takes three parameters, because we are using sa_sigaction
static void hdl (int sig, siginfo_t* siginfo, void* context)
{
    printf ("Seding PID: %ld, UID: %ld\n", (long)siginfo->si_pid, (long)siginfo->si_uid);
}

int main (int argc, char* argv[])
{
    struct sigaction act;
    memset (&act, '\0', sizeof (act));
    /* Use the sa_sigaction field because the handler has two additional parameters
        hdl contains a siginfo_t and a void pointer, see the function
    */
    act.sa_sigaction = &hdl;
    /* The SA_SIGINFO flag tells sigaction() to use the sa_sigaction field, not sa_handler */
    act.sa_flags = SA_SIGINFO;
    if (sigaction (SIGINT, &act, NULL) < 0)
    {
        perror ("sigaction");
        return 1;
    }

    while (1)
        sleep (3);

    return 0;
}