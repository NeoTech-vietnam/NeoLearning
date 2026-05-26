# Cornell Notes

## Topic: Delegating Constructors

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Delegating Constructors
- Often the code for constructors is very similar
- Duplicated code can lead to errors
- C++ allows delegating constructors
  - code for one constructor can call another in the initialization list
  - avoids duplicating code

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
- Old way of implementing constructors would be:
```cpp
Player::Player()
: name{"None"}, health{0}, xp{0} {
}
Player::Player(std::string name_val)
    : name{name_val}, health{0}, xp{0} {
}
Player::Player(std::string name_val, int health_val, int
xp_val)
    : name{name_val}, health{health_val}, xp{xp_val} {
}
```
- By using delegating constructors, we can avoid code duplication:
```cpp
Player::Player(std::string name_val, int health_val, int xp_val)
    : name{name_val}, health{health_val}, xp{xp_val} {
}
Player::Player()
    : Player {"None", 0, 0} {
}
Player::Player(std::string name_val)
    : Player { name_val, 0, 0} {
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]