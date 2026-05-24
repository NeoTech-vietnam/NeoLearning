# Section 21: Threads

## Topic: Creating a thread

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. pthreads API**
- the functions that comprise the pthreads API can be grouped into three major categories
- thread management
  - routines that work directly on threads - creating, detaching, joining, etc.
  - also include functions to set/query thread attributes (joinable, scheduling etc.)
- synchronization
  - Routines that manage read/write locks and barriers and deal with synchronization
  - mutex functions provide for creating, destroying, locking and unlocking mutexes (mutual exclusion)
- condition variables
  - routines that address communications between threads that share a mutex
  - based upon programmer specified conditions
- operations that can be performed on threads include
  - thread creation
  - termination
  - synchronization (joins,blocking)
  - scheduling
  - data management
  - process interaction

**2. Creating a thread**
- the lifecycle of a thread, much like a process, begins with creation
  - threads are not forked from a parent to create a child
  - instead they are simply created with a starting function as the entry point
- on POSIX operating systems, there is a library named pthread.h
  - allows you to create threads and perform many operations on threads
  - must include this library when creating and using threads
- In this lecture, I will describe three functions that are involved in the creation of a thread
  - pthread_create, pthread_exit, and pthread_join
- the pthread_create function is called to create a new thread and make it executable
  - initially, your main() program comprises a single, default thread and all other threads must be explicitly created by the programmer
- the maximum number of threads that may be created by a process is implementation dependent
  - once created, threads are peers, and may create other threads
  - there is no implied hierarchy or dependency between threads

**3. pthread_create**
```c
int pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void*), void *arg);
```
- `pthread_create()` takes four arguments
- the first argument is of type `pthread_t`
- an integer used to identify the thread in the system
  - upon successful completion, `pthread_create()` stores the ID of the created thread in the location referenced by thread
- the second argument specifies attributes for the thread
  - you can specify a thread attributes object, or NULL for the default values
  - examples of attributes that can be specified include detached state, scheduling policy, scope, stack address and stack size
- the third argument is name of the function that the thread will execute once it is created
- the fourth argument is used to pass arguments to the function (start_routine)
  - a pointer cast of type void is required
  - NULL may be used if no argument is to be passed
  - to pass multiple arguments, you would need to use a pointer to a structure

**4. pthread_join**
- it is often useful to be able to identify when a thread has completed or exited
- the method for doing this is to join the thread, which is a lot like the wait() call for processes
- a join is performed when one wants to wait for a thread to finish
  - used to link the current thread process to another thread
  - a thread calling routine may launch multiple threads then wait for them to finish to get the results
- a call to pthread_join blocks the calling thread until the thread with identifier equal to the first
argument terminates
  - makes the program stops in order to wait for the end of the selected thread
- typically, only the main thread calls join, but other threads can also join each other
- all threads are automatically joined when the main thread terminates
- the pthread_join() also receives the return value of your thread function and stores it in a void pointer variable
  - once both threads have finished, your program can exit smoothly
```c
int pthread_join(pthread_t thread, void **value_ptr);
```
- the first argument is the thread id of the thread you want to wait for
- if the second argument is not NULL, this value is passed to `pthread_exit()` by the terminating thread

**5. pthread_exit**
- threads can be terminated in a number of ways
  - by explicitly calling pthread_exit
  - by letting the thread function return
  - by a call to the function exit which will terminate the process including any threads
- typically, the `pthread_exit()` routine is called after a thread has completed its work and is no longer required to exist
- if main() finishes before the threads it has created finish, and exits with `pthread_exit()`, the other threads will continue to execute
  - otherwise, they will be automatically terminated when main() finishes
- although not explicitly required to call `pthread_exit()` at the end of the thread function
  - it is good practice to do so, as you may have the need to return some arbitrary data back to the caller via pthread_join()
```c
void pthread_exit(void *value_ptr);
```
- the first argument makes the value_ptr available to any successful join with the terminating thread
- sometimes it is desirable for a thread not to terminate (e.g., a server with a worker thread pool)
  - can be solved by placing the thread code in an infinite loop and using condition variables

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
