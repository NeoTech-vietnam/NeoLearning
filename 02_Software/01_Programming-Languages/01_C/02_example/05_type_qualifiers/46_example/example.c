#include <stdio.h>

void f1 (int n, float* restrict a1, const float* restrict a2)
{
    int i;
    for (i = 0; i < n; i++)
        a1[i] += a2[i];
}

int main (void)
{

    return 0;
}