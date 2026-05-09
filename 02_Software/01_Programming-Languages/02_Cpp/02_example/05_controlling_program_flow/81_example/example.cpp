#include <iostream>

using namespace std;

int main(void){

    int num {};
    cout << "Enter an integer: ";
    cin >> num;

    if(num % 2 == 0)
        cout << num << " is even." << endl;
    else
        cout << num << " is odd." << endl;

    cout << num << " is " << ((num % 2 == 0) ? "even" : "odd") << "." << endl;

    int num1{}, num2{};

    cout << "Enter two integers separated by a space: ";
    cin >> num1 >> num2;

    if(num1 != num2){
        cout << "The larger of the two numbers is: " << ((num1 > num2) ? num1 : num2) << endl;
    } else {
        cout << "The numbers are equal." << endl;
    }

    return 0;
}