# Cornell Notes

## Topic: Scope Rules

## Date: 05/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Scope Rules
- C++ uses scope rules to determine where an identiﬁer can be used
- C++ uses static or lexical scoping
- Local or Block scope
- Global scope

#### Local or Block Scope
- Identiﬁers declared in a block { }
- Function parameters have block scope
- Only visible within the block { } where declared
- Function local variables are only active while the function is executing
- Local variables are NOT preserved between function calls
- With nested blocks inner blocks can ‘see’ but outer blocks cannot ‘see’ in

#### Static local variables
- Declared with static qualiﬁer 
```cpp
static int value {10};
```
- Value IS preserved between function calls
- Only initialized the ﬁrst time the function is called

#### Global scope
- Identiﬁer declared outside any function or class
- Visible to all parts of the program after the global identiﬁer has been declared
- Global constants are OK
- Best practice – don’t use global variables

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]