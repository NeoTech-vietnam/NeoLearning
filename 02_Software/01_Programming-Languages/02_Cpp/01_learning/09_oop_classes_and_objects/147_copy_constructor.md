# Cornell Notes

## Topic: Copy Constructor

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Copy Constructor
- When objects are copied C++ must create a new object from an existing object
- When is a copy of an object made?
  - passing object by value as a parameter
  - returning an object from a function by value
  - constructing one object based on another of the same class
- C++ must have a way of accomplishing this so it provides a compiler-deﬁned copy constructor if you don’t

#### Pass object by-value
```cpp
Player hero {"Hero", 100, 20};
void display_player(Player p) {
    // p is a COPY of hero in this example
    // use p
    // Destructor for p will be called
}
display_player(hero);
```

#### Return object by value
```cpp
    Player enemy;
    Player create_super_enemy() {
    Player an_enemy{"Super Enemy", 1000, 1000};
    return an_enemy; // A COPY of an_enemy is returned
}
enemy = create_super_enemy();
```

#### Construct one object based on another
```cpp
Player hero {"Hero", 100, 100};
Player another_hero {hero}; // A COPY of hero is made
```
- If you don’t provide your own way of copying objects by value then the compiler provides a default way of copying objects
- Copies the values of each data member to the new object
  - default memberwise copy
- Perfectly ﬁne in many cases
- Beware if you have a pointer data member
  - Pointer will be copied
  - Not what it is pointing to

#### Best practices
- Provide a copy constructor when your class has raw pointer members
- Provide the copy constructor with a const reference parameter
- Use STL classes as they already provide copy constructors
- Avoid using raw pointer data members if possible

#### Declaring the Copy Constructor
```cpp
Type::Type(const Type &source);
Player::Player(const Player &source);
Account::Account(const Account &source);
```
#### Implementing the Copy Constructor
```cpp
Type::Type(const Type &source) {
// code or initialization list to copy the object
}
```
```cpp
//Player
Player::Player(const Player &source)
: name{source.name},
  health {source.health},
  xp {source.xp} {
}
```
```cpp
// Account
Account::Account(const Account &source)
: name{source.name},
  balance {source.balance} {
}
```
- In an initializer list, these forms are valid:
  - `()`:
    - traditional constructor-style initialization
    - prevents narrowing conversions
  - `{}`:
    - uniform (brace) initialization (C++11+)
    - Allow narrowing conversions
    - Can be used to call delegating constructors
  - `Player {source.name, source.health, source.xp}` is also valid and is an example of a delegating constructor


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]