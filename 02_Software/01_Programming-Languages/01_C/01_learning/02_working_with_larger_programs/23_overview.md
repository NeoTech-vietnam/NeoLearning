# Section 4: Working with Larger Programs

## Topic: Overview

## Date: 13/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**

- All of the example programs that have been provided in this class and my beginner class have all been very small and relatively simple
- Most programs in the real world that you will have to develop will not be as small or as simple
- It is imperative to learn the proper techniques for dealing with larger programs
  - You need to divide the problem into multiple sub problems and then try to tackle it one by one
- C provides all the features necessary for the efficient development of large programs

**2. Dividing your program into multiple files**
- In every program that I have presented so far, it was assumed that the entire program was entered into a single file
- The most common beginner mistake is to jump in directly and try to write all the necessary code into a single file and later try to debug or extend later
  - This approach is doomed to fail and would usually require re-writing from scratch
- All the functions that the program used were included in one file
  - Except for the system functions, such as **printf()** and **scanf()**
  - Standard header files such as `<stdio.h>` and `<stdbool.h>` were also included for definitions and function declarations
- When you start dealing with larger programs, they must be organized around multiple files
  - Programs that contain more than 100 statements or so

**3. IDE’s**

- Developing with an **Integrated Development Environment (IDE)** is essential when dealing with large programs
- Large programming applications frequently require the efforts of more than one programmer
  - As the number of statements in the program increases, so does the time it takes to edit the program and to
  subsequently recompile it
  - Having everyone work on the same source file, or even on their own copy of the same source file, is unmanageable
- C programs do not require that all the statements for a particular program be contained in a single file
  - You can enter your code for a particular module into one file, for another module into a different file, and so on
- The term module refers either to a single function or to a number of related functions that you choose to group logically
- With **Code::Blocks** and **Visual Studio code**, working with multiple source files is **easy**
  - You simply have to identify the particular files that belong to the project on which you are working, and the software handles the rest for you

**4. Advantages**
- The advantages of this approach allows you to achieve Abstraction and promotes the re-usability of
code
- Teams of programmers can work on programs
  - Each programmer works on a different file
- Files can contain all functions from a related group
  - e.g. all matrix operations
- Well implemented can be re-used in other programs, reducing development time
- When changes are made to a file, only that file need be re-compiled to rebuild the program
- If you check any Open-Source project (GitHub) you can see how the large program is “decentralized”
into many numbers of sub-modules
  - Each individual module contributes to a specific critical function of the program

**5. How**
- Programmers usually start designing a program by dividing the problem into easily managed sections
- Each of these sections might be implemented as one or more functions
- All functions from each section will usually live in a single file
- The file contains the definition of each function
  - Should create a header file for each of the C files
  - Will have the same name as the C file

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
