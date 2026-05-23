/*---EXAMPLE 1---*/
// #include <stdio.h>

// int i = 5;
// char text[255][25];

// void foo (void);
// int main (void)
// {
//     printf ("%i\n", i);
//     foo ();
//     printf ("%i\n", i);
//     return 0;
// }

/*---EXAMPLE 2---*/
int count;
extern void write_extern (void);
int main (void)
{
    count = 5;
    write_extern ();
    return 0;
}

