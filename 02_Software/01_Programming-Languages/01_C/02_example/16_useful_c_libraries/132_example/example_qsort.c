#include <stdio.h>
#include <stdlib.h>

int comp_ints (const void*, const void*);

int main (void)
{
    int data[5] = { 54, 3, 12, 9, 24 };
    qsort (data, 5, sizeof (int), comp_ints);
    for (int i = 0; i < 5; i++)
        printf ("%d\n", data[i]);


    return 0;
}

int comp_ints (const void* p1, const void* p2)
{
    const int i1 = *(const int*)p1;
    const int i2 = *(const int*)p2;
    return(i1 - i2);
}