# Cornell Notes

## Topic: Const and Pointers

## Date: 07/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Passing pointers to a function
`const` and Pointers
- There are several ways to qualify pointers using `const`
  - Pointers to constants
  - Constant pointers
  - Constant pointers to constants

#### Pointers to constants
- The data pointed to by the pointers is constant and cannot be changed.
- The pointer itself can change and point somewhere else.

```cpp
int high_score {100};
int low_score { 65};
const int *score_ptr { &high_score };
*score_ptr = 86; // ERROR
score_ptr = &low_score; // OK
```

#### Constant pointers
- The data pointed to by the pointers can be changed.
- The pointer itself cannot change and point somewhere else
```cpp
int high_score {100};
int low_score { 65};
int *const score_ptr { &high_score };
*score_ptr = 86; // OK
score_ptr = &low_score; // ERROR
```

#### Constant pointers to constants
- The data pointed to by the pointer is constant and cannot be changed.
- The pointer itself cannot change and point somewhere else.
```cpp
int high_score {100};
int low_score { 65};
const int *const score_ptr { &high_score };
*score_ptr = 86; // ERROR
score_ptr = &low_score; // ERROR
```

---

### Summary Section (Summary of Notes)

- Pointers can be qualified with `const` in different ways:
  - Pointers to constants: The data pointed to is constant, but the pointer can change.
  - Constant pointers: The pointer itself is constant, but the data pointed to can change.
  - Constant pointers to constants: Both the pointer and the data pointed to are constant.