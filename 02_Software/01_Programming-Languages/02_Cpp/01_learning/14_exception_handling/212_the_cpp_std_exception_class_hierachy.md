# Cornell Notes

## Topic: The C++ std::exception Class Hierachy

## Date: 11/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is the C++ std::exception class hierarchy?
- What are the main derived classes of std::exception?
- How do different exception types relate to each other?

---

### Notes Section (Main Notes)

#### The C++ standard library exception class hierarchy

- C++ provides a class hierarchy of exception classes
  - `std::exception` is the base class
  - all subclasses implement the `what()` virtual function
  - we can create our own user-deﬁned exception subclasses

![alt text](image-15.png)

![alt text](image-16.png)

#### Deriving our class from std::exception

![alt text](image-17.png)

#### Our modiﬁed Account class constructor

![alt text](image-18.png)

#### Creating an Account object

![alt text](image-19.png)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]