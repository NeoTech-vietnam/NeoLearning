# Section 5: Structure of a C++ Program

## Topic: Compile and run a C++ program
## Date: 14/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is the difference between `gcc` and `g++`?
- What is the basic syntax for compiling a C++ program?
- What are the most common compiler flags and what do they do?
- How do you specify the output filename during compilation?
- What does the `-Wall` flag do?
- What C++ standards can you use during compilation?
- How do you optimize code during compilation?
- What is the `-g` flag used for?
- How do you run a compiled C++ program?

---

### Notes Section (Main Notes)

**1. Compiler for C++: g++ vs gcc**
- `gcc` compiles C code
- `g++` compiles C++ code and is required for C++ programs
- Always use `g++` for `.cpp` files
- Using `gcc` on C++ files will result in compilation errors

**2. Basic Compilation Syntax**
- Basic command:
```bash
g++ filename.cpp -o output_name
```
- Example:
```bash
g++ example.cpp -o example
```
- The `-o` flag specifies the output executable name
- Without `-o`, the default output name is `a.out`

**3. Common Compiler Flags**

**Warnings and Errors:**
- `-Wall` (Warn All) - Show all common warnings
- `-Wextra` - Show additional warnings not included in `-Wall`
- `-Werror` - Treat warnings as errors (compilation fails if warnings exist)
- `-pedantic` - Enforce strict standard compliance

**C++ Standard:**
- `-std=c++11` - Compile using C++11 standard
- `-std=c++14` - Compile using C++14 standard
- `-std=c++17` - Compile using C++17 standard
- `-std=c++20` - Compile using C++20 standard
- `-std=c++23` - Compile using C++23 standard (latest)

**Optimization:**
- `-O0` - No optimization (default, faster compilation)
- `-O1` - Basic optimization
- `-O2` - More optimization (balanced)
- `-O3` - Maximum optimization (slower compilation, faster execution)
- `-Os` - Optimize for size

**Debugging:**
- `-g` - Include debug symbols for debugging with gdb
- `-ggdb` - Include debugging info specific to gdb
- `-O0 -g` - Combine no optimization with debug symbols (recommended for debugging)

**Other Useful Flags:**
- `-v` - Verbose output, show compilation steps
- `-save-temps` - Keep intermediate files
- `-c` - Compile only (don't link), produces `.o` object file

**4. Complete Compilation Examples**

Basic compilation:
```bash
g++ example.cpp -o example
```

With warnings:
```bash
g++ -Wall example.cpp -o example
```

With warnings and C++17 standard:
```bash
g++ -Wall -std=c++17 example.cpp -o example
```

With optimization:
```bash
g++ -Wall -std=c++17 -O2 example.cpp -o example
```

For debugging (no optimization + debug symbols):
```bash
g++ -Wall -std=c++17 -O0 -g example.cpp -o example
```

Maximum warnings and strictness:
```bash
g++ -Wall -Wextra -pedantic -std=c++17 example.cpp -o example
```

Multiple source files:
```bash
g++ -Wall file1.cpp file2.cpp file3.cpp -o output
```

**5. Compiling and Running**

Step 1 - Compile the program:
```bash
g++ -Wall -std=c++17 example.cpp -o example
```

Step 2 - Run the program:
```bash
./example
```

Output example:
```
Hello, World!
The answer is 42
```

**6. Troubleshooting Common Compilation Errors**

- **"command not found: g++"** - Install g++:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install g++
  
  # Fedora
  sudo dnf install gcc-c++
  
  # macOS
  brew install gcc
  ```

- **Compilation fails with errors** - Check:
  - Syntax errors in code
  - Missing include files (`#include <iostream>`)
  - Spelling errors in function/variable names
  - Missing semicolons

- **Undefined reference error** - Check:
  - All source files are included in compilation
  - Function definitions are provided

**7. Build Systems for Complex Projects**

For larger projects with multiple files, use build systems:
- **Make** - Traditional build system using Makefile
- **CMake** - Cross-platform build generator
- **Ninja** - Fast build system

Example Makefile:
```makefile
CXX = g++
CXXFLAGS = -Wall -std=c++17

program: main.cpp helper.cpp
	$(CXX) $(CXXFLAGS) main.cpp helper.cpp -o program

clean:
	rm program
```

Then compile with:
```bash
make
```

---

### Summary Section (Summary of Notes)

Compiling C++ programs requires using the `g++` compiler (not `gcc`). The basic syntax is `g++ filename.cpp -o output_name`. Essential compiler flags include `-Wall` for warnings, `-std=c++XX` for specifying C++ standards, and `-O2` for optimization. For debugging, combine `-O0` and `-g`. Always verify compilation succeeds before running the executable with `./program_name`. Complex projects benefit from build systems like Make or CMake to manage multiple source files efficiently.

---

### Reference Websites for More Information

**Official Documentation:**
1. **GNU GCC/G++ Official Compiler Documentation**
   - URL: https://gcc.gnu.org/onlinedocs/
   - Information about all compiler flags and options

2. **GCC Manual - Compiling C++ Programs**
   - URL: https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html
   - Complete reference for compiler invocation

3. **C++ Standard Library Documentation (cppreference)**
   - URL: https://en.cppreference.com/
   - Information about C++ standards and libraries
   - Includes compiler flag details

**Learning Resources:**
4. **cplusplus.com - Getting Started**
   - URL: https://www.cplusplus.com/doc/tutorial/
   - Beginner-friendly C++ tutorials including compilation

5. **GeeksforGeeks - How to compile C++ program**
   - URL: https://www.geeksforgeeks.org/how-to-compile-c-program-in-linux/
   - Linux-specific compilation guide with examples

6. **Compiler Explorer (Godbolt)**
   - URL: https://godbolt.org/
   - Interactive online compiler to test C++ code
   - See generated assembly code

**Build Systems:**
7. **CMake Documentation**
   - URL: https://cmake.org/documentation/
   - Cross-platform build system for large projects

8. **GNU Make Manual**
   - URL: https://www.gnu.org/software/make/manual/
   - Traditional build system for C++ projects
