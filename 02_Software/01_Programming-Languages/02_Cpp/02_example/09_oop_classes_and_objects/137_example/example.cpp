#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Player {
    // Attributes
    string name {"Player"};
    int health {100};
    int xp {3};
    // Methods
    void talk(string);
    bool is_dead();
};

class Account {
    // Attributes
    string name {"Account"};
    double balance {0.0};
    // Methods
    bool deposit(double);
    bool withdraw(double);
};


int main(void){

    Account frank_account;
    Account jim_account;

    Player frank;
    Player hero;

    Player *enemy {nullptr};
    enemy = new Player;

    delete enemy;

    Player players[] {frank, hero};

    vector<Player> player_vec{frank};
    player_vec.push_back(hero);


    enemy = nullptr;

    return 0;
}