# Section 16: Advanced Pointers

## Topic: Void Pointer

## Date: 02/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- we have previously learned that if a pointer is of type pointer to int or `(int *)` then it can hold the address of the variable of type int only
  - we cannot assign an address of a float variable to a pointer of type pointer to int
- the void type of pointer is a special type of pointer
  - `void` represents the absence of type (a generic pointer)
- void pointers are pointers that point to a value that has no type
- a void pointer can point to a variable of any data type
  - from an integer value or a float to a string of characters

**2. Syntax**
- a void pointer declaration is similar to the normal pointer, but the difference is that instead of data types we use the void keyword
```c
void * pointer_name;
```
- the size of a void pointer is similar to the size of the character pointer
  - has the same representation and alignment requirements as a pointer to a character type

**3. example**
```c
void *vp;
int a = 100, *ip;
float f = 12.2, *fp;
char ch = 'a’;
```
- vp is a void pointer, so you can assign the address of any type of variable to it
```c
vp = &a; // ok
vp = ip; // ok
vp = fp; // ok
ip = &f; // wrong since type of ip is pointer to int
fp = ip; // wrong since type of fp is pointer to float
```
**4. dereferencing a void pointer**
- the data pointed to by a void pointer cannot be directly dereferenced
  - we have no type to dereference to
  - we will always have to cast the address in the void pointer to some other pointer type that points to a concrete data type before dereferencing it
  ```c
  void *vp;
  int a = 100;
  vp = &a;
  printf("%d", *vp); // wrong
  ```
- the above will not work
  - because a void pointer has no data type
  - before you dereference a void pointer it must be type casted to the appropriate pointer type
  ```c
  void *vp;
  int a = 100;
  vp = &a;
  ```
- void pointer vp is pointing to the address of integer variable a
  - vp is acting as a pointer to int or `(int *)`
  - the proper typecast in this case is `(int*)`
  ```c
  (int *)vp
  ```
- the type of vp temporarily changes from void pointer to pointer to int or (int*)
  - we already know how to dereference a pointer to int, just precede it with indirection operator (*)
```c
*(int *)vp
```
- type casting changes type of vp temporarily until the evaluation of the expression, everywhere else in the program vp is still a void pointer

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
