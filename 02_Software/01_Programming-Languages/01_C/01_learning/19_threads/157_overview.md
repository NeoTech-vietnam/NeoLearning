# Section 21: Threads

## Topic: Overview

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- programs often need to do several things at the same time
- games need to update the graphics on the screen while also reading input from a game controller
- chat programs will need to read text from the network and send data to the network at the same time
- media players will need to stream video to the display as well as watch for input from the user controls

**2. Processes**
- simple processes do one thing at a time
- in the real world, you cannot do all of the tasks at the same time (not by yourself)
  - if someone comes into the shop, you may need to stop stocking the shelves to help a customer
- if you work in a shop alone, you are the same as a simple process
  - you do one thing after another, but always one thing at a time
  - you can switch between tasks to keep everything going
    - but what if there is a blocking operation?
    - what if you are serving someone at the checkout and the phone rings?
- most of the programs we have written so far have had a single path of execution
  - there has only been one task working inside the program’s process
  - the main() function is the single path of execution (sequentially, line by line)

**3. Working on tasks at the same time**
- so, how can your code perform several different tasks at once?
  - how about creating a process to handle all these tasks (fork)?
    - the answer is no
- processes take time to create
  - creating a process for each task is not efficient
- processes cannot share data easily
  - separate processes have a complete copy of all the data from the parent process
    - if the child needs to send data back to the parent, then you need use some method of IPC (pipes, shared memory, message queues, sockets)
- processes are just plain difficult
  - you need to create a chunk of code to generate processes, and that can make your programs long and messy

**4. Threads**
- you need something that starts a separate task quickly, can share all of your current data, and will not require a lot of code to write
  - the answer is to use threads
- threads are a way to divide a single process into sub-runnable parts
  - a separate path of execution inside a program
  - sometimes called lightweight processes
- a thread can also be scheduled independently of the larger program that it is inside of (done by the OS)
  - means that a single program may actually use more than 100% of CPU resources on multi-processor machines
- a thread has its own unique id, program counter (PC), a register set, and a stack space just like a process
- threads share memory across each thread by having the same address space (unlike multi-processes)
  - two threads have access to the same set of variables and can alter each other's variable values
    - if one thread changes a global variable, all of the other threads will see the change immediately
- threads also share OS resources like open files and signals
  - all of the threads will all be able to read and write to the same files and talk on the same network sockets

**5. Multi-threading**
- threads are popular way to improve an application through parallelism (simultaneous running of code)
  - several tasks can execute concurrently (many tasks can run in any order and possibly in parallel)
- a multithreaded program is like a shop with several people working in it
- If one person is running the checkout, another is filling the shelves, and someone else is waxing the surfboards
  - everybody can work without interruptions
  - if one person answers the phone, it won’t stop the other people in the shop
- in the same way that several people can work in the same shop, you can have several threads living inside the same process (program)
  - each thread runs independently (a thread of execution)
- multi-threading means you can give each thread a separate task and they will all be performed at the same time
  - in a browser, multiple tabs can be different threads
  - MS word uses multiple threads, one thread to format the text, other thread to process inputs, etc.

**6. Advantages of using threads**
- threads require less overhead than "forking" or spawning a new process
- the system does not initialize a new system virtual memory space and environment
- threads provide efficient communication and data exchange because they share the same address space
- threaded applications offer potential performance gains and practical advantages over non-threaded applications in several ways
  - the creation of a thread is much faster (much less operating system overhead)
  - faster context switching
  - faster termination of a thread

**7. Disadvantages of using threads**
- very easy to overlook the consequences of interactions between concurrently executing threads
  - considerable potential for very obscure errors in your code
- providing for thread synchronization is the is the biggest issue
  - the potential for two or more threads attempting to access the same data at the same time
- imagine a program with several threads that may access a variable containing salary data
- suppose that two independent threads can modify the value
- if one thread accesses the value to change it and the second thread does the same before the first thread has stored the modified value
  - you will have inconsistent data

**8. Multi-threading in C**
- C is a language that runs on one thread by default (main), which means that the code will only run one instruction at a time
- C does not contain any built-in support for multithreaded applications
  - unless you count C11, but, these threads are not very portable and not widely supported
- threading was traditionally provided via hardware and OS support in the past
  - implementations differed substantially from each other making it difficult for programmers to develop portable threaded applications
- in order to take full advantage of the capabilities provided by threads, a standardized programming interface was required
- In 1995, POSIX became the standard interface for many system calls in UNIX including the threading environment
- we are going to write multi-threaded C programs using POSIX threads
  - also known as pthreads, implementation is available with the gcc compiler
    - the key model for programming with threads in nearly every language (Java, python and other high level languages)

**9. POSIX thread (pthread) libraries**
- the POSIX thread libraries are a standards based thread API for C/C++
  - allows one to spawn a new concurrent process flow
  - can be found on almost any modern POSIX-compliant OS
- it is most effective on multi-processor or multi-core systems where the process flow can be scheduled to run on another processor
  - thus gaining speed through parallel or distributed processing
- a thread is spawned by defining a function and it's arguments which will be processed in the
thread
  - the purpose of using the POSIX thread library in your software is to execute software faster
- pthread functions are defined in a pthread.h header/include file and implemented in a thread library

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
