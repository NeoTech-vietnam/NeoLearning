# Cornell Notes

## Topic: Declaring a Class and Creating Objects

## Date: 08/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Declaring a Class
```cpp
class Class_Name
{
// declaration(s);
};
```
#### `Player` Class
```cpp
class Player
{
    // attributes
    std::string name;
    int health;
    int xp;
    // methods
    void talk(std::string text_to_say);
    bool is_dead();
};
```
- Creating Objects
```cpp
Player frank;
Player hero;
Player *enemy = new Player();
delete enemy;
```
#### `Account` Class
```cpp
class Account {
    //Attributes
    std::string name;
    double balance;
    // Methods
    bool withdraw(double amount);
    bool deposit(double amount);
};
```
- Creating objects
```cpp
Account frank_account;
Account jim_account;
Account accounts[] {frank_account, jim_account};
std::vector<Account> accounts1 {frank_account};
accounts1.push_back(jim_account);
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]