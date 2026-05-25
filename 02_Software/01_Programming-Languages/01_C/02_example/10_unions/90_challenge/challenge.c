/*
- This challenge will test your understanding of unions in C programming
    - How to define/declare and how to access assign
- Write a program which will define a union and then use this union to assign and access its members
- You must define a union named student that consists of the following three elements
    - char leeterGrade
    - int roundedGrade
    - float exactGrade
- Your program should declare two union variables inside the main method (variable 1 and variable 2)
- Your program should assign random values to variable 1
    - You then need to display each value for each member of this union
    - You should notice that something is wrong
- Should then assign a value (using variable 2) to its member letter grade and then print it out
- Should then assign a value (using variable 2) to its to member rounded grade and then print it out
- Should then assign a value (using variable 2) to its to member exact grade and then print it out
- Should notice the difference in output with variable 1 and variable 2
    - Why is there a difference?
OPTIONAL ADDITIONS:
- Declare the union variables by using the option tag in the declaration
- Use pointers as union variables and practice assigning/accessing members
- Display the total size of the union in bytes
- Initialize a union member by using a designated initializer
- Add a union inside a structure
*/
#include <stdio.h>

union student
{
    char letterGrade;
    int roundedGrade;
    float exactGrade;
};

int main (void)
{
    union student record1;
    union student record2;

    // Assigning values to record1 union variable
    record1.letterGrade = 'B';
    record1.roundedGrade = 87;
    record1.exactGrade = 86.50;

    printf ("Union record1 values example\n");
    printf ("Letter Grade: %c\n", record1.letterGrade);
    printf ("Rounded Grade: %d\n", record1.roundedGrade);
    printf ("Exact Grade: %f\n", record1.exactGrade);

    // Assigning values to record2 union variable
    record2.letterGrade = 'A';
    printf ("Letter Grade: %c\n", record2.letterGrade);
    record2.roundedGrade = 100;
    printf ("Rounded Grade: %d\n", record2.roundedGrade);
    record2.exactGrade = 99.50;
    printf ("Exact Grade: %f\n", record2.exactGrade);


    return 0;
}