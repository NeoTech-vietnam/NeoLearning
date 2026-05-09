#include <iostream>

using namespace std;

int main (void)
{
    /* Character type */
    char middle_initial{ 'J' };
    cout << "My initial character is " << middle_initial << endl;

    /* Integer Type */
    unsigned short int exam_score{ 55 }; // same as unsigned short exam_score {55};
    cout << "My exam score was " << exam_score << endl;

    int countries_represented{ 65 };
    cout << "There were " << countries_represented << " countries represented in my meeting" << endl;

    long people_in_vietnam{ 20610000 };
    cout << "There are about " << people_in_vietnam << " people in Vietnam" << endl;


    long long people_on_earth = 7'600'000'000;
    cout << "There are about " << people_on_earth << " people on earth" << endl;

    long long distance_to_alpha_centauri{ 9'461'000'000'000 };
    cout << "Tyhe distance to alpha centauri is " << distance_to_alpha_centauri << " kilometers" << endl;

    /* Floating point types */

    float car_payment{ 401.23 };
    cout << "My car payment is " << car_payment << endl;

    double pi{ 3.14159 };
    cout << "PI is " << pi << endl;

    long double large_amount{ 2.7e120 };
    cout << large_amount << " is a very big number" << endl;

    /* Boolean type */
    bool gameOver{ false };
    cout << "The value of gameOver is " << gameOver << endl;

    /* Overflow example */
    short value1{ 30000 };
    short value2{ 1000 };
    short sum{ value1 * value2 };

    cout << "The sum of " << value1 << " and " << value2 << " is " << sum << endl; // warning: narrowing conversion of ‘(((int)value1) * ((int)value2))’ from ‘int’ to ‘short int’ [-Wnarrowing]
    return 0;
}