#include <stdio.h>

int main (void)
{
    size_t rows = 0;
    size_t columns = 0;

    printf ("Enter the number of rows you want to store: ");
    scanf ("%zd", &rows);
    printf ("Enter the number of columns in a row: ");
    scanf ("%zd", &columns);

    float beans[rows][columns];
    return 0;
}