/*
Write a C++ program as follows:

- Declare 2 empty vectors of integers named vector1 and vector2.
- Add 10 and 20 to vector1 using push_back.
- Display the elements in vector1 using the at() method as well as its size using the size() method.

- Add 100 and 200 to vector2 using push_back.
- Display the elements in vector2 using the at() method as well as its size using the size() method.

- Declare an empty 2D vector (i.e. a vector of vectors) named vector_2d.
- Remember that a 2D vector is a vector of vector<int> objects.

- Add vector1 to vector_2d using push_back.
- Add vector2 to vector_2d again using push_back.

- Display the elements in vector_2d using the at() method.
- Change vector1.at(0) to 1000.

- Display the elements in vector_2d again using the at() method.
- Display the elements in vector1.

*/

#include <iostream>
#include <vector>

using namespace std;

int main (void)
{
    
    // Declare 2 empty vectors of integers named
    // vector1 and vector2.
    vector <int> vector1;
    vector <int> vector2;

    // Add 10 and 20 to vector1 dynamically using push_back
    vector1.push_back (10);
    vector1.push_back (20);

    // Display the elements in vector1 using the at() method as well as its size using the size() method

    cout << "\nvector1: " << endl;
    cout << vector1.at(0) << endl;
    cout << vector1.at(1) << endl;
    cout << "vector1 contains: " << vector1.size() << " elements" << endl;

    // Add 100 and 200 to vector2 dynamically using push_back
    vector2.push_back (100);
    vector2.push_back (200);

    cout << "\nvector2: " << endl;
    cout << vector2.at(0) << endl;
    cout << vector2.at(1) << endl;
    cout << "vector2 contains: " << vector2.size() << " elements" << endl;

    // Declare an empty 2D vector called vector_2d
    // Remember, that a 2D vector is a vector of vector<int>
    vector <vector <int>> vector_2d;

    //Add vector1 to vector_2d using push_back
    //Add vector2 to vector_2d using push_back
    vector_2d.push_back(vector1);
    vector_2d.push_back(vector2);

    // Display the elements in vector_2d using the at() method
    cout << "\nvector_2d: " << endl;
    cout << vector_2d.at(0).at(0) << " " << vector_2d.at(0).at(1) << endl;
    cout << vector_2d.at(1).at(0) << " " << vector_2d.at(1).at(1) << endl;

    // change vector1.at(0) to 1000
    vector1.at(0) = 1000;

    // Display the elements in vector_2d again using the at() method
    cout << "\nvector_2d: " << endl;
    cout << vector_2d.at(0).at(0) << " " << vector_2d.at(0).at(1) << endl;
    cout << vector_2d.at(1).at(0) << " " << vector_2d.at(1).at(1) << endl;

    // Display the elements in vector1
    cout << "\nvector1: " << endl;
    cout << vector1.at(0) << endl;
    cout << vector1.at(1) << endl;
    cout << "vector1 contains: " << vector1.size() << " elements" << endl;

    return 0;
}