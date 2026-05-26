# Section 4: Working with Larger Programs

## Topic: Makefiles

## Date: 14/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- If you still want to work from the command line, the makefile utility is a tool that you might want to learn how to use
  - Not part of the C language
  - Very helpful when developing larger programs
  - Can help speed your development time
- This powerful utility allows you to specify a list of files and their dependencies in a special file known as a **Makefile**
- The make program automatically recompiles files only when necessary
  - Based on the modification times of a file
- If make finds that your source `(.c)` file is newer than your corresponding object `(.o)` file
  - Automatically issues the commands to recompile the source file to create a new object file
- You can even specify source files that depend on header files
  - You can specify that a module called `datefuncs.o` is dependent on its source file `datefunc.c` as well as the header file date.h
- If you change anything inside the `date.h` header file, the make utility automatically recompiles the `datefuncs.c` file
  - Based on the fact that the header file is newer than the source file
```makefile
SRC = mod1.c mod2.c main.c
OBJ = mod1.o mod2.o main.o
PROG = myProgram$(PROG): $(OBJ)
gcc $(OBJ) -o $(PROG)
$(OBJ): $(SRC)
```
- This Makefile defines the set of source files `(SRC)`
- This Makefile defines the corresponding set of object files `(OBJ)`
- This Makefile defines the name of the executable `(PROG)`
- Also defines some dependencies `($(PROG): $(OBJ) )`
  - Says that the executable is dependent on the object files
    - If one or more object files change, the executable needs to be rebuilt
      - Must be typed with a leading tab `(gcc $(OBJ) -o $(PROG))`
- The last line of the Makefile `($(OBJ): $(SRC) )`
  - Says that each object file depends on its corresponding source file
    - If a source file changes, its corresponding object file must be rebuilt
      - The make utility has built-in rules that tell it how to do that

**2. Running Make**
- here is what happens the first time you run make
```cmd
$ make
gcc -c -o mod1.o mod1.c
gcc -c -o mod2.o mod2.c
gcc -c -o main.o main.c
gcc mod1.o mod2.o main.o -o myProgram
$
```
- Make compiled each individual source file and then linked the resulting object files to create the executable
- If you instead had an error in `mod2.c`, here’s what the output from make would have looked like
```c
$ make
gcc -c -o mod1.o mod1.c
gcc -c -o mod2.o mod2.c
mod2.c: In function 'foo2':
mod2.c:3: error: 'i' undeclared (first use in this function)
mod2.c:3: error: (Each undeclared identifier is reported only once
mod2.c:3: error: for each function it appears in.)
make: *** [mod2.o] Error 1
$
```
- Make found there was an error in compiling `mod2.c` and stopped the make process, which is its default action
- If you correct `mod2.c` and run make again
```cmd
$ make
gcc -c -o mod2.o mod2.c
gcc -c -o main.o main.c
gcc mod1.o mod2.o main.o -o myProgram
$
```
- Notice that make did not recompile `mod1.c`
  - The real power and elegance of the make utility
- You can use the Make utility to start using make for your own programs


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
