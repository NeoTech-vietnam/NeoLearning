// Section 9
/*
    Shipping cost calculator

    Ask the user for package dimension in inches
    length, width, height - these should be integers

    All dimensions must be 10 inches or less or we cannot ship it.

    Base cose is $2.50
    If package volume is greater than 100 cubic inches, there is a 10% surcharge.
    IF package volume is greater than 500 cubic inches, there is a 25% surcharge.

*/


#include <iostream>
using namespace std;

int main (void){

    int length {}, width {}, height {};
    double base_cost {2.50};
    const int tier1_threshold {100}; // volume
    const int tier2_threshold {500}; // volume

    int max_dimension_length {10}; // inches

    double tier1_surcharge {0.10}; // 10%
    double tier2_surcharge {0.25}; // 25%

    // All dimension must be 10 inches or less

    int package_volume {};

    cout << "Welcome to the package cost calculator" << endl;
    cout << "Enter length, width, and height of the package separated by spaces: ";
    cin >> length >> width >> height;

    if(length > max_dimension_length || width > max_dimension_length || height > max_dimension_length) {
        cout << "Sorry, we cannot ship this package" << endl;
    } else {
        package_volume = length * width * height;
        double total_cost {base_cost};

        if(package_volume > tier2_threshold) {
            total_cost += base_cost * tier2_surcharge;
        } else if (package_volume > tier1_threshold) {
            total_cost += base_cost * tier1_surcharge;
        }

        cout << "The volume of your package is: " << package_volume << " cubic inches" << endl;
        cout << "The total cost for shipping your package is: $" << total_cost << endl;
    }

    return 0;
}