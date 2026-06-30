# Cornell Notes

## Topic: Associative Containers - Sets

## Date: 30/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### The STL Set containers

- Associative containers
  - Collection of stored objects that allow fast retrieval using a key
  - STL provides Sets and Maps
  - Usually implemented as a balanced binary tree or hashsets
  - Most operations are very eﬃcient
- Sets
  - `std::set`
  - `std::unordered_set`
  - `std::multiset`
  - `std::unordered_multiset`

#### std::set

`#include <set>`

- Similar to a mathematical set
- Ordered by key
- No duplicate elements
- All iterators available and invalidate when corresponding element is deleted

#### std::set – initialization and assignment

![alt text](image-72.png)

#### std::set – common methods

![alt text](image-73.png)

![alt text](image-75.png)

- uses `operator<` for ordering!
- returns a `std::pair<iterator, bool>`
- first is an iterator to the inserted element or to the duplicate in the set
- second is a boolean indicating success or failure

![alt text](image-76.png)

![alt text](image-77.png)

#### std::multi_set

`#include <set>`

- Sorted by key
- Allows duplicate elements
- All iterators are available

#### std::unordered_set

`#include <unordered_set>`

- Elements are unordered
- No duplicate elements allowed
- Elements cannot be modiﬁed
  - Must be erased and new element inserted
- No reverse iterators are allowed

#### std::unordered_multiset

`#include <unordered_set>`

- Elements are unordered
- Allows duplicate elements
- No reverse iterators are allowed

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]