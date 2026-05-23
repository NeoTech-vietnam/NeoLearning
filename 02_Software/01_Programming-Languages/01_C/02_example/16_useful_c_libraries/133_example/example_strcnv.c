#include <stdio.h>
#include <stdlib.h>

int main (void)
{
    /* atoi - ASCII to Integer: Convert a string to an integer */
    char a[10] = "100";
    int num = atoi (a);
    printf ("Value of integer = %d\n", num);

    /* atof - ASCII to Float: Convert a string to a float */
    char b[10] = "3.14";
    float fnum = atof (b);
    printf ("Value of float = %f\n", fnum);

    /* atol - ASCII to Long: Convert a string to a long integer */
    char c[10] = "123456";
    long lnum = atol (c);
    printf ("Value of long integer = %ld\n", lnum);

    /* strtod - ASCII to Double: Convert a string to a double */
    char d[] = "123.456xyz", * end;
    double dnum = strtod (d, &end);
    printf ("Value of double = %lf\n", dnum);

    /* strtof - ASCII to Float: Convert a string to a float */
    char e[] = "365.25 7.0", * end2;
    float fnum_strtof = strtof (e, &end2);
    float fnum_strtof2 = strtof (end2, NULL);
    printf ("Value of float = %f\n", fnum_strtof);
    printf ("Value of float = %f\n", fnum_strtof2);

    /* strtol - ASCII to Long: Convert a string to a long integer */
    char f[30] = "2030300 This is test";
    char* ptr = NULL;
    long ret = 0;
    ret = strtol (f, &ptr, 10);
    printf ("The number (unsigned long integer) is %ld\n", ret);
    printf ("String part is |%s |\n", ptr);

    return 0;
}