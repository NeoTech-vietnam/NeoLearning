# Section 20: Interprocess Communication and signals

## Topic: Handling a Signal using the signal() function

## Date: 18/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- it is possible to handle or catch almost all signals in your program
- sometimes you need to run your own code when receiving a signal (handle/catch)
  - maybe your process has files or network connections open
    - it might want to close things down and tidy up before exiting
- it is also possible to ignore almost all signals
  - neither performing the default action nor handling the signal
- a few signals cannot be ignored or handled/caught
  - `SIGKILL`, `SIGABRT` and `SIGSTOP` (which is why "kill 9" is the ultimate kill statement)
- the actions performed for signals are
  - default action
  - handle the signal
  - ignore the signal

**2. Handling/Catching a signal**
- the signal handling library (`<signal.h>`) provides the capability to catch and handle signals
- signal handling can be done in two different ways through system calls
- signal() or sigaction()
- first, lets discuss using the signal function
- this function is used to tell the operating system which function it should call when a signal is sent to a process
  - the function is used to deal with (or handle) a signal that is sent to it
- if you have a function called `foo()` that you want the operating system to call when someone sends an interrupt signal to your process
  - you need pass the function name foo to the signal function as a parameter
  - the function `foo()` is called the handler
- handlers are intended to be short, fast pieces of code
  - they should do just enough to deal with the signal that has been received
- the signal function receives two arguments
  - an integer signal number and a pointer to the signal handling function
- the signal function returns
  - on success returns the address of a function that takes an integer argument and has no return value
  - on error returns SIG_ERR in case of error
```c
#include <signal.h>
typedef void (*sighandler_t) (int);
sighandler_t signal(int signum, sighandler_t handler);
```
- the system call `signal()` would call the registered handler (second parameter) upon generation of signal
- the handler (second parameter) can be either one of
  - `SIG_IGN` (Ignoring the Signal)
  - `SIG_DFL` (Setting signal back to default mechanism)
  - or user-defined signal handler or function address


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
