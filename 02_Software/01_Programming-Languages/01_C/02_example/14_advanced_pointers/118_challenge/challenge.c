/*
- This challenge will test your understanding of
    - how to declare a function pointer
    - how to assign functions to a function pointer
    - how to pass a function pointer as parameter
    - how to invoke a function using its pointers
- Write a program that will perfom some arithmetic operation (user entry) on an array using function pointers
- Download the challenge starter file from the resource section of the lecture (Challenge-Starter-code.c)
- You need to modify the program to
    - Based on user input, the program will perform the specified operation on the two arrays and then display the result
    - You will use an array of function poitners to perform the correct operation
- Add code to the starter file:
- Task 1:
    - Create an array of function pointers that point to each arithmetic function (add, sub, mult, div)
- Task 2:
    - Add a fourth parameter to the performOp function so that it takes a function pointer with the signature of the arithmetic functions
- Task 3:
    - Pass in the correct function pointer (array index) to the performOp function
- Task 4:
    - Include the code for the function performOp
    - Your code should invoke the function pointed to from the parameter passed in
        - Will perform the operation on elements of the two arrays passed in and sotre the result in a third array
        - Function should return the new array containing the results
- Task 5:
    - Include the code for the function display
        - Your code should display as output all the elements of the given array in a readable format
*/
#include <stdio.h>
#include <string.h>
#include <malloc.h>

// some random numbers
int array1[] = { 10,20,30,40,50,60,70,80,90,100 };
int array2[] = { 38, 27, 87, 63, 59, 223, 132, 1, 19, 7 };


int add (int a, int b) { return a + b; }
int sub (int a, int b) { return a - b; }
int mult (int a, int b) { return a * b; }
int div (int a, int b) { return a / b; }

/// Array of pointers to functions
// INSERT YOUR FUNCTION POINTER INITIALIZATION HERE = { &add,&sub,&mult,&div };
int (*fpArr[]) (int, int) = { &add, &sub, &mult, &div };

// performs the given operation on elements of the arrays
int* performOp (int* a, int* b, int size, int (*f) (int, int));

// displays the elements of an array
void display (int* x, int size);

// main method
int main ()
{

    int choice = 0;

    // size of the array                      
    unsigned int size = 0;

    int* result = NULL;

    // set size to minimum size of the two arrays
    size = sizeof (array1);

    if (sizeof (array2) < size)
        size = sizeof (array2);

    size = size / sizeof (int);

    while (choice != 5)
    {
        printf ("\n\nWhich operation do you want to perform? \n");
        printf ("1.Add \n");
        printf ("2.Subtract \n");
        printf ("3.Multiply \n");
        printf ("4.Divide \n");
        printf ("5.None ... \n");
        printf ("Enter choice: ");
        scanf ("%d", &choice);

        if (choice == 5) break;
        if (choice < 1 || choice > 5) continue;

        int j = choice - 1;

        result = performOp (array1, array2, size, fpArr[j]);

        printf ("\n\nThe Results are ...\n");
        display (result, size);

        if (result != NULL)
            free (result);

    }

    return 0;
}


// performs the given operation on all elements of the arrays A and B 
int* performOp (int* a, int* b, int size, int (*f)(int, int))
{
    // INCLUDE YOUR CODE HERE
    int* c = malloc (sizeof (int) * size);
    for (int i = 0; i < size; i++)
    {
        c[i] = (f)(a[i], b[i]);
    }

    return c;
}


// function for displaying the results stored in array x
void display (int* x, int size)
{
    // INCLUDE YOUR CODE HERE
    if (x == NULL) return;

    for (int i = 0; i < size; i++)
    {
        printf ("%d  ", x[i]);
    }
    printf ("\n");
}
