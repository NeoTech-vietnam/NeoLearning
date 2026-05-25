# Section 5: Advanced Data Types

## Topic: Register

## Date: 22/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- Up until this point, all the arrays that you have used have had fixed dimensions that you specify in the code
  - Arrays are of constant size
- What if you don’t know an array’s size at compilation time?
  - To handle this, you would have to use dynamic memory allocation with malloc
- A variable-length array is an array whose length, or size, is defined in terms of an expression evaluated at execution time
  - Enable you to work with arrays in your programs without having to give them a constant size
- The term variable in variable-length array does not mean that you can modify the length of the array after you create it
  - Once created, a VLA keeps the same size
- The term variable means that you can use a variable when specifying the array dimensions when first creating the array

**2. C11**
- A C11-conforming compiler does not have to implement support for
variable length arrays because it is an optional feature
- If it does not, the symbol `__STDC_NO_VLA__` must be defined as 1
- You can check for support for variable length arrays using this code
```c
#ifdef __STDC_NO_VLA__
printf("Variable length arrays are not supported.\n");
exit(1);
#endif
```

**3. Conclusion**
- Linus Torvalds is quoted saying
```
“USING VLA’S IS ACTIVELY STUPID! It generates much more code, and much slower code
(and more fragile code), than just using a fixed key size would have done.”
```
- Torvalds goes on to say that Linux is free of VLAs and he’s proud of that fact
- There is a lot of demo/academic code on VLAs and even less material out there in the C training world
- It is possible in C to create a variable length array
  - Just not necessary and it’s something I would recommend you avoid
    - If you need to dynamically allocate and even reallocate storage buffers, you can always use pointers

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
