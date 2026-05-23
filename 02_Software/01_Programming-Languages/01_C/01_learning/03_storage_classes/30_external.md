# Section 5: Storage Classes

## Topic: External

## Date: 21/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. External Variables**
- The extern storage class simply tells us that a variable is defined elsewhere
  - Not within the same block where it is used
- An extern variable is a global variable initialized with a legal value where it is declared in order to be used elsewhere
  - An extension to the concept of the global variable
- The main purpose of using extern variables is that they can be accessed between two different files which are part of a large program
  - Functions contained in separate files can communicate through external variables
- The extern storage class is used to give a reference of a global variable that is visible to ALL the program files
- Inside the module that wants to access the external variable
  - The variable data type is preceded with the keyword `extern` in the declaration
    - Tells the compiler that a globally defined variable from another file is to be accessed
- Suppose you want to define an int variable called moveNumber
  - You want to access the value and possibly modify it within a function contained in another file
```c
int moveNumber = 0;
```
- Declare the above, at the beginning of your program, outside of any function
  - Its value could be referenced by any function within that program
  - `moveNumber` is defined as a global variable
- This same definition of the variable `moveNumber` also makes its value accessible by functions contained in other files
- The statement defines the variable `moveNumber` not just as a global variable, but also as an external global variable
- To reference the value of an external global variable from another module
  - You must declare the variable to be accessed, preceding the declaration with the keyword `extern`
  - The variable **cannot be initialized**
    - It points the variable name at a storage location that has been previously defined
```c
extern int moveNumber;
```
- The value of `moveNumber` can now be accessed and modified by the module in which the preceding declaration
appears
- Other modules can also access the value of `moveNumber` by incorporating a similar `extern` declaration in the file
- You must obey an important rule when working with external variables
  - The variable has to be defined in some place among your source files
- The first way is to declare the variable outside of any function, not preceded by the keyword `extern`
```c
int moveNumber;
```
- The second way to define an external variable is to declare the variable outside of any function, placing the keyword `extern` in front of the declaration
- Explicitly assigning an initial value to it
```c
extern int moveNumber = 0;
```
- These two ways are mutually exclusive

**2. Extern specifier on functions**
- When a function is defined, it can be declared to be `extern` explicitly
- An extern function can be called from a file where it is not defined
  - **Where it does not need to be defined in a header file**
```c
extern double foo(double x){...}
```
- The definition of the foo function effectively becomes global to any file in the program
- Can be called from outside the file

**3. When extern actually matters**
- Only for variables, not for functions.
- **For variables:**
```c
int count = 0;       // definition (allocates storage)
extern int count;    // declaration (refers to existing one)
```
- **For functions:**
```c
void foo(void);          // declaration
extern void foo(void);   // same thing
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
