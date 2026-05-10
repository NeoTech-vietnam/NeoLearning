/* CHALLENGE #3
- This challenge will test your understanding of getting the current time
- Write a C program to priunt the current time
    - You should use the time and ctime functions
    - You should handle erros using fprintf and the exit function with the correct failure code

*/

#include <time.h>
#include <stdio.h>  
#include <stdlib.h>

int main (void)
{
    time_t cur_time;
    char* cur_t_string;
    cur_time = time (NULL);

    if (cur_time == ((time_t)-1))
    {
        (void)fprintf (stderr, "Failure to get the current time.\n");
        exit (EXIT_FAILURE);
    }
    cur_t_string = ctime (&cur_time); //convert to local time format
    if (cur_t_string == NULL)
    {
        (void)fprintf (stderr, "Failure to convert the current time.\n");
        exit (EXIT_FAILURE);
    }
    (void)printf ("\n The Current time is : %s \n", cur_t_string);
    exit (EXIT_SUCCESS);
}
