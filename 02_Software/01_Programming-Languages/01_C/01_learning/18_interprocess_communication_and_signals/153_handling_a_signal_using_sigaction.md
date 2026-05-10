# Section 20: Interprocess Communication and signals

## Topic: Handling a Signal using sigaction

## Date: 18/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Handling/Catching a signal (sigaction)**
- you can handle or catch signals in your program using a sigaction
- a sigaction is essentially a function wrapper
  - a struct that contains a pointer to a function
- sigactions are used to tell the operating system which function it should call when a signal is sent to a process
  - the function is used to deal with (or handle) a signal that is sent to it
- if you have a function called foo() that you want the operating system to call when someone sends an interrupt signal to your process
  - you need to wrap the foo() function up as a sigaction
  - the function `foo()` is called the handler
- handlers are intended to be short, fast pieces of code
  - they should do just enough to deal with the signal that has been received

**2. sigaction function**
- the signal handling library (`<signal.h>`) provides the capability to catch and handle signals via the sigaction function
  - used to either examine or change a signal action
```c
int sigaction(int signum, const struct sigaction *newaction, struct sigaction *oldaction)
```
- `sigaction()` takes three parameters:
  - the signal number
    - the integer value of the signal you want to handle
  - the new action
    - this is the address of the new sigaction you want to register
  - the old action
    - if you pass a pointer to another sigaction, it will be filled with details of the current handler that you are about to replace
    - if you do not care about the existing signal handler, you can set this to NULL
- the sigaction() function will return –1 if it fails and will also set the errno variable
  - you should always check for errors in your own code

**3. struct sigaction**
```c
int sigaction(int signum, const struct sigaction *newaction, struct sigaction *oldaction)
```
- the sigaction structure contains the following fields

**Field 1** − Handler mentioned either in sa_handler or sa_sigaction
```c
void (*sa_handler)(int);
void (*sa_sigaction)(int, siginfo_t *, void *);
```
- the handler for sa_handler specifies the action to be performed based on the signum
  - `SIG_DFL` indicating default action
  - `SIG_IGN` to ignore the signal or pointer to a signal handling function
- the handler for sa_sigaction
  - specifies the signal number as the first argument
  - specifies the pointer to siginfo_t structure as the second argument
  - specifies the pointer to user content as the third argument (out of scope)
- the structure `siginfo_t` contains signal information such as the signal number to be delivered, signal value, process id, real user id of sending process, etc.

**Field 2** − Set of signals to be blocked

```c
int sa_mask;
```
- this variable specifies the mask of signals that should be blocked during the execution of signal handler

**Field 3** − Special flags

```c
int sa_flags;
```
- this field specifies a set of flags which modify the behavior of the signal

**Field 4** − Restore handler.

```c
void (*sa_restorer) (void); // returns 0 on success and -1 in case of failure
```

**3. Summary**
- the operating system talks to processes using signals
  - programs are normally stopped using signals
    - for most error signals, the default handler stops the program
- handlers can be replaced with the signal() or sigaction functions
- you can send signals to yourself with raise()
- the interval timer sends SIGALRM signals.
  - the `alarm()` function sets the interval timer.
  - there is one timer per process
- kill sends signals to a process
  - `kill -KILL` will always kill a process

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
