# Section 4: Working with Larger Programs

## Topic: Communication between files 

## Date: 14/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- Methods can be used so that the modules contained in separate files can effectively communicate
- If a function from one file needs to call a function contained inside another file
  - A function call can be made in the normal fashion
    - Arguments can be passed and returned in the usual way
  - In the file that calls the function, you should always make certain to include a **prototype declaration**
    - So that the compiler knows the function’s argument types and the type of the return value
- It is important to remember that even though more than one module might be specified to the compiler at the same time on the command line
  - The compiler compiles each module independently
    - Means that **no knowledge about structure definitions**, function return types, or function argument types is shared across module compilations by the compiler
- It is up to you to ensure that the compiler has sufficient information about such things to correctly compile each module

**2. External Variables**
- Functions contained in separate files can communicate through **external variables**
  - An extension to the concept of the **global variable**
- An **external variable** is one whose value can be accessed and changed by another module (file)
- Inside the module that wants to access the external variable
  - The variable data type is preceded with the keyword `extern` in the declaration
    - Tells the compiler that a globally defined variable **from another file** is to be accessed
- Suppose you want to define an int variable called `moveNumber`
  - You want to access the value and possibly modify it within a function contained in another file
```c
int moveNumber = 0;
```
- Declare the above, at the beginning of your program, outside of any function
  - Its value could be referenced by any function within that program
  - `moveNumber` is defined as a **global variable**
- This same definition of the variable `moveNumber` also makes its value accessible by functions contained in other files
- The statement defines the variable `moveNumber` not just as a global variable, but also as an **external global variable**
- To reference the value of an external global variable from another module
  - You must declare the variable to be accessed, preceding the declaration with the keyword extern
```c
extern int moveNumber;
```
- The value of `moveNumber` can now be accessed and modified by the module in which the preceding declaration appears
- Other modules can also access the value of `moveNumber` by incorporating a similar **extern declaration in the file**

**3. Static Versus Extern Variables**
- There are situations that arise in which you want to define a variable to be **global but not external**
- You want to define a global variable to be local to a particular module (file)
- It makes sense to want to define a variable this way if no functions other than those contained inside a particular file need access to the particular variable
- In these situations, you should define the variable to be **static**
- If the below declaration is made outside of any function
  - Makes the value of the variable accessible from any subsequent point in the file in which the definition appears
- Not from functions contained in other files
```c
static int moveNumber = 0;
```
- If you need to define a global variable whose value does not have to be accessed from another file
  - Declare the variable to be `static`
  - A cleaner approach to programming
- The `static` declaration more accurately reflects the variable’s usage
  - No conflicts can be created by two modules that unknowingly both use different **external global variables of the same name**


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
