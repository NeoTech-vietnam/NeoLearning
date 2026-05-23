# Section 12: Unions

## Topic: Accessing Union Members

## Date: 04/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- we can access/assign data to members of a union just like we access/assign data to members of a structure
- we use the dot (.) operator to access members of a union
  - to access pointer variables, we use use the -> operator (indirection operator)
  - the dot operator is used with a union name to specify a member of that union
```c
name.member
```
- the type of name.member is the type specified for member
```c
union {
  int code;
  float cost;
} item;
item.code = 1265; // assigns a value to the code member of the structure item
```

**2. Access pointer members of a union**
- you can use the -> operator with pointers to unions in the same fashion that you use the operator with pointers to structures
- the indirection operator is used with a pointer to a union to identify a member of that union
```c
union {
  int code;
  float cost;
} item, * ptrst;
ptrst = &item;
ptrst->code = 3451; // assigns an int value to the code member of item
```
- the following three expressions are equivalent
  - `ptrst->code`
  - `item.code`
  - `(*ptrst).code`

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
