# Section 20: Interprocess Communication and signals

## Topic: The fork() System Call

## Date: 18/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- in multitasking operating systems, processes (running programs) need a way to create new processes
  - a new process is often needed to run other programs or to run a different “branch” of the existing program
- the `fork()` system call is a function where a process creates a copy of itself
  - creates a new process
  - defined in `<unistd.h>`
- when a process calls `fork()`, it is deemed the parent process and the newly created process is its child
- the child process has an exact copy of all the memory segments of the parent process
  - the `fork()` operation creates a separate address space for the child
    - updating a variable in one process will not affect the other
- the fork() function does not take any parameters and returns a process ID
```c
pid=fork();
```
- the returned process ID is of type `pid_t` defined in `<sys/types.h>`
  - the process ID is an integer
  - as mentioned in a previous lecture, a process can use function `getpid()` to retrieve the process ID assigned to this process
- in the subsequent blocks of code you need to check the value of `pid` to determine whether you are in the parent or child process
  - returns a negative value when the creation of a child process was unsuccessful
  - returns a zero value to the newly created child process
  - returns a positive value, the process ID of the child process, to the parent
- when we test the value of `pid` to find whether it is equal to zero or greater than it we are effectively finding out whether we are in the child process or the parent process

**2. Use Case**
- `fork()` is often used with the `exec()` system call in order to start the execution of a different program
- a typical use case is that a process will first invoke the `fork()` function to create a copy of itself
  - then, the copy (child process), calls the `exec()` system call to overlay itself with the other program
    - it ceases execution of its former program in favor of the other
- after a new child process is created, both processes will execute the next instruction following the `fork()` system call
  - child and parent processes run in parallel
    - we have to distinguish the parent from the child
      - this can be done by testing the returned value of `fork()`

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
