# Section 17: Static Libraries and Shard Objects

## Topic: Dynamically loading a shared object

## Date: 14/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- up until now, we have learned about the concepts of static linking and dynamic linking when creating and using a library
- we link against a library at compile time or at run-time
  - the linker at compile time resolves all external symbols or makes sure everything is in place when creating our executable file
    - either by copying the code into the executable or placing the name of the library in the executable so that it can use a shared object
  - creates a dependency
- loading of a library is of two types
  - static loading
  - dynamic loading
- do not confuse the terms static loading vs static linking and dynamic loading vs dynamic linking
- whenever we run our executable, the loader will try to resolve against all the symbols at program start up
  - loading will store every required library into memory, along with our executable itself
- what if we didn’t want to link libraries at compile time (via copy or sharing) and
load symbols at program start-up time
  - instead, load them ourselves as needed during runtime
- instead of a predefined dependency on a library, we could make its presence optional and adjust our program’s functionality accordingly
  - loading of a library on demand (dynamic loading), not at start up
  - the programmer determines when/if the library is loaded
- dynamic loading is a mechanism by which a computer program can, at run time, load a library (or other binary) into memory
  - can retrieve the addresses of functions and variables contained in the library
  - can execute those functions or access those variables
  - can unload the library from memory
- it is one of the 3 mechanisms by which a computer program can use some other software
  - the other two are static linking and dynamic linking (both load at program start up)
- unlike static linking and dynamic linking, dynamic loading allows a computer program to start up in the absence of these libraries
  - can discover available libraries, and to potentially gain additional functionality
- the main difference of dynamic linking to a shared object is that the libraries are not automatically loaded at program start-up

**2. Examples**
- they are particularly useful for implementing plugins or modules
  - they permit waiting to load the plugin until it is needed
- the Pluggable Authentication Modules (PAM) system uses DL libraries to permit administrators to configure and reconfigure authentication
- (`DL`) libraries are also useful for implementing interpreters that wish to occasionally compile their code into machine code and use the compiled version for efficiency purposes
  - all without stopping
- the Apache Web Server's *.dso "dynamic shared object" plugin files are libraries which are loaded at runtime with dynamic loading
- also used in implementing computer programs where multiple different libraries may supply the requisite functionality
  - where the user has the option to select which library or libraries to provide

**3. Dynamic Loading API (dlopen())**
- there is an API for opening a library, looking up symbols, handling errors, and closing the library
  - need to include the header file `<dlfcn.h>`
- the first function we will discuss is the dlopen() function
  - opens a library and prepares it for use
- if libraries depend on each other (e.g., X depends on Y), then you need to load the dependees first (load Y first, and then X)
```c
void * dlopen(const char *filename, int flag);
```
- if filename begins with `/` (i.e., it's an absolute path), `dlopen()` will just try to use it
  - otherwise, it will search for the library in the `LD_LIBRARY_PATH` environment variable and other directories
```c
void * dlopen(const char *filename, int flag);
```
- the value of flag must be either `RTLD_LAZY` or `RTLD_NOW`
  - `RTLD_LAZY` means to resolve undefined symbols as code from the dynamic library is executed
  - `RTLD_NOW` means to resolve all undefined symbols before dlopen() returns and fail if this cannot be done (used if debugging)
- the return value of `dlopen()` is a ''handle'' that should is used by the other DL library routines
  - will return `NULL` if the attempt to load does not succeed (should always check for this)
  - if the same library is loaded more than once with dlopen(), the same file handle is returned

**4. Dynamic Loading API (dlerror() and dlsym())**
- errors can be reported by calling dlerror()
  - returns a string describing the error from the last call to dlopen(), dlsym(), or dlclose()\
- the main routine for using a DL library is the dlsym() function
  - looks up the value of a symbol in a given (opened) library
  - no point in loading a DL library if you cannot use it
```c
void * dlsym(void *handle, char *symbol);
```
- the handle is the value returned from dlopen, and symbol is a NIL-terminated string
  - do not store the result of dlsym() into a void* pointer
  - you will have to cast it each time you use it (and you'll give less information to other people trying to maintain the program)
- `dlsym()` will return a `NULL` result if the symbol was not found
- convention is to call `dlerror()` first
  - to clear any error condition that may have existed
  - then to call `dlsym()` to request a symbol
  - then call dlerror() again to see if an error occurred
```c
dlerror(); /* clear error code */
s = (actual_type) dlsym(handle, symbol_being_searched_for);
if ((err = dlerror()) != NULL) {
/* handle error, the symbol wasn't found */
} else {
/* symbol found, its value is in s */
}
```

**5. Dynamic Loading API (dlclose())**
- the converse of dlopen() is dlclose()
  - closes a DL library
- the dl library maintains link counts for dynamic file handles
  - a dynamic library is not actually deallocated until dlclose has been called on it
  - need to call as many times as dlopen has succeeded on it
- it is not a problem for the same program to load the same library multiple times

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
