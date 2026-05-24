#include <stdio.h>

struct point { int x, y; };

int main (void)
{
    // Option 1:
    // struct point p = { .x = 2, .y = 3 };
    // Option 2:
    struct point p = { x: 2, y : 3 };
    // Option 3:
    // struct point p = { 2, 3 };
    struct point pts[5] = { [2] .y = 5,[2].x = 6,[0].x = 2 };
    int i;
    for (i = 0; i < 5; i++)
        printf ("%d %d\n", pts[i].x, pts[i].y);


    return 0;
}