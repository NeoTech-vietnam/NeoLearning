#include <iostream>
using namespace std;

int main(void) {
  int num{};
  const int min{10};
  const int max{100};

  cout << "Enter a number between " << min << " and " << max << ": ";
  cin >> num;

  if (num >= min) {
    cout << "\n===If statement 1===" << endl;
    cout << num << " is greater than or equal to " << min << endl;

    int diff{num - min};
    cout << num << " is " << diff << " greater than " << min << endl;
  }

  if (num <= max) {
    cout << "\n===If statement 2===" << endl;
    cout << num << " is less than or equal to " << max << endl;

    int diff {max - num};
    cout << num << " is " << diff << " less than " << max << endl;

  }

  if (num >= min && num <= max) {
    cout << "\n===If statement 3===" << endl;
    cout << num << " is in range " << max << endl;
    cout << " This means statement 1 and statement 2 are both true" << endl;
  }

  if(num == min || num == max) {
    cout << "\n===If statement 4===" << endl;
    cout << num << " is on the boundary" << endl;
  }

  return 0;
}