# Section 11: Advanced Funtion Concepts

## Topic: va_copy

## Date: 25/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. va_copy**
- `va_arg()` does not provide a way to back up to previous arguments
- it is possible that you may need to process a variable argument list more than once
  - may be useful to preserve a copy of the va_list type variable
  - use `va_copy()` - two arguments are both type va_list variables, copies the second argument to the first
```c
va_list parg;
va_list parg_copy;
va_copy(parg_copy, parg);
```
- the first statement creates a new va_list variable, parg_copy
- the next statement copies the contents of parg to parg_copy
- you can then process parg and parg_copy independently to extract argument values using `va_arg()` and `va_end()`
- the `va_copy()` routine copies the va_list object in whatever state it is in
  - if you have executed va_arg() with parg to extract argument values from the list prior to using the `va_copy()` routine, parg_copy will be in an
identical state to parg with some argument values already extracted
- do not use the `va_list` object `parg_copy` as the destination for another copy operation before you have executed `va_end()` for `parg_copy`

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
