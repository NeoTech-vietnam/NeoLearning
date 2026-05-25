/*
- This challenge will test your understanding of double pointers
    - How to declare a pointer to pointer
    - How to initialize a pointer to a pointer
    - How to access a pointer to a pointer
- Write a program that creates, assigns, and accesses some double pointers
    1. create a normal integer variable (non pointer) and assign it a random value
    2. create a single integer pointer variable
    3. create a double integer pointer variable
    4. assign the address of the normal integer variable (step 1) to the single pointer (step 2)
    5. assign the address of the single pointer (step 2) to the double pointer variable (step 3)
- Display the following output using all possible syntax
    - All possible ways to find value of the normal integer variable (step 1)
    - All possible ways to find address of the normal integer variable (step 1)
    - All possible ways to find the value of the single pointer variable (step 2)
    - All possible ways to find the address of the single pointer variable (step 2)
    - All possible ways to print the double pointer value and address (step 2)
*/
#include <stdio.h>

int main (void)
{
    int num = 123;
    int* singlePointer = NULL;
    int** doublePointer = NULL;

    singlePointer = &num;
    doublePointer = &singlePointer;

    /* Possible ways to find value of variable num */
    printf ("\n Value of num is: %d", num);
    printf ("\n Value of num using singlePointer is: %d", *singlePointer);
    printf ("\n Value of num using doublePointer is: %d\n", **doublePointer);

    /* Possible ways to find value of variable num */
    printf ("\n Address of num is: %p", &num);
    printf ("\n Address of num using singlePointer is: %p", singlePointer);
    printf ("\n Address of num using doublePointer is: %p\n", *doublePointer);

    /* Find value of pointer */
    printf ("\n Value of Pointer singlePointer is: %p", singlePointer);
    printf ("\n Value of Pointer singlePointer using doublePointer is: %p\n", *doublePointer);

    /* Ways to find the address of pointer */
    printf ("\n Address of Pointer singlePointer is: %p", &singlePointer);
    printf ("\n Address of Pointer singlePointer using doublePointer is: %p\n", doublePointer);

    /* Double pointer value and address */
    printf ("\n Value of Pointer doublePointer is:%p", doublePointer);
    printf ("\n Address of Pointer doublePointer is:%p\n", &doublePointer);

    return 0;
}