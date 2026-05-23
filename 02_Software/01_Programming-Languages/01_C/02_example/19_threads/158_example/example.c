#include <stdio.h>
#include <pthread.h>

void* hello_fun ()
{
    printf ("Hello World!\n");
    return NULL;
}

int main (int argc, char* argv[])
{
    pthread_t thread = 0;
    pthread_create (&thread, NULL, hello_fun, NULL);
    pthread_join (thread, NULL);
    pthread_exit (NULL);
    return 0;
}