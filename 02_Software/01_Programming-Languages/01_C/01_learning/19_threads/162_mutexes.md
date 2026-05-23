# Section 21: Threads

## Topic: Mutexes

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the threads library (pthread.h) provides three synchronization mechanisms that we can implement
  - mutexes - locks, block access to variables by other threads
  - joins - makes a thread wait till others are complete (terminated)
  - condition variables - a way to communicate to other threads
- we have already discussed and provided examples of joins
  - a protocol to allow the programmer to collect all relevant threads at a logical synchronization point
- so, we will focus on mutexes first and then condition variables

**2. Mutexes**
- as we have discussed, mutexes are one way of synchronizing access to shared resources
- when protecting s0hared data, it is the programmer's responsibility to make sure every thread that needs to use a mutex does so
  - if four threads are updating the same data, but only one uses a mutex, the data can still be corrupted
- very often the action performed by a thread owning a mutex is the updating of global variables
  - a safe way to ensure that when several threads update the same variable, the final value is the same as what it would be if only one thread performed the update
- a typical sequence in the use of a mutex is as follows
  - create and initialize a mutex variable
  - several threads attempt to lock the mutex
  - only one succeeds and that thread owns the mutex
  - the owner thread performs some set of actions
  - the owner unlocks the mutex
  - another thread acquires the mutex and repeats the process
  - finally the mutex is destroyed
- when several threads compete for a mutex, the losers block at that call
- please understand that a deadlock can occur when using a mutex lock
  - making sure threads acquire locks in an agreed order (i.e. preservation of lock ordering)

**3. Creating and destroying mutexes**
- mutex variables must be declared with type pthread_mutex_t
  - they must be initialized/created before they can be used
- there are two ways to initialize/create a mutex variable

**3.1. Statically, when it is declared**
- the below is a mutex variable named lock that is initialized to the default pthread mutex values
```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
```

**3.2. dynamically, with the pthread_mutex_init() function**
```c
int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *mutexattr);
```
- this function requires a `pthread_mutex_t` variable to operate on as the first argument
- attributes for the mutex can be given through the second parameter
  - to specify default attributes, pass NULL as the second parameter
- the pthreads standard defines three optional mutex attributes
  - protocol - specifies the protocol used to prevent priority inversions for a mutex
  - prioceiling - specifies the priority ceiling of a mutex
  - process-shared - specifies the process sharing of a mutex
- the `pthread_mutex_destroy(mutex)` function should be used to free a mutex object which is no longer needed

**4. Locking and unlocking mutexes**
- to perform mutex locking and unlocking, the pthreads library provides the following functions
```c
int pthread_mutex_lock(pthread_mutex_t *mutex);
```
- used by a thread to acquire a lock on the specified mutex variable
- if the mutex is already locked by another thread, this call will block the calling thread until the mutex is unlocked
```c
int pthread_mutex_trylock(pthread_mutex_t *mutex);
```
- will attempt to lock a mutex, however, if the mutex is already locked, the routine will return immediately with a "busy" error code
- may be useful in preventing deadlock conditions, as in a priority-inversion situation.
```c
int pthread_mutex_unlock(pthread_mutex_t *mutex);
```
- will unlock a mutex if called by the owning thread
- calling this function is required after a thread has completed its use of protected data if other threads are to acquire the mutex for their
work with the protected data
- an error will be returned if
  - If the mutex was already unlocked
  - If the mutex is owned by another thread
- anytime a global resource is accessed by more than one thread the resource should have a mutex associated with it
  - the above functions should be used to control access to a "critical section” of code from other threads
  - it is up to the programmer to ensure that the necessary threads all make the mutex lock and unlock calls correctly

**5. Simple Deadlock example**
- the order of applying the mutex is also important
  - potential for deadlock
```c
void *function1()
{
...
pthread_mutex_lock(&lock1); // Execution step 1
pthread_mutex_lock(&lock2); // Execution step 3 DEADLOCK
...
...
pthread_mutex_lock(&lock2);
pthread_mutex_lock(&lock1);
...
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways], NULL, thread_function, 