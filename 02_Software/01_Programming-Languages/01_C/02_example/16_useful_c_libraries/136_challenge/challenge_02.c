/* CHALLENGE #2
- This challenge will test your understanding of the quick sort algorithm (qsort()) from the stdlib.h file
- Write a C program that will sort an array of doubles from the lowest to highest using the qsort() function
- Create a function that takes a double array and a size parameter which generates some randome double values
    - void fillarray(double ar[], int n);
- Create a function that displays an array (takes a double array and size)
    - void showarray(const double ar[], int n);
- Your main function should
    - Create an array
    - Fill it with random numbers
    - Display it
    - Sort it using qsort()
    - Display the sorted array
*/

#include <stdlib.h>
#include <stdio.h>
#include <time.h>

#define NUM 40

void fillarray (double ar[], int n);
void showarray (const double ar[], int n);
int mycomp (const void* p1, const void* p2);

int main (void)
{
    double vals[NUM];
    fillarray (vals, NUM);
    puts ("Random list:");
    showarray (vals, NUM);
    qsort (vals, NUM, sizeof (double), mycomp);
    puts ("\nSorted list:");
    showarray (vals, NUM);
    return 0;
}


void fillarray (double ar[], int n)
{
    int index;

    for (index = 0; index < n; index++)
        ar[index] = (double)rand () / ((double)rand () + 0.1);
}

void showarray (const double ar[], int n)
{
    int index;

    for (index = 0; index < n; index++)
    {
        printf ("%9.4f ", ar[index]);
        if (index % 6 == 5)
            putchar ('\n');
    }

    if (index % 6 != 0)
        putchar ('\n');
}

/* sort by increasing value */
int mycomp (const void* p1, const void* p2)
{

    /* need to use pointers to double to access values   */
    const double* a1 = (const double*)p1;
    const double* a2 = (const double*)p2;

    if (*a1 < *a2)
        return -1;
    else if (*a1 == *a2)
        return 0;
    else
        return 1;
}
