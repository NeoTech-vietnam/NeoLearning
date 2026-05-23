#include <stdio.h>
#include <malloc.h>

// Double pointer
void foo (int** ptr)
{
    int a = 5;
    *ptr = &a;
}

// Single pointer
void foo (int* ptr)
{
    int a = 5;
    ptr = &a;
}

int main (void)
{
    int* ptr2 = NULL;
    ptr2 = (int*)malloc (sizeof (int));
    *ptr2 = 15;
    foo (&ptr2);
    printf ("%d\n", *ptr2);

    return 0;
}