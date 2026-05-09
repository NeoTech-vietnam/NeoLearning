#include <iostream>

using namespace std;

int main (void)
{
    const double usd_per_eur {1.19};

    cout << "Welcome to the currency converter" << endl;
    cout << "Enter the amount in EUR you want to convert to USD: ";
    double amount_eur {0.0};
    double amount_usd {0.0};
    cin >> amount_eur;

    amount_usd = amount_eur * usd_per_eur;
    cout << amount_eur << " EUR is " << amount_usd << " USD" << endl;

    return 0;
}