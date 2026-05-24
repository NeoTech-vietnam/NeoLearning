# Section 11: Advanced Funtion Concepts

## Topic: Variadic Functions

## Date: 25/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the word variadic tells us that there is some kind of change or variation is involved
  - the variation or change here is that we are dealing with unknown number of arguments for a function
- we typically use a variadic function when we do not know the total number of arguments that will be used for a function
  - one single function could potentially have `n` number of arguments
  - a variadic function will contribute to the flexibility of the program that you are developing
- the concept of a variadic function is already used in several C’s built-in functions
  - in printf when you want to print one number or many numbers
    - printf(" the one number = %d", nOneNumber);
    - printf(" the first number = %d, the second number =%d ", nOneNumber, nSecondNumber);
- if you look at the `stdio.h` header, you can see that this was implemented using variadic functions
- you may come up with a need to do this yourself from time to time, so the standard library `stdarg.h` provides you with routines to write some of your own variadic functions

**2. Using a variadic function**
- a variadic function has two parts
  - mandatory arguments
    - at least one is required and is the first one listed
    - order is very important
  - optional arguments
    - listed after mandatory arguments
- for the `printf` function
  - the first parameter is mandatory ( ” the one number = %d” )
  - the optional part comes second and it could be different( nOneNumber ), depending on the situation you are in
- common practice is to have some number that will tell us how many arguments there are (as the first argument)

**3. Creating a variadic function**
- when creating a variadic function, you must understand how to reference the variable number of arguments used inside the function
  - you do not know how many there are and you cannot possibly give them names
  - you can solve this problem indirectly, through pointers
- the `stdarg.h` library header provides you with routines that are implemented as macros (look and operate like functions)
  - you need to use these when implementing your own function with a variable number of arguments
- **va_list**
  - used in situations in which we need to access optional parameters and it is an argument list
  - represents a data object used to hold the parameters corresponding to the ellipsis part of the parameter list
- **va_start**
  - will connect our argument list with some argument pointer
  - the list specified in va_list is the first argument and the second argument is the last fixed parameter
- **va_arg**
  - will fetch the current argument connected to the argument list
  - we would need to know the type of the argument that we are reading
- **va_end**
  - used in situations when we would like to stop using are variable argument list (cleanup)
- **va_copy**
  - used in situations for which we need to save our current location
    - discussed in next lecture

**Step 1:**
- to create a function with a variable number of arguments, perform the following steps
- provide a function prototype using an ellipsis (three dots)
  - the ellipsis indicates that a variable number of arguments may follow any number of fixed arguments
    - must have at least one fixed argument
```c
void f1(int n, ...);
// valid
int f2(const char * s, int k, ...); // valid
char f3(char c1, ..., char c2);
// invalid, ellipsis not last
double f3(...);
// invalid, no parameter
```
**Steps 2 and 3:**
- create a va_list type variable in the function definition
- initialize the variable to an argument list
  - need to copy the argument list to the va_list variable using va_start
```c
double average(double v1, double v2,...) {
va_list parg;
// Pointer for variable argument list
// More code to go here...
va_start( parg, v2);
// More code to go here...
}
```
- first declare the variable `parg` of type `va_list`
- call `va_start()` with this as the first argument and specify the last fixed parameter `v2` as the second argument
- effect of the call to `va_start()` is to set the variable `parg` to point to the first variable argument that is passed to the function when it is called
- still do not know what type of value this represents

**Step 4:**
- access the contents of the argument list using va_arg()
  - takes two arguments: a type va_list variable and a type name
  - the first time it is called, it returns the first item in the list
  - the next time it is called, it returns the next item, and so on
  - the type argument specifies the type of value returned
    - has to match the specification
```c
double someFunction(int lim,...) {
va_list ap;
// declare object to hold arguments
va_start(ap, lim);
// initialize ap to argument list
double tic = va_arg(ap, double); // retrieve first argument
int toc = va_arg(ap, int);
// retrieve second argument
```
- If the first argument is 10.0, the above code for tic works fine
  - if the argument is 10, the code may not work
  - the automatic conversion of double to int that works for assignment doesn’t take place here

**Step 5:**
- you should clean up by using the `va_end()` macro as your last step
  - essential to tidy up loose ends left by the process
  - takes a va_list variable as its argument
    - resets the ap pointer to NULL
- If you omit this call, your program may not work properly
  - variable may not be usable unless you use va_start to reinitialize it
```c
va_end(ap); //clean up
```
**4. Summary of rules for variable-length argument lists**
- there must be at least one fixed parameter
- must call `va_start()` to initialize the value of the variable argument list pointer in your function
  - this pointer must be declared as type va_list
- there needs to be a mechanism to determine the type of each argument
  - either there can be a default type assumed or there can be a parameter that allows the argument type to be determined
    - for example, you could have an extra fixed argument in the average() function that would have the value 0 if the variable arguments were double and 1 if they were long
- you must have a way to determine when the list of arguments is exhausted
  - for example, the last argument in the variable argument list could have a fixed value called a sentinel value that can be detected because it’s different from all the others
  - OR the first argument could specify the count of the number of arguments in total or in the variable part of the argument list
- you must call va_end() before you exit a function with a variable number of arguments
  - If you fail to do so, the function will not work properly

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
