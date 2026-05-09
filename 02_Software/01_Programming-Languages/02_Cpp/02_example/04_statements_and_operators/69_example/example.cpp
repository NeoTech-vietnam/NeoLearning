#include <iostream>

using namespace std;

int main(void)
{
    bool equal_result {false};
    bool not_equal_result {false};

    int num1{}, num2{};

    cout << boolalpha; // display bool values as true or false instead of 1 or 0

    cout << "Enter 2 integers separated by a space: ";
    cin >> num1 >> num2;
    equal_result = (num1 == num2);
    not_equal_result = (num1 != num2);
    cout << "Comparison result (==): " << equal_result << endl;
    cout << "Comparison result (!=): " << not_equal_result << endl;


    char char1{}, char2{};
    cout << "Enter 2 characters separated by a space: ";
    cin >> char1 >> char2;
    equal_result = (char1 == char2);
    not_equal_result = (char1 != char2);
    cout << "Comparison result (==): " << equal_result << endl;
    cout << "Comparison result (!=): " << not_equal_result << endl;


    /*
    - Note: Comparing floating-point numbers can be tricky due to precision issues.
    - It's often better to check if the absolute difference between the numbers is within a small tolerance rather than checking for direct equality.
    - For example: 12.0 could be equal to 11.99999999999999 due to precision limitations, so a direct comparison might yield false even though they are effectively equal.
    */
    double double1{}, double2{};
    cout << "Enter 2 doubles separated by a space: ";
    cin >> double1 >> double2;
    equal_result = (double1 == double2);
    not_equal_result = (double1 != double2);
    cout << "Comparison result (==): " << equal_result << endl;
    cout << "Comparison result (!=): " << not_equal_result << endl;

    return 0;
}