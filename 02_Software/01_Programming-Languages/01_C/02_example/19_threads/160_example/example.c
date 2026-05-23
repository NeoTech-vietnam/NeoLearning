#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

void* calls (void* ptr)
{
    // Using pthread self() get current thread id
    printf ("In function \nthread id = %ld\n", pthread_self ());
    pthread_exit (NULL);
    return NULL;
}

int main (void)
{
    pthread_t thread; // Declare thread
    pthread_create (&thread, NULL, calls, NULL);
    printf ("In main \nthread id = %ld\n", thread);
    pthread_join (thread, NULL);
    return 0;
}