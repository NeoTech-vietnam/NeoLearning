# Section 21: Threads

## Topic: Condition Variables

## Date: 23/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Condition variables**
- condition variables provide yet another way for threads to synchronize
- while mutexes implement synchronization by controlling thread access to data, condition variables allow threads to synchronize based upon the actual value of data
- without condition variables, the programmer would need to have threads continually polling (possibly in a critical section), to check if a condition is met
  - can be very resource consuming since the thread would be continuously busy in this activity
- a condition variable is a way to achieve the same goal without polling
- the condition variable mechanism allows threads to suspend execution and relinquish the processor until some condition is true
  - used with the appropriate functions for waiting and later, thread continuation
- a condition variable must always be associated with a mutex
  - to avoid a deadlock created by one thread preparing to wait and another thread which may signal the condition before the first thread actually waits on it
  - the thread will be perpetually waiting for a signal that is never sent
- any mutex can be used with a condition variable
  - there is no explicit link between the mutex and the condition variable

**2. Condition Variables Example**
- you can think of a condition variable as a "big pillow" in the sense that threads can fall asleep on a condition variable and be woken from that condition variable
- here is an analogy of how a condition variable can work
  - tommy the thread wanted to access shared information
    - he acquired the appropriate lock but then was disappointed to see that the shared information was not ready yet
    - without anything else to do, he decided to sleep (or wait) on a nearby condition variable until another thread updated the shared information and woke him up
  - timmy the thread finally came along and updated the shared information while tommy was asleep on the nearby condition variable
    - timmy noticed tommy asleep, so timmy signaled him to wake up off the condition variable
    - timmy then went on his way and left tommy to play with his new, excited shared information
- one thing that was missed in the above analogy is we know that to access the shared information a thread needs to hold a lock
  - since timmy needs to update the shared information while tommy is asleep and waiting
    - we must have any thread that sleeps on a condition variable release the lock while it is asleep
    - but since tommy had the lock when he fell asleep, he expects to still have the lock when he wakes up
    - so the condition variable semantics guarantee that a thread sleeping on a condition variable will not fully wake up until
      - (1) it receives a wake-up signal
      - (2) it can re-acquire the lock that it had when it fell asleep

**3. Condition variables functions**
- condition variables must be declared with type pthread_cond_t, and must be initialized before they can be used

**Creating/Destroying:**
```c
pthread_cond_init (condition,attr) - Dynamically created
pthread_cond_t cond = PTHREAD_COND_INITIALIZER; (Statically declared)
pthread_cond_destroy (condition)
```
**Waiting on condition:**
```c
pthread_cond_wait 
```
- will put the caller thread to sleep on the condition variable condition and release the mutex lock, guaranteeing that when the subsequent line is executed after the caller has woken up, the caller will hold lock
```c
pthread_cond_timedwait 
```
- place limit on how long it will block
**Waking thread based on condition:**
```c
pthread_cond_signal
```
```
pthread_cond_broadcast 
```
- wake up all threads blocked by the specified condition variable
- for all of the above functions, the caller must first hold the lock that is associated with that condition variable
  - failure to do this can lead to several problems


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways], NULL, thread_function, 