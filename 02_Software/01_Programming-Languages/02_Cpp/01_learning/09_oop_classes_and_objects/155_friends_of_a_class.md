# Cornell Notes

## Topic: Friends of a class

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a friend of a class?
- How is friendship granted?
- Is friendship symmetric or transitive?
- Why should friendship be minimized?

---

### Notes Section (Main Notes)

#### Friends of a class
- Friend
  - A function or class that has access to private class member
  - And, that function of or class is NOT a member of the class it is accessing
- Function
  - Can be regular non-member functions
  - Can be member methods of another class
- Class
  - Another class can have access to private class members
- Friendship must be granted NOT taken
  - Declared explicitly in the class that is granting friendship
  - Declared in the function prototype with the keyword friend
- Friendship is not symmetric
  - Must be explicitly granted
    - if A is a friend of B
    - B is NOT a friend of A
- Friendship is not transitive
  - Must be explicitly granted
    - if A is a friend of B AND
    - B is a friend of C
    - then A is NOT a friend of C

#### non-member function
```cpp
class Player {
    friend void display_player(Player &p);
    std::string name;
    int health;
    int xp;
public:
    . . .
};
```
```cpp
void display_player(Player &p) {
    std::cout << p.name << std::endl;
    std::cout << p.health << std::endl;
    std::cout << p.xp << std::endl;
}
```
- `display_player` may also change private data members

#### member function of another class
```cpp
class Player {
    friend void Other_class::display_player(Player &p);
    std::string name;
    int health;
    int xp;
public:
    . . .
};
```
```cpp
class Other_class {
    . . .
public:
    void display_player(Player &p) {
        std::cout << p.name << std::endl;
        std::cout << p.health << std::endl;
        std::cout << p.xp << std::endl;
    }
};
```

#### Another class as a friend
```cpp
class Player {
    friend class Other_class;
    std::string name;
    int health;
    int xp;
public:
    . . .
};
```

---

### Summary Section (Summary of Notes)

- A friend of a class is a function or class that has access to private class members but is not a member of the class it is accessing. Friendship must be granted explicitly and is not symmetric or transitive. Non-member functions, member functions of another class, and entire classes can be declared as friends to access private members.
- friendship should be minimized as it breaks encapsulation and can lead to maintenance issues. It should be used judiciously when there is a clear need for access to private members that cannot be achieved through public interfaces.