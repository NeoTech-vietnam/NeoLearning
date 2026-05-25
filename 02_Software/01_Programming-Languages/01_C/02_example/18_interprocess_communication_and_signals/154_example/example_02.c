#include <stdio.h>
#include <unistd.h>


#define MAX_COUNT 10


/* Prototype functions */
void childProcess (void);
void parentProcess (void);

int main (void)
{
    __pid_t pid;
    pid = fork ();
    if (pid == 0)
    {
        childProcess ();
    }
    else if (pid > 0)
    {
        parentProcess ();
    }
    else
    {
        printf ("fork() failed.\n");
        return 1;
    }
    return 0;
}

void childProcess (void)
{
    for (int i = 1; i <= MAX_COUNT; i++)
    {
        printf ("This line is from the child process, value = %d\n", i);
    }
    printf ("Child process is done.\n");
}

void parentProcess (void)
{
    for (int i = 1; i <= MAX_COUNT; i++)
    {
        printf ("This line is from parent, value = %d\n", i);
    }
    printf ("Parent process is done.\n");
}