/*
- The goal is to create a static library and the nwrite a program that uses that library
- Create a C source file named "StringFunctions.c" should contain implementation
of varius string manipulation functions:
    - Find the frequency of characters in a string
    - Remove all the characters in a String except Alphabets
    - Calculate the length of a string without using strlen
    - Concatenate two strings with using strcat
    - Copy a string manually without using strcpy
    - Find the substring of a given string
*/

#include <stdlib.h>
#include <stdio.h>

#include "StringFunctions.h"

int main (void)
{

    char temp[] = "jason &&''''Fedin";
    char temp2[] = "apple";
    char temp3[100];

    printf ("Number of 'p's in apples is %d\n", numberOfCharactersInString (temp2, 'p'));

    removeNonAlphaCharacters (temp);
    printf ("String temp with alpha characters removed is: %s\n", temp);

    printf ("String temp length is: %d\n", lengthOfString (temp));

    strConcat (temp, temp2);
    printf ("String concatenated with string2 is: %s\n", temp);

    strCopy (temp2, temp3);
    printf ("String copied is: %s\n", temp3);

    substring (temp, 3, 8, temp3);
    printf ("Substring is: %s\n", temp3);

    return 0;
}
