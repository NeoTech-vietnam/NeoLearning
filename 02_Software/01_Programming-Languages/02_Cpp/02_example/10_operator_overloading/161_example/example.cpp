// Section 14
// Overloading move constructor and move assignment operator
#include <vector>
#include <iostream>
#include <Mystring.h>

using namespace std;

int main (void)
{
    Mystring a{ "Hello" }; // Overloaded constructor
    a = Mystring{ "Holla" }; // Overloaded constructor then move assignment
    a = "Bonjour"; // Overloaded constructor then move assignment
    return 0;
}