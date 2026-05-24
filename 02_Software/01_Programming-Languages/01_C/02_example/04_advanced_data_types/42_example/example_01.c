#include <stdio.h>

int main (void)
{
    int numbers[] = { 1,2,3,[3 ... 9] = 10,[10] = 80, 15,[70] = 50,[42] = 400 };

    int n = sizeof (numbers) / sizeof (numbers[0]);
    printf ("%d\n", n);



    return 0;
}