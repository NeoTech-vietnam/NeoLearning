#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
int j = 0;

void* do_process ()
{
    pthread_mutex_lock (&lock);
    int i = 0;
    j++;
    while (i < 5)
    {
        printf ("%d", j);
        sleep (1);
        i++;
    }
    printf ("...Done\n");
    pthread_mutex_unlock (&lock);
}

int main (void)
{
    pthread_t t1, t2;
    if (pthread_mutex_init (&lock, NULL) != 0)
    {
        printf ("Mutex initialization failed.\n");
        return 1;
    }
    j = 0;

    pthread_create (&t1, NULL, do_process, NULL);
    pthread_create (&t2, NULL, do_process, NULL);
    pthread_join (t1, NULL);
    pthread_join (t2, NULL);
    return 0;
}