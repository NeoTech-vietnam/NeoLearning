# Cornell Notes

## Topic: Static Class Members

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Static Class Members
- Class data members can be declared as static
  - A single data member that belongs to the class, not the objects
  - Useful to store class-wide information
- Class functions can be declared as static
  - Independent of any objects
  - Can be called using the class name

#### Player class -static members
```cpp
class Player {
private:
    static int num_players;
public:
    static int get_num_players();
    . . .
};
```

#### Player class – initialize the static data
- Typically in Player.cpp
```cpp
#include "Player.h"
int Player::num_players = 0;
```

#### Player class – implement static method
```cpp
int Player::get_num_players() {
    return num_players;
}
```

#### Player class –update the constructor
```cpp
Player::Player(std::string name_val, int health_val,
int xp_val)
    : name{name_val}, health{health_val}, xp{xp_val} {
        ++num_players;
}
```

#### Player class - Destructor
```cpp
Player::~Player() {
    --num_players;
}
```
- main.cpp:
```cpp
void display_active_players() {
    cout << "Active players: "
        << Player::get_num_players() << endl;
}
int main() {
    display_active_players();
    Player obj1 {"Frank"};
    display_active_players();
    . . .
}
```


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]