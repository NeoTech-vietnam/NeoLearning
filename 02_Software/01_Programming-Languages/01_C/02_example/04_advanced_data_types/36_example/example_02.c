#include <stdio.h>

void array (int size)
{
    char alpha[size];
    int x = 0;

    while (x < size)
    {
        alpha[x] = 'A' + x;
        printf ("alpha is: %c: \n", alpha[x]);
        x++;
    }
}

int main (void)
{
    array (5);
    array (20);
    array (9);
    return 0;
}