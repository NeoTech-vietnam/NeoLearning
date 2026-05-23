#include <stdio.h>

#define PI 3.14

#define PRNT(a,b)\
    printf("value 1 = %d\n", a);\
    printf("value 2 = %d\n", b);

int main (void)
{
    int x = 2;
    int y = 3;
    PRNT (x, y);
    return 0;
}