#include <stdio.h>

union mixed
{
    char c;
    float f;
    int i;
};

union number
{
    int x;
    double y;
};

void foo (union number n)
{
    union number x = n;
}


int main (void)
{

    union number x;
    union number* y = &x;

    y->y = 100.0;
    printf ("value of integer x: %d\n", y->x);
    printf ("value of double y: %f\n", y->y);

    // union number value;
    // value.x = 100; /* Put an integer into the union */
    // printf ("Value of integer x: %d\n", value.x);
    // printf ("Value of double y: %f\n", value.y);

    // value.y = 100.0; /* Put a double into the same union */
    // printf ("Value of integer x: %d\n", value.x);
    // printf ("Value of double y: %f\n", value.y);


    return 0;
}