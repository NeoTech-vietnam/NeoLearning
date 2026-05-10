# Section 16: Advanced Pointers

## Topic: Functions pointers

## Date: 02/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- functions contain addresses and thus, we can use pointers to point to functions
  - not as common as other pointer use cases
- pointers to functions can be
  - passed to functions
  - returned from functions
  - stored in arrays
  - assigned to other function pointers
- a function pointer can be used directly as the function name when calling the function
- they are less error prone than normal pointers cause you will never allocate or deallocate memory with them
  - you just need to understand what they are and to learn their syntax

**2. Common uses of function pointers**
- a function pointer can be used as an argument to another function
  - telling the second function which function to use
- sorting an array involves comparing two elements to see which comes first
  - the qsort() function from the C library is designed to work with arrays of any kind as long as you tell it what function to use to compare elements
  - takes a pointer to a function as one of its arguments
  - uses that function to sort the type (whether it be integer, string, or structure)
- another common application for function pointers is to create what is known as dispatch tables
- you can create tables that contain pointers to functions to be called
- you might create a table for processing different commands that will be entered by a user
  - each entry in the table could contain both the command name and a pointer to a function to call to process that particular command
  - whenever the user enters a command, you can look up the command inside the table and invoke the corresponding function to handle it
- menu-driven systems are also a common use of function pointers
- you can use them to replace switch/if-statements
- you can use them to realize your own late-binding
- you can use them to implement callbacks
- function pointers are useful when alternative functions may be used to perform similar tasks on data

**3. Syntax**
- a pointer to a function stores the address for the start of the function code
  - however, the address by itself is not enough information to invoke it
  - we need to know the number and type of the arguments to be supplied and the type of return value to be expected
  - compiler can not deduce this information just from the address of the function
- this means that declaring a pointer to a function is going to be a little more complicated than declaring a pointer to a data type
  - a function pointer holds an address and must also define a prototype
- just as a pointer to a variable is dereferenced to access the value of the variable, a pointer to a function is dereferenced to use the function

**4. Declaration**
- function pointers can be declared, assigned values and then used to access the functions they point to
- the declaration for a pointer to a function looks a little strange and can be confusing
- when you declare a data pointer, you have to declare the type of data to which it points
- when declaring a function pointer, you have to declare the type of function pointed to
  - to specify the function type, you specify the function signature (the return type for the function and the parameter types for a function)
```c
int (*pfunction) (int);
```
- declares a variable that is a pointer to a function
  - does not point to anything
  - just defines the pointer variable
- the name of the pointer is `pfunction`
- the parentheses are essential in the declaration because of the operators’ precedence
  - the declaration without the parentheses
    ```c
    int *pfunction(int);
    ```
  - will declare a function pfunction that returns an integer pointer that is not our intention in this case
- the declaration is the de-referenced value of `pfunction (*pfunction)`
- points to functions that have one parameter of type `int` and that return a value of type `int` to the calling function
  - you can only use this particular `pointer` to point to functions with these parameters and return value
- if you want a `pointer` to functions that accepts a `float` argument and returns `float` values
  - you need to declare another pointer with the required characteristics

**5. Assignment**
```c
int (*pfunction) (int);
```
- to set your function pointer pointing to an existing specific function, you simply assign the name of the function to it
```c
int lookup(int);
pfunction = lookup; or pfunction = &lookup;
```
- stores a pointer to this function inside the function pointer variable pfunction
writing a function name without a subsequent set of parentheses is treated in an analogous way to writing an array name without a subscript
  - compiler automatically produces a pointer to the specified function
  - an ampersand is permitted in front of the function name, but it’s not required
- if the `lookup()` function has not been previously defined in the program, it is necessary to declare the function before the preceding assignment can be made

**6. Invocation**
```c
int (*pfunction) (int);
```
- you can call the function by applying the function call operator to the pointer
- listing any arguments to the function inside the parentheses
```c
int value = pfunction(5);
```
- calls the function pointed to by pfunction, storing the returned value inside the variable value
- you use the function pointer name just like a function name to call the function that it points to
  - no dereference operator is required

**7. qsort example**
- the qsort standard library function is very useful function
  - designed to sort an array by a key value of any type into ascending order
  - as long as the elements of the array are of fixed type
- qsort is prototyped in `(stdlib.h)`
```c
void qsort(void *base, size_t num_elements, size_t element_size, int (*compare)(void const *, void const *));
```
- the argument base points to the array to be sorted and num_elements indicates how long the array is, with element_size the size in bytes of each array element
- the final argument, compare is a pointer to a function
- qsort calls the compare function which is user defined to compare the data when sorting
  - qsort maintains it's data type independence by giving the comparison responsibility to the user
- the compare function must return certain (integer) values according to the comparison result
  - less than zero, if first value is less than the second value
  - zero, if first value is equal to the second value
  - greater than zero, if first value is greater than the second value
- to sort the following structure by integer key
```c
typedef struct {
  int key;
  struct other_data;
} record;
```
- we can write a compare function
```c
int record_compare(void const *a, void const *a){
return ( ((record *)a)->key - ((record *)b)->key );
}
```
- assuming that we have an array of array_length records suitably filled with date we can call qsort like this
```c
qsort( array, arraylength, sizeof(record), record_compare);
```

**8. Pointer to a function vs. function returning a pointer**
```c
/* function returning pointer to int */
int *func(int a, float b);
/* pointer to function returning int */
int (*func)(int a, float b);
```
- the difference between the above two declarations is only in
the parentheses
  - be very careful about placing the parentheses in the right place

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
