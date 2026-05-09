# Cornell Notes

## Topic: Potential Pointer Pitfalls

## Date: 07/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Potential Pointer Pitfalls
- Uninitialized pointers
- Dangling Pointers
- Not checking if new failed to allocate memory
- Leaking memory

#### Uninitialized pointers
```cpp
int *int_ptr; // pointing anywhere
. . .
*int_ptr = 100; // Hopefully a crash
```
#### Dangling pointer
- Pointer that is pointing to released memory
  - For example, 2 pointers point to the same data
  - 1 pointer releases the data with delete
  - The other pointer accesses the release data
- Pointer that points to memory that is invalid
  - We saw this when we returned a pointer to a function local variable

#### Not checking if new failed
- If `new` fails an exception is thrown
- We can use exception handling to catch exceptions
- Dereferencing a null pointer will cause your program to crash

#### Leaking memory
- Forgetting to release allocated memory with delete
- If you lose your pointer to the storage allocated on the heap you have not way to get to that storage again
- The memory is orphaned or leaked
- One of the most common pointer problems


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]