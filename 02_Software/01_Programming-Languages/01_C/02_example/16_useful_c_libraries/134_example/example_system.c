#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main (void)
{
    char command[50];
    strcpy (command, "pwd");
    system (command);
    return 0;
}