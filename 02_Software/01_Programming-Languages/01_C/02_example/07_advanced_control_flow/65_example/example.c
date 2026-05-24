#include <stdio.h>
#include <setjmp.h>
#include <stdlib.h>

jmp_buf buf;

void myFunction ()
{
    printf ("in myFucnction()\n");
    longjmp (buf, 1);

    /* NOT REACHED */
    printf ("you will never see this, because I longjmp'd");
}

int main (void)
{
    // int i = setjmp (buf);
    // printf ("i = %d\n", i);
    // if (i != 0) exit (0);
    // longjmp (buf, 42);
    // printf ("does this line get printed?\n");
    if (setjmp (buf))
        printf ("back in main\n");
    else
    {
        printf ("first time through\n");
        myFunction ();
    }


    return 0;
}