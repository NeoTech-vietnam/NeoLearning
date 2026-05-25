# Section 5: Storage Classes

## Topic: Static

## Date: 21/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- The static storage class can be used on **local** and **global** variables, as well as **functions**
- When applied to **local variables** it instructs the compiler to keep the variable in existence during the life-time of the program
- When applied to **global variables**, the static modifier causes that variable's scope to be restricted to the file in which it is declared
- When applied to **functions**, the static function can be called only from within the same file as the function appears

**2. Automatic and static variables (local statics)**
- We know that when you normally declare a local variable inside a function
  - You are declaring automatic local variables
  - Recall that the keyword `auto` can, in fact, precede the declaration of such variables (optional)
  - An **automatic variable** is actually created each time the function is called and destroyed upon exit of the function
- **Automatic local variables** can be given initial values
  - The value of the expression is calculated and assigned to the automatic local variable each time the function is called
  - Because an automatic variable disappears after the function completes execution, the value of that variable disappears along with it
  - The value an automatic variable has when a function finishes execution is guaranteed not to exist the next time the function is called
- **Static variables** have a property of preserving their value even after they are out of their scope
  - Static variables preserve the value of their last use in their scope.
  - No new memory is allocated because they are not re-declared
  - Their scope is local to the function to which they were defined
- Making local variables static allows them to maintain their values between function calls
  - Does not create and destroy the local variable each time it comes into and goes out of scope

**3. Initialization of local statics**
- A **static**, **local** variable is initialized only once at the start of overall
program execution
  - Not each time that the function is called
- The **initial value** specified for a **static variable** must be a simple constant or constant expression
- **Static variables** also have default initial values of zero, unlike automatic variables, which have no default initial value
- **Static variables** are allocated memory **on the heap**, not on the stack

**4. Static Versus Extern Variables (global statics)**

- There are situations that arise in which you want to define a variable to be global but not external
- You want to define a `global variable` to be `local` to a particular module
(file)
- It makes sense to want to define a variable this way if no functions other than those contained inside a particular file need access to the particular variable
- In these situations, you should define the variable to be `static`
- by default, they are assigned the value 0 by the compiler
- If the below declaration is made outside of any function
  - Makes the value of the variable accessible from any subsequent point in the file in which the definition appears
    - Not from functions contained in other files
```c
static int moveNumber = 0;
```
- If you need to define a `global variable` whose value does not have to be accessed from another file
  - Declare the variable to be `static`
  - A cleaner approach to programming
- The `static` declaration more accurately reflects the variable’s usage
  - No conflicts can be created by two modules that unknowingly both use different external global variables of the same name

**5. Static and Extern Variables on functions**
- When a function is defined, it can be declared to be `extern` or `static`
  - `extern` case being the default
- A `static` function can be called only from within the same file as the function appears
```c
static double foo(double x){...}
```
- The definition of the `foo` function effectively becomes local to the file in which it is defined
- Cannot be called from outside the file

**6. static and structures**
- **static variables** should not be declared inside a structure
- The C compiler requires the entire structure elements to be placed together
  - Memory allocation for structure members should be contiguous
- It is possible to declare a structure
  - Inside a function (stack segment)
  - Allocate memory dynamically(heap segment)
  - It can be even global
- Whatever might be the case, all structure members should reside in the same memory segment
  - The value for the structure element is fetched by counting the offset of the element from the beginning address of the structure
- Separating out one member alone to a data segment defeats the purpose of a static variable
- It is possible to have an entire structure as static

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
