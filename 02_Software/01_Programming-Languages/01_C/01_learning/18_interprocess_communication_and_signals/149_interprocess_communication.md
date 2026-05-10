# Section 20: Interprocess Communication and signals

## Topic: Interprocess commnunication

## Date: 16/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Processes**
- a process is a program in execution
- a program is a file containing the information of a process
  - when you start execution of the program, it is loaded into RAM and starts executing
- each process has its own address space and (usually) one thread of control
- you can have multiple processes executing the same program
  - BUT each process has its own copy of the program within its own address space and executes it independently of the other copies
- processes are organized hierarchically
  - each process has a parent process which explicitly arranged to create it
- the processes created by a given parent are called its child processes
  - a child inherits many of its attributes from the parent process
- a system call is a request for service that a program makes of the kernel (the brain of the operating system)
  - the service is generally something that only the kernel has the privilege to do
  - sometimes called kernel calls
- programmers do not normally need to be concerned with system calls because there are functions in the GNU C Library to do virtually everything that system calls do
  - these functions work by making system calls themselves
- each process is identified with a unique positive integer called a process ID (PID)
- the system call getpid() returns the process ID of the calling process
  - this call is always successful and thus no return value to indicate an error
```c
#include <sys/types.h>
#include <unistd.h>
pid_t getpid(void);
```
- the system call getppid() returns the Parent PID of the calling process

**2. Example**
```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
int main() {
    int mypid, myppid;
    printf("Program to know PID and PPID's information\n");
    mypid = getpid();
    myppid = getppid();
    printf("My process ID is %d\n", mypid);
    printf("My parent process ID is %d\n", myppid);
    printf("Cross verification of pid's by executing process commands on shell\n");
    system("ps -ef");
    return 0;
}
```

**3. Interprocess communication**
- a process can be of two types
  - independent process
    - not affected by the execution of other processes
    - does not interact with other programs
  - co-operating process
    - affected by other executing processes
    - can be used for increasing computational speed, convenience and modularity
- what if you want to send specific data to a process or read its output?
- interprocess communication lets processes work together
  - programs can be much more powerful by letting them talk to other programs on your system
  - often referred to as IPC
- to reiterate, each process has its own address space
- if any process wants to communicate with some information from its own address space to other processes
  - it is only possible with IPC (inter process communication) techniques
- the communication between multiple processes can be seen as a method of co-operation between them
- communication can be of two types
  - between related processes initiating from only one process, such as parent and child processes
  - between unrelated processes, or two or more different processes
- a process can communicate with another process in many different ways
- **pipes (same process)**
  - first process communicates with the second process, allows flow of data in one direction only (half duplex)
- **named pipes (different processes, FIFO)**
  - the first process can communicate with the second process and vice versa at the same time (full duplex)
- **message queues**
  - processes will communicate with each other by posting a message and retrieving it out of a queue (full duplex)
- **shared memory**
  - communication between two or more processes is achieved through a shared piece of memory among all processes
- **sockets**
  - mostly used to communicate over a network between a client and a server
- **signals**
  - communication between multiple processes by way of signaling
  - a source process will send a signal (recognized by number) and the destination process will handle it accordingly

**4. Pipes (named and anonymous)**
- a pipe is a communication mechanism between two or more related or interrelated processes
  - can be either within one process or a communication between the child and the parent processes
- communication can also be multi-level such as communication between the parent, the child and the grand-child, etc.
- can be thought of filling water with the pipe into some container, say a bucket, and someone retrieving it, say with a mug
  - the filling process is nothing but writing into the pipe and the reading process is nothing but retrieving from the pipe
  - implies that one output (water) is input for the other (bucket)
- another name for a named pipe is FIFO (First-In-First-Out)
- system calls are used for creating and using pipes
- steps to utilize pipes for IPC are
  - create a pipe
  - send a message to the pipe
  - retrieve the message from the pipe and write it to the standard output
  - send another message to the pipe
  - retrieve the message from the pipe and write it to the standard output

**5. Message Queues**
- all processes can exchange information through access to a common system message queue
- message queues are a sort-of mix between signals and sockets
  - allows you to create a data stream of messages which can allow one or multiple processes to communicate between them
  - sending and receiving can be achieved by using a simple function
- the sending process places a message (via some (OS) message-passing module) onto a queue which can be read by another process
  - each message is given an identification or type so that processes can select the appropriate message
  - process must share a common key in order to gain access to the queue in the first place.
- system calls are used for creating and using message queues
- to perform communication using message queues, follow the below steps
  - the `ftok()` function is used to generate a unique key
  - create a message queue or connect to an already existing message queue (`msgget()`)
  - write into message queue (`msgsnd()`)
  - read from the message queue (`msgrcv()`)
  - perform control operations on the message queue (`msgctl()`)

**6. Shared Memory**
- shared memory is memory shared between two or more processes
- communication is done via this shared memory where changes made by one process can be viewed by another process
- communication between processes requires processes to share some variable and it completely depends on how programmer will implement it
- system calls allow you to create a memory segment which can be accessed and modified by multiple processes
  - setting it up is easy (and similar to Message Queues)
  - managing the given data segment might be the only tricky part
- to perform communication using shared memory, follow these steps
  - create the shared memory segment or use an already created shared memory segment (`shmget()`)
  - attach the process to the already created shared memory segment (`shmat()`)
  - detach the process from the already attached shared memory segment (`shmdt()`)
  - control operations on the shared memory segment (`shmctl()`)


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
