#include <stdio.h>

int somedisplay (void);

void funct1 (int);
void funct2 (int);

typedef void FuncType (int);

int main (void)
{
    // int (*func_ptr)();

    // func_ptr = somedisplay;

    // printf ("\nAddress of function somedisplay is: %p\n", func_ptr);

    // (*func_ptr)();

    FuncType* func_ptr = NULL;
    func_ptr = funct1;
    (*func_ptr)(100);

    func_ptr = funct2;
    (*func_ptr)(200);

    return 0;
}

int somedisplay (void)
{
    printf ("\n--Displaying some text--\n");
    return 0;
}

void funct1 (int testarg)
{
    printf ("funct1 got an argument of %d\n", testarg);
}

void funct2 (int testarg)
{
    printf ("funct2 got an argument of %d\n", testarg);
}