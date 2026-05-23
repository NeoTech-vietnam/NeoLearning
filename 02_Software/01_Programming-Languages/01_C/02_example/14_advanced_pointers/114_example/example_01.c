#include <stdio.h>
#include <malloc.h>
#include <string.h>

void foo (char** ptr)
{
    *ptr = malloc (255);
    strcpy (*ptr, "Hello World!"); // 
}

int main (void)
{
    char* ptr = NULL;

    foo (&ptr);
    printf ("%s\n", ptr);

    free (ptr);

    return 0;
}