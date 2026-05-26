#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <malloc.h>

struct thread_data
{
    int thread_id;
    int sum;
    char* message;
};

void* print_hello (void* thread_arg)
{
    struct thread_data* my_data;
    int taskid = 0, sum = 0;
    char hello_msg[255];
    my_data = (struct thread_data*)thread_arg;
    taskid = my_data->thread_id;
    sum = my_data->sum;
    strcpy (hello_msg, my_data->message);
    printf ("taskid = %d, sum = %d, message = %s\n", taskid, sum, hello_msg);

}

int main (int argc, char* argv[])
{
    pthread_t my_thread;
    struct thread_data my_thread_data;
    my_thread_data.message = malloc (sizeof (char) * 255);
    my_thread_data.sum = 35;
    my_thread_data.thread_id = 10;
    my_thread_data.message = "Hello World";
    pthread_t my_id = pthread_create (&my_thread, NULL, print_hello, (void*)&my_thread_data);
    pthread_join (my_thread, NULL);
    pthread_exit (NULL);

    return 0;
}