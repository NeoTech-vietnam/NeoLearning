# Cornell Notes

## Topic: The Default Constructor

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### The Default Constructor
- Does not expect any arguments
  - Also called the no-args constructor
- If you write no constructors at all for a class
  - C++ will generate a Default Constructor that does nothing
- Called when you instantiate a new object with no arguments
```cpp
Player frank;
Player *enemy = new Player;
```

#### Declaring a Class
##### Account – using default constructor
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    bool withdraw(double amount);
    bool deposit(double amount);
};
```
- Creating objects
```cpp
Account frank_account;
Account jim_account;
Account *mary_account = new Account;
delete mary_account;
```
##### Account – user-deﬁned no-args constructor
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    Account() {
        name = "None";
        balance = 0.0;
    }
    bool withdraw(double amount);
    bool deposit(double amount);
};
```
##### Account – no default constructor
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    Account(std::string name_val, double bal) {
        name = name_val;
        balance = bal;
    }
    bool withdraw(double amount);
    bool deposit(double amount);
};
```
- Creating objects
  - Using the default constructor

```cpp
Account frank_account; // Error
Account jim_account; // Error

Account *mary_account = new Account; // Error
delete mary_account;
Account bill_account {"Bill", 15000.0}; // OK
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]