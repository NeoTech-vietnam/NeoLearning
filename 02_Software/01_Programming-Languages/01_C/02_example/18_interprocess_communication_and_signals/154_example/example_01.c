#include <unistd.h>
#include <string.h>
#include <stdio.h>

#define MAX_COUNT 10
#define BUFFER_SIZE 100

int main (void)
{
    __pid_t pid;
    char buf[BUFFER_SIZE];
    fork ();
    pid = getpid ();
    for (int i = 0; i < MAX_COUNT; i++)
    {
        sprintf (buf, "This line is from pid %d, value = %d\n", pid, i);
        write (STDOUT_FILENO, buf, strlen (buf));
    }
    return 0;
}