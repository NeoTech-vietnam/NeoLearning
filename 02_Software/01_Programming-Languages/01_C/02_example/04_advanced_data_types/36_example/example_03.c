#include <stdio.h>

int sum2d (int rows, int cols, int array[rows][cols])
{
    int r;
    int c;
    int tot = 0;
    for (r = 0; r < rows; r++)
        for (c = 0; c < cols; c++)
            tot += ar[r][c];
    return tot;
}

int main (void)
{
    array (5);
    array (20);
    array (9);
    return 0;
}