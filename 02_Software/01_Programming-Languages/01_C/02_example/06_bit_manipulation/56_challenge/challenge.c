/*
CHALLENGE (SETTING AND READING BITS)

- This challenge will test your knowledge of setting and reading bits
- Write a C program to input any number from user
    - The program should check whether nth bit of the given number is set (1) or not
    - The program should set nth bit of the given number as 1

Enter any number: 10
Enter nth bit to check and set (0-31): 2
The 2 bit is set to 0

Bit set successfully.

Number before setting 2 bit: 10(in decimal)
Number after setting 2 bit: 14 (in decimal)
*/
#include <stdio.h>

int main (void)
{
    // Declare input number
    int userNumber, position, newNum, bitStatus;

    /* Input number from user */
    printf ("Enter any number: ");
    scanf ("%d", &userNumber);

    /* Input bit position you want to set */
    printf ("Enter nth bit to check and set (0-31): ");
    scanf ("%d", &position);

    /* Right shift userNumber, position times and perform bitwise AND with 1 */
    bitStatus = (userNumber >> position) & 1;
    printf ("The %dth bit is set to %d\n", position, bitStatus);

    /* Left shift 1, n times and perform bitwise OR with userNumber */
    newNum = (1 << position) | userNumber;
    printf ("\nBit set successfully.\n");

    printf ("Number before setting %d bit: %d (in decimal)\n", position, userNumber);
    printf ("Number after setting %d bit: %d (in decimal)\n", position, newNum);


    return 0;
}