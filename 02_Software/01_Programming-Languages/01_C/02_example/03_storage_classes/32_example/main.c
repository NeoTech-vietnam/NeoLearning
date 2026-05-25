#include <stdio.h>

register int x = 10; // error: register can only be used within a local block

int main (void)
{
    // register int x = 15; //register variable (counter)

    // int* a = &x; // error: address of register variable 'x' requested
    /* --- */
    int x = 15; //register variable (counter)
    register int* a = &x; // ok: telling that the pointer is actually going to store in a register and point to store an actual address

    register static int* a = &x; // error: multiple storage classes in declaration specifiers

    printf ("\n%d", *a);
    return 0;
}