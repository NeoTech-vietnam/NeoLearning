# Section 17: Static Libraries and Shard Objects

## Topic: Creating a static library (archive)

## Date: 05/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- a static library is an archive
  - a bunch of object files wrapped up into a single file
  - similar to a `.zip` or a `.tar` file
    - a file that contains other files
- created and updated by the ar (for archive) utility
  - a program that takes files and stores them in a bigger file without regard to compression
- standard convention is to name static libraries
  - `lib<something>.a`
    - names begin with lib and end with a `.a` extension
    - `libc.a` file contains the Standard C library
    - `libm.a` contains mathematics functions
- once you have an archive, you can store it in a library directory
  - `/usr/local/lib` (system directory)
  - `/my_lib` (your own director)

**2. linking to a static library (notes)**
- the compiler expects to find the libraries in certain directories
  - the compiler looks in a few special places such as /usr/lib/ for libraries
- the compiler option `-Lpathname` is used to tell the linker a list of other directories in which to search for libraries
  - if you put your archive somewhere else, like `/my_lib`?
- the name that follows the `-l` option needs to match part of the archive
name
- if your archive is called `libawesome.a`, you can compile your program
with the `-lawesome` switch

**3. Misc**
- the order of the statically linked libraries on the compiler command line is significant
  - linker is fussy about where libraries are mentioned, and in what order, since symbols are resolved looking from left to right
- this makes a difference if the same symbol is defined differently in two different libraries
- another problem occurs if you mention the static libraries before your own code
  - won’t be any undefined symbols yet, so nothing will be extracted
  - when your object file is processed by the linker, all its library references will be undefined

**4. Include header file and compile with GCC**

- **Archive option**
  - Using `ar` command to archive the object file when you have done the compilation process
  ```cmd
  gcc -c ./myLib.c -o myLib.o
  ```
  - After that, use archive command to convert it into `.a` file
  ```cmd
  ar rcs ./myLib.a ./myLib.o
  ```
  - Then we need to compile source code with `-I` option to add the directory to the **header file search path**
  ```cmd
  gcc -I ../myLib/ -c ./example.c -o example.o
  ```
    - With `-c` option, this is only for compile, do not link. Hence, this procuces an **object file** (`.o`) instead of executable file

- **Adding static library**
  - When the compilation process is completed, we start adding the static `.a` library by using the command:
  ```cmd
  gcc -o example ./example.o ../myLib/myLib.a
  ```
  - Then with the executable file (e.g `example`), we can execute the program with a static library added.
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
