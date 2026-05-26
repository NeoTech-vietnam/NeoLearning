# Cornell Notes

## Topic: Overloading the Assignment Operator (move)

## Date: 26/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Move assignment operator (=)
- You can choose to overload the move assignment operator
  - C++ will use the copy assignment operator if necessary
```cpp
Mystring s1;
s1 = Mystring {"Frank"}; // move assignment
- If we have raw pointer we should overload the move assignment operator for
efficiency
```

#### Overloading the Move assignment operator
![alt text](image-2.png) ![alt text](image-3.png)

#### Overloading the Move assignment operator – steps for deep copy
- Check for self assignment

```cpp
if (this == &rhs)
return *this; // return current object
```
- Deallocate storage for this->str since we are overwriting it
```cpp
delete [] str;
```
- Steal the pointer from the rhs object and assign it to this->str
```cpp
str = rhs.str;
```
- Null out the rhs pointer
```cpp
rhs.str = nullptr;
```
- Return the current object by reference to allow chain assignment
```cpp
return *this;
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]