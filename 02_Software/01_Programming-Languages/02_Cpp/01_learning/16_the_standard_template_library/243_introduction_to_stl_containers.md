# Cornell Notes

## Topic: Introduction to STL Containers

## Date: 20/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Containers

- Data structures that can store object of almost any type
  - Template-based classes
- Each container has member functions
  - Some are speciﬁc to the container
  - Others are available to all containers
- Each container has an associated header ﬁle
  - `#include <container_type>`

#### Containers – common

![alt text](image-29.png)

![alt text](image-30.png)

#### Container elements

What types of elements can we store in containers?

- A **copy** of the element will be stored in the container
  - All primitives OK
- Element should be
  - Copyable and assignable (copy constructor / copy assignment)
  - Moveable for eﬃciency (move Constructor / move Assignment)
- Ordered associative containers must be able to compare elements
  - `operator<`, `operator==`

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]