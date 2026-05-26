// Section 14
// Overloading copy assignment

#include <iostream>
#include <vector>
#include "Mystring.h"

using namespace std;

int main (void)
{
    Mystring a{ "Hello" }; // Overloaded constructor
    Mystring b; // No-args constructor
    b = a; // Copy assignment
    b = "This is a test"; // b.operator = ("This is a test");

    Mystring empty; // No-args constructor
    Mystring larry ("Larry"); //Overloaded constructor
    Mystring stooge{ larry }; //Copy constructor
    Mystring stooges; //No-args constructor

    empty = stooge; // Copy assignment operator

    empty.display (); // Larry: 5
    larry.display (); // Larry : 5
    stooge.display (); // Larry : 5
    empty.display (); // Larry: 5

    stooges = "Larry, Moe, and Curly";
    stooges.display (); // Larrym Moe, and Curly : 21

    vector<Mystring> stooges_vec;
    stooges_vec.push_back ("Larry");
    stooges_vec.push_back ("Moe");
    stooges_vec.push_back ("Curly");

    cout << "=== Loop 1 ===============" << endl;
    for (const Mystring& s : stooges_vec)
        s.display (); // Larry --> Moe --> Curly

    cout << "=== Loop 2 ===============" << endl;
    for (Mystring& s : stooges_vec)
        s = "Changed"; // Copy assignment

    cout << "=== Loop 3 ===============" << endl;
    for (const Mystring& s : stooges_vec)
        s.display ();   // Changed


    return 0;
}