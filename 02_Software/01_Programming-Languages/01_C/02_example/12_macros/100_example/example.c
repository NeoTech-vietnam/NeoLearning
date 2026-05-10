#include <stdio.h>

void my_function_name (void)
{
    printf ("%s was called.\n", __func__);
}

int main (void)
{
#if (__STDC__ == 1)
    printf ("Implementation is ISO-conforming.\n");
#else
    printf ("Implementation is ISO-conforming.\n");
#endif

    printf ("File is %s line is %d\n", __FILE__, __LINE__);
    printf ("Program last compiled at %s on %s\n", __TIME__, __DATE__);

    my_function_name ();


    return 0;
}