# Section 4: Working with Larger Programs

## Topic: Compiling multiple source files from the command line

## Date: 14/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- Suppose you have conceptually divided your program into three modules
  - `mod1.c`, `mod2.c`, and the `main()` routine into the file `main.c`
- To tell the system that these three modules actually belong to the same program
  - You include the names of all three files when you enter the command to compile the program
```cmd
$ gcc mod1.c mod2.c main.c –o dbtest
```
- The above has the effect of separately compiling the code contained in `mod1.c`, `mod2.c`, and `main.c`
- Errors discovered in `mod1.c`, `mod2.c`, and `main.c` are separately identified by the compiler
```c
mod2.c:10: mod2.c: In function 'foo':
mod2.c:10: error: 'i' undeclared (first use in this function)
mod2.c:10: error: (Each undeclared identifier is reported only once
mod2.c:10: error: for each function it appears in.)
```
- The above indicates that the compiler identified an error on line 10 of file `mod2.c`
  - In the function foo
- No messages are displayed for `mod1.c` and `main.c` because no errors are found compiling those modules
- We already understand that the compiler generates intermediate object files for each source file that it compiles
  - Places the resulting object code from compiling `mod.c` into the file `mod.o` by default (or obj on windows)
- Some C compilers keep these object files around and do not delete them when you compile more than one file at a time
  - In the previous example, because `mod1.c` and `main.c` had no compiler errors, the corresponding `.o` files (`mod1.o` and `main.o`) would still be around
- Replacing the c from the filename `mod.c` with an `o` tells the C compiler to use the object file that was produced
- The following command line could be used with a compiler that does not delete the object code files
```cmd
cc mod1.o mod2.c main.o –o dbtest
```
- Do you not have to re-edit `mod1.c` and `main.c` if no errors are discovered by the compiler, but you also don’t have to recompile them
- If your compiler automatically deletes the intermediate `.o` files
  - You can still take advantage of performing incremental compilations
- You can compile each module separately and using the `–c` command-line option
  - Option tells the compiler not to link your file
  - Does not produce an executable
  - Retains the intermediate object file that it creates
```c
$ gcc –c mod2.c
```
- Compiles the file `mod2.c`, placing the resulting executable in the file `mod2.o`

- You can use the following sequence to compile a three-module program using the incremental compilation technique
```cmd
$ gcc –c mod1.c Compile mod1.c => mod1.o
$ gcc –c mod2.c Compile mod2.c => mod2.o
$ gcc –c main.c Compile main.c => main.o
$ gcc mod1.o mod2.o mod3.o –o myProgram Create executable
```
- The three modules are compiled separately
  - No errors were detected by the compiler
- The last line above lists only object files and no source files
  - The object files are linked together to produce the executable output file `‘myProgram’`
- If you extend the preceding examples to programs that consist of many modules
  - You can see how this mechanism of separate compilations can enable you to develop large programs more efficiently
```cmd
$ gcc –c legal.c Compile legal.c, placing output in legal.o
$ gcc legal.o makemove.o exec.o enumerator.o evaluator.o display.o –o superchess
```
- The above will compile a program consisting of six modules, in which only the module legal.c needs to be recompiled
- **Code::blocks** and **Visual Studio Code** have this knowledge of what needs recompilation, and they only recompile files as necessary
- The process of incremental compilation can be automated by using a tool called **make** which we will discuss in the next lecture

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
