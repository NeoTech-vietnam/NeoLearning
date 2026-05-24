# Section 18: Useful C Libraries

## Topic: General Ultilities (stdlib.h) Part 2

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
  - random-number generators
  - conversion functions
  - memory and string functions
- more specifically
  - atoi, atof, atol, strtod, strtof, strtol, itoa
  - rand and srand
  - system
  - getenv
- and from the string library
  - memcopy and memmove (string.h)
  - strdup and strndup (string.h)

- `atoi` : converts a string to an RQONE04965354integer
- `atof` : converts a string to a floating-point number
- `atol` : converts a string to a long integer
- `strtod` : converts a string to a double
- `strtof` : converts a string to a float
- `strtol` : converts a string to a long integer with base specification
- `itoa` : converts an integer to a string (non-standard, but commonly available)

**2. String to number conversion**

- the following functions convert character strings to numbers
- all routines skip leading whitespace characters in the string and stop their scan upon encountering a character that is invalid for the type of value being converted
```c
int atoi(char const *s);
```
- converts the string pointed to by s into an int, returning the result
```c
char a[10] = "100";
int value = atoi(a);
printf("Value = %d\n", value);
```

**3. random numbers**
- C provides the rand() and srand() functions in order to create random numbers
- random numbers can be used for many types of applications from security to use in games
  - can be used to generate UUID, Certificates, Passwords etc.
- in order to generate random numbers, you generally need a hardware-based source which generates random signals
  - these signals can then be used to generate a random number
- creating randomness is a very hard job
  - usually a seed is provided for every random function execution
- seed values are used to make a random start from the application point of view
  - we generally use functions like time or network traffic as a seed value because they are changing regularly

**4. rand()**
```c
int rand (void)
```
- used to create random numbers without any parameters
- returns a random number in the range [0, RAND_MAX]
-   `RAND_MAX` is defined in `<stdlib.h>` and has a minimum value of `32767`

**5. srand**

```c
void srand (unsigned seed)
```
- sets the starting point for producing a series of pseudo-random integers
  - if srand() is not called, the rand() seed is set as if srand(1) were called at program start
  - any other value for seed sets the generator to a different starting point
- the pseudo-random number generator should only be seeded once
  - before any calls to rand(), and the start of the program
  - it should not be repeatedly seeded
  - it should not be reseeded every time you wish to generate a new batch of pseudo-random numbers
- standard practice is to use the result of a call to srand(time(0)) as the seed
  - `time(0)` returns a time_t value which varies every time and hence the pseudo-random number varies for every program call

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
