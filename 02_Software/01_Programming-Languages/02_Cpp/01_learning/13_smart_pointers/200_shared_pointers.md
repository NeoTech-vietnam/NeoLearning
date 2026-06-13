# Cornell Notes

## Topic: Shared Pointers

## Date: 08/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### shared_ptr

- Provides shared ownership of heap objects

- `shared_ptr<T>`
  - Points to an object of type `T` on the heap
  - It is not unique – there can many `shared_ptrs` pointing to the same object on the heap
  - Establishes shared ownership relationship
  - CAN be assigned and copied
  - CAN be moved
  - Doesn’t support managing arrays by default
  - When the use count is zero, the managed object on the heap is destroyed

#### `shared_ptr` – creating, initializing and using

![alt text](image-5.png)

#### `shared_ptr` – some other useful methods

![alt text](image-7.png)

#### `shared_ptr` – user deﬁned classes

![alt text](image-8.png)

#### `shared_ptr` – vectors and move

![alt text](image-9.png)

#### `shared_ptr` – `make_shared` (C++11)

![alt text](image-10.png)

- Use `std::make_shared<T>` – it’s more eﬃcient!
- All 3 pointers point to the SAME object on the heap!
- When the use_count becomes 0 the heap object is deallocated

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]