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

##### Player Constructors
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

##### Account Constructors
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
- The destructor is just the last method the class runs to honor its contract: "I acquired resources, I will release them." Whether that's delete, closing a file, releasing a mutex, or anything else — it's always the class cleaning up after itself.
- Common real-world uses beyond memory:
  - Close a file — fclose(file)
  - Release a mutex/lock — mutex.unlock()
  - Close a network socket — close(socket_fd)
  - Log/debug output — like your cout << "Destructor called for " << name in this example
  - Decrement a reference counter
  - Notify other systems the object is gone
##### Player Destructor
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

##### Account Destructor
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

##### How Destructors Are Called
- Automatically when an object goes out of scope
```cpp
{
    Shallow obj {100};
} // ~Shallow() called automatically here
```
- Function parameter passed by value
```cpp
void display_shallow(Shallow s) {  // s is a copy
    cout << s.get_data_value();
} // ~Shallow() called on s when function returns
```
- `delete` on a heap-allocated object
```cpp
Shallow *obj = new Shallow{100};
delete obj;  // ~Shallow() called explicitly here
```
- End of `main()`
```cpp
int main() {
    Shallow obj1 {100};
    Shallow obj2 {obj1};
    return 0;  // ~Shallow() called on obj2, then obj1 (reverse order)
}
```
- Explicit call (rare, almost never used)
```cpp
obj.~Shallow();  // valid but dangerous — avoid this
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