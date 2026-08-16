# Cornell Notes

## Topic: Associative Containers - Maps

## Date: 01/07/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### std::map

`#include <map>`

- Similar to a dictionary
- Elements are stored as Key, Value pairs (std::pair)
- Ordered by key
- No duplicate elements (keys are unique)
- Direct element access using the key
- All iterators available and invalidate when corresponding element is deleted

#### std::map – initialization and assignment

![alt text](image-78.png)

#### std::map – common methods

![alt text](image-79.png)

- No concept of front and back

![alt text](image-80.png)

![alt text](image-81.png)

![alt text](image-82.png)

![alt text](image-83.png)

#### std::multi_map

`#include <map>`

- Ordered by key
- Allows duplicate elements
- All iterators are available

#### std::unordered_map

`#include <unordered_map>`

- Elements are unordered
- No duplicate elements allowed
- No reverse iterators are allowed

#### std::unordered_multimap

`#include <unordered_map>`

- Elements are unordered
- Allows duplicate elements
- No reverse iterators are allowed



---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]