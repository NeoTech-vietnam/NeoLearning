#include <stdio.h>
#include <math.h>
#include <complex.h>

int main (void)
{
    double complex z1 = I * I; // Imaginary unit squared
    printf ("I * I = %.1f%+.1fi\n", creal (z1), cimag (z1));

    double _Complex z2 = pow (I, 2);
    printf ("pow (I, 2) = %.1f%+.1fi\n", creal (z2), cimag (z2));

    double PI = acos (-1);
    double complex z3 = exp (I * PI); // Euler's formula
    printf ("exp (I * PI) = %.1f%+.1fi\n", creal (z3), cimag (z3));
    /*
    Use

    gcc challenge_03.c -o challenge_03 -lm

    Reason: Functions like exp, acos, and the complex number functions (cexp, cimag, etc.) are defined in the math library (libm).
    GCC does not link it automatically — you must specify it with -lm.
    */

    double complex z4 = 1 + 2 * I, z5 = 1 - 2 * I; // Conjugates
    printf ("(1+2i)*(1-2i) = %.1f%+.1fi\n", creal (z4 * z5), cimag (z4 * z5));

    return 0;
}