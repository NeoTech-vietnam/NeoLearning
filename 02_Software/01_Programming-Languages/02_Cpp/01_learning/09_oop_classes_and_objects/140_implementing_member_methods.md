# Cornell Notes

## Topic: Implementing Member Methods

## Date: 08/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Implementing Member Methods
- Very similar to how we implemented functions
- Member methods have access to member attributes
  - So you don’t need to pass them as arguments!
- Can be implemented inside the class declaration
  - Implicitly inline
- Can be implemented outside the class declaration
  - Need to use `Class_name::method_name`
- Can separate speciﬁcation from implementation
  - .h ﬁle for the class declaration
  - .cpp ﬁle for the class implementation

#### Inside the class declaration
```cpp
class Account {
private:
    double balance;
public:
    void set_balance(double bal) {
        balance = bal;
    }
    double get_balance() {
        return balance;
    }
};
```

#### Outside the class declaration
```cpp
class Account {
private:
    double balance;
public:
    void set_balance(double bal);
    double get_balance();
};
void Account::set_balance(double bal) {
balance = bal;
}
double Account::get_balance() {
    return balance;
}
```

#### Separating Speciﬁcation from Implementation
```cpp
// Account.h
class Account {
private:
    double balance;
public:
    void set_balance(double bal);
    double get_balance();
};
```
- Include Guards
```cpp
#ifndef _ACCOUNT_H_
#define _ACCOUNT_H_
// Account class declaration
#endif
```
```cpp
// Account.h - #pragma once
#pragma once
class Account {
private:
    double balance;
public:
    void set_balance(double bal);
    double get_balance();
};
```
```cpp
// Account.cpp
#include "Account.h"
void Account::set_balance(double bal) {
    balance = bal;
}
double Account::get_balance() {
    return balance;
}
```
```cpp
// main.cpp
#include <iostream>
#include "Account.h"
int main() {
    Account frank_account;
    frank_account.set_balance(1000.00);
    double bal = frank_account.get_balance();
    std::cout << bal << std::endl; // 1000
return 0;
}
```



---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]