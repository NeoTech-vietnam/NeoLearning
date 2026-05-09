# Cornell Notes

## Topic: Pointer Arithmetic

## Date: 07/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Pointer Arithmetic
- Pointers can be used in
  - Assignment expressions
  - Arithmetic expressions
  - Comparison expressions
- C++ allows pointer arithmetic
- Pointer arithmetic only makes sense with raw arrays

#### `++` and `--`

- (++) increments a pointer to point to the next array element 
```cpp
int_ptr++;
```
- (--) decrements a pointer to point to the previous array element 
```cpp
int_ptr--;
```

#### `+` and `-`
- (+) increment pointer by `n * sizeof(type)` 
```cpp 
int_ptr += n; or int_ptr = int_ptr + n;
```
- (-) decrement pointer by `n * sizeof(type)` 
```cpp
int_ptr -= n; or int_ptr = int_ptr - n;
```

#### Subtracting two pointers
- Determine the number of elements between the pointers
- Both pointers must point to the same data type 
```cpp
int n = int_ptr2 - int_ptr1;
```

#### Comparing two pointers `==` and `!=`
- Determine if two pointers point to the same location
  - does NOT compare the data where they point!

```cpp
string s1 {"Frank"};
string s2 {"Frank"};
string *p1 {&s1};
string *p2 {&s2};
string *p3 {&s1};
cout << (p1 == p2) << endl; // false
cout << (p1 == p3) << endl; // true
```

#### Comparing the data pointers point to
- Determine if two pointers point to the same data
  - you must compare the referenced pointers

```cpp
string s1 {"Frank"};
string s2 {"Frank"};
string *p1 {&s1};
string *p2 {&s2};
string *p3 {&s1};
cout << (*p1 == *p2) << endl; // true
cout << (*p1 == *p3) << endl; // true
```



---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]