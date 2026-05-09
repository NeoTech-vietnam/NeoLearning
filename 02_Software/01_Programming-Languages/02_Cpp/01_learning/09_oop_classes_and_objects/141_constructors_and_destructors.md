# Cornell Notes

## Topic: Constructors And Destructors

## Date: 08/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a constructor?
- What is a destructor?
- How are constructors and destructors used in C++?

---

### Notes Section (Main Notes)

#### Constructors
- Special member method
- Invoked during object creation
- Useful for initialization
- Same name as the class
- No return type is speciﬁed
- Can be overloaded

#### Player Constructors
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
    Player(std::string name);
    Player(std::string name, int health, int xp);
};
```

#### Account Constructors
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    // Constructors
    Account();
    Account(std::string name, double balance);
    Account(std::string name);
    Account(double balance);
};
```

#### Destructors
- Special member method
- Same name as the class proceeded with a tilde (~)
- Invoked automatically when an object is destroyed
- No return type and no parameters
- Only 1 destructor is allowed per class – cannot be overloaded!
- Useful to release memory and other resources

#### Player Destructor
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
    Player();
    Player(std::string name);
    Player(std::string name, int health, int xp);
    // Destructor
    ~Player();
};
```

#### Account Destructor
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    Account();
    Account(std::string name, double balance);
    Account(std::string name);
    Account(double balance);
    // Destructor
    ~Account();
};
```

#### Creating objects
```cpp
{
    Player slayer;
    Player frank {"Frank", 100, 4 };
    Player hero {"Hero"};
    Player villain {"Villain"};
    // use the objects
}   // 4 destructors called
    
Player *enemy = new Player("Enemy", 1000, 0);
delete enemy; // destructor called
```


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]