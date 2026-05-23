// Section 13
// Static Class Members

#include <iostream>
#include "Player.h"
using namespace std;

void display_active_players(){
    cout << "Active players: " << Player::get_num_players() << endl;
}

int main (void){

    display_active_players();

    Player hero {"Hero"};
    display_active_players();
    {
        Player frank {"Frank"};
        display_active_players();
    }
    display_active_players();

    Player *enemy = new Player("Enemy", 100, 15);

    display_active_players();
    delete enemy;
    display_active_players();

    return 0;
}