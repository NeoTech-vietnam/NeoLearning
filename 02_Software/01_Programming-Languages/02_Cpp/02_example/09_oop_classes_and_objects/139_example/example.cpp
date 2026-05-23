#include <iostream>
#include <string>

using namespace std;

class Player {
private:
    // Attributes
    string name;
    int health;
    int xp;
public:
    // Methods
    void talk(string text_to_say) {cout << name << " says: " << text_to_say << endl;}
    bool is_dead();
};

int main(void){
    Player frank;
    frank.name = "Frank"; // Compiler error
    cout << frank.health << endl; // Compiler error

    return 0;
}