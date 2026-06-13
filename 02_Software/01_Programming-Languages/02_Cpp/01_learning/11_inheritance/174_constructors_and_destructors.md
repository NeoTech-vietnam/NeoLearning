# Cornell Notes

## Topic: Constructors and Destructors

## Date: 04/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Constructors and class initialization

- A Derived class inherits from its Base class
- The Base part of the Derived class MUST be initialized BEFORE the Derived class is initialized
- When a Derived object is created
  - Base class constructor executes then
  - Derived class constructor executes

![alt text](image-9.png)

![alt text](image-10.png)

#### Destructors and class initialization

- Class destructors are invoked in the reverse order as constructors
- The Derived part of the Derived class MUST be destroyed BEFORE the Base class destructor is invoked
- When a Derived object is destroyed
  - Derived class destructor executes then
  - Base class destructor executes
  - Each destructor should free resources allocated in it’s own constructors

![alt text](image-11.png)

![alt text](image-12.png)

- A Derived class does NOT inherit
  - Base class constructors
  - Base class destructor
  - Base class overloaded assignment operators
  - Base class friend functions
- However, the derived class constructors, destructors, and overloaded assignment operators can invoke the base-class versions
- C++11 allows explicit inheritance of base ‘non-special’ constructors with
  - `using Base::Base`; anywhere in the derived class declaration
  - Lots of rules involved, often better to deﬁne constructors yourself

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]