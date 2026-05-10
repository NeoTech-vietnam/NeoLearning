# Section 21: Threads

## Topic: Passing arguments and returning values to/from threads

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Passing Arguments to Threads**
- the pthread_create() function permits the programmer to pass one argument to the thread start routine
- when passing more than one argument, you can create a structure which contains all of the arguments, and then pass a pointer to that structure in the pthread_create() function
- all arguments must be cast to (void *)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]