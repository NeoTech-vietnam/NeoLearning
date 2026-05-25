/*
CHALLENGE 1:
- Write a program to print the values of the following predefined symbolic constants
    - __LINE__
    - __FILE__
    - __DATE__
    - __TIME__
    - __STDC__
*/
#include <stdio.h>

int main (void)
{
    printf ("__LINE__ = %d\n", __LINE__);
    printf ("__FILE__ = %s\n", __FILE__);
    printf ("__DATE__ = %s\n", __DATE__);
    printf ("__TIME__ = %s\n", __TIME__);
    printf ("__STDC__ = %d\n", __STDC__);
    return 0;
}