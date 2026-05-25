#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <malloc.h>

void* hello_return (void* args)
{
    // Allocate a new string on the heap with "Hello World!"
    char* hello = strdup ("Hello World!\n");
    return (void*)hello;
}


int main (int argc, char* argv[])
{
    char* str;
    pthread_t thread;
    // Create a new thread that runs hello_return without arguments
    pthread_create (&thread, NULL, hello_return, NULL);
    // Wait until the thread completes, assign return value to str
    pthread_join (thread, (void**)&str);
    // Can not have the pthread_exit as it will terminate the thread immediately
    // pthread_exit (NULL);
    printf ("%s", str);
    return 0;
}