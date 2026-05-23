# Section 19: Data Structures

## Topic: Stacks (Implementation)

## Date: 11/02/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- a stack can be implemented either through an array or a linked list
- I will give a brief description of implementation via a linked list, but, we will mostly focus on the array implementation
- what identifies the data structure as a stack in either case is not the implementation but the interface
  - popping and pushing items onto the array or linked list, with few other helper operations

**2. Linked List implementation**
- for the single linked list implementation of a stack, we use a pointer to the top of the list and a counter to keep track of the size of the list
- the push operation is performed by inserting the element at the front of the list
- the pop operation is performed by deleting the element at the front of the list
- some drawbacks of this implementation include speed (all the operations take constant time)
  - calls to malloc and free are expensive especially in comparison to the pointer manipulation routines

**3. Array Implementation**
- a simpler way of implementing a stack is to use an array
  - no need for pointers
- push and pop functions are implemented by using the operations available on an array
- the only problem with this implementation is array size must be specified initially.
- the stack cannot grow and shrink dynamically

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
