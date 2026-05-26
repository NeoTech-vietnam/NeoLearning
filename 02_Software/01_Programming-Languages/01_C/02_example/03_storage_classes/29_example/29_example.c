#include <stdio.h>

int main (void)
{
    auto int x; // Local variables

    int m;

    scanf ("%d", &m);
    {
        int i; //Both m and i in scope
        int n = 5;
        for (i = m; i < n; i++)
        {

        }
    }
    return 0;
}

char* myFunction ()
{
    char x[] = "apple";
    return x;
}

int func_name ()
{
    auto int y = 0; // Local variables
    return y;
}