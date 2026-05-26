/*
CHALLENGE - SETJMP AND LONG JMP
- Our challenge is to write a C program that uses setjmp and longjmp to gracefully handle unrecoverable program errors
    - When you discover an unrecoverable error, you should transfer control back to the main input loop and start again from there

- Create a function named error_recovery that prints out an error and then uses longjmp to transfer control back to a main function loop
- Your main function should include a forever loop that uses setjmp at the top of the loop before processing
- You can add "dummy" code in your loop that simulates an error (by calling error_recover) when setjmp returns 0
*/
#include <stdio.h>
#include <setjmp.h>

jmp_buf buf;

void error_recovery ()
{
    printf ("detected an unrecoverable error\n");
    longjmp (buf, 1);
}


int main (void)
{
    while (1)
    {
        if (setjmp (buf))
        {
            printf ("back in main\n");
            break;
        }
        else
        {
            error_recovery ();
        }
    }

    return 0;
}
