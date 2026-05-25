#include <stdio.h>

int main (void)
{
    /* OPTION 1
    char ch = '\0';
    FILE* fp = NULL;
    if (fp = fopen ("someFile.c", "rw"))
    {
        ch = getc (fp);
        while (ch != EOF)
        {
            putc (ch, fp);
            ch = getc (fp);
        }
    }
    fclose (fp);
    */
    /* OPTION 2 */
    // char ch = 'd';
    // putc (ch, stdout);

    /* OPTION 3 */
    // char string[] = "Hello Thach, \nwhatever!\n";
    // int i = 0;

    // while (string[i] != '\0')
    // {
    //     if (string[i] != '\n')
    //     {
    //         putchar (string[i]);
    //     }
    //     i++;

    // }

    /* OPTION 3 */
    // int ch = 0;
    // while ((ch = getchar ()) != EOF)
    //     putchar (ch);

    // /* ungetc() returns EOF previously read back to stdin */
    // ungetc (ch, stdin);
    // printf ("Thank you!\n");

    /* OPTION 4 */
    FILE* pFile = NULL;
    char c = '\0';

    pFile = fopen ("myFile.txt", "w");

    if (pFile != NULL)
    {
        for (c = 'A'; c <= 'Z'; c++)
            fputc (c, stdout);
        fclose (pFile);
    }

    return 0;
}