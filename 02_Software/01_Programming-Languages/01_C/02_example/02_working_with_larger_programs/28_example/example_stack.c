#include <stdio.h>

double multiplybyTwo (double input)
{
    double twice = input * 2.0;
    return twice;
}

int main (void)
{
    int age = 30;
    double salary = 12345.67;
    double myList[3] = { 1.2, 2.3, 3.4 };
    printf ("double your salary is %.3f\n", multiplybyTwo (salary));
    return 0;
}