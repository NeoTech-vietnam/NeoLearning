# Cornell Notes

## Topic: Stack Unwinding and how it Works

## Date: 09/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Stack unwinding

- If an exception is thrown but not caught in the current scope C++ tries to ﬁnd a handler for the exception by unwinding the stack
- Function in which the exception was not caught terminates and is removed from the call stack
- If a try block was used to then catch blocks are checked for a match
- If no try block was used or the catch handler doesn’t match stack unwinding occurs again
- If the stack is unwound back to main and no catch handler handles the exception the program terminates

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]