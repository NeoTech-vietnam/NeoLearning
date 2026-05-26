# Section 15: Advanced Debugging, Analysis, and Compiler Opotions

## Topic: Debugging with gdb

## Date: 28/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- GDB (GNU Project debugger) allows you to see what is going on `inside' another program while it executes
  - or what another program was doing at the moment it crashed
- gdb is a powerful interactive debugger that is frequently used to debug programs compiled with GNU’s gcc compiler
- GDB can do four main kinds of things to help you catch bugs in the act
  - start your program, specifying anything that might affect its behavior
  - make your program stop at a predetermined location
  - examine what has happened, when your program has stopped (display variables)
  - change things in your program (set variables)
    - so you can experiment with correcting the effects of one bug and go on to learn about another
- you can trace your program’s execution and even execute it one line at a time
- the programs that you use gdb on may be executing on the same machine as GDB (native), on another machine (remote), or on a simulator
- GDB can run on most popular UNIX and Microsoft Windows variants, as well as on Mac OS X
- your C program must be compiled with the gcc compiler using the `-g` option to make full use of gdb’s features
  - causes the C compiler to add extra information to the output file
    - variable and structure types, source filenames, and C statement to machine code mappings

**2. Inserting Breakpoints**
- the break command can be used to set breakpoints in your program
- a breakpoint is just as its name implies
  - a point in your program that, when reached during execution, causes the program to “break” or pause
  - program’s execution is suspended, which allows you to do things such as look at variables and determine   precisely what’s going on at the point
- a breakpoint can be set at any line in your program by simply specifying the line number to the command
- If you specify a line number but no function or filename, the breakpoint is set on that line in the current file
  - if you specify a function, the breakpoint is set on the first executable line in that function

---

### Summary Section (Summary of Notes)
- [GCC online documentation](https://gcc.gnu.org/onlinedocs/gcc-15.2.0/gcc.pdf)

[Insert a brief summary of the key ideas and takeaways]
