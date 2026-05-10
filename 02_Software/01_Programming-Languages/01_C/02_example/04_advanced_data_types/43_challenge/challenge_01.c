#include <stdio.h>

int main (void)
{
    int sum = 0, size = 0;
    printf ("Please enter the size of the array\n");

    scanf ("%d", &size);

    int arr[size];

    printf ("Enter %d element in the array: ", size);
    for (int i = 0; i < size; i++)
        scanf ("%d", &arr[i]);

    for (int i = 0; i < size; i++)
        sum = sum + arr[i];

    printf ("\nSum of all elements of array = %d\n", sum);

    return 0;
}