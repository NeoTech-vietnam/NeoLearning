# Cornell Notes

## Topic: Sequence Containers - List and Forward List

## Date: 29/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### std::list

`#include <list>`

- Dynamic size
  - Lists of elements
  - `list` is bidirectional (doubly-linked)
- Direct element access is NOT provided
- Rapid insertion and deletion of elements anywhere in the container (constant time)
- All iterators available and invalidate when corresponding element is deleted

![alt text](image-62.png)

#### `std::list` – initialization and assignment

![alt text](image-63.png)

#### `std::list` – common methods

![alt text](image-64.png)

![alt text](image-65.png)

![alt text](image-67.png)

#### `std::list` – methods that use iterators

![alt text](image-66.png)

#### std::forward_list

`#include <forward_list>`

- Dynamic size
  - Lists of elements
  - `list` uni-directional (singly-linked)
  - Less overhed than a std::list
- Direct element access is NOT provided
- Rapid insertion and deletion of elements anywhere in the container (constant time)
- Reverse iterators not available. Iterators invalidate when corresponding element is deleted

![alt text](image-68.png)

#### `std::forward_list` – common methods

![alt text](image-69.png)

![alt text](image-70.png)

#### `std::forward_list` – methods that use iterators

![alt text](image-71.png)



---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]