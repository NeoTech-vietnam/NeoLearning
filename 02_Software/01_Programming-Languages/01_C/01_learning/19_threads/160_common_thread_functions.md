# Section 21: Threads

## Topic: Common Thread Functions

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. pthread_detach**
- when a thread is created, one of its attributes defines whether it is joinable or detached
  - by default if you passed NULL as the second argument the thread will be in joinable state
  - only threads that are created as joinable can be joined
    - if a thread is created as detached, it can never be joined
- If you know in advance that a thread will never need to join with another thread, consider creating it in a detached state
  - some system resources may be able to be freed
- there are two common use cases of when you would want to detach
  - in a cancellation handler for a pthread_join()
    - nearly essential to have a pthread_detach() function in order to detach the thread on which pthread_join() was waiting
  - in order to detach the "initial thread" (as may be desirable in processes that set up server threads)
- the pthread_detach() routine can be used to explicitly detach a thread even though it was created as joinable
```c
int pthread_detach(pthread_t thread);
```

**2. Stack Management**
- the POSIX standard does not dictate the size of a thread's stack
  - implementation dependent and varies
- exceeding the default stack limit is often very easy to do
  - results in program termination and/or corrupted data
- safe and portable programs do not depend upon the default stack limit
  - instead, explicitly allocate enough stack for each thread by using the pthread_attr_setstacksize function
```c
pthread_attr_getstacksize (attr, stacksize)
pthread_attr_setstacksize (attr, stacksize)
```

**3. pthread_equal and pthread_once**
- the pthread_equal function compares two thread IDs
  - if the two IDs are different 0 is returned, otherwise a non-zero value is returned
  - operator == should not be used to compare two thread IDs against each other
```c
pthread_equal (thread1,thread2)
```
- the pthread_once function executes the init_routine exactly once in a process
  - the first call to this function by any thread in the process executes the given init_routine, without parameters
  - any subsequent call will have no effect
```c
pthread_once (once_control, init_routine)
```
- the init_routine routine is typically an initialization routine
- the once_control parameter is a synchronization control structure that requires initialization prior to calling pthread_once
  - pthread_once_t once_control = PTHREAD_ONCE_INIT;


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]