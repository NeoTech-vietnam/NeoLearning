# Cornell Notes

## Topic: Virtual Destructors

## Date: 07/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Virtual Destructors

- Problems can happen when we destroy polymorphic objects
- If a derived class is destroyed by deleting its storage via the base class pointer and the class a non-virtual destructor. Then the behavior is undeﬁned in the C++ standard.
- Derived objects must be destroyed in the correct order starting at the correct destructor
- Solution/Rule:
  - If a class has virtual functions
  - ALWAYS provide a public virtual destructor
  - If base class destructor is virtual then all derived class destructors are also virtual

```cpp
class Account {
public:
    virtual void withdraw(double amount);
    virtual ~Account();
    . . .
};
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]