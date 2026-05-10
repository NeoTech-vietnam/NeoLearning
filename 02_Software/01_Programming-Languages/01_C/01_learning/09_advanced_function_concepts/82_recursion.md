# Section 11: Advanced Funtion Concepts

## Topic: Recursion

## Date: 02/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the programs we have discussed are generally structured as functions that call one another in a hierarchical manner
- for some types of problems, it is useful to have functions call themselves
- a recursive function is a function that calls itself either directly or indirectly
- recursive functions can be effectively used to succinctly and efficiently solve problems
  - commonly used in applications in which the solution to a problem can be expressed in terms of successively applying the same solution to subsets of the problem
- you are unlikely to come across a need for recursion very often
  - provides considerable simplification of the code needed to solve particular problems
- it takes a great deal of practice writing recursive programs before the process will appear natural
- recursion can be confusing and tricky at first
  - when a function calls itself, there is the immediate problem of how the process stops
```c
void Looper(void) {
printf("Looper function called.\n");
Looper();
// Recursive call to Looper()
}
```
- calling this function would result in an indefinite number of lines of output
  - after executing the printf() call, the function calls itself
  - there is no mechanism in the code that will stop the process
  - similar to the problem you have with an infinite loop
- a function that calls itself must contain a conditional test (base case) that terminates the recursion

**2. Example**
```c
int factorial(int n) {
//Factorial of 0 is 1 (base case is 0, return 1)
if(n==0) return(1);
return(n*factorial(n-1));
}
```
- when a recursive function is called with a base case, the function simply returns a result
- when the function is called with a more complex problem
  - the function divides the problem into two conceptual pieces
    - a piece that the function knows how to do
    - a slightly smaller version of the original problem
- the recursion step can result in many more such recursive calls as the function keeps working on the smaller problem
- for recursion to terminate, the sequence of smaller and smaller problems must converge on the base case
  - when the function recognizes the base case, the result is returned to the previous function call
    - a sequence of returns ensues all the way up the line until the original call of the function eventually returns the final result
- recursive functions are most commonly illustrated by an example that calculates the factorial of a number
  - the factorial of a positive integer n, written n!, is simply the product of the successive integers 1 through n
  - the factorial of 0 is a special case and is defined equal to 1
```c
5! = 5 x 4 x 3 x 2 x 1 = 120
```
- in the general case, the factorial of any positive integer n greater than zero is equal to `n` multiplied by the factorial of `n - 1`
```c
n! = n x (n - 1)!
```
- the expression of the value of `n!` in terms of the value of `(n-1)!` is called a recursive definition
  - the definition of the value of a factorial is based on the value of another factorial

**3. Example explanation**
- the sequence of operations that is performed in the evaluation of factorial (3) can be
conceptualized as follows
```c
factorial (3) = 3 * factorial (2)
= 3 * 2 * factorial (1)
= 3 * 2 * 1 * factorial (0)
= 3*2*1*1
= 6
```
- it would be a good idea for you to trace through the operation of the `factorial()`
function with a pencil and paper
  - assume that the function is initially called to calculate the factorial of 4
  - list the values of n and result at each call to the `factorial()` function

**4. Recursion vs. Iteration**
- any problem that can be solved recursively can also be solved iteratively (non-recursively
using loops)
- both iteration and recursion are based on a control structure
  - iteration uses a repetition structure
  - recursion uses a selection structure
- both iteration and recursion involve repetition
  - iteration explicitly uses a repetition structure
  - recursion achieves repetition through repeated function calls
- iteration and recursion each involve a termination test
  - iteration terminates when the loop-continuation condition fails
  - recursion terminates when a base case is recognized
- iteration with counter-controlled repetition and recursion each gradually approach termination
  - iteration keeps modifying a counter until the counter assumes a value that makes the loop-continuation condition fail
  - recursion keeps producing simpler versions of the original problem until the base case is reached
- both iteration and recursion can occur infinitely
  - an infinite loop occurs with iteration if the loop-continuation test never becomes false
  - infinite recursion occurs if the recursion step does not reduce the problem each time in a manner that converges on the base case
- a recursive approach is normally chosen in preference to an iterative approach when the recursive approach more naturally mirrors the problem
  - results in a program that is easier to understand and debug

**5. Recursion Pros and Cons**
- recursion sometimes offers the simplest solution to some programming problems
- recursive functions can rapidly exhaust a computer’s memory resources
  - it repeatedly invokes the mechanism, and consequently the overhead, of function calls
    - expensive in both processor time and memory space
  - each recursive call causes another copy of the function (only the function’s variables) to be created (can consume considerable memory)
- avoid using recursion in performance situations
- recursion can be difficult to document and maintain

**6. Tail Recursion**
- tail recursion is the simplest form of recursion
  - the recursive call is at the end of the function, just before the return statement
  - the recursive call comes at the end
  - acts like a loop
- tail recursive functions can be optimized by compiler
  - since the recursive call is the last statement, there is nothing left to do in the current function, so saving the current function’s stack frame is of no use
```c
void print(int n) {
if (n < 0) return;
// The last executed statement is recursive call
print(n-1);
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
