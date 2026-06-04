# Cornell Notes

## Topic: Copy/Move Constructors and Operator `=` with Derived Classes

## Date: 05/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Copy/Move constructors and overloaded operator=

- Not inherited from the Base class
- You may not need to provide your own
  - Compiler-provided versions may be just ﬁne
- We can explicitly invoke the Base class versions from the Derived class

#### Copy constructor

- Can invoke Base copy constructor explicitly
  - Derived object ‘other’ will be sliced

```cpp
Derived::Derived(const Derived &other)
: Base(other), {Derived initialization list}
{
// code
}
```
```cpp
class Base {
    int value;
public:
    // Same constructors as previous example
    Base(const Base &other) :value{other.value} {
        cout << "Base copy constructor" << endl;
    }
};
```
```cpp
class Derived : public Base {
    int doubled_value;
public:
    // Same constructors as previous example
    Derived(const Derived &other)
    : Base(other), doubled_value {other.doubled_value } {
        cout << "Derived copy constructor " << endl;
    }
};
```

#### operator=

```cpp
class Base {
    int value;
public:
    // Same constructors as previous example
    Base &operator=(const Base &rhs) {
        if (this != &rhs) {
        value = rhs.value; // assign
        }
        return *this;
    }
};
```
```cpp
class Derived : public Base {
    int doubled_value;
public:
    // Same constructors as previous example
    Derived &operator=(const Derived &rhs) {
        if (this != &rhs) {
        Base::operator=(rhs);
        // Assign Base part
        doubled_value = rhs.doubled_value; // Assign Derived part
        }
        return *this;
    }
};
```
- Often you do not need to provide your own
- If you DO NOT not deﬁne them in Derived
  - then the compiler will create them and automatically and call the base class’s version
- If you DO provide Derived versions
  - then YOU must invoke the Base versions explicitly yourself
- Be careful with raw pointers
  - Especially if Base and Derived each have raw pointers
  - Provide them with deep copy semantics

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]