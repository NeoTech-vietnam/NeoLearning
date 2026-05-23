#include <stdio.h>


send (void* pData, int nLength);

int main (void)
{
    int i = 10;
    float f = 2.34;
    char ch = 'k';

    void* vptr = NULL;
    vptr = &i;
    printf ("Value of i = %d\n", *(int*)vptr);

    vptr = &f;
    printf ("Value of i = %.2f\n", *(float*)vptr);

    vptr = &ch;
    printf ("Value of i = %c\n", *(char*)vptr);

    return 0;
}