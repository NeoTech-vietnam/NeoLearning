# Cornell Notes

## Topic: Virtual Functions

## Date: 07/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Virtual functions

- Redeﬁned functions are bound statically
- Overridden functions are bound dynamically
- Virtual functions are overridden
- Allow us to treat all objects generally as objects of the Base class

#### Declaring virtual functions

- Declare the function you want to override as virtual in the Base class
- Virtual functions are virtual all the way down the hierarchy from this point
- Dynamic polymorphism only via Account class pointer or reference

```cpp
class Account {
public:
    virtual void withdraw(double amount);
    . . .
};
```
- Override the function in the Derived classes
- Function signature and return type must match EXACTLY
- Virtual keyword not required but is best practice
- If you don’t provide an overridden version it is inherited from it’s base class

```cpp
class Checking : public Account {
public:
    virtual void withdraw(double amount);
    . . .
};
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]