#include <stdio.h>
#include <assert.h>

int main (void)
{
    int y = 5;
    for (int x = 0; x < 20; ++x)
    {
        printf ("x = %d y = %d\n", x, y);
        assert (x < y);
    }

    return 0;
}