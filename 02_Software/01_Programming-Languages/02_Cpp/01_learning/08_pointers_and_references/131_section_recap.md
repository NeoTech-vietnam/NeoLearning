# Cornell Notes

## Topic: Section Recap

## Date: 08/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### When to use pointers vs. references parameters
- Pass-by-value
  - when the function does not modify the actual parameter, and
  - the parameter is small and eﬃcient to copy like simple types (int, char, double, etc.)
- Pass-by-reference using a pointer
  - when the function does modify the actual parameter, and
  - the parameter is expensive to copy, and
  - Its OK to the pointer is allowed a nullptr value
- Pass-by-reference using a pointer to const
  - when the function does not modify the actual parameter, and
  - the parameter is expensive to copy, and
  - Its OK to the pointer is allowed a nullptr value
- Pass-by-reference using a const pointer to const
  - when the function does not modify the actual parameter, and
  - the parameter is expensive to copy, and
  - Its OK to the pointer is allowed a nullptr value, and
  - You don’t want to modify the pointer itself
- Pass-by-reference using a reference
  - when the function does modify the actual parameter, and
  - the parameter is expensive to copy, and
  - The parameter will never be nullptr
- Pass-by-reference using a `const` reference
  - when the function does not modify the actual parameter, and
  - the parameter is expensive to copy, and
  - The parameter will never be nullptr



---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]