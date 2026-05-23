# Section 19: Data Structures

## Topic: Queues (Implementation)

## Date: 15/02/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- a queue can be implemented either through an array or a linked list
- I will give a brief description of implementation via a linked list, but, we will mostly focus on the array implementation
- what identifies the data structure as a queue in either case is not the implementation but the interface
  - enqueue and dequeue onto the array or linked list, with few other helper operations

**2. Linked List implementation**
- for the single linked list implementation of a queue, we use a pointer to the front of the list (head) and a pointer to the rear of the list (tail)
- the enqueue operation is performed by inserting the element at the rear of the list
- the dequeue operation is performed by deleting the element at the front of the list
- some drawbacks of this implementation include speed (all the operations take constant time)
  - calls to malloc and free are expensive especially in comparison to the pointer manipulation routines

**3. Array Implementation**
- we need to keep track of two indices, front and rear
- we enqueue an item at the rear and dequeue an item from front
- if we simply increment front and rear indices, then there may be problems, front may reach end of the array
- the solution to this problem is to increase front and rear in circular manner
- two integers named `FRONT` and `REAR` are used to keep track of the first and last elements in the queue
- when initializing the queue, we set the value of FRONT and REAR to `-1`
- on enqueing an element, we increase the value of REAR index and place the new element in the position pointed to by `REAR`
- on dequeueing an element, we return the value pointed to by `FRONT` and increase the `FRONT` index.
- before enqueing, we check if queue is already full.
- before dequeuing, we check if queue is already empty.
- when enqueing the first element, we set the value of FRONT to 0.
- when dequeing the last element, we reset the values of FRONT and REAR to `-1`.
- the following steps should be taken to enqueue (insert) data into a queue
  - Step 1 − Check if the queue is full.
  - Step 2 − If the queue is full, produce overflow error and exit.
  - Step 3 − If the queue is not full, increment rear pointer to point the next empty
space.
  - Step 4 − Add data element to the queue location, where the rear is pointing
  - Step 5 − return success
- the following steps should be taken to dequeue (delete) data from a queue
  - Step 1 − Check if the queue is empty.
  - Step 2 − If the queue is empty, produce underflow error and exit.
  - Step 3 − If the queue is not empty, access the data where front is
pointing.
  - Step 4 − Increment front pointer to point to the next available data
element.
  - Step 5 − Return success.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
