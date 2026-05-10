#include <stdio.h>
#include <ctype.h>

int getc (FILE* stream);

int main (void)
{

    // char ch = '\0';

    /* OTPION 1
    FILE* fp;

    if (fp = fopen ("someFile.c", "rw"))
    {
        ch = getc (fp);
        while (ch != EOF)
        {
            ch = getc (fp);
        }
        fclose (fp);
    }
    */

    /* --- */

    /* OPTION 2: getc
    ch = getc (stdin);
    printf ("read in character %c\n", ch);
    */

    /* --- */

    /* getchar() */
    // printf ("%c\n", getchar ());

    /* --- */

    /* Test EOF signals from keyboard -> Ctrl + D
    int ch = 0;
    while ((ch = getchar ()) != EOF)
        printf ("%c\n", ch);
    */

    /* --- */

    /*
    FILE* fp;
    char c;

    fp = fopen ("myFile.c", "r"); // Opening an existing file

    if (fp == NULL)
    {
        printf ("Could not open file myFile.c");
        return 1;
    }
    printf ("Reading the file myFile.c");

    while (1)
    {
        c = fgetc (fp); // Reading the file
        if (c == EOF)
            break;
        printf ("%c", c);
    }
    printf ("Closign the file test.c");
    fclose (fp); // Closing the file
    */

    /* --- */

    char ch = 0;
    while (isspace (ch = (char)getchar ()));
    ungetc (ch, stdin);
    printf ("char is %c\n", getchar ());
    return 0;
}