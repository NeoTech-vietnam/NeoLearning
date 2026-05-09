// Section 9
// Switch with enumeration

#include <iostream>

using namespace std;

int main(void){

    enum Direction {
        left,
        right,
        up,
        down
    };

    Direction heading {left};

    switch (heading){
        case left:
            cout << "Heading left" << endl;
            break;
        case right:
            cout << "Heading right" << endl;
            break;
        case up:
            cout << "Heading up" << endl;
            break;
        case down:
            cout << "Heading down" << endl;
            break;
        default:
            cout << "Invalid heading" << endl;
            break;
    }

    return 0;
}