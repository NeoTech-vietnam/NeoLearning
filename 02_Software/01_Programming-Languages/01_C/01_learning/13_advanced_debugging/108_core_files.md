# Section 15: Advanced Debugging, Analysis, and Compiler Opotions

## Topic: Core files

## Date: 28/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- a core dump is generated when a program crashes or is terminated abnormally because of segmentation fault
  - possibly division by zero or attempts to access past the end of an array (illegal memory access)
- a segmentation fault is a specific kind of error caused by accessing memory that “does not belong to you”
  - a piece of code tries to do read and write operation in a read only location in memory or freed block of memory
- a core dump is also called a memory dump, storage dump or dump
- a core dump results in the creation of a file
- this core file contains a snapshot of the contents of the process’s memory at the time it terminated
  - this file is used for debugging purposes (used to assist in diagnosing and fixing errors)
- core dumps allow a user to save a crash for later or off-site analysis, or comparison with other crashes
- core dumps can be used to capture data freed during dynamic memory allocation and may thus be used to retrieve information from a program that is no longer running
- a core dump is contained in a file named something similar to “`core.<process_id>`”
  - created in current working directory
- on windows which uses Cygwin
  - the dump may not be named core
  - It will likely be named something like "`mybadprog.exe.stackdump`"
- your system might be configured to disable the automatic creation of this core file, often due to the large size of these files
  - to enable writing core files you use the ulimit command
    - ulimit -c unlimited
      - may have to type in “bash” to make sure you acre in a shell
        - otherwise command may not be recognized
- to "view" a core dump you will need a debugger
  - it will allow you to examine the state of the process
  - includes listing the stack traces for all the threads of the process
  - you can also print the values of variables and registers
- analyzing a core file does not work well without debugging information added to the executable (gcc -g)
- we will use `gdb` to analyze our core files
---

### Summary Section (Summary of Notes)
- [GCC online documentation](https://gcc.gnu.org/onlinedocs/gcc-15.2.0/gcc.pdf)

[Insert a brief summary of the key ideas and takeaways]
