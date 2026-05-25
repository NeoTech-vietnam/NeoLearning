/*
CHALLENGE 1:
- This challenge will test your understanding of the common char I/O functions
    - You must choose the correct function to use based on the requirements (sometimes, there are multiple options)
- Write a program in C to count the number of words and characters in a file OR from standard input
- This program can take zero command-line arguments or one command-line argument
    - If there is one argument, it is interpreted as the name of a file
    - If there is no argument, the standard input (stdin) is to be used for input
*/
#include <stdio.h>
#include <stdlib.h>

int main (int argc, char* argv[])
{
    FILE* fp = NULL;
    char ch = '\0';
    int wrd = 1, charctr = 1;

    if (argc == 1)
        fp = stdin;
    else if (argc == 2)
    {
        if ((fp = fopen (argv[1], "r")) == NULL)
        {
            fprintf (stderr, "Can't open %s\n", argv[1]);
            exit (EXIT_FAILURE);
        }
    }
    else
    {
        fprintf (stderr, "Usage: %s [filename]\n", argv[0]);
        exit (EXIT_FAILURE);
    }

    ch = getc (fp);

    while (ch != EOF)
    {
        if (ch == ' ' || ch == '\n')
        {
            wrd++;
        }
        else
        {
            charctr++;
        }

        ch = getc (fp);
    }

    printf ("\n The number of words in the file are : %d\n", wrd);
    printf (" The number of characters in the file is : %d\n\n", charctr);

    fclose (fp);

    return 0;
}
