# Cornell Notes

## Topic: Unique Pointers

## Date: 08/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### `unique_ptr`

- Simple smart pointer – very eﬃcient!
- `unique_ptr<T>`
- Points to an object of type T on the heap
  - It is unique – there can only be one `unique_ptr<T>` pointing to the object on the heap
  - Owns what it points to
  - Cannot be assigned or copied
  - CAN be moved
  - When the pointer is destroyed, what it points to is automatically destroyed

#### `unique_ptr` – creating, initializing and using

![alt text](image-1.png)

#### `unique_ptr` – some other useful methods

![alt text](image-2.png)

#### `unique_ptr` – user deﬁned classes 

![alt text](image-3.png)

#### `unique_ptr` – vectors and move

![alt text](image-4.png)

#### `unique_ptr` – make_unique (C++14)

![alt text](image-6.png)

- More eﬃcient – no calls to new or delete

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]