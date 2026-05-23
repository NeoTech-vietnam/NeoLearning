#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main (void)
{
    char source[] = "THACH";

    char* target = strndup (source, 5);
    printf ("%s\n", target);
    free (target);
    return 0;
}