# Cornell Notes

## Topic: Global Variables

## Date: 10/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. What is a Global Variable?**
- A global variable is a variable that is declared outside of all functions, typically at the top of a program.
- It can be accessed and modified by any function in the program.
```cpp
#include <iostream>
using namespace std;
int age {24};

int main(void){
    
    cout << age << endl;
    return 0;
}
```
**2. The pros and cons when using global variables**

| Pros                            | Cons                                |
| ------------------------------- | ----------------------------------- |
| Can be accessed from anywhere   | Can lead to unintended side effects |
| Useful for constants            | Can make debugging difficult        |
| Can simplify code in some cases | Can make code less modular          |

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]