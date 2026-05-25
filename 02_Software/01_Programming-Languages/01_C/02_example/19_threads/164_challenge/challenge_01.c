/* CHALLENGE 1
- This challenge will test your understanding of threads
    - Creating and exiting threads, joining threads and passing arguments to thread functions
- Write a program in which multiple threads print a message
    - Create 10 separate threads and have each thread call one function that takes an argument
        - Pass a different number for each thread to yoour thread function
        - Might want to use an array to store each thread and to store each number
- Create a global variable named counter and initialize it to 0 (shared variable amongst threads)
*/

#include<stdio.h>
#include<pthread.h>

#define NTHREADS 10

int counter = 0;

void* func1 (void* data)
{
    int* x = (int*)data;

    counter++;
    printf ("message is %d, thread id = %lud modified the counter to %d\n", *x, pthread_self (), counter);
    printf ("message is %d, thread id = %lud read the counter %d\n", *x, pthread_self (), counter);
}

int main (void)
{
    pthread_t thread_id[NTHREADS];
    int values[NTHREADS];

    for (int i = 0; i < NTHREADS; i++)
    {
        values[i] = i;
        pthread_create (&thread_id[i], NULL, func1, &values[i]);
    }

    for (int j = 0; j < NTHREADS; j++)
    {
        pthread_join (thread_id[j], NULL);
        pthread_exit (&thread_id[j]);
    }

    return 0;
}
