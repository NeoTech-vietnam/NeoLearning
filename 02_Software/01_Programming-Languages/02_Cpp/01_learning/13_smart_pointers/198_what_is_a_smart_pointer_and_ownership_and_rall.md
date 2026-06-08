# Cornell Notes

## Topic: What is a smart pointer? Ownership and RAII

## Date: 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What are they?

- `#include <memory>`
- Deﬁned by class templates
  - Wrapper around a raw pointer
  - Overloaded operators
    - Dereference (*)
    - Member selection (->)
    - Pointer arithmetic not supported (++, --, etc.)
  - Can have custom deleters

#### A simple example

![alt text](image.png)

#### RAII – Resource Acquisition Is Initialization

- Common idiom or pattern used in software design based on container object lifetime
- RAII objects are allocated on the stack
- Resource Acquisition
  - Open a ﬁle
  - Allocate memory
  - Acquire a lock
- Is Initialization
  - The resource is acquired in a constructor
- Resource relinquishing
  - Happens in the destructor
    - Close the ﬁle
    - Deallocate the memory
    - Release the lock

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]