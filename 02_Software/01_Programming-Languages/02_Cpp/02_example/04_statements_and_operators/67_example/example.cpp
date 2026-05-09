#include <iostream>

using namespace std;

int main (void)
{
    int counter {10};
    int result {0};

    // Example 1 - simple increment
    cout << "Example 1 - simple increment" << endl;
    cout << "Counter: " << counter << endl;

    counter = counter + 1;
    cout << "Counter: " << counter << endl;

    counter++;
    cout << "Counter: " << counter << endl;

    ++counter;
    cout << "Counter: " << counter << endl;

    //Example 2 - preincrement
    cout << "=================================" << endl;
    cout << "Example 2 - preincrement" << endl;
    counter = 10;
    result = 0;

    cout << "Counter: " << counter << endl;
    result = ++counter; // Note the preincrement operator is used here
    cout << "Counter: " << counter << endl;
    cout << "Result: " << result << endl;

    //Example 3 - postincrement
    cout << "=================================" << endl;
    cout << "Example 3 - postincrement" << endl;
    counter = 10;
    result = 0;

    cout << "Counter: " << counter << endl;
    result = counter++; // Note the postincrement operator is used here
    cout << "Counter: " << counter << endl;
    cout << "Result: " << result << endl;

    //Example 4
    cout << "=================================" << endl;
    cout << "Example 4 " << endl;
    counter = 10;
    result = 0;
    cout << "Counter:" << counter << endl;

    result = ++counter + 10; // Note the preincrement operator is used here
    cout << "Counter: " << counter << endl;
    cout << "Result: " << result << endl;

    //Example 5
    cout << "=================================" << endl;
    cout << "Example 5 " << endl;
    counter = 10;
    result = 0;
    cout << "Counter:" << counter << endl;

    result = counter++ + 10; // Note the preincrement operator is used here
    cout << "Counter: " << counter << endl;
    cout << "Result: " << result << endl;

    return 0;
}