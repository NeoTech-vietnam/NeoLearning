# Cornell Notes

## Topic: inline Functions

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Inline Functions
- Function calls have a certain amount of overhead
- You saw what happens on the call stack
- Sometimes we have simple functions
- We can suggest to the compiler to compile them ‘inline’
  - avoid function call overhead
  - generate inline assembly code
  - faster
  - could cause code bloat
- Compilers optimizations are very sophisticated
  - will likely inline even without your suggestion

#### Example
```cpp
inline int add_numbers(int a, int b) { // definition
    return a + b;
}
int main() {
    int result {0};
    result = add_numbers(100,200); // call
    return 0;
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]