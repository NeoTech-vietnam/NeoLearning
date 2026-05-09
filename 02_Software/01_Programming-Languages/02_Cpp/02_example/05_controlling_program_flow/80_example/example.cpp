/*
Switch statement

Ask the user what grade they expect on an exam and
tell them what they need to score to get it.

*/


#include <iostream>

using namespace std;

int main (void){
    
    char letter_grade {};
    cout << "Enter the letter grade you expect on the exam: ";
    cin >> letter_grade;

    switch (letter_grade){
        case 'A':
        case 'a':
            cout << "You need to score between 90 and 100." << endl;
            break;
        case 'B':
        case 'b':
            cout << "You need to score between 80 and 89." << endl;
            break;
        case 'C':
        case 'c':
            cout << "You need to score between 70 and 79." << endl;
            break;
        case 'D':
        case 'd':
            cout << "You need to score between 60 and 69." << endl;
            break;
        case 'F':
        case 'f':
        {
            char confirm {};
            cout << "Are you sure (Y/N)?";
            cin >> confirm;
            if (confirm == 'Y' || confirm == 'y')
                cout << "Ok, I guess you didn't study at all." << endl;
            else if (confirm == 'N' || confirm == 'n')
                cout << "Good, go study!" << endl;
            else
                cout << "Invalid input." << endl;
            break;
        }
        default:
            cout << "Invalid letter grade." << endl;
    }

    cout << endl;
    return 0;
}