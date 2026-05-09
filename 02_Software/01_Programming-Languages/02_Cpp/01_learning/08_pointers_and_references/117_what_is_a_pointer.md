# Cornell Notes

## Topic: What is a Pointer?

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What is a Pointer?
- A variable
  - whose value is an address
- What can be at that address?
  - Another variable
  - A function
- Pointers point to variables or functions?
  - If x is an integer variable and its value is 10 then I can declare a pointer that points to it
- To use the data that the pointer is pointing to you must know its type

#### Why use Pointers?
```
Can’t I just use the variable or function itself?
Yes, but not always
```
- Inside functions, pointers can be used to access data that are deﬁned outside the function. Those variables may not be in scope so you can’t access them by their name
- Pointers can be used to operate on arrays very eﬃciently
- We can allocate memory dynamically on the heap or free store.
  - This memory doesn’t even have a variable name.
  - The only way to get to it is via a pointer
- With OO. pointers are how polymorphism works!
- Can access speciﬁc addresses in memory
  - useful in embedded and systems applications

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]