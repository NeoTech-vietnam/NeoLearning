# Cornell Notes

## Topic: Redefining Base Class Methods

## Date: 05/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Using and redeﬁning Base class methods

- Derived class can directly invoke Base class methods
- Derived class can override or redeﬁne Base class methods
- Very powerful in the context of polymorphism (next section)

```cpp
class Account {
public:
    void deposit(double amount) { balance += amount; }
};
class Savings_Account: public Account {
public:
    void deposit(double amount) { // Redefine Base class method
    amount += some_interest;
    Account::deposit(amount); // invoke call Base class method
    }
};
```

#### Static binding of method calls
- Binding of which method to use is done at compile time
  - Default binding for C++ is static
  - Derived class objects will use Derived::deposit
  - But, we can explicitly invoke Base::deposit from Derived::deposit
  - OK, but limited – much more powerful approach is dynamic binding which we will see in the next section

```cpp
Base b;
b.deposit(1000.0);  // Base::deposit

Derived d;
d.deposit(1000.0); // Derived::deposit

Base *ptr = new Derived();
ptr->deposit(1000.0); // Base::deposit ????
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]