#include <stdio.h>
#include <stdlib.h>

int main (void)
{
    FILE* fp;
    fp = fopen ("somefile.txt", "r");
    if (fp == NULL)
    {
        perror ("Going to abort the program\n");
        abort ();
    }
    printf ("Going to close the file\n");
    fclose (fp);
    return 0;
}