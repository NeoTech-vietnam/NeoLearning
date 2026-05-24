# Section 21: Threads

## Topic: Thread Synchronization Concepts

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- In this lecture, we will be discussion some of the issues that occur when using threads and concepts that can help prevent these issues
- the issues that we will address are the following:
  - race conditions
  - deadlocks
- our goal is to strive for **thread safe code**
- all of these issues are related to thread synchronization
- thread synchronization is the concurrent execution of two or more threads that share critical resources
- threads should be synchronized to avoid critical resource use conflicts
  - otherwise, conflicts may arise when parallel-running threads attempt to modify a common variable at the same time

**2. Race conditions**
- while the code may appear on the screen in the order you wish the code to execute
  - threads are scheduled by the operating system and are executed at random
- it cannot be assumed that threads are executed in the order they are created
  - they may also execute at different speeds
- when threads are executing (racing to complete) they may give unexpected results (race condition)
- a race condition often occurs when two or more threads need to perform operations on the same memory area
  - but the results of computations depends on the order in which these operations are performed
- may occur when commands to read and write a large amount of data are received at almost the same instant
  - the machine attempts to overwrite some or all of the old data while that old data is still being read

**3. Deadlocks**
- deadlocks can occur when multiple threads are trying to access a shared resource
- a deadlock is a situation in which two threads are sharing the same resource and effectively preventing each other from accessing this resource
  - causes program execution to halt indefinitely
  - each thread is “waiting” on the other thread
- traffic gridlock is an everyday example of a deadlock situation
- the dining philosophers problem is a common example of a deadlock
  - each philosopher picks up his or her left fork and waits for the right fork to become available, but it never does
- deadlocks occur when one thread “locks” a resource and never “unlocks” that resource
  - caused by poor application of “locks” or joins
  - you have to be very careful when applying two or more “locks” to a section of code

**4. Thread safe code**
- because of the issues of race conditions and deadlocks a threaded function must call functions which are "thread safe“
  - code only manipulates shared data structures in a manner that ensures that all threads behave properly without unintended interaction
- “thread safe” means that there are no static or global variables (shared resources) which other threads may corrupt or clobber
  - usually any function that does not use static data or other shared resources is thread-safe
- thread-safe means that the program protects shared data
  - possibly through the use of mutual exclusion, atomic operations or condition variables
  - you want to strive to write “thread-safe” code
- thread-unsafe functions may be used by only one thread at a time in a program and the uniqueness of the thread must be ensured

**5. Mutual Exclusion**
- a critical section of code is code that contains a shared resource and is accessible by multiple processes or threads
  - it is important for a thread programmer to minimize critical sections if possible
- mutual exclusion is when a process or a thread is prevented simultaneous access to a critical section
  - a property of concurrency control which is used to prevent race conditions
- mutual exclusion is the method of serializing access to shared resources
- you do not want a thread to be modifying a variable that is already in the process of being modified by another thread
- another scenario is where a value is in the process of being updated and another thread reads an old value

**6. Mutexes**
- a mutex is a lock that one can virtually attach to some resource
- one of the primary means of implementing thread synchronization and for protecting shared data
  - used to prevent data inconsistencies due to race conditions
- anytime a global resource is accessed by more than one thread the resource should have a mutex associated with it
  - can apply a mutex to protect a segment of memory ("critical region") from other threads
- if a thread wishes to modify or read a value from a shared resource, the thread must first gain the lock
  - once it has the lock it may do what it wants with the shared resource without concerns of other threads accessing the shared resource because other threads will have to wait
  - once the thread finishes using the shared resource, it unlocks the mutex, which allows other threads to access the resource
- as an analogy, you can think of a mutex as a safe with only one key and the resource it is protecting lies within the safe
  - only one person can have the key to the chest at any time, therefore, is the only person allowed to look or modify the contents of the chest at the time it holds the key

**7. Atomic operations and Condition variables**
- atomic operations allow for concurrent algorithms and access to certain shared data types without the use of mutexes
  - one can modify some variable within a multithreaded context without having to go through a locking protocol
- condition variables allow threads to synchronize to a value of a shared resource
  - used as a notification system between threads
- you could have a counter (flag) that once it reaches a certain count
  - a thread will activate and then wait on a condition variable
- active threads will signal on this condition variable to notify other threads waiting/sleeping on this condition variable
  - causing a waiting thread to wake up
- you can also use a broadcast mechanism if you want to signal all threads waiting on the condition variable to wakeup
- when waiting on condition variables, the wait should be inside a loop

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]