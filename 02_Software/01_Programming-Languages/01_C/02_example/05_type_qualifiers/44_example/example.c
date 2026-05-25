#include <stdio.h>

const double PI = 3.14159;
const char* MONTH[12] = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
"August", "Sept", "Oct","Nov", "Dec" };

int main (void)
{
    /* Basically it is cont double pi */
    const const const const double pi = 3.141592654;
    const int days[12] = { 31, 28 ,31 ,30 ,[4 ... 11] = 30 };
    /* define const int as zip */
    typedef const int zip;
    /* Equally const const q */
    const zip q = 8;


    const float* pf; // pf points to a constant float value

    float* const pt; // pt is a const pointer which address can not be changed

    const float* const ptr; // Both restrictions are applied

    float const* pfc; // Same as const float *pfc;

    return 0;
}

void display (const int array[], int limit);

char* strcat (char* restrict s1, const char* restrict s2); // You only modify the first string and the second string is just read-only