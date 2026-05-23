# Section 10: Input and Output

## Topic: char functions (input)

## Date: 16/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. output functions - putc**
- the function `putc()` enables you to write a single character to a file (or to `stdout`)
  - takes two arguments
    - the **first** argument is the character that is to be written into the file
    - the **second** argument is the `FILE` pointer that identifies the file from which the character is to be written to
  - must first call `fopen()` in write or append mode
```c
int putc(int char, FILE *fp)
putc(‘\n’, stdout);
```
OR
```
putc ('\n', outputFile);
```
- has the effect of writing a newline character into the file identified by the `FILE` pointer outputFile

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
