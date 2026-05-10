/*---EXAMPLE 1---*/
// extern char text[][25];
// void foo (void)
// {
//     extern int i;
//     i = 100;
// }

/*---EXAMPLE 2---*/
#include <stdio.h>
extern int count;
void write_extern (void)
{
    printf ("count is %d\n", count);
}
