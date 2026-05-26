/*
CHALLENGE 4:
- Write a program to check whether a character is uppercase or lowercase using macros
- You should create two macros that accept a single argument (character)
    - IS_UPPER
    - IS_LOWER
    - both of the macros should return a boolean
        - true(1) or false(0) based on whether they are upper or lower case
- Yor macro will need to include a conditional and can use logical operators
- Your program should have the user enter any character (getchar())
- Your program should then display whether the character is upper or lower case as output
by invoking the above macros
ADDITONAL ENHANCEMENTS:
- Feel free to add the below macro to perform additional checks on characters
    - To further your learning
- Logic to check alphabets, digits, alphanumberic, vowels, consonants,
special characters, white spaces etc.
    - Some of the above macros can use the other macros
        - an IS_ALPHANUMERIC macro could use an IS_ALPHABET and IS_DIGIT macros
*/
#include <stdio.h>

// Macro definitions
#define IS_UPPER(x) (x >= 'A' && x <= 'Z')
#define IS_LOWER(x) (x >= 'a' && x <= 'z')
#define IS_ALPHABET(x) (IS_LOWER(x) || IS_UPPER(x))

#define IS_VOWEL_LOWER(x) (x == 'a' || x == 'e' || x == 'i' || x == 'o' || x == 'u')
#define IS_VOWEL_UPPER(x) (x == 'A' || x == 'E' || x == 'I' || x == 'O' || x == 'U')
#define IS_VOWEL(x) (IS_VOWEL_LOWER(x) || IS_VOWEL_UPPER(x))

#define IS_DIGIT(x) (x >= '0' && x <= '9')
#define IS_ALPHANUMERIC(x) (IS_ALPHABET(x) || IS_DIGIT(x))

#define IS_WHITE_SPACE(x) (x == ' ' || x == '\t' || x == '\r' || x == '\n' || x == '\0')

#define IS_SPECIAL_CHARACTERS(x) (x >= 32 && x <= 127 && !IS_ALPHABET(x) && !IS_DIGIT(x) && !IS_WHITE_SPACE(x))

int main ()
{
    char ch;

    // Input a character from user
    printf ("Enter any character: ");
    ch = getchar ();

    if (IS_UPPER (ch))
        printf ("'%c' is uppercase\n", ch);
    else if (IS_LOWER (ch))
        printf ("'%c' is lowercase\n", ch);
    else
        printf ("Entered character is not alphabet");

    return 0;
}
