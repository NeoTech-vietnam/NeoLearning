# Cornell Notes

## Topic: Passing Pointers to Functions

## Date: 07/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Passing pointers to a function
- Pass-by-reference with pointer parameters
- We can use pointers and the dereference operator to achieve pass-by-reference
- The function parameter is a pointer
- The actual parameter can be a pointer or address of a variable
- Pass-by-reference with pointers – deﬁning the function
```cpp
void double_data(int *int_ptr);
void double_data(int *int_ptr) {
    *int_ptr *= 2;
    // *int_ptr = *int_ptr * 2;
}
```
- Pass-by-reference with pointers – calling the function
```cpp
int main() {
int value {10};
    cout << value << endl; // 10
    double_data( &value);
    cout << value << endl; // 20
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]