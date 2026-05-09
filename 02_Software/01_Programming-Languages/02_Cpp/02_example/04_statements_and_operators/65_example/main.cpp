#include <iostream>

using namespace std;

int main(void)
{
    // This is not an assignment, it's an initialization. The curly braces are used to initialize the variables.
    int num1 {10};
    int num2 {20};

    // This is an assignment.
    num1 = num2 = 1000;

    cout << "num1 is " << num1 << endl;
    cout << "num2 is " << num2 << endl;

    cout << endl;

    return 0;
}