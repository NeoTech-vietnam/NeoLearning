# Cornell Notes

## Topic: Returning a Pointer from a Function

## Date: 07/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Returning a Pointer from a Function
- Functions can also return pointers type *function();
- Should return pointers to
  - Memory dynamically allocated in the function
  - To data that was passed in
- Never return a pointer to a local function variable!

#### Returning a parameter
```cpp
int *largest_int(int *int_ptr1, int *int_ptr2) {
    if (*int_ptr1 > *int_ptr2)
        return int_ptr1;
    else
        return int_ptr2;
}
```
```cpp
int main() {
    int a{100};
    int b{200};

    int *largest_ptr {nullptr};
    largest_ptr = largest_int(&a, &b);
    cout << *largest_ptr << endl; // 200
    return 0;
}
```

#### returning dynamically allocated memory
```cpp
int *create_array(size_t size, int init_value = 0) {
    int *new_storage {nullptr};
    new_storage = new int[size];
    for (size_t i{0}; i < size; ++i)
        *(new_storage + i) = init_value;
    return new_storage;
}
```
```cpp
int main() {
int *my_array; // will be allocated by the function
my_array = create_array(100,20); // create the array
// use it
delete [] my_array; // be sure to free the storage
return 0;
}
```

#### Never return a pointer to a local variable!!
```cpp
int *dont_do_this () {
    int size {};
    . . .
    return &size;
}
int *or_this () {
    int size {};
    int *int_ptr {&size};
    . . .
    return int_ptr;
}
```


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]