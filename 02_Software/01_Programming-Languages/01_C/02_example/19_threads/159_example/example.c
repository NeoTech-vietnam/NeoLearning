#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <malloc.h>

void* print_message_function (void* ptr);

int main (void)
{
    pthread_t thread1, thread2;
    char* message1 = "Thread 1";
    char* message2 = "Thread 2";
    int iret1 = 0, iret2 = 0;

    /* Create independent threads each of which will execute function */
    iret1 = pthread_create (&thread1, NULL, print_message_function, (void*)message1);
    iret2 = pthread_create (&thread2, NULL, print_message_function, (void*)message2);

    /* Wate till threads are completed before main continues. Unless we
    wait we run the risk of executing an exit which will terminate
    the process and all thread before the threads have completed.
    */
    pthread_join (thread1, NULL);
    pthread_join (thread2, NULL);

    printf ("Thread 1 returns: %d\n", iret1);
    printf ("Thread 2 returns: %d\n", iret2);
    pthread_exit (NULL);
    exit (0);

    return 0;
}

void* print_message_function (void* ptr)
{
    char* message;
    message = (char*)ptr;
    printf ("%s \n", message);
}