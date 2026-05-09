# Section 5: Structure of a C++ Program

## Topic: The main() function

## Date: 14/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a preprocessor directive and when is it processed?
- What is the `#include` directive and what are the two ways to use it?
- What is the difference between `#include <filename>` and `#include "filename"`?
- What are standard library headers and how are they included?
- What are custom headers and how do you create them?
- What other preprocessor directives exist besides `#include`?
- How does the C++ preprocessor work differently from the C++ compiler?
- What is the difference between including a header file vs. defining code inline?

---

### Notes Section (Main Notes)

**1. The main() Function**
- The `main()` function is the entry point of a C++ program
- Every C++ program must have a `main()` function
- The `main()` function can return an integer value, typically `0` for successful execution. Otherwise, it can return a non-zero value to indicate an error or abnormal termination.
- The syntax for the `main()` function is:
```cpp
int main() {
    // code to be executed
    return 0; // indicates that the program ended successfully
}
```
- Example:
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
- However, the `main()` function can also be defined with parameters to accept command-line arguments:
```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "Number of arguments: " << argc << std::endl;
    for (int i = 0; i < argc; ++i) {
        std::cout << "Argument " << i << ": " << argv[i] << std::endl;
    }
    return 0;
}
```
- `argc` (argument count) represents the number of command-line arguments passed to the program, including the program name itself.
- `argv` (argument vector) is an array of C-style strings representing the actual arguments.

---

### Summary Section (Summary of Notes)

The `main()` function is the entry point of a C++ program. Every C++ program must have a `main()` function, which can return an integer value, typically `0` for successful execution. Understanding the `main()` function is essential for structuring and executing C++ programs.