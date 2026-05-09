# Cornell Notes

## Topic: How do Function Calls Work?

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### How do Function Calls Work?
- **Functions use the `function call stack`**
  - Analogous to a stack of books
  - LIFO – Last In First Out
  - push and pop
- **Stack Frame or Activation Record**
  - Functions must return control to function that called it
  - Each time a function is called we create an new activation record and push it on stack
  - When a function terminates we pop the activation record and return
  - Local variables and function parameters are allocated on the stack
- Stack size is ﬁnite – Stack Overﬂow

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]