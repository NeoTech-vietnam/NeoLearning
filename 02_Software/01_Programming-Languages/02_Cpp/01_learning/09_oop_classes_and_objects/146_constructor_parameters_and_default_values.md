# Cornell Notes

## Topic: Constructor Parameters and Default Values

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Default Constructor Parameters
- Can often simplify our code and reduce the number of overloaded constructors
- Same rules apply as we learned with non-member functions
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
// Constructor with default parameter values
Player(std::string name_val = "None",
    int health_val = 0,
    int xp_val = 0);
};
```
- By providing default values for the parameters, we can create objects with varying levels of detail without needing multiple overloaded constructors
```cpp
Player::Player(std::string name_val, int health_val, int
xp_val)
    : name {name_val}, health {health_val}, xp {xp_val} {
}
Player empty;   // None, 0, 0
Player frank {"Frank"}; // Frank, 0, 0

Player villain {"Villain", 100, 55}; // Villain, 100, 55
Player hero {"Hero", 100};  // Hero, 100, 0

// Note what happens if you declare a no-args constructor
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]