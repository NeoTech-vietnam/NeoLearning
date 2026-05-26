# Section 18: Useful C Libraries

## Topic: General Ultilities (stdlib.h) Part 3

## Date: 25/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- in this lecture we will focus on the general utilities library (stdlib.h) and the string library (string.h)
  - misc. functions
  - memory and string functions
- more specifically
  - system
  - getenv
- and from the string library
  - memcopy and memmove (string.h)
  - strdup and strndup (string.h)

**2. The system() function**
- the system function passes the command name or program name specified as an argument to the host environment
  - to be executed by the command processor and returns after the command has been completed
  - allows you to execute programs on the console/shell
```c
int system(const char *command)
```
- gives the command contained in the character array pointed to by command to the system for execution
  - the value returned is -1 on error, and the return status of the command otherwise
```c
system ("mkdir /usr/tmp/data");
```
- causes the system to create a directory called /usr/tmp/data (assuming you have the proper permissions to do so)

**3. The getenv() function**
- an ‘Environment’ is an implementation-defined list of NAME/VALUE pairs maintained by the operating system
- the operating system defines specific meanings to “Environment Variables”
- not all implementations necessarily define same set of Environment Variables
  - they must define same meanings to whatever Environment Variables they have
- the function getenv searches for the environment string that is passed in
  - returns a null-terminated string with the value of the requested environment variable, or `NULL` if that environment variable does not exist
```c
char *getenv(char const *NAME);
```

**4. memcpy() and memmove()**
- you cannot assign one array to another, so often programmers use loops to copy one array to another, element by element
  - one exception is using strcpy() and strncpy() functions for character arrays
- the memcpy() and memmove() functions offer you almost the same convenience for other kinds of arrays
```c
void *memcpy(void * restrict s1, const void * restrict s2, size_t n);
void *memmove(void *s1, const void *s2, size_t n);
```
- both of these functions copy n bytes from the location pointed to by `s2` to the location pointed to by `s1`
  - both return the value of `s1`
- the difference between the two (as indicated by the keyword restrict)
  - `memcpy()` is free to assume that there is no overlap between the two memory ranges
- the `memmove()` function does not make that assumption
  - copying takes place as if all the bytes are first copied to a temporary buffer before being copied to the final destination
- if you use `memcpy()` when there are overlapping ranges then the behavior is undefined
  - it might work or it might not
- these functions are designed to work with any data type
  - so, the two pointer arguments are type pointer-to-void
- these functions have no way of knowing what type of data is being copied
  - so, they use the third argument to indicate the number of bytes to be copied
- remember, for an array, the number of bytes is not, in general, the number of elements
  - if you are copying an array of 10 double values
    - you would use `10*sizeof(double)`, not 10, as the third argument

**5. strdup and strndup**
- these function are used to duplicate a given string
  - a non standard function which may not available in standard library in C
- returns a pointer to a null-terminated byte string, which is a duplicate of the string pointed to by s
- the memory obtained is done dynamically using malloc and hence it can be freed using `free()`
```c
char *strdup(const char *string);
char *strndup(const char *s, size_t n);
```
- strndup is similar to strdup(), but copies at most n bytes
  - If s is longer than n, then only n bytes are copied, and a NULL (”) is added at the end

**6. size_t and NULL**
- **size_t**
  - the unsigned integral type and is the result of the sizeof keyword
- **NULL**
  - macro is the value of a null pointer constant

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
