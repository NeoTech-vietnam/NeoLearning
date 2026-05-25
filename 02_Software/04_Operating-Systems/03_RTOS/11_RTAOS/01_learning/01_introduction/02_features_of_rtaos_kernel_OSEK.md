# Cornell Notes

## Topic: Features of RTA-OS Kernel - OSEK

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What are the features of the RTA-OS kernel?
- What is OSEK?
- What is OSEK OS?
- What are the types of tasks in OSEK OS?
- What are the scheduling options in OSEK OS?

---

### Notes Section (Main Notes)

#### Features of the RTA-OS Kernel
- RTA-OS builds on the proven technology of earlier ETAS operating systems which, to date, have been used in over 350 million ECUs worldwide. 
- The kernel provides an implementation of the AUTOSAR 3.x, AUTOSAR 4.0, AUTOSAR 4.1, AUTOSAR 4.2, AUTOSAR 4.3, AUTOSAR 4.4, AUTOSAR 4.5 (R19-11), AUTOSAR 4.6 (R20-11), AUTOSAR 4.7 (R21-11) and AUTOSAR 4.8 (R22-11) open standards which subsume features from the earlier OSEK OS standard[^1]. 
- The kernel also provides a number of additional features which are unique to RTA-OS. The following sections provide a short introduction to the standards and their features.

##### OSEK
- OSEK is a European automotive industry standards effort to produce open systems interfaces for vehicle electronics. The full name of the project is OSEK/VDX. 
  - OSEK is an acronym formed from a phrase in German, which translates as Open Systems and Corresponding Interfaces for Automotive Electronics. 
  - VDX is based on a French standard (Vehicle Distributed eXecutive), which has now been merged with OSEK. OSEK/VDX is referred to as OSEK in this guide.
- The goals of OSEK are to support portability and reusability of software components across a number of projects. This allows vendors to specialize in Automotive Intellectual Property, whereby a vendor can develop a purely software solution and run software in any OSEK-compliant ECU.
- To reach this goal, however, detailed specifications of the interfaces to each non application-specific component are required. OSEK standards therefore include an Application Programming Interface (API) that abstracts away from the specific details of the underlying hardware and the configuration of the in-vehicle networks.
- For further information see https://www.iso.org/standard/40079.html.

###### OSEK OS
- OSEK OS is the most mature and most widely used of the OSEK standards. OSEK OS has been adopted in all types of automotive ECUs, from powertrain, chassis and body to multi-media devices.
- The most recent version of OSEK OS is 2.2.3, the third minor revision of the 2.2 standard originally introduced in September 2001. This version of OSEK OS is also part of the ISO17356 standard.
- OSEK OS is entirely statically defined using an offline configuration language called OIL (OSEK Implementation Language). Since all objects are known at system generation time, implementations can be extremely small and efficient.
- OSEK OS provides the following OS features:
- **Tasks:** are the main building block of OSEK OS systems. Unlike some other OS’s, tasks in OSEK are not required to be self-scheduling (i.e. it is not necessary to place the body of the task inside an infinite loop[^2]). There are four types of task in OSEK OS:
  - **Basic tasks with unique priority and non-queued activation**: 
    - These are the simplest form of task and ideally suited for hard real-time systems. Once a task is activated it must run and terminate before it can be activated again.
    - This type of task cannot suspend itself mid-way through execution to wait for an event. 
    - In RTA-OS these are called **BCC1** tasks because they correspond to OSEK OS’s BCC1 conformance class (see later section for more details about OSEK’s Conformance Classes).
  - **Basic tasks with shared priority and queued activation**:
    - These tasks can share priorities with other tasks in the system and do not need to terminate before being activated again.
    - The OS queues pending task activations and runs the next activation when the current one has terminated.
    - Like **BCC1** tasks, this type of task cannot suspend itself mid-way through execution to wait for an event. In RTA-OS these are called **BCC2** tasks because they correspond to OSEK OS’s **BCC2** conformance class.
  - **Extended tasks with unique priority**: 
    - An extended task is allowed to wait for events during execution (i.e. the task can self suspend). However, activations cannot be queued and the tasks must have unique priorities.
    - In RTA-OS these are called **ECC1** tasks because they correspond to OSEK OS’s **ECC1** conformance class.
  - **Extended tasks with shared priority**: 
    - These are like **ECC1** tasks but can share priorities with other tasks in the system. In this regard they are similar to **BCC2** tasks. 
    - However, unlike **BCC2** tasks, extended tasks cannot have queued activations. In RTA-OS these tasks are called **ECC2** tasks.
  - A system can contain any combination of the above task types.
- **Scheduling**: Tasks can be scheduled either preemptively or non-preemptively and co-operative schedulers can be constructed easily.
- **Interrupts**: allow for the interaction of the OS with asynchronous external triggers.
  - There are two types of interrupt in OSEK OS:
    - **Category 1** interrupts are not handled by the OS.
    - **Category 2** interrupts are handled by, and can interact with, the OS.
- **Resources**: are simple binary semaphores that allow you to provide mutual exclusion over critical sections shared between tasks and interrupts. 
  - Resources are managed by the OS using the **priority ceiling protocol** which guarantees freedom from deadlock and minimizes priority inversion at runtime[^3].
- **Counters and alarms**: are used to provide periodic and aperiodic scheduling of tasks.
  - **Counters**: as the name suggests, count the occurrence of domain specific events and register values as ‘ticks’.
  - **Alarms**: can be set to expire at runtime configurable count values, either at absolute count value or relative to the ‘tick’ value of the counter when the alarm is set.
- **Debugging Support**: is provided natively in the OS through the use of build levels.
  - The OS provides two build levels:
    - **Standard**: is ‘lean and mean’ and provides minimum error handling.
    - **Extended**: is the ‘debugging’ build that provides extensive error detection facilities to check if you are using the OS correctly.
  - Debugging is also provided through the OSEK ORTI (OSEK Run-Time Interface) standard. This provides a common way for OS implementations to export symbol details to third-party debuggers so that the debugger can display information about the internal state of the OS at runtime (e.g. which task is running, which tasks are ready to run etc.).



---

### Summary Section (Summary of Notes)
RTA-OS is a real RTOS that is designed to be high performance, real-time and portable. It is a full implementation of the open-standard AUTOSAR OS specifications and is compliant to the OSEK/VDX OS Standard. The kernel is written in ANSI C that is MISRA-C 2012 compliant, making it suitable for use in systems that conform to ASIL D.

[^1]: For the sake of brevity, the term AUTOSAR OS is used throughout this document to refer to the combined AUTOSAR and OSEK OS standards.
[^2]: Though you can do this for the class of tasks called “extended tasks”.
[^3]: Priority inversion is the situation where a low priority task is running in preference to a higher priority task. With the priority ceiling protocol this situation can occur at most once each time a higher priority task is activated (and it is always at the start of execution) and is called the blocking time for the higher priority task. The blocking time is bounded by the longest time any single task shares data with the higher priority object - there is no cumulative blocking due to the interaction of lower priority tasks.