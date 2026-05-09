# Cornell Notes

## Topic: What is a reference?

## Date: 07/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What is a reference?
- An alias for a variable
- Must be initialized to a variable when declared
- Cannot be null
- Once initialized cannot be made to refer to a different variable
- Very useful as function parameters
- Might be helpful to think of a reference as a constant pointer that is automatically dereferenced
- Using references in range-based for loop
```cpp
vector<string> stooges {"Larry", "Moe", "Curly"};
for (auto str: stooges)
    str = "Funny"; // changes the copy
for (auto str:stooges)
    cout << str << endl; // Larry, Moe, Curly
```
```cpp
vector<string> stooges {"Larry", "Moe", "Curly"};
for (auto &str: stooges)
    str = "Funny"; // changes the actual
for (auto str:stooges)
    cout << str << endl; // Funny, Funny, Funny
```
```cpp
vector<string> stooges {"Larry", "Moe", "Curly"};
for (auto const &str: stooges)
    str = "Funny"; // compiler error
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]