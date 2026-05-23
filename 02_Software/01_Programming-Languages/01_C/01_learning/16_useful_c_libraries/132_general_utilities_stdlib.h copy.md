# Section 18: Useful C Libraries

## Topic: Assert

## Date: 25/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- there are several dozens of functions which facilitate every C programmer in writing programs for different requirements
- programming in C requires any C program to use these various different functions
  - we have discussed many of these functions
    - strcpy, printf, scanf, etc.
- all these functions are put together in the standard library
  - functions performing somewhat similar tasks are put together in same header file
    - functions performing input and output are put together in ‘stdio.h’ header
    - functions performing string manipulations are defined in ‘string.h’ header
- these standard library functions help make your code more portable and more efficient
- in this lecture and the next, we will focus on the general utilities library (stdlib.h)
  - random-number generators
  - program termination functions
  - searching and sorting functions
  - conversion functions
  - memory-management functions
- More specifically
  - exit
  - atexit
  - abort
  - qsort

**2. The exit() function**
- we understand that program execution is automatically terminated whenever the last statement in main() is executed
  - or when executing a return from main()
- at times, you might want to force the termination of a program earlier than the above
  - when an error condition is detected by a program
    - input error
    - a file to be processed by the program cannot be opened
- the exit function forces a program to terminate as if it executed normally
  - no matter from what point you are executing
  - invoked automatically upon return from main
```c
int exit(int status);
```
  - the above statement has the effect of terminating (exiting from) the current program
- any open files are automatically closed by the system
  - flushes all output streams
  - closes all open streams
  - closes temporary files created by calls to the standard I/O function `tmpfile()`
- the integer value status is called the exit status, and has the same meaning as the value returned from main()
  - `EXIT_FAILURE` (symbolic constant) represents an integer value that you can use to indicate the program has failed (non-zero)
  - `EXIT_SUCCESS` (symbolic constant) represents an integer value that you can use to indicate it has succeeded (0)
- when a program terminates simply by executing the last statement in main, its exit status is undefined
  - you should exit or return from main() with a defined exit status

**3. the atexit() function**
- the `atexit()` function allows you to specify particular functions to be called when `exit()` executes
  - must register the functions to be called on exit
- takes as an argument a pointer to a function (the function name)
```c
int atexit(void (*function)(void));
```
- to use the atexit() function
  - pass it the address of the function you want called on exit
  - registers this function in a list of functions to be executed when exit() is called
    - up to 32 functions may be registered for execution at program termination
- the functions registered by atexit() should be type void functions taking no arguments
  - cannot have arguments and cannot return a value
- typically, the functions invoked, would perform housekeeping tasks
  - updating a program-monitoring file
  - resetting environmental variables

**4. the abort() function**
- we just mentioned that the atexit and exit functions relate to normal termination
of a program
- the abort function causes abnormal program termination
  - raises the `SIGABRT` signal
  - returns an implementation defined code indicating unsuccessful termination
- the abort function follows the philosophy of “fail hard and fail often”
- this function causes a noticeable failure because it will dump core and generate a core file
- the following may occur
  - file buffers are not flushed
  - streams are not closed
  - temporary files are not deleted
- functions passed to atexit() are not called
- **note**: will not cause the program to terminate if SIGABRT is being caught by a
signal handler passed to signal and the handler does not return
```c
void abort(void);
```

**5. The qsort() function**
- the “quick sort” method is one of the most effective sorting algorithms
  - particularly for larger arrays
  - partitions arrays into ever smaller sizes until the element level is reached
- first, the array is divided into two parts, with every value in one partition being less than every value in the other partition
  - process continues until the array is fully sorted
- the name for the C implementation of the quick sort algorithm is `qsort()`
  - sorts a data array pointed to by a function pointer (comparison function) passed into the qsort function
- `qsort()` and the comparison function use void pointers for generality
  - you have to tell `qsort()` explicitly how large each element of the array is
  - you have to convert its pointer arguments to pointers of the proper type for your application

**Syntax**:
```c
void qsort (void *base, size_t nmemb, size_t size, int (*compar)(const void *, const void*));
```
- the first argument is a pointer to the beginning of the array to be sorted
  - can refer to any kind of array because of use of void pointer
- the second argument is the number of items to be sorted
  - converts this value to type size_t
- the third argument is the size of each element
  - because qsort() converts its first argument to a void pointer, qsort() loses track of how big each array element is
    - to compensate, you must tell qsort() explicitly the size of the data object (this argument)
- the final argument is the address of the function to be used for comparing elements
- the signature of the comparison function is
```c
int (*compar)(const void *, const void *)
```
- a pointer to a function that returns an int and that takes two arguments
  - each of which is a pointer to type const void
    - these two pointers point to the items being compared
- the comparison function should return the following
  - a positive integer if the first item should follow the second value
  - a zero if the two items are the same
  - a negative integer if the second item should follow the first

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
