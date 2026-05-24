# Cornell Notes

## Topic: Overloading Constructors

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Overloading Constructors
- Classes can have as many constructors as necessary
- Each must have a unique signature
- Default constructor is no longer compiler-generated once another constructor is declared

#### Constructors and Destructors
##### Overloaded Constructors
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
```cpp
Player::Player() {
    name = "None";
    health = 0;
    xp = 0;
}
Player::Player(std::string name_val) {
    name = name_val;
    health = 0;
    xp = 0;
}
```
```cpp
Player::Player(std::string name_val, int health_val, int
xp_val) {
    name = name_val;
    health = health_val;
    xp = xp_val;
}
```
- Creating objects
```cpp
Player empty; // None, 0, 0

Player hero {"Hero"}; // Hero, 0, 0
Player villain {"Villain"}; // Villain, 0, 0

Player frank {"Frank", 100, 4}; // Frank, 100, 4
Player *enemy = new Player("Enemy", 1000, 0); // Enemy, 1000, 0
delete enemy;
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]