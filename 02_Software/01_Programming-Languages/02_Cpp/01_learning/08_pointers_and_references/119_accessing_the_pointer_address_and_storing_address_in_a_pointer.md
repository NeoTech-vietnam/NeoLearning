# Cornell Notes

## Topic: Accessing the Pointer Address and Storing Address in a Pointer

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Accessing Pointer Address?
- `&` the address operator
  - Variables are stored in unique addresses
  - Unary operator
  - Evaluates to the address of its operand
    - Operand cannot be a constant or expression that evaluates to temp values

```cpp
int num{10};
cout << "Value of num is: " << num << endl; // 10
cout << "sizeof of num is: " << sizeof num << endl; // 4
cout << "Address of num is: " << &num << endl; // 0x61ff1c
```
- `&` the address operator - example
```cpp
int *p;
cout << "Value of p is: " << p << endl; // 0x61ff60 - garbage
cout << "Address of p is: " << &p << endl; // 0x61ff18
cout << "sizeof of p is: " << sizeof p << endl; // 4
p = nullptr;// set p to point nowhere
cout << "Value of p is: " << p << endl; // 0x0
```
- `sizeof` a pointer variable
  - Don’t confuse the size of a pointer and the size of what it points to
  - All pointers in a program have the same size
  - They may be pointing to very large or very small types

```cpp
int *p1 {nullptr};
double *p2 {nullptr};
unsigned long long *p3 {nullptr};
vector<string> *p4 {nullptr};
string *p5 {nullptr};
```
#### Storing an Address in Pointer Variable?
- Typed pointers
    - The compiler will make sure that the address stored in a pointer variable is of the correct type
```cpp
int score {10};
double high_temp {100.7};
int *score_ptr {nullptr};
score_ptr = &score; // OK
score_ptr = &high_temp; // Compiler Error
```
- `&` the address operator
- Pointers are variables so they can change
- Pointers can be null
- Pointers can be uninitialized

```cpp
double high_temp {100.7};
double low_temp {37.2};
double *temp_ptr;
temp_ptr = &high_temp; // points to high_temp
temp_ptr = &low_temp; // now points to low_temp
temp_ptr = nullptr;
```


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]