# Cornell Notes

## Topic: Deriving Classes from Existing Classes

## Date: 03/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### C++ derivation syntax

```cpp
class Base {
    // Base class members . . .
};
class Derived: access-specifier Base {
    // Derived class members . . .
};
```
- Access-speciﬁer can be: `public`, `private`, or `protected`

#### Types of inheritance in C++

- `public`
  - Most common
  - Establishes ‘is-a’ relationship between Derived and Base classes
- `private` and `protected`
  - Establishes “derived class has a base class” relationship
  - “Is implemented in terms of” relationship
  - Diﬀerent from composition

#### C++ derivation syntax

```cpp
class Account {
    // Account class members . . .
};
class Savings_Account: public Account {
    // Savings_Account class members . . .
};
```
- Savings_Account `is-a` Account

#### C++ creating objects

```cpp
Account account {};
Account *p_account = new Account();
account.deposit(1000.0);
p_account->withdraw(200.0);
delete p_account;
```
```cpp
Savings_Account sav_account {};
Savings_Account *p_sav_account = new Savings_Account();
sav_account.deposit(1000.0);
p_sav_account->withdraw(200.0);
delete p_sav_account;
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]