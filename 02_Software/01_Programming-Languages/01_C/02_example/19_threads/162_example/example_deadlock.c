#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

pthread_mutex_t lock1, lock2;

void* resource1 ()
{
    pthread_mutex_lock (&lock1);

    printf ("Job started in resource1..\n");
    sleep (2);

    printf ("Trying to get resource2\n");
    while (pthread_mutex_trylock (&lock2))
    {
        pthread_mutex_unlock (&lock1);
        sleep (2);
        pthread_mutex_lock (&lock1);
    }
    printf ("Acquired resource2\n");
    pthread_mutex_unlock (&lock2);

    sleep (2);

    pthread_mutex_unlock (&lock1);

    printf ("Job finished in resource1..\n");
    pthread_mutex_unlock (&lock1);
    pthread_exit (NULL);
}

void* resource2 ()
{
    pthread_mutex_lock (&lock2);

    printf ("Job started in resource2..\n");
    sleep (2);

    printf ("Trying to get resource1\n");
    pthread_mutex_lock (&lock1);
    printf ("Acquired resource1\n");
    pthread_mutex_unlock (&lock1);

    printf ("Job finished in resource2..\n");
    pthread_mutex_unlock (&lock2);
    pthread_exit (NULL);
}

int main (void)
{

    pthread_mutex_init (&lock1, NULL);
    pthread_mutex_init (&lock2, NULL);

    pthread_t t1, t2;
    pthread_create (&t1, NULL, resource1, NULL);
    pthread_create (&t2, NULL, resource2, NULL);
    pthread_join (t1, NULL);
    pthread_join (t2, NULL);
    return 0;
}