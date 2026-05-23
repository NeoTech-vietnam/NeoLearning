# Section 4: Working with Larger Programs

## Topic: Heap and Stack Memory Allocation

## Date: 19/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**

- There are three forms of memory that you can use in your program
  - static
  - stack
  - heap
- In this lecture, we will discuss these three types with a focus on the heap and stack
- Each type of memory determines where and how it is stored
- It is very important to understand the differences/advantages/disadvantages of how/where your memory is stored
  - It gives you a strategic advantage for creating scalable programs
- You have to decide when to use memory from the **stack** vs **heap** or **static memory** based on each problem you are trying to solve
- **Static memory** persists throughout the entire life of the program
  - Usually used to store things like **global variables**, or **variables** created with the **static clause**

**2. Stack**

- The stack is a special region of memory that stores temporary variables
  - Used to store variables that are created inside of a function
  - Easier to keep track of because the memory is only locally available in the function
- The stack is a "LIFO" (last in, first out) data structure that is managed and optimized by the CPU
  - A linear data structure
  - There is no need to manage the memory yourself
    - Variables are allocated and freed automatically
- The stack grows and shrinks as variables are created and destroyed inside a function
  - Every time a function declares a new variable, it is "pushed" onto the stack
  - Every time a function exits, all of the variables pushed onto the stack by that function, are freed (deleted)
  - Once a stack variable is freed, that region of memory becomes available for other stack variables
- There is a limit on the size of variables that can be stored on the stack
- If a program tries to put too much information on the stack, stack overflow will occur
  - Happens when all the memory in the stack has been allocated, and further allocations begin overflowing into other sections of memory
  - Stack overflow also occurs in situations where recursion is incorrectly used
- Stack memory is divided into successive frames where each time a function is called, it allocates itself a fresh stack frame
- A key to understanding the stack is the notion that when a function exits, all of its variables are popped off of the stack
  - Thus stack variables are local in nature
- Stack variables only exist while the function that created them is running
- A common bug is attempting to access a variable that was created on the stack inside some function, from a place in your program outside of that function (i.e. after that function has exited)

**3. Heap**
- Opposite of the stack
- A hierarchical data structure
- The heap is a large pool of memory that can be used dynamically
- Memory is not automatically managed
  - More free-floating region of memory
- The heap is managed by the programmer
  - The memory is accessed through the use of pointers
    - You have to explicitly allocate (malloc) and deallocate (free) the memory
    - Failure to free the memory when you are finished with it will result in memory leaks
      - Memory that is still “being used”, and not available to other processes
- There are generally no restrictions on the size of the heap (or the
variables it creates)
  - Other than the physical size of memory in the machine
- Variables created on the heap are accessible anywhere in the program
  - Essentially global in scope
- Heap memory is slightly slower to be read from and written to

**4. When should I use the Heap or Stack?**
- **Use the heap**
  - When you need to allocate a large block of memory
    - A large array
    - A big struct
  - When you need to keep that variable around a long time
    - A global
  - When you need variables like arrays and structs that can change size dynamically
    - Arrays that can grow or shrink as needed
- **Use the stack**
  - When you are dealing with relatively small variables that only need to persist as long as the function using them is alive
    - Easier and Faster

**5. Characteristics of the Stack (Summary)**

- Very fast access
- Do not have to explicitly de-allocate variables
- Space is managed efficiently by CPU
  - Memory is allocated in a contiguous block
  - Memory will not become fragmented
- Local variables only
- Limit on the size of the stack
- Variables cannot be resized

**6. Characteristics of the Heap (Summary)**

- Variables can be accessed globally
- No limit on memory size
- (relatively) Slower access
- You are responsible for managing the memory
- No guaranteed efficient use of space
  - Memory is allocated in any random order
  - Memory may become fragmented over time as blocks of memory are allocated, then freed
- Variables can be resized using `realloc()`

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
