# Section 5: Storage Classes

## Topic: Heap and Stack Memory Allocation

## Date: 19/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Storage Classes**
- Storage classes are used to describe the features of a variable/function
  - Include the scope, visibility and life-time
  - Help us to trace the existence of a particular variable during the runtime of a program
- The lifetime of a variable is the time period during which variable exist in computer memory
  - Some exist briefly, some are repeatedly created and destroyed, and others exist for the entire execution of a program
- The scope of the variable is where the variable can be referenced in a program
  - Some can be referenced throughout a program, others from only portions of a program
- A variable’s visibility or linkage, determines for a multiple-source-file program whether the identifier is known only in the current source file or in any source file with proper declarations

**2. Auto Storage Class**
- C provides four storage classes, indicated by their storage class specifiers
  - auto
  - register
  - extern
  - Static
- The four storage-class specifiers can be split into two storage durations
  - Automatic storage duration
  - Static storage duration
- Keyword auto is used to declare variables of automatic storage duration
  - Created when the block in which they are defined is entered
  - Exist while the block is active
  - Destroyed when the block is exited

**3. Local Variables**
- Local variables are declared within a function body or block of code
- Local variables have automatic storage duration by default
- So, these variables are known as automatic local variables
  - They are automatically created each time the function is called
  - Their values are local to the function
- The value of a local variable can only be accessed by the function in which the variable is defined
  - Its value cannot be accessed by any other function
  - If an initial value is given to a variable inside a function, that initial value is assigned to the variable each time the function is called
- The C compiler assumes by default that any variable defined inside a function is an automatic local variable
  - The keyword **auto** is seldom used
- C++ has repurposed the auto keyword for a quite different use, so simply not using auto as a storage-class specifier is better for C/C++ compatibility
- You can, however, make your intentions perfectly clear by explicitly using the keyword auto before the definition of the variable
  - You might do this to document that you are intentionally overriding an
external variable definition
  - Or that it is important not to change the variable to another storage class

**4. Why use Auto?**
- Automatic storage is a means of conserving memory
  - Automatic variables exist only when they are needed
  - They are created when the function in which they are defined is
  entered
  - They are destroyed when the function is exited
- Automatic storage is an example of the principle of least privilege
  - Allowing access to data only when it is absolutely needed
- Why have variables stored in memory and accessible when in fact they
are not needed?

**5. Syntax**
- Storage classes precede the type of the variable
- To specify the storage class for a variable, the following syntax is to be followed 
```c
storage_class var_data_type var_name;
```
- The following declaration indicates that double variables x and y are automatic local variables
  - They exist only in the body of the function in which the declaration appears
```c
auto double x, y;
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
