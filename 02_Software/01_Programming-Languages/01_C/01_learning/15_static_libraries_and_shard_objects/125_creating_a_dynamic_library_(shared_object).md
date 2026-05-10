# Section 17: Static Libraries and Shard Objects

## Topic: Dynamic Library

## Date: 14/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- every program linked against this library shares the same one copy
- contrast to static linking, in which everyone is (wastefully) given their own copy of the contents of the library
- a dynamically linked library (shared object) is created by the link editor
  - the name of the link editor is the command ld
- standard convention is to name dynamic libraries
  - `lib<something>.so` (shared object)
    - names begin with lib and end with a `.so` extension
    - similar to windows extension `.dll` and mac extension `.dylib`
- you can use the ldd command on linux to list all of the shared objects for a given binary/executable
  - `ldd name-of-executable`

**2. Linking to a dynamic library (notes)**
- the compiler expects to find the libraries in certain directories
  - the compiler looks in a few special places such as `/usr/lib/` for libraries
  - threads library is in `/usr/lib/libthread.so`
- the compiler option `-Lpathname` is used to tell the linker a list of other directories in which to search for libraries
  - `LD_LIBRARY_PATH` and `LD_RUN_PATH` can also be used to provide this information
  - better to use the `-Lpathname` `-Rpathname` options at linktime instead
- the name that follows the `-l` option needs to match part of the library name
- if your archive is called `libawesome.so`, you can compile your program with the `-lawesome` switch

**3. How to (step by step)**

- **Project Structure**

```
project/
├── lib/
│ ├── libStringFunctions.so
│ ├── StringFunctions.c
│ ├── StringFunctions.h
│ └── StringFunctions.o
└── source/
└── challenge.c
```

- **Build the Shared Library (if not already built)**

  - Compile position-independent object code
  ```bash
  gcc -fPIC -c lib/StringFunctions.c -o lib/StringFunctions.o
  ```

  - Create shared library
  ```bash
  gcc -shared -o lib/libStringFunctions.so lib/StringFunctions.o
  ```

**Important**: Shared library filename must start with lib for the -l linker flag to work.

- **Compile and link the main program**
```bash
gcc source/challenge.c \
    -Ilib \
    -Llib \
    -lStringFunctions \
    -o challenge
```
| Flag                | MEaning                                          |
| ------------------- | ------------------------------------------------ |
| `-Ilib`             | Look for header files (`.h`) in the lib folder   |
| `-Llib`             | Look for libraries (.so or .a) in the lib folder |
| `-lStringFunctions` | Link against libStringFunctions.so               |
| `-o challenge`      | Output executable file named challenge           |

- Run the program

  - Option A: Using LD_LIBRARY_PATH (quick testing)
  ```cmd
  LD_LIBRARY_PATH=./lib ./challenge
  ```
  - Option B: Using `rpath`
    - Recompile with rpath so the executable knows where to find the library:
  ```bash
  gcc source/challenge.c \
    -Ilib -Llib -lStringFunctions \
    -Wl,-rpath,'$ORIGIN/lib' \
    -o challenge
  ./challenge
  ```
    - `$ORIGIN` = directory where the executable lives
    - No environment variable needed
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
