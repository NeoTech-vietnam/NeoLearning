#include <iostream>
#include <vector>

using namespace std;

int main(void){

    // for(int i {1}; i <= 10; ++i) // would be the same for i++ as there is no other expression in the loop
    //     cout << i << endl;

    // for(int i {1}; i <= 10; i+=2)
    //     cout << i << endl;

    // for(int i {10}; i >= 1; --i)
    //     cout << i << endl;
    // cout << "Blastoff!" << endl;

    // for(int i {10}; i <=100; i+= 10){
    //     if(i % 15 == 0)
    //         cout << i << " is divisible by 15" << endl;
    // }

    //Comma operator
    // for(int i {1}, j {10}; i <= 10; ++i, j++)
    //     cout << i << " + " << j << " = " << i + j << endl;

    // for(int i {1}; i<= 100; ++i){
    //     cout << i;
    //     cout << ((i % 10 == 0) ? "\n" : " ");
    // }

    vector<int> nums {10, 20, 30, 40, 50};
    for(unsigned i {0}; i < nums.size(); ++i) //unsigned is a shorthand for unsigned int, which is a type that can only represent non-negative integers. It is often used for loop counters and array indices, as they cannot be negative.  
        cout << nums.at(i) << endl;

    return 0;
}