#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

int main (void)
{
    char* str = NULL;
    /* attemp to access environment variables using getenv() */
    assert ((str = getenv ("HOME")) != NULL);
    printf ("Value of \"HOME\" Environment variable is: %s\n", str);

    assert ((str = getenv ("PATH")) != NULL);
    printf ("Value of \"PATH\" Environment variable is: %s\n", str);

    assert ((str = getenv ("LOGNAME")) != NULL);
    printf ("Value of \"LOGNAME\" Environment variable is: %s\n", str);

    return 0;
}