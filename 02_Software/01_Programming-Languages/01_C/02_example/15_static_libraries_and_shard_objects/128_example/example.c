#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>

int main (void)
{
    void* handle = NULL;
    double (*cosine) (double) = NULL;
    char* error = NULL;

    handle = dlopen ("/lib/x86_64-linux-gnu/libm.so.6", RTLD_LAZY);
    if (!handle)
    {
        fputs (dlerror (), stderr);
        exit (1);
    }
    dlerror ();

    cosine = dlsym (handle, "cos");

    if ((error = dlerror ()) != NULL)
    {
        fputs (error, stderr);
        exit (1);
    }
    printf ("%f\n", (*cosine)(2.0));
    dlclose (handle);

    return 0;
}