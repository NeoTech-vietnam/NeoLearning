# Cornell Notes

## Topic: Overloading the Stream Insertion and Extraction Operators

## Date: 29/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### stream insertion and extraction operators (`<<`, `>>`)

![alt text](image-16.png)

![alt text](image-17.png)

- Doesn’t make sense to implement as member methods
  - Left operand must be a user-deﬁned class
  - Not the way we normally use these operators

```cpp
Mystring larry;
larry << cout; // huh?
Player hero;
hero >> cin; // huh?
```

#### stream insertion operator (`<<`)

```cpp
std::ostream &operator<<(std::ostream &os, const Mystring &obj) {
    os << obj.str;
    // if friend function
    // os << obj.get_str(); // if not friend function
    return os;
}
```

- Return a reference to the ostream so we can keep inserting
- Don’t return ostream by value!

#### stream extraction operator (>>)
```cpp
std::istream &operator>>(std::istream &is, Mystring &obj) {
    char *buff = new char[1000];
    is >> buff;
    obj = Mystring{buff}; // If you have copy or move assignment
    delete [] buff;
    return is;
}
```

- Return a reference to the `istream` so we can keep inserting
- Update the object passed in

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]