# Cornell Notes

## Topic: Overloading the Assignment Operator (Copy)

## Date: 26/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Copy assignment operator (=)
- C++ provides a default assignment operator used for assigning one object to another
```cpp
Mystring s1 {"Frank"};
Mystring s2 = s1;
// NOT assignment
// same as Mystring s2{s1};
s2 = s1;
// assignment
```
- Default is memberwise assignment (shallow copy)
  - If we have raw pointer data member we must deep copy

#### Overloading the copy assignment operator (deep copy)

![alt text](image.png)

#### Overloading the copy assignment operator (deep copy)

![alt text](image-1.png)

#### Overloading the copy assignment operator – steps for deep copy

- Check for self assignment
```cpp
if (this == &rhs) // p1 = p1;
return *this; // return current object
```
- Deallocate storage for this->str since we are overwriting it
```cpp
delete [] str;
```

- Allocate storage for the deep copy
```cpp
str = new char[std::strlen(rhs.str) + 1];
```
- Perform the copy
```cpp
std::strcpy(str, rhs.str);
```
- Return the current by reference to allow chain assignment
```cpp
return *this; 
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]