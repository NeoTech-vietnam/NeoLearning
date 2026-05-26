#include <iostream>
#include "Mystring.h"

using namespace std;

int main(void){
    Mystring empty; // no-args constructor
    Mystring larry{"Larry"}; // Overloaded constructor
    Mystring stooge {larry}; // Copy constructor

    empty.display();
    larry.display();
    stooge.display();

    return 0;
}