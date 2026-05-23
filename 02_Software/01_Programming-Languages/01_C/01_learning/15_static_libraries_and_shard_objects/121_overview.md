# Section 17: Static Libraries and Shard Objects

## Topic: Overview

## Date: 05/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- you have already seen the power of standard libraries in C
  - standard header files (stdio.h, stdlib.h)
  - math, String, and utility functions
- now it is time to use that power for your own code
- you will learn how to create your own libraries and reuse the same code across several programs
- you will learn how to share code at runtime with dynamic libraries (shared objects)
- you will be able to write code that you can scale and manage simply and efficiently

**2. Libraries**
- a library is a collection (group) of header files and implementation files, exposed for use by other programs
  - interface expressed in a header file
  - implementation expressed in a `.c` file
- a library consists of one or more object files, which consist of object code
- C functions that can be shared by more than one application should be broken out of an application's source code and compiled and bundled into a library
- libraries may call functions in other libraries such as the Standard C or math libraries to do various tasks
- a programmer has the interface file (headers) to figure out how to use a library

**3. Advantages of Libraries**
- libraries are useful because they allow for fast compilation times
  - you do have to compile all sources of your dependencies when compiling your application
- allows application vendors a way to simply release an API to interface with an application
- libraries also allow for modular development and separation of components
- software reuse is a huge benefit of libraries
- version management
  - libraries can cohabitate old and new versions on a single system
- component specialization
  - specialized developers can focus on their core competency on a single library

**4. Linking**
- when a C program is compiled, the compiler generates object code (.o or .obj)
- after generating the object code, the compiler also invokes the linker
- linking is the processes of collecting and combining multiple object files in order to create a single executable file
- one of the main tasks for linker is to make the code of library functions (eg `printf()`, `scanf()`, `sqrt()`, ..etc) available to your program
- a linker can accomplish this task in two ways
  - by copying the code of library function to your object code
  - by making some arrangements so that the complete code of library functions is not copied, but made available at run-time
- static linking is the result of the linker making copy of all used library functions to the executable file
- dynamic linking does not require the code to be copied, it is done by just placing the name of the library in the binary file
  - linking happens when the program is run, when both the binary file and the library are in memory

**5. Static Linking**
- when you link your application to another library at compile time, the library code is part of your application
- the primary advantage of static linking is the speed
  - there will be no symbol (a program entity) resolution at runtime
  - every piece of the library is part of the binary image (executable)
- once everything is bundled into your application, you don’t have to worry that the client will have the right library (and version) available on their system
- static linking creates larger binary files that utilize more disk space and main memory
- once the library is linked and the program is created, you have no way of changing any of the library code without rebuilding the whole program
  - more time consuming to fix bugs

**6. Dynamic Linking**
- dynamic linking defers much of the linking process until a program starts running
  - performs the linking process “on the fly” as programs are executed in the system
- libraries are loaded into memory by programs when they start
- during compilation of the library, the machine code is stored on your machine
  - when you recompile a program that uses this library, only the new code in the program is compiled
  - does not recompile the library into the executable file like in static linking
- the main reason for using dynamic linking of libraries is to free your software from the need to recompile with each new release of a library
- dynamic linking is the more modern approach, and has the advantage of a much smaller executable size
- dynamic linking trades off more efficient use of the disk and a quicker linking phase for a small runtime penalty
- dynamic linking helps overall performance in two ways
  - it saves on disk and virtual memory
    - libraries are only mapped in to the process when needed
  - all executables dynamically linked to a particular library share a single copy of the library at runtime
  - ensures that libraries mapped into memory are shared by all processes using them
  - provides better I/O and swap space utilization and is sparing of physical memory, improving overall system throughput

**7. Library Types**
- there are two C library types which can be created
- **static libraries**
  - uses static linking (compile-time, becomes part of the application)
  - each process gets its own copy of the code and data
  - known as an archive
- **shared object libraries**
  - dynamically linked at run time
    - shared objects are not included into the executable component but are tied to the execution
  - code shared, data is specific to each process
- there is also the concept of a **dynamically loaded/unloaded shared object library** that is linked during execution using the dynamic linking loader system functions

**8. Library Conventions**
- dynamic libraries are called lib something .so
- have a filename of the form libname.so (version numbers may be appended to the name)
  - the library of thread routines is called libthread .so
- static libraries are called lib something `.a`
  - has a filename of the form `libname.a`
  - `.a` library is conceptually the same as the windows `.lib` libraries
- you can Identify your libraries by looking at the header files you have used
  - a good hint is to study the #includes that your program uses
  - each header file that you include potentially represents a library against which you must link

**9. Summary**
- static Libraries have the advantage of speed
  - all the code to execute the file is in one executable file, with little to virtually zero compatibility issues
- static libraries are larger in size because the file has to be recompiled every time when adding new code to the executable
- for shared objects, only one copy of the shared library is kept in memory
  - making it much faster to compile programs and significantly reducing the size of the executable program
- shared objects have a slower execution time compared to static libraries
- shared objects also may have compatibility issues if a library is changed without recompiling the library into memory

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
