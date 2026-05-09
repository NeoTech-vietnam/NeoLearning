# Cornell Notes

## Topic: Passing Arrays to Functions

## Date: 05/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Passing Arrays To Functions
- We can pass an array to a function by providing square brackets in the formal parameter description 
```cpp
void print_array(int numbers []);
```
- The array elements are NOT copied
- Since the array name evaluates to the location of the array in memory – this address is what is copied
- So the function has no idea how many elements are in the array since all it knows is the location of the ﬁrst element (the name of the array)

#### Example
```cpp
void print_array(int numbers []);
int main() {
    int my_numbers[] {1,2,3,4,5};
    print_array(my_numbers);
    return 0;
}
void print_array(int numbers []) {
    // Doesn’t know how many elements are in the array???
    // we need to pass in the size!!
}
// === //
void print_array(int numbers [], size_t size);
int main() {
    int my_numbers[] {1,2,3,4,5};
    print_array(my_numbers, 5);
    / 1 2 3 4 5
    return 0;
}
void print_array(int numbers [], size_t size) {
    for (size_t i{0}; i < size; ++i )
    cout << numbers[i] << endl;
}
```
- Since we are passing the location of the array
  - The function can modify the actual array!
```cpp
void zero_array(int numbers [], size_t size) {
    for (size_t i{0}; i < size; ++i )
    numbers[i] = 0;
    // zero out array element
}
int main() {
    int my_numbers[] {1,2,3,4,5};
    zero_array(my_numbers, 5);
    // my_numbers is now zeroes!
    print_array(my_numbers, 5);
    // 0 0 0 0 0
    return 0;
}
```

#### const parameters
- We can tell the compiler that function parameters are const (read-only)
- This could be useful in the print_array function since it should NOT modify the array
```cpp
void print_array(const int numbers [], size_t size) {
    for (size_t i{0}; i < size; ++i )
    cout << numbers[i] << endl;
    numbers[i] = 0;
    // any attempt to modify the array
    // will result in a compiler error
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]