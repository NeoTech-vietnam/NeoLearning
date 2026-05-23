#include "date.h"


int main (void)
{
    return 0;
}

// Function to calculate tomorrow's date
Date dateUpdate (Date today)
{
    Date tomorrow;
    if (today.day != numberOfDays (today))
        setDate (tomorrow, today.month, today.day + 1, today.year);
    else if (today.month == December)
        setDate (tomorrow, January, 1, today.year + 1);
    else
        setDate (tomorrow, today.month + 1, 1, today.year);

    return tomorrow;
}

int numberOfDays (Date d)
{
    return 3;
}