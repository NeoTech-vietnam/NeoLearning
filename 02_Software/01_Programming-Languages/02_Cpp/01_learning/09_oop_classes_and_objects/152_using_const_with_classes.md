# Cornell Notes

## Topic: Using `const` with Classes

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Using const with classes
- Pass arguments to class member methods as const
- We can also create const objects
- What happens if we call member functions on const objects?
- `const-`correctness

#### Creating a const object
- villain is a const object so it’s attributes cannot change 
```cpp
const Player villain {"Villain", 100, 55};
```
- What happens when we call member methods on a const object?
```cpp
const Player villain {"Villain", 100, 55};
villain.set_name("Nice guy"); // ERROR
std::cout << villain.get_name() << std::endl; // ERROR
```
```cpp
const Player villain {"Villain", 100, 55};
void display_player_name(const Player &p) {
    cout << p.get_name() << endl;
}
display_player_name(villain); // ERROR
```
- `const` methods
```cpp
class Player {
private:
. . .
public:
    std::string get_name() const;
. . .
};
```
- `const-`correctness
```cpp
const Player villain {"Villain", 100, 55};
villain.set_name("Nice guy"); // ERROR
std::cout << villain.get_name() << std::endl; // OK
```
```cpp
class Player {
private:
    . . .
public:
    std::string get_name() const;
    // ERROR if code in get_name modifies this object
    . . .
};
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]