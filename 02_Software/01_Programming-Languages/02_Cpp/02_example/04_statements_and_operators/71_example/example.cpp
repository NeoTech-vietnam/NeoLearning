#include <iostream>

using namespace std;

int main(void)
{
    // int num {};

    // const int lower {10};
    // const int upper {100};

    cout << boolalpha; // print bool values as true or false

    //Determine if an entered integer is between two other integers
    // Assume lower < upper

    // cout << "Enter an integer - the bound are " << lower << " and " << upper << ": ";
    // cin >> num;

    // bool within_bounds {false};

    // within_bounds = (num > lower && num < upper);

    // cout << num << " is between " << lower << " and " << upper << ": " << within_bounds << endl;

    // Determine if an entered integer is outside two other integers
    // Assume lower < upper
    // cout << num << " is outside " << lower << " and " << upper << ": " << (num < lower || num > upper) << endl;

    // Determine if an entered integer is exactly on the boundary
    // Assume lower < upper
    // cout << "\nEnter an integer - the bounds are " << lower << " and " << upper << ": ";
    // cin >> num;

    // bool outside_bounds {false};
    // outside_bounds = (num < lower || num > upper);

    // cout << num << " is outside " << lower << " and " << upper << ": " << outside_bounds << endl;

    // // Determine if an entered integer is exactly on the boundary
    // // Assume lower < upper
    // cout << "\nEnter an integer - the bounds are " << lower << " and " << upper << ": ";
    // cin >> num;

    // bool on_bounds {false};
    // on_bounds = (num == lower || num == upper);
    // cout << num << " is on one of the bounds which are " << lower << " and " << upper << ": " << on_bounds << endl; 


    // Determine that you need to wear a coat based on the temperature and wind speed
    bool wear_coat {false};
    double temperature {};
    int wind_speed {};

    const int wind_speed_for_coat {25}; // Wind over this value requires a coat
    const double temperature_for_coat {45.0}; // Temperature below this value requires a coat

    // Require a coat if either wind is too high OR temperature is too low
    cout << "\nEnter the current temperature in Fahrenheit: ";
    cin >> temperature;
    cout << "Enter the current wind speed in miles per hour: ";
    cin >> wind_speed;

    wear_coat = (temperature < temperature_for_coat || wind_speed > wind_speed_for_coat);
    cout << "Do you need to wear a coat using OR? " << wear_coat << endl;

    // Requre a coat if BOTH the wind is too high AND the temperature is too low
    wear_coat = (temperature < temperature_for_coat && wind_speed > wind_speed_for_coat);
    cout << "Do you need to wear a coat using AND? " << wear_coat << endl;

    cout << "\nDone!" << endl;

    return 0;
}