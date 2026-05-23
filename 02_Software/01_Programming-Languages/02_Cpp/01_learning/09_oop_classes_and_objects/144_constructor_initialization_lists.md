# Cornell Notes

## Topic: Constructor Initialization lists

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Constructor Initialization Lists
- So far, all data member values have been set in the constructor body
- Constructor initialization lists
  - are more eﬃcient
  - initialization list immediately follows the parameter list
  - initializes the data members as the object is created!
  - order of initialization is the order of declaration in the class
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
    // Overloaded Constructors
    Player();
    Player(std::string name_val);
    Player(std::string name_val, int health_val, int xp_val);
};
```
- `Player()`
```cpp
// Previous way:
Player::Player() {
    name = "None";  // assignment not initialization
    health = 0;
    xp = 0;
}

// Better way:
Player::Player()
    : name{"None"}, health{0}, xp{0} {
}
```
- `Player(std::string)`
```cpp
// Previous way:
Player::Player(std::string name_val) {
    name = name_val; // assignment not initialization
    health = 0;
    xp = 0;
}
// Better way:
Player::Player(std::string name_val)
    : name{name_val}, health{0}, xp{0} {
}
```
- `Player(std::string, int, int)`
```cpp
// Previous way:
Player::Player(std::string name_val, int health_val, int xp_val) {
    name = name_val; // assignment not initialization
    health = health_val;
    xp = xp_val;
}
// Better way:
Player::Player(std::string name_val, int health_val, int xp_val)
    : name{name_val}, health{health_val}, xp{xp_val} {
}
```
- Result:
```cpp
Player::Player()
    : name{"None"}, health{0}, xp{0} {
}
Player::Player(std::string name_val)
    : name{name_val}, health{0}, xp{0} {
}
Player::Player(std::string name_val, int health_val, int xp_val)
    : name{name_val}, health{health_val}, xp{xp_val} {
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]