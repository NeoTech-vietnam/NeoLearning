/*
- This challenge will test your understanding of double pointers used as arguments to a function
- Write a program that includes a function that modifies a pointers value
    - Not the value that the pointer is pointing to
    - The actual value of the pointer (the address that the pointer is pointing to)
- Essentially this program will be simulating "pass by reference" in the C language
    - You want to change the value of the pointer passed to a function as the function argument
*/
#include <stdio.h>
#include <malloc.h>

void allocateMemory (int** ptr)
{
    *ptr = (int*)malloc (sizeof (int)); // allocate some memory
}

int main ()
{
    int* ptr = NULL;

    allocateMemory (&ptr);
    *ptr = 20;

    printf ("%d\n", *ptr);

    // free up the memory
    free (ptr);
    return 0;
}