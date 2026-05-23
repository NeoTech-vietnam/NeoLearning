/* CHALLENGE #4
- This challenge will test your understanding of using the tm structure
- Write a program to compute the number of seconds passed since the beginning of the current month
    - You should use the localtime, difftime, and mktime functions
    - You should handle errors using fprintf and the exit function with the correct failure code

*/

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main (void)
{
    time_t now;
    time (&now);

    struct tm beg_month;
    beg_month = *localtime (&now);
    beg_month.tm_hour = 0;
    beg_month.tm_min = 0;
    beg_month.tm_sec = 0;
    beg_month.tm_mday = 1;

    double seconds = difftime (now, mktime (&beg_month));

    printf ("\n %.f seconds passed since the beginning of the month.\n\n", seconds);
    return 0;
}