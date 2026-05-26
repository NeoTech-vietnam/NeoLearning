#include <stdio.h>

union car
{
    int i_value;
    float f_value;
    char c_value[40];
};

struct owner
{
    char socsecurity[12];
};

struct leasecompany
{
    char name[40];
    char headquarters[40];
};

struct car_data
{
    char make[15];
    int status; /* 0 = owned, 1 = leased */
    union
    {
        struct owner owncar;
        struct leasecompany leasecar;
    };
};

struct
{
    char* name;
    enum symbolType type;
    union
    {
        int i;
        float f;
        char c;
    } data;
} table[entries];

int main (void)
{

    union car car1, car2, * car3;
    printf ("Memory size occupied by data: %zu\n", sizeof (car1));

    return 0;
}