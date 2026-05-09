# C++ Complete Notes

> Auto-generated from individual lesson files in `01_learning/`

## Table of Contents

- [Structure Of A Cpp Program](#structure-of-a-cpp-program)
- [Variables And Constants](#variables-and-constants)
- [Arrays And Vectors](#arrays-and-vectors)
- [Statements And Operators](#statements-and-operators)
- [Controlling Program Flow](#controlling-program-flow)
- [Characters And Strings](#characters-and-strings)
- [Functions](#functions)
- [Pointers And References](#pointers-and-references)
- [Oop Classes And Objects](#oop-classes-and-objects)

---

## Structure Of A Cpp Program

## Section 5: Structure of a C++ Program

### Topic: Compile and run a C++ program
### Date: 14/03/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

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

#### Notes Section (Main Notes)

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

#### Summary Section (Summary of Notes)

Compiling C++ programs requires using the `g++` compiler (not `gcc`). The basic syntax is `g++ filename.cpp -o output_name`. Essential compiler flags include `-Wall` for warnings, `-std=c++XX` for specifying C++ standards, and `-O2` for optimization. For debugging, combine `-O0` and `-g`. Always verify compilation succeeds before running the executable with `./program_name`. Complex projects benefit from build systems like Make or CMake to manage multiple source files efficiently.

---

#### Reference Websites for More Information

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

## Section 5: Structure of a C++ Program

### Topic: Writing my first program

### Date: 14/03/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What are C++ keywords and why can't they be used as variable names?
- What is an identifier and what are the naming rules for identifiers?
- What is the stream insertion operator and how is it used?
- What is the stream extraction operator and how does it differ from insertion?
- What is the scope resolution operator and when do you use it?
- What role does punctuation play in C++ programs?
- What does syntax mean in the context of C++ programming?

---

#### Notes Section (Main Notes)

**1. C++ Keywords**
- Keywords are reserved words in C++ that have special meanings and cannot be used as variable or function names
- They are part of the C++ language syntax and perform specific functions
- Common keywords include: `int`, `void`, `return`, `if`, `else`, `for`, `while`, `class`, `struct`, `namespace`, `using`, `const`, `static`, etc.
- Example:
```cpp
int main() {        // 'int' and 'main' are keywords
    return 0;       // 'return' is a keyword
}
```

**2. Identifier**
- An identifier is a name given to a variable, function, class, or other entity in a C++ program
- Identifiers must follow naming rules: start with a letter or underscore, contain only letters, digits, or underscores, and are case-sensitive
- Identifiers should be descriptive to make code readable
- Examples:
```cpp
int myVariable;         // 'myVariable' is an identifier
void displayMessage();   // 'displayMessage' is an identifier
int age, score123;      // 'age' and 'score123' are identifiers
```

**3. Stream insertion operator and Stream extraction operator**
- **Stream insertion operator** `<<` is used to send (insert) data to an output stream, typically `cout`
  - Direction: data flows from right to left into the stream
  - Used for displaying information to the user
  - Can chain multiple values together in a single statement
  
- **Stream extraction operator** `>>` is used to extract data from an input stream, typically `cin`
  - Direction: data flows from left to right out of the stream (opposite direction)
  - Used for receiving input from the user
  - Can extract multiple values in sequence
  
- Examples:
```cpp
// Stream insertion operator (output)
cout << "Hello, World!";                    // inserts text
cout << 42;                                 // inserts a number
cout << "Value: " << 100 << endl;           // chains multiple insertions

// Stream extraction operator (input)
int age;
cin >> age;                                 // extracts integer from input

string name;
cin >> name;                                // extracts string from input

int x, y;
cin >> x >> y;                              // extracts multiple values in sequence

// Combined example
cout << "Enter your age: ";                 // prompt user with insertion operator
cin >> age;                                 // get input with extraction operator
cout << "You are " << age << " years old"; // display with insertion operator
```

**4. Scope resolution operator**
- The scope resolution operator is represented by `::`
- It is used to access members of a namespace, class, or scope that are not directly visible
- Allows you to specify which namespace or class a function or variable belongs to
- Syntax: `namespace::member` or `class::member`
- Example:
```cpp
std::cout << "Using scope resolution";  // accesses cout from std namespace
std::endl;                               // accesses endl from std namespace
MyClass::staticVariable = 5;             // accesses static member of a class
```

**5. Punctuation**
- Punctuation marks are essential symbols that structure and organize C++ code
- Common punctuation includes:
  - Semicolon `;` - terminates statements
  - Braces `{}` - define code blocks (functions, loops, conditions)
  - Parentheses `()` - used in function declarations and calls
  - Square brackets `[]` - used for array indexing
  - Comma `,` - separates items
  - Period `.` - member access operator
- Example:
```cpp
int main() {                    // braces define the function block
    int x = 5;                  // semicolon ends the statement
    cout << x << endl;          // parentheses in function call, comma separates args
    return 0;                   // semicolon ends statement
}
```

**6. Syntax**
- Syntax refers to the rules and structure that define how a C++ program must be written
- It includes proper placement of keywords, operators, punctuation, and statements
- Following correct syntax is essential; even minor errors will prevent compilation
- Syntax encompasses rules for variable declaration, function definition, control structures, etc.
- Example of correct syntax:
```cpp
#include <iostream>             // preprocessor directive
using namespace std;            // using declaration

int main() {                     // function declaration with proper syntax
    cout << "Hello, World!" << endl;  // statement with correct syntax
    return 0;                    // return statement
}
```

---

#### Summary Section (Summary of Notes)

The structure of a C++ program is built on fundamental components: **keywords** (reserved words like `int` and `return`), **identifiers** (user-defined names for variables and functions), and **syntax** (rules governing how code is written). Communication with the program happens through **stream operators**: the **stream insertion operator** `<<` for output to `cout` and the **stream extraction operator** `>>` for input from `cin` (opposite directions). The **scope resolution operator** `::` allows access to namespaced members, while **punctuation** marks (`;`, `{}`, `()`, etc.) organize and structure the code. Understanding these elements collectively is essential to writing syntactically correct and functional C++ programs.

## Section 5: Structure of a C++ Program

### Topic: Writing my first program

### Date: 14/03/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What is a preprocessor directive and when is it processed?
- What is the `#include` directive and what are the two ways to use it?
- What is the difference between `#include <filename>` and `#include "filename"`?
- What are standard library headers and how are they included?
- What are custom headers and how do you create them?
- What other preprocessor directives exist besides `#include`?
- How does the C++ preprocessor work differently from the C++ compiler?
- What is the difference between including a header file vs. defining code inline?

---

#### Notes Section (Main Notes)

**1. Preprocessor Directives**
- Preprocessor directives are commands that start with `#` and are processed before actual compilation
- They instruct the preprocessor to perform text manipulation on the source code
- Common preprocessor directives include:
  - `#include` - Include header files
  - `#define` - Define macros or constants
  - `#ifdef`, `#ifndef`, `#if`, `#endif` - Conditional compilation
  - `#pragma` - Compiler-specific instructions
- Preprocessor directives are not C++ statements; they don't end with semicolons
- Example:
```cpp
#include <iostream>      // preprocessor directive
#define PI 3.14159       // preprocessor directive
using namespace std;     // C++ statement (has no #)
```

**2. The #include Directive**

**Two Forms of #include:**

**Form 1: `#include <filename>` (Angle Brackets)**
- Used for including standard library headers and system headers
- The preprocessor searches for the file in standard system directories
- Example:
```cpp
#include <iostream>      // includes input/output stream library
#include <string>        // includes string class library
#include <vector>        // includes vector container library
#include <cmath>         // includes C math library
#include <iomanip>       // includes input/output manipulators
```
- Common standard library headers:
  - `<iostream>` - Input/Output
  - `<fstream>` - File Input/Output
  - `<cmath>` - Math functions
  - `<string>` - String handling
  - `<vector>` - Dynamic arrays
  - `<map>` - Key-value storage
  - `<algorithm>` - Sorting, searching functions

**Form 2: `#include "filename"` (Quotes)**
- Used for including custom/user-defined header files
- The preprocessor searches in the current directory first, then system directories
- Example:
```cpp
#include "myheader.h"    // includes custom header from project
#include "utilities.h"   // includes another custom header
```

**3. Understanding How #include Works**

- The `#include` directive tells the preprocessor to copy the entire content of the included file into the current source file at that location
- This happens before compilation begins
- Example:

original file (main.cpp):
```cpp
#include <iostream>

int main() {
    std::cout << "Hello";
    return 0;
}
```

After preprocessing (what the compiler sees):
```cpp
// (entire iostream content inserted here)
int main() {
    std::cout << "Hello";
    return 0;
}
```

**4. Creating and Using Custom Header Files**

Custom header file (myheader.h):
```cpp
#ifndef MYHEADER_H      // Header guard to prevent multiple inclusion
#define MYHEADER_H

int add(int a, int b) {
    return a + b;
}

void greet() {
    std::cout << "Welcome!" << std::endl;
}

#endif
```

Using custom header (main.cpp):
```cpp
#include <iostream>
#include "myheader.h"    // Must use quotes for custom files

int main() {
    int result = add(5, 3);    // Function from myheader.h
    greet();                    // Function from myheader.h
    return 0;
}
```

**5. Other Preprocessor Directives**

**#define - Define Constants and Macros:**
```cpp
#define PI 3.14159              // Define constant
#define SQUARE(x) ((x) * (x))   // Define macro function

int main() {
    double area = PI * 5 * 5;
    int result = SQUARE(4);     // Result is 16
}
```

**#ifdef / #ifndef - Conditional Compilation:**
```cpp
#ifdef DEBUG
    cout << "Debug mode enabled" << endl;  // Only compiled if DEBUG is defined
#endif

#ifndef RELEASE
    cout << "This is not a release build" << endl;
#endif
```

**#if / #elif / #else - Conditional Directives:**
```cpp
#if defined(__cplusplus)
    cout << "Compiling as C++" << endl;
#elif defined(__STDC__)
    printf("Compiling as C\n");
#endif
```

**#pragma - Compiler-Specific Instructions:**
```cpp
#pragma once               // Include file only once (simpler than header guards)
#pragma warning(disable: 4996)  // Disable specific warnings
```

**6. Preprocessor with C++**
- The C++ preprocessor does not understand C++ syntax; it only processes directives before compilation
- It performs text substitution and file inclusion
- After preprocessing, the compiler receives the modified source code
- Preprocessor directives are processed in a separate phase before compilation
- Example of preprocessing:
```cpp
// Original code
#define MAX 10
int arr[MAX];

// After preprocessing
int arr[10];  // MAX is replaced with 10
```

**7. Header Guards and Include Guards**

- Used to prevent multiple inclusion of the same header file
- Without guards, including a header twice causes compilation errors
- Three common approaches:

**Method 1: Traditional Include Guards**
```cpp
#ifndef MYHEADER_H
#define MYHEADER_H

// Header content here

#endif
```

**Method 2: #pragma once (Simpler, non-standard but widely supported)**
```cpp
#pragma once

// Header content here
```

**Method 3: Combination (Best Practice)**
```cpp
#pragma once

#ifndef MYHEADER_H
#define MYHEADER_H

// Header content here

#endif
```

---

#### Summary Section (Summary of Notes)

Preprocessor directives (starting with `#`) are processed before compilation and instruct the compiler on file inclusion and text manipulation. The `#include` directive includes header files using either `<filename>` for standard libraries or `"filename"` for custom headers. The preprocessor works by copying the entire content of included files into the source code before the compiler processes it. Beyond `#include`, other important directives include `#define` for macros, `#ifdef`/`#ifndef` for conditional compilation, and `#pragma` for compiler-specific instructions. Header guards (using `#ifndef` or `#pragma once`) prevent multiple inclusions of the same file. Understanding preprocessor directives is essential for organizing code, managing dependencies, and enabling conditional compilation in C++ programs.

## Section 5: Structure of a C++ Program

### Topic: The main() function

### Date: 14/03/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What is a preprocessor directive and when is it processed?
- What is the `#include` directive and what are the two ways to use it?
- What is the difference between `#include <filename>` and `#include "filename"`?
- What are standard library headers and how are they included?
- What are custom headers and how do you create them?
- What other preprocessor directives exist besides `#include`?
- How does the C++ preprocessor work differently from the C++ compiler?
- What is the difference between including a header file vs. defining code inline?

---

#### Notes Section (Main Notes)

**1. The main() Function**
- The `main()` function is the entry point of a C++ program
- Every C++ program must have a `main()` function
- The `main()` function can return an integer value, typically `0` for successful execution. Otherwise, it can return a non-zero value to indicate an error or abnormal termination.
- The syntax for the `main()` function is:
```cpp
int main() {
    // code to be executed
    return 0; // indicates that the program ended successfully
}
```
- Example:
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
- However, the `main()` function can also be defined with parameters to accept command-line arguments:
```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "Number of arguments: " << argc << std::endl;
    for (int i = 0; i < argc; ++i) {
        std::cout << "Argument " << i << ": " << argv[i] << std::endl;
    }
    return 0;
}
```
- `argc` (argument count) represents the number of command-line arguments passed to the program, including the program name itself.
- `argv` (argument vector) is an array of C-style strings representing the actual arguments.

---

#### Summary Section (Summary of Notes)

The `main()` function is the entry point of a C++ program. Every C++ program must have a `main()` function, which can return an integer value, typically `0` for successful execution. Understanding the `main()` function is essential for structuring and executing C++ programs.

## Section 5: Structure of a C++ Program

### Topic: Namespaces in C++

### Date: 14/03/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What is a namespace and why do we use them?
- What is a naming conflict and how can it occur?
- What does the `std` namespace represent in C++?
- Why do we write `std::cout` instead of just `cout`?
- What is the scope resolution operator `::` used for?
- What are the different ways to use namespaces in C++?
- What is the difference between `using namespace std;` and `using std::cout;`?
- What are the pros and cons of each namespace method?
- How do third-party frameworks use namespaces?

---

#### Notes Section (Main Notes)

**1. What is a Namespace and Naming Conflicts**

- A namespace is a declarative region that provides a scope to the identifiers (names of types, functions, variables, etc.) inside it
- Namespaces help organize code and prevent naming conflicts
- A naming conflict occurs when two or more entities have the same name in the same scope

**Example of a naming conflict before using namespaces:**
```cpp
// Problem: Two different functions with the same name
void display() {
    cout << "Library A's display function" << endl;
}

void display() {  // ERROR: Redefinition!
    cout << "Library B's display function" << endl;
}
```

**Solution using namespaces:**
```cpp
namespace LibraryA {
    void display() {
        cout << "Library A's display function" << endl;
    }
}

namespace LibraryB {
    void display() {
        cout << "Library B's display function" << endl;
    }
}
```

**The std Namespace:**
- `std` stands for "standard" and is the namespace that contains all standard C++ library functions and objects
- Examples: `std::cout`, `std::cin`, `std::string`, `std::vector`, etc.
- Without specifying `std::`, the compiler doesn't know you're referring to the standard library version

**2. Method 1: Explicitly Using the Scope Resolution Operator `::`**

- The scope resolution operator `::` is used to access members of a namespace
- Syntax: `namespace_name::identifier`
- This is the most explicit way to use namespace members
- Advantages:
  - Very clear which namespace each identifier belongs to
  - Avoids potential naming conflicts
  - No global namespace pollution
  - Easy to understand code
  
- Disadvantages:
  - More verbose and longer code
  - Repetitive typing

**Example:**
```cpp
#include <iostream>
#include <string>

int main() {
    // Using scope resolution operator
    std::cout << "Enter your name: ";
    
    std::string name;
    std::cin >> name;
    
    std::cout << "Hello, " << name << std::endl;
    
    return 0;
}
```

**Output:**
```
Enter your name: John
Hello, John
```

**Real-world example with custom namespaces:**
```cpp
namespace Math {
    int add(int a, int b) { return a + b; }
    int multiply(int a, int b) { return a * b; }
}

namespace String {
    std::string concatenate(std::string a, std::string b) { return a + b; }
}

int main() {
    int result1 = Math::add(5, 3);                           // 8
    int result2 = Math::multiply(4, 6);                      // 24
    std::string result3 = String::concatenate("Hello", " World");  // "Hello World"
    
    std::cout << result1 << std::endl;      // Output: 8
    std::cout << result2 << std::endl;      // Output: 24
    std::cout << result3 << std::endl;      // Output: Hello World
    
    return 0;
}
```

**3. Method 2: Using the `using` Directive**

- The `using namespace` directive allows you to use all identifiers from a namespace without the namespace prefix
- Syntax: `using namespace namespace_name;`
- This imports all names from the namespace into the current scope

- Advantages:
  - Cleaner, shorter code
  - Less typing
  - Easier to read for small programs
  
- Disadvantages:
  - Can cause naming conflicts if two namespaces have the same identifier
  - Pollutes the global namespace
  - Can make code less clear about where identifiers come from
  - Not recommended for large projects or library code

**Example:**
```cpp
#include <iostream>
#include <string>
using namespace std;  // Use everything from std namespace

int main() {
    cout << "Enter your name: ";  // No std:: prefix needed
    
    string name;
    cin >> name;                   // No std:: prefix needed
    
    cout << "Hello, " << name << endl;  // No std:: prefix needed
    
    return 0;
}
```

**Potential problem with `using namespace`:**
```cpp
#include <iostream>
using namespace std;

namespace MyLib {
    void cout() {  // Conflicts with std::cout
        // ...
    }
}

int main() {
    // Ambiguous! Which cout is this?
    cout << "Hello";  // ERROR: Ambiguous!
    
    return 0;
}
```

**4. Method 3: Qualified `using` Statements (using declarations)**

- A `using` declaration imports a specific identifier from a namespace
- Syntax: `using namespace_name::identifier;`
- This is a middle ground between the two methods above
- Imports only the specific names you need

- Advantages:
  - Cleaner than full namespace prefix for specific frequently-used identifiers
  - More selective than `using namespace`
  - Reduces namespace pollution
  - Clear about which identifiers are being used
  
- Disadvantages:
  - Still not as explicit as scope resolution operator
  - Requires knowing which identifiers you'll need in advance

**Example:**
```cpp
#include <iostream>
#include <string>
using std::cout;      // Import only cout
using std::cin;       // Import only cin
using std::endl;      // Import only endl
using std::string;    // Import only string

int main() {
    cout << "Enter your name: ";  // Can use cout without std::
    
    string name;                   // Can use string without std::
    cin >> name;                   // Can use cin without std::
    
    cout << "Hello, " << name << endl;  // All are available
    
    return 0;
}
```

**Comparison of all three methods:**
```cpp
#include <iostream>
#include <string>

// Method 1: Explicit scope resolution (recommended)
int method1() {
    std::cout << "Method 1: Scope Resolution" << std::endl;
    std::cout << "Explicit and clear" << std::endl;
    return 0;
}

// Method 2: Using namespace directive
using namespace std;  // Use all std identifiers
int method2() {
    cout << "Method 2: Using Namespace" << endl;  // Shorter code
    cout << "Less explicit but cleaner" << endl;
    return 0;
}

// Method 3: Qualified using declarations
using std::cout;
using std::endl;
int method3() {
    cout << "Method 3: Qualified Using" << endl;  // Middle ground
    cout << "Balance between clarity and brevity" << endl;
    return 0;
}
```

**5. Creating Custom Namespaces**

**Declaring a namespace:**
```cpp
namespace MyNamespace {
    int myVariable = 10;
    
    void myFunction() {
        std::cout << "Function in MyNamespace" << std::endl;
    }
    
    class MyClass {
        // ...
    };
}
```

**Using custom namespace:**
```cpp
#include <iostream>
using namespace std;

namespace Math {
    double PI = 3.14159;
    
    double calculateArea(double radius) {
        return PI * radius * radius;
    }
}

int main() {
    // Using scope resolution
    double area1 = Math::calculateArea(5.0);
    cout << "Area: " << area1 << endl;
    
    // Using using declaration
    using Math::PI;
    using Math::calculateArea;
    
    double area2 = calculateArea(10.0);
    cout << "Area: " << area2 << endl;
    
    return 0;
}
```

**Nested namespaces:**
```cpp
namespace Company {
    namespace Department {
        namespace Team {
            void function() {
                std::cout << "Nested namespace" << std::endl;
            }
        }
    }
}

int main() {
    Company::Department::Team::function();
    return 0;
}
```

**6. Best Practices for Namespaces**

1. **Use scope resolution operator `::` in library code** - Most explicit and safest
2. **Avoid `using namespace std;` in production code** - Can cause naming conflicts
3. **Use qualified `using` declarations** - Good compromise for frequently-used identifiers
4. **Use namespaces to organize large projects** - Group related functionality
5. **Name your namespaces after your project/company** - Avoid collisions with other libraries
6. **Keep namespace nesting shallow** - Deep nesting becomes hard to read

---

#### Summary Section (Summary of Notes)

Namespaces are organizational tools in C++ that prevent naming conflicts by grouping code into logical scopes. The `std` namespace contains the C++ standard library. There are three primary ways to use namespaces: (1) **Explicit scope resolution** (`std::cout`) - most explicit and recommended for production code; (2) **`using namespace` directive** - imports all namespace members but risks conflicts and namespace pollution; (3) **Qualified `using` declarations** (`using std::cout;`) - a balanced approach importing only specific identifiers. The scope resolution operator `::` accesses namespace members. Custom namespaces organize large projects and third-party frameworks use their own namespaces to avoid conflicts. Best practice is using explicit scope resolution in library code, avoiding `using namespace std;` in production, and using qualified `using` declarations for frequently-accessed identifiers.

## Cornell Notes

### Topic: Basic Input and Ouput (I/O) using `cin` and `cout` in C++

### Date: 20/03/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. Basic I/O using cin and cout**

- `cout`, `cin`, `cerr`, and `clog` are objects representing streams
- `cout`
  - standard output stream
  - console
- `cin`
  - standard input stream
  - keyboard
- `<<`
  - Insertion operator
  - output streams
- `>>`
  - extraction operator
  - input streams

**2. cout and <<**

- Insert the data into the cout stream
```cpp
cout << data;
```

- Can be chained
```cpp
cout << "data 1 is " << data1;
```

- Does not automatically add line breaks
```cpp
cout << "data 1 is " << data1 << endl;
cout << "data 1 is " << data1 << "\n";
```

**3. cin and >>**

- Extract data from the cin stream based on data’s type
```cpp
cin >> data;
```
- Can be chained
```cpp
cin >> data1 >> data2;
```
- Can fail if the entered data cannot be interpreted
```cpp
data could have an undetermined value
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Variables And Constants

## Cornell Notes

### Topic: What is variable?

### Date: 09/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. What is a variable?**
- A variable is an abtraction for a memory location.
- Allow programmers to use meaningful names and not memory addresses
- Variables have:
  - **Type:** their category (integer, real number, string, etc.)
  - **Value:** the data they hold (10, 3.14, "Frank", etc.)
- Variables must be declared before they are used
- A variables value may change
```cpp
age = 21; // Compiler error
```
- It should be:
```cpp
int age = 21; // Correct
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Declaring and Initializing Variables

### Date: 09/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. Declaring Variables**
```cpp
VariableType VariableName;
int age;
double rate;
string name;
Account franks_account;
Person james;
```

**2. Naming Variables**

- Can contain letters, numbers, and underscores
- Must begin with a letter or underscore (_)
- cannot begin with a number
- Cannot use C++ reserved keywords
- Cannot redeclare a name in the same scope
  - Remember that C++ is case sensitive

| Legal            | Illegal  |
| ---------------- | -------- |
| Age              | int      |
| _age             | 2014_age |
| My_age           | My age   |
| your_age_in_2014 | Age+1    |
| INT              | cout     |
| Int              | return   |

- Style and Best Practices:
- Be consistent with your naming conventions
  - myVariableName vs. my_variable_name
  - avoid beginning names with underscores
- Use meaningful names
  - Not too long and not too short
- Never use variables before initializing them
- Declare variables close to when you need them in your code

**3. Initializing Variables**

- **Datatypes with numbers:**
```cpp
int age; // uninitialized
int age = 21; // C-like initialization
int age (21); // Constructor initialization
int age {21}; // C++11 list initialization syntax
```
- **Datatypes with characters:**
```cpp
char grade = 'A'; // C-like initialization
char grade ('A'); // Constructor initialization
char grade {'A'}; // C++11 list initialization syntax
```
- **Datatypes with strings:**
```cpp
string name = "Frank"; // C-like initialization
string name ("Frank"); // Constructor initialization
string name {"Frank"}; // C++11 list initialization syntax
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Global Variables

### Date: 10/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. What is a Global Variable?**
- A global variable is a variable that is declared outside of all functions, typically at the top of a program.
- It can be accessed and modified by any function in the program.
```cpp
#include <iostream>
using namespace std;
int age {24};

int main(void){
    
    cout << age << endl;
    return 0;
}
```
**2. The pros and cons when using global variables**

| Pros                            | Cons                                |
| ------------------------------- | ----------------------------------- |
| Can be accessed from anywhere   | Can lead to unintended side effects |
| Useful for constants            | Can make debugging difficult        |
| Can simplify code in some cases | Can make code less modular          |

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: C++ built-in Primitive Types

### Date: 10/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. C++ Primitive Data Types**

- Fundamental data types implemented directly by the C++ language
- Character types
- Integer types
  - signed and unsigned
- Floating-point types
- Boolean type
- Size and precision is often compiler-dependent
```cpp
#include <climits>
```
- **Type sizes**
  - Expressed in bits
  - The more bits the more values that can be represented
  - The more bits the more storage required

| Size (in bits) | Representable value        |      |
| -------------- | -------------------------- | ---- |
| 8              | 256                        | 2^8  |
| 16             | 65,536                     | 2^16 |
| 32             | 4,294,967,296              | 2^32 |
| 64             | 18,446,744,073,709,551,615 | 2^64 |

- **Character Types**
  - Used to represent single characters, ‘A’, ‘X’, ‘@’
  - Wider types are used to represent wide character sets

| Type Name | Size / Precision                                  |
| --------- | ------------------------------------------------- |
| char      | Exactly 1 byte. At least 8 bits                   |
| char16_t  | At least 16 bits                                  |
| char32_t  | At least 32 bits                                  |
| wchar_t   | Can represent the largest available character set |

- **Integer Types**
  - Used to represent whole numbers
  - Signed and unsigned versions

| Type Name              | Size / Precision |
| ---------------------- | ---------------- |
| signed short int       | At least 16 bits |
| signed int             | At least 16 bits |
| signed long int        | At least 32 bits |
| signed long long int   | At least 64 bits |
| unsigned short int     | At least 16 bits |
| unsigned int           | At least 16 bits |
| unsigned long int      | At least 32 bits |
| unsigned long long int | At least 64 bits |

- **Floating-point Type**
  - Used to represent non-integer numbers
  - Represented by mantissa and exponent (scientific notation)
  - Precision is the number of digits in the mantissa
  - Precision and size are compiler dependent

| Type Name   | Size / Precision | Typical Range                   |
| ----------- | ---------------- | ------------------------------- |
| float       | At least 16 bits | 1.2 x 10^38 to 3.4 x 10^38      |
| double      | At least 16 bits | 2.2 x 10^-308 to 3.8 x 10^308   |
| long double | At least 32 bits | 3.3 x 10^-4932 to 1.2 x 10^4932 |

- **Boolean Type**
  - Used to represent true and false
  - Zero is false.
  - Non-zero is true.

| Type Name | Size / Precision                                    |
| --------- | --------------------------------------------------- |
| bool      | Usually 8 bits **true** or **false** (C++ keywords) |

**2. Difference between {} and = initialization**
- **= initialization**
  - Can lead to narrowing conversions
  - Can lead to unintended implicit conversions

```cpp
int x = 3.14; // x will be 3, not 3.14
```
- **{} initialization**
  - Prevents narrowing conversions
  - Will cause a compile-time error if a narrowing conversion is attempted
```cpp
int x {3.14}; // Compile-time error: narrowing conversion
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is the Size of Variable (sizeof)

### Date: 13/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. Using the sizeof operator**
- The sizeof operator
  - Determines the size in bytes of a type or variable
- Examples:
```cpp
sizeof(int)
sizeof(double)
sizeof(some_variable)
sizeof(some_variable);
```
- `<climits>` and `<cfloat>`
- The climits and cfloat include files contain size and precision information about your implementation of C++
```cpp
INT_MAX
INT_MIN
LONG_MIN
LONG_MAX
FLT_MIN
FLT_MAX
...
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is a constant?

### Date: 13/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

**1. What is a constant?**
- Like C++ variables
  - Have names
  - Occupy storage
  - Are usually typed

**Note:** Their value cannot change once declared!

**2. Types of constants in C++**
- Literal constants
- Declared constants
  - `const` keyword
- Constant expressions
  - `constexpr` keyword
- Enumerated constants
  - `enum` keyword
- Defined constants
  - `#define`

**2.1. Literal constants**
  - The most obvious kind of constant
```cpp
x = 12;
y = 1.56;
name = “Frank”;
middle_initial = ‘J’;
```

- **Integer Literal Constants**
```cpp
12 //An integer
12U //An unsigned integer
12L //A long integer
12UL //An unsigned long integer
12LL //A long long integer
```
- **Float Literal Constants**
```cpp
12.1 //A double
12.1F //A float
12.1L //A long double
```
- **Character Literal Constants (escape codes)**
```cpp
\n //Newline
\t //Tab
\\ //Backslash
\' //Single quote
\" //Double quote
\r //Carriage return
\f //Form feed
\v //Vertical tab
\b //Backspace

cout << "Hello\tthere\nmy friend\n";
Hello  there
my friend
```

**2.2. Constants declared using the `const` keyword**
```cpp
const int x = 12;
const double y = 1.56;
const char middle_initial = 'J';
const char name[] = "Frank";

x = 15; //Error: cannot modify a const variable
```

**2.3. Defined constants**
  - Constants declared using the `#define` preprocessor directive
  - **Note:** Don't use defined constants in Modern C++ programming. Use `const` or `constexpr` instead. Since the preprocessor simply replaces the constant name with its value, it can lead to unexpected behavior and is not type-safe.
```cpp
#define PI 3.14159
#define MAX_SIZE 100
```


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Arrays And Vectors

## Cornell Notes

### Topic: Sections Overview

### Date: 15/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Arrays and Vectors
- Arrays:
  - What they are
  - Why we use arrays
  - Declaration and initialization
  - Accessing elements
- Multidimensional arrays
- Vectors:
  - What they are
  - Advantages vs. arrays
  - Declaration and initialization

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is Arrays?

### Date: 

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Arrays
###### Why do we need arrays?
- Bad scenario without arrays
```cpp
int test_score_1 {0};
int test_score_2 {0};
int test_score_3 {0};
int test_score_4 {0};
int test_score_5 {0};
...
int test_score_100 {0};
```
- **Characteristics**:
  - Fixed size
  - Elements are all the same type
  - Stored contiguously in memory
  - Individual elements can be accessed by
  - their position or index
  - First element is at index 0
  - Last element is at index size-1

  - No checking to see if you are out of bounds

  - Always initialize arrays
  - Very efficient
  - Iteration (looping) is often used to process

![alt text](01_learning/03_arrays_and_vectors/image.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Declaring and Initializing Arrays

### Date: 15/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Declaring ![alt text](01_learning/03_arrays_and_vectors/image-1.png)

##### 2.Initialization ![alt text](01_learning/03_arrays_and_vectors/image-2.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Accessing and Modifying Array Elements

### Date: 15/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Accessing array elements ![alt text](01_learning/03_arrays_and_vectors/image-3.png)

##### 2. Changing the contents of array elements ![alt text](01_learning/03_arrays_and_vectors/image-4.png)

##### 3. How does it work?
- The name of the array represent the location of the first element in the array (index 0)
- The [index] represents the offset from the beginning of the array
- C++ simply performs a calculation to find the correct element
- Remember – no bounds checking!

##### 4. Declaring multi-dimensional arrays ![alt text](01_learning/03_arrays_and_vectors/image-5.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Multidimensional Arrays

### Date: 15/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Multi-dimensional arrays ![alt text](01_learning/03_arrays_and_vectors/image-6.png)

##### 2. Accessing array elements in multi-dimensional arrays ![alt text](01_learning/03_arrays_and_vectors/image-7.png)

##### 3. Initializing multi-dimensional arrays ![alt text](01_learning/03_arrays_and_vectors/image-8.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Declaring and Initializing Vectors

### Date: 15/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Vectors
- Suppose we want to store test scores for my school
- I have no way of knowing how many students will register next year
- Options:
  - Pick a size that you are not likely to exceed and use static arrays
  - Use a dynamic array such as vector
  
##### 2. What is a vector?
- Container in the C++ Standard Template Library
- An array that can grow and shrink in size at execution time
- Provides similar semantics and syntax as arrays
- Very efficient
- Can provide bounds checking
- Can use lots of cool functions like sort, reverse, find, and more.

##### 3. Declaring
![alt text](01_learning/03_arrays_and_vectors/image-9.png) ![alt text](01_learning/03_arrays_and_vectors/image-10.png)

##### 4. Initializing
![alt text](01_learning/03_arrays_and_vectors/image-11.png)

##### 5. Characteristics
- Dynamic size
- Elements are all the same type
- Stored contiguously in memory
- Individual elements can be accessed by
- their position or index
- First element is at index 0
- Last element is at index size-1
- `[ ]` - no checking to see if you are out of bounds
- Provides many useful function that do bounds check
- Elements initialized to zero
- Very efficient
- Iteration (looping) is often used to process

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Accessing and Modifying Vectpr Elements

### Date: 15/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### 1. Accessing vector elements – array syntax
![alt text](01_learning/03_arrays_and_vectors/image-12.png)

##### 2. Accessing vector elements - vector syntax
![alt text](01_learning/03_arrays_and_vectors/image-13.png)

##### 3. Changing the contents of vector elements - vector syntax
![alt text](01_learning/03_arrays_and_vectors/image-14.png)
- So, when do they grow as needed?
![alt text](01_learning/03_arrays_and_vectors/image-15.png)
- What if you are out of bounds?
  - Arrays never do bounds checking
  - Many vector methods provide bounds checking
  - An exception and error message is generated 

![alt text](01_learning/03_arrays_and_vectors/image-16.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Statements And Operators

## Cornell Notes

### Topic: Section Overview

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Expressions, Statements and Operators
- Expressions
- Statements and block statements
  - Operators
  - Assignment
  - Arithmetic
  - Increment and decrement
  - Equality
  - Relational
  - Logical
  - Compound assignment
  - Precedence


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Expressions and Statements

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Expressions
- An expression is:
  - The most basic building block of a program
  - “a sequence of operators and operands that specifies a computation”
  - Computes a value from a number of operands
  - There is much, much more to expressions – not necessary at this level
- Examples: ![alt text](01_learning/04_statements_and_operators/image.png)

##### Statements
- A statement is:
  - A complete line of code that performs some action
  - Usually terminated with a semi-colon
  - Usually contain expressions
  - C++ has many types of statements
    - expression, null, compound, selection, iteration,
    - declaration, jump, try blocks, and others.
- Examples: ![alt text](01_learning/04_statements_and_operators/image-1.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Using Operators

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Using Operators
- C++ has a rich set of operators
  - unary, binary, ternary 
- Common operators can be grouped as follows:
  - assignment
  - arithmetic
  - increment/decrement
  - relational
  - logical
  - member access
  - other

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: The Assignment Operator

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Assignment Operator (=)
```cpp
lhs = rhs;
```
- `rhs` (right hand side) is an expression that is evaluated to a value
- The value of the `rhs` is stored to the `lhs` (left hand side)
- The value of the `rhs` must be type compatible with the `lhs`
- The `lhs` must be assignable
- Assignment expression is evaluated to what was just assigned
- More than one variable can be assigned in a single statement

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Arithmetic Operators

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Arithmetic Operators
- `+` (addition)
- `-` (subtraction)
- `*` (multiplication)
- `/` (division)
- `%` (modulo or remainder) (works only with integers)
- `++` (increment) (adds 1 to the operand)
- `--` (decrement) (subtracts 1 from the operand)
- Arithmetic operators can be used with built-in types and user-defined types (if overloaded)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Increment and Decrement Operators

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Increment and Decrement Operators
- `++` (increment operator): Adds 1 to the operand. Can be used in two forms:
  - **Prefix form**: `++x` (increments x before using its value)
  - **Postfix form**: `x++` (uses x's value before incrementing it)
- `--` (decrement operator): Subtracts 1 from the operand. Can also be used in two forms:
  - **Prefix form**: `--x` (decrements x before using its value)
  - **Postfix form**: `x--` (uses x's value before decrementing it)
- These operators can be used with built-in types (like integers) and user-defined types (if overloaded)
- The choice between prefix and postfix forms can affect the order of operations in expressions, so it's important to understand how they work in different contexts.

##### Note:
- Don't overuse increment and decrement operators in complex expressions, as it can lead to confusion and unintended consequences. Always strive for clarity in your code.
- Never use it twice on the same variable in the same expression, as it can lead to undefined behavior. For example, `x++ + x++` is not recommended.

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Mixed Expressions and Conversions

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Mixed Types Expressions
- C++ operations occur on same type operands
- If operands are of different types, C++ will convert one
- Important! since it could affect calculation results
- C++ will attempt to automatically convert types (coercion).
  - If it can’t, a compiler error will occur

##### Conversions
- Higher vs. Lower types are based on the size of the values the type can hold
  - `long double`,`double`,`float`,`unsigned long`,`long`,`unsigned int`,`int`,`unsigned short`,`short`,`char`
  - `short` and `char` types are always converted to `int` or `unsigned int` before any other conversions are performed.
- **Type Coercion**: conversion of one operand to another data type
- **Promotion**: conversion to a higher type
  - Used in mathematical expressions
- **Demotion**: conversion to a lower type
  - Used with assignment to lower type

##### Examples
![alt text](01_learning/04_statements_and_operators/image-2.png)

##### Explicit Type Casting – `static_cast<type>`
![alt text](01_learning/04_statements_and_operators/image-3.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Testing for equality

### Date: 18/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Testing for Equality
- **The == and != operators**
  - Compares the values of 2 expressions
  - Evaluates to a Boolean (True or False, 1 or 0)
  - Commonly used in control flow statements
```cpp
expr1 == expr2
expr1 != expr2
100 == 200
num1 != num2
```
![alt text](01_learning/04_statements_and_operators/image-4.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Relational Operators

### Date: 21/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Relational Operators Overview
```cpp
expr1 op expr2
```
| Opperator | Description                           |
| --------- | ------------------------------------- |
| `==`      | Equal to                              |
| `!=`      | Not equal to                          |
| `<`       | Less than                             |
| `>`       | Greater than                          |
| `<=>`     | three-way comparison operator (C++20) |


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Logical Operators

### Date: 21/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Logical Operators Overview

| Opperator | Description |
| --------- | ----------- |
| not `!`   | Negation    |
| and `&&`  | logical AND |
| or        | logical OR  |

##### Not Operator (`!`)
```cpp
!expr
```
- Evaluates to `true` if `expr` is `false`, and vice versa.

| Expression `a` | Not a `!a` |
| -------------- | ---------- |
| true           | false      |
| false          | true       |

##### AND (`&&`) Operator
```cpp
expr1 && expr2
```
| Expression `a` | Expression `b` | `a` and `b` (`a && b`) |
| -------------- | -------------- | ----------------------- |
| true           | true           | true                    |
| true           | false          | false                   |
| false          | true           | false                   |
| false          | false          | false                   |

##### OR Operator
```cpp
expr1 or expr2
```
| Expression `a` | Expression `b` | `a` or `b` (`a or b`) |
| -------------- | -------------- | ---------------------- |
| true           | true           | true                   |
| true           | false          | true                   |
| false          | true           | true                   |
| false          | false          | false                  |

##### Precedence of Logical Operators
1. `!` (not)
2. `&&` (and)
3. `or` (or)
- Not `!` is a unary operator and has the highest precedence, followed by `&&` and then `or`, which are binary operators. Parentheses can be used to override the default precedence.

##### Short-Circuit Evaluation
- When evaluating a logical expression C++ stops as soon as the result is known.

```cpp
expr1 && expr2 && expr3
expr1 || expr2 || expr3
```




---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Compound Assignment Operators

### Date: 21/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Compound Assignment Operators

```cpp
op = expression
```
| Operator | Example      | Meaning                       |
| -------- | ------------ | ----------------------------- |
| `+=`     | `x += 5;`    | Equivalent to `x = x + 5;`    |
| `-=`     | `x -= 3;`    | Equivalent to `x = x - 3;`    |
| `*=`     | `x *= 2;`    | Equivalent to `x = x * 2;`    |
| `/=`     | `x /= 4;`    | Equivalent to `x = x / 4;`    |
| `%=`     | `x %= 3;`    | Equivalent to `x = x % 3;`    |
| `>>=`    | `x >>= 1;`   | Equivalent to `x = x >> 1;`   |
| `<<=`    | `x <<= 2;`   | Equivalent to `x = x << 2;`   |
| `&=`     | `x &= 0xFF;` | Equivalent to `x = x & 0xFF;` |
| `\=`     | `x \= 0x0F;` | Equivalent to `x = x \ 0x0F;` |
| `^=`     | `x ^= 0x0A;` | Equivalent to `x = x ^ 0x0A;` |

##### Example
![alt text](01_learning/04_statements_and_operators/image-5.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Operator Precedence

### Date: 21/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Operator Precedence (not a complete list)
Higher to lower

![alt text](01_learning/04_statements_and_operators/image-6.png)

##### What is associativity?
- Use precedence rules when adjacent operators are different 
```cpp
expr1 op1 expr2 op2 expr3 // precedence
```
- Use associativity rules when adjacent operators have the same precedence 
```cpp
expr1 op1 expr2 op1 expr3 // associativity
```
- Use parenthesis to absolutely remove any doubt

##### Example
![alt text](01_learning/04_statements_and_operators/image-7.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Controlling Program Flow

## Cornell Notes

### Topic: Section OVerview

### Date: 23/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Controlling PRogram Flow
- **Sequence:**
  - Ordering statements sequentially
- **Selection:**
  - Making decisions
- **Iteration:**
  - Looping or repeating actions

##### Selection - Decision Making
- `if` statement
- `if-else` statement
- `switch` statement
- Nexted `if` statements
- Conditional operator (`? :`)

##### Iteration - Looping
- `for` loop
- `while` loop
- `do-while` loop
- Range-based `for` loop (C++11 and later)
- `continue` and `break` statements
- Infinite loops and how to avoid them
- Nested loops

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: If Statement

### Date: 23/04/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### `if` Statement

```cpp
if(exp)
    statement;
```
- If the expression is `true` then execute the statement
- If the expression is `false` then skip the statement

![alt text](01_learning/05_controlling_program_flow/image.png) ![alt text](01_learning/05_controlling_program_flow/image-1.png)

##### `block` statment
```cpp
if(exp)
{
    statement1;
    statement2;
    statement3;
}
```
![alt text](01_learning/05_controlling_program_flow/image-2.png) ![alt text](01_learning/05_controlling_program_flow/image-3.png)
- Create a block of code by including more than one statement in code block `{ }`
- Blocks can also contain variable declarations
- These variables are visible only within the block – local scope

##### `if-else` statement
```cpp
if(exp)
    statement1;
else
    statement2;
```
- If the expression is `true` then execute statement1
- If the expression is `false` then execute statement2 ![alt text](01_learning/05_controlling_program_flow/image-4.png) ![alt text](01_learning/05_controlling_program_flow/image-5.png)
- `block` statement:
![alt text](01_learning/05_controlling_program_flow/image-6.png)
---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: If Else Statement

### Date: 01/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### if-else statement
![alt text](01_learning/05_controlling_program_flow/image-7.png)

- If the expression is true then execute statement1
- If the expression is false then execute statement2 ![alt text](01_learning/05_controlling_program_flow/image-8.png) ![alt text](01_learning/05_controlling_program_flow/image-9.png)

- **Block statement:** ![alt text](01_learning/05_controlling_program_flow/image-10.png) ![alt text](01_learning/05_controlling_program_flow/image-11.png)



---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Nested If Statement

### Date: 01/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Nested if statement
![alt text](01_learning/05_controlling_program_flow/image-12.png)
- if statement is nested within another
- Allows testing of multiple conditions
- else belongs to the closest if

![alt text](01_learning/05_controlling_program_flow/image-13.png)

![alt text](01_learning/05_controlling_program_flow/image-14.png)

![alt text](01_learning/05_controlling_program_flow/image-15.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: The Switch Statement

### Date: 01/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### The switch statement
![alt text](01_learning/05_controlling_program_flow/image-16.png)
- Example:
![alt text](01_learning/05_controlling_program_flow/image-17.png)

- fall-through example:
![alt text](01_learning/05_controlling_program_flow/image-18.png)

- with an enumeration:
![alt text](01_learning/05_controlling_program_flow/image-19.png)

- The control expression must evaluate to an integer type
- The case expressions must be constant expressions that evaluate to integer or integers literals
- Once a match occurs all following case sections are executes UNTIL a break is reached the switch complete
- Best practice – provide break statement for each case
- Best practice – default is optional, but should be handled

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Conditional Operator

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Conditional Operator

- `?:` is the conditional operator, also known as the ternary operator.
- It is a shorthand for an `if-else` statement.
  
![alt text](01_learning/05_controlling_program_flow/image-20.png)

- cond_expr evaluates to a boolean expression
- If cond_expr is true then the value of expr1 is returned
- If cond_expr is false then the value of expr2 is returned
- Similar to if-else construct
- Ternary operator
- Very useful when used inline
- Very easy to abuse!
- example:
![alt text](01_learning/05_controlling_program_flow/image-21.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Looping

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Looping
- **iteration**:
  - The third basic building block of programming
    - sequence, selection, iteration
  - Iteration or repetition
  - Allows the execution of a statement or block of statements repeatedly
  - Loops are made up a loop condition and the body which contains the statements to repeat

- Some typical use-cases:
  - **Execute a loop**:
    - a speciﬁc number of times
    - for each element in a collection
    - while a speciﬁc condition remains true
    - until a speciﬁc condition becomes false
    - until we reach the end of some input stream
    - forever
    - many, many more

##### C++ Looping Constructs
- `for` loop
  - iterate a speciﬁc number of times
- `Range-based for` loop
  - one iteration for each element in a range or collection
- `while` loop
  - iterate while a condition remains true
  - stop when the condition becomes false
  - check the condition at the beginning of every iteration
- `do-while` loop
  - iterate while a condition remains true
  - stop when the condition becomes false
  - check the condition at the end of every iteration

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: For Loop

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### `For` Loop
![alt text](01_learning/05_controlling_program_flow/image-22.png) ![alt text](01_learning/05_controlling_program_flow/image-23.png) ![alt text](01_learning/05_controlling_program_flow/image-24.png)

- display even numbers: ![alt text](01_learning/05_controlling_program_flow/image-25.png)
- array example: ![alt text](01_learning/05_controlling_program_flow/image-26.png)
- comma operator: ![alt text](01_learning/05_controlling_program_flow/image-27.png)
- The basic for loop is very clear and concise
- Since the for loop’s expressions are all optional, it is possible to have
  - no initialization
  - no test
  - no increment ![alt text](01_learning/05_controlling_program_flow/image-28.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Range-based for loop

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What is a range-based for loop?
- How does a range-based for loop differ from a traditional for loop?
- When should you use a range-based for loop?

---

#### Notes Section (Main Notes)

##### Range-based for loop
![alt text](01_learning/05_controlling_program_flow/image-29.png) ![alt text](01_learning/05_controlling_program_flow/image-30.png)

- auto:
![alt text](01_learning/05_controlling_program_flow/image-31.png)

- vector:
![alt text](01_learning/05_controlling_program_flow/image-32.png)

- initializer list:
![alt text](01_learning/05_controlling_program_flow/image-33.png)

- string:
![alt text](01_learning/05_controlling_program_flow/image-34.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: While Loop

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What is a while loop?
- How does a while loop differ from a for loop?
- When should you use a while loop?

---

#### Notes Section (Main Notes)

##### `While` Loop
![alt text](01_learning/05_controlling_program_flow/image-35.png) ![alt text](01_learning/05_controlling_program_flow/image-36.png)

- even numbers:
![alt text](01_learning/05_controlling_program_flow/image-37.png)

- array example:
![alt text](01_learning/05_controlling_program_flow/image-38.png)

- input validation:
![alt text](01_learning/05_controlling_program_flow/image-39.png) ![alt text](01_learning/05_controlling_program_flow/image-40.png)

- input validation – boolean ﬂag:
![alt text](01_learning/05_controlling_program_flow/image-41.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: `do-while` Loop

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### `do-while` Loop
![alt text](01_learning/05_controlling_program_flow/image-42.png)

- input validation:
![alt text](01_learning/05_controlling_program_flow/image-43.png)


- area calculation with calculate another:
![alt text](01_learning/05_controlling_program_flow/image-44.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Contiue and Break

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### continue and break statements
- `continue`
  - no further statements in the body of the loop are executed
  - control immediately goes directly to the beginning of the loop for the next iteration
- `break`
  - no further statements in the body of the loop are executed
  - loop is immediately terminated
  - Control immediately goes to the statement following the loop construct

![alt text](01_learning/05_controlling_program_flow/image-45.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Infinite Loops

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Infinite Loops
- Loops whose condition expression always evaluate to true
- Usually this is unintended and a programmer error
- Sometimes programmers use inﬁnite loops and include and break statements in the body to control them
- Sometimes inﬁnite loops are exactly what we need
  - Event loop in an event-driven program
  - Operating system

##### Inﬁnite for Loops
![alt text](01_learning/05_controlling_program_flow/image-46.png)

##### Inﬁnite while Loops
![alt text](01_learning/05_controlling_program_flow/image-47.png)

##### Inﬁnite do-while Loops
![alt text](01_learning/05_controlling_program_flow/image-48.png)
- example:
![alt text](01_learning/05_controlling_program_flow/image-49.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Nested Loops

### Date: 03/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Nested Loops
- Loop nested within another loop
- Can be many as many levels deep as the program needs
- Very useful with multi-dimensional data structures
- Outer loop vs. Inner loop

![alt text](01_learning/05_controlling_program_flow/image-50.png)

- Multiplication Table

![alt text](01_learning/05_controlling_program_flow/image-51.png)

- 2D Arrays – set all elements to 1000 ![alt text](01_learning/05_controlling_program_flow/image-52.png)

- 2D Arrays – display elements ![alt text](01_learning/05_controlling_program_flow/image-53.png)

- 2D Vector – display elements ![alt text](01_learning/05_controlling_program_flow/image-54.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Characters And Strings

## Cornell Notes

### Topic: Section Overview

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Characters and Strings
- Character functions
- C-style Strings
- Working with C-style Strings
- C++ Strings
- Working with C++ Strings

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Character Functions

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Character Functions
- `#include <cctype>`

```cpp
#include <cctype>
function_name(parameters);
```
- Functions for testing characters
- Functions for converting character case

- Testing characters
| Function | Description |
|----------|-------------|
| `isalnum(int c)` | Checks if the character is alphanumeric (letter or digit) |
| `isalpha(int c)` | Checks if the character is an alphabetic letter |
| `isdigit(int c)` | Checks if the character is a digit (0-9) |
| `islower(int c)` | Checks if the character is a lowercase letter |
| `isupper(int c)` | Checks if the character is an uppercase letter |
| `isspace(int c)` | Checks if the character is a whitespace character (space, tab, newline) |
| `ispunct(int c)` | Checks if the character is a punctuation character |
| `isxdigit(int c)` | Checks if the character is a hexadecimal digit (0-9, A-F, a-f) |

- Converting character case
| Function | Description |
|----------|-------------|
| `tolower(int c)` | Converts the character to lowercase if it is uppercase |
| `toupper(int c)` | Converts the character to uppercase if it is lowercase |




---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: C-style Strings

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### C-style Strings
- **Sequence of characters**
  - contiguous in memory
  - implemented as an array of characters
  - terminated by a null character (null)
    - null – character with a value of zero
  - Referred to as zero or null terminated strings
- **String literal**
  - sequence of characters in double quotes, e.g. “Frank”
  - constant
  - terminated with null character ![alt text](01_learning/06_characters_and_strings/image.png)

- Declaring variables:
![alt text](01_learning/06_characters_and_strings/image-1.png) ![alt text](01_learning/06_characters_and_strings/image-2.png) ![alt text](01_learning/06_characters_and_strings/image-3.png)

##### `#include <cstring>`
- Functions that work with C-style Strings
  - Copying
  - Concatenation
  - Comparison
  - Searching
  - and others
- A few examples:
![alt text](01_learning/06_characters_and_strings/image-4.png)

##### `#include <cstdlib>`
- General purpose functions
  - Includes functions to convert C-style Strings to
    - integer
    - ﬂoat
    - long
    - etc.

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: C++ Strings

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### C++ Strings
- `std::string` is a Class in the Standard Template Library
  - `#include <string>`
  - std namespace
  - contiguous in memory
  - dynamic size
  - work with input and output streams
  - lots of useful member functions
  - our familiar operators can be used (+, = , < , <=, >, >=, +=, ==, !=, []…)
  - can be easily converted to C-style Strings if needed
  - safer
- Declaring and initializing:
![alt text](01_learning/06_characters_and_strings/image-5.png)
- Assignment `=` ![alt text](01_learning/06_characters_and_strings/image-6.png)
- Concatenation ![alt text](01_learning/06_characters_and_strings/image-7.png)
- Accessing characters `[]` and `at()` method ![alt text](01_learning/06_characters_and_strings/image-8.png) ![alt text](01_learning/06_characters_and_strings/image-9.png) ![alt text](01_learning/06_characters_and_strings/image-10.png)
- Comparing `==` `!=` `>` `>=` `<` `<=`
- The objects are compared character by character lexically.
- Can compare:
  - two std::string objects
  - std::string object and C-syle string literal
  - std::string object and C-style string variable ![alt text](01_learning/06_characters_and_strings/image-11.png)

- Substrings – `substr()`
  - Extracts a substring from a std::string
```cpp
object.substr(start_index, length)
string s1 {"This is a test"};
cout << s1.substr(0,4); // This
cout << s1.substr(5,2); // is
cout << s1.substr(10,4); // test
```
- Searching – `find()`
  - Returns the index of a substring in a std::string 
```cpp
object.find(search_string)
string s1 {"This is a test"};
cout << s1.find("This"); // 0
cout << s1.find("is"); // 2
cout << s1.find("test"); // 10
cout << s1.find('e'); // 11
cout << s1.find("is", 4); // 5
cout << s1.find("XX"); // string::npos
```
- Removing characters – `erase()` and `clear()`
  - Removes a substring of characters from a std::string
  - `erase()` removes a portion of the string based on index and length
  - `clear()` removes all characters from the string
```cpp
object.erase(start_index, length)
string s1 {"This is a test"};
cout << s1.erase(0,5); // is a test
cout << s1.erase(5,4); // is a
s1.clear(); // empties string s1
```
- Other useful methods
```cpp
string s1 {"Frank"};
cout << s1.length() << endl; // 5
s1 += " James";
cout << s1 << endl; // Frank James
```
- Many more…
- Input `>>` and `getline()`
  - Reading std::string from cin
```cpp
string s1;
cin >> s1;
// Hello there
// Only accepts up to the first space
cout << s1 << endl; // Hello
getline(cin, s1); // Read entire line until \n
cout << s1 << endl; // Hello there
getline(cin, s1, 'x'); // this isx
cout << s1 << endl; // this is
```
---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Functions

## Cornell Notes

### Topic: Section Overview

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Functions
- Definition
  - Prototype
  - Parameters and pass-by-value
  - `return` statement
  - Default parameters values
  - Overloading
  - Passing Arrays to functions
  - Pass-by-reference
  - `inline` functions
  - `auto` return type
  - Recursive functions

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is a Function?

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### What is a function?
- C++ programs
  - C++ Standard Libraries (functions and classes)
  - Third-party libraries (functions and classes)
  - Our own functions and classes
- Functions allow the modularization of a program
  - Separate code into logical self-contained units
  - These units can be reused ![alt text](01_learning/07_functions/image.png)

![alt text](01_learning/07_functions/image-1.png)

- Boss/Worker analogy:
  - Write your code to the function specification
  - Understand what the function does
  - Understand what information the function needs
  - Understand what the function returns
  - Understand any errors the function may produce
  - Understand any performance constraints
  - Don’t worry about HOW the function works internally
    - Unless you are the one writing the function!
- Example `<cmath>`
  - Common mathematical calculations
  - Global functions called as:
```cpp
function_name(argument);
function_name(argument1, argument2, ...);
cout << sqrt(400.0) << endl; // 20.0
double result;
result = pow(2.0, 3.0); // 2.0^3.0
```
- User-defined functions
  - We can define our own functions
  - Here is a preview 
 
![alt text](01_learning/07_functions/image-2.png)

- Return zero if any of the arguments are negative

![alt text](01_learning/07_functions/image-3.png)


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Function Definition

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Defining Functions
- name
  - the name of the function
  - same rules as for variables
  - should be meaningful
  - usually a verb or verb phrase
- parameter list
  - the variables passed into the function
  - their types must be specified
- return type
  - the type of the data that is returned from the function
- body
  - the statements that are executed when the function is called
  - in curly braces {}
- Example with no parameters

![alt text](01_learning/07_functions/image-4.png)

- Example with 1 parameter

![alt text](01_learning/07_functions/image-5.png)

- Example with no return type (void)

![alt text](01_learning/07_functions/image-6.png)

- Example with multiple parameters

```cpp
void function_name(int a, std::string b)
{
    statements(s);
    return; // optional
}
```
- A function with no return type and no parameters
```cpp
void say_hello () {
    cout << "Hello" << endl;
}
```

##### Calling a function
```cpp
void say_hello () {
    cout << "Hello" << endl;
}
int main() {
    say_hello();
    return 0;
}
// =============================================== //
void say_hello () {
    cout << "Hello" << endl;
}
int main() {
    for (int i{1} i<=10; ++i)
    say_hello();
    return 0;
}
// =============================================== //
void say_world () {
    cout << " World" << endl;
}
void say_hello () {
    cout << "Hello" << endl;
    say_world();
}
int main() {
    say_hello();
    return 0;
}
// =============================================== //
void say_world () {
    cout << " World" << endl;
    cout << " Bye from say_world" << endl;
}
void say_hello () {
    cout << "Hello" << endl;
    say_world();
    cout << " Bye from say_hello" << endl;
}
int main() {
    say_hello();
    cout << " Bye from main" << endl;
    return 0;
}
```
![alt text](01_learning/07_functions/image-7.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Function Prototypes

### Date: 04/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Function Prototypes
- The compiler must ‘know’ about a function before it is used
  - Define functions before calling them
    - OK for small programs 
    - Not a practical solution for larger programs
  - Use function prototypes
    - Tells the compiler what it needs to know without a full function definition 
    - Also called forward declarations
    - Placed at the beginning of the program 
    - Also used in our own header files (.h) – more about this later

##### Example
```cpp
int function_name(); // prototype
int function_name()
{
    statements(s);
    return 0;
}
// === //
int function_name(int); // prototype
// or
int function_name(int a); // prototype
int function_name(int a) {
    statements(s);
    return 0;
}
// === //
void function_name(); // prototype
void function_name()
{
    statements(s);
    return; // optional
}
// === //
void function_name(int a, std::string b);
// or
void function_name(int, std::string);
void function_name(int a, std::string b)
{
    statements(s);
    return; // optional
}
```
##### A function with no return type and no parameters
```cpp
void say_hello();
void say_hello() {
    cout << "Hello" << endl;
}
```
##### Calling a function
```cpp
void say_hello();
int main() {
    say_hello();
    // OK
    say_hello(100);
    // Error
    cout << say_hello(); // Error
    // No return value
    return 0;
}
```
- Example:
```cpp
void say_hello(); // prototype
void say_world(); // prototype
int main() {
    say_hello();
    cout << " Bye from main" << endl;
    return 0;
}

void say_world () {
    cout << " World" << endl;
    cout << " Bye from say_world" << endl;
}

void say_hello () {
    cout << "Hello" << endl;
    say_world();
    cout << " Bye from say_hello" << endl;
}
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Function Parameters and the return Statement

### Date: 05/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What are function parameters?
- How does the return statement work?
- What is the difference between pass-by-value and pass-by-reference?

---

#### Notes Section (Main Notes)

##### Function Parameters
- When we call a function we can pass in data to that function
- In the function call they are called arguments
- In the function deﬁnition they are called parameters
- They must match in number, order, and in type

##### Example
```cpp
int add_numbers(int, int);
// prototype
int main() {
    int result {0};
    result = add_numbers(100,200); // call
    return 0;
}
int add_numbers(int a, int b) { // definition
    return a + b;
}
// === //
void say_hello(std::string name) {
    cout << "Hello " << name << endl;
}
say_hello("Frank");
std::string my_dog {"Buster"};
say_hello(my_dog);
```
##### Pass-by-value
- When you pass data into a function it is passed-by-value
- A copy of the data is passed to the function
- Whatever changes you make to the parameter in the function does NOT aﬀect the argument that was passed in.
- Formal vs. Actual parameters
  - Formal parameters – the parameters deﬁned in the function header
  - Actual parameters – the parameter used in the function call, the arguments
```cpp
void param_test(int formal) { // formal is a copy of actual
    cout << formal << endl;
    / 50
    formal = 100;
    // only changes the local copy
    cout << formal << endl; // 100
}
int main() {
    int actual {50};
    cout << actual << endl;
    param_test(actual);
    cout << actual << endl;
    return 0
}
```

##### Function Return Statement
- If a function returns a value then it must use a return statement that returns a value
- If a function does not return a value (void) then the return statement is optional
- return statement can occur anywhere in the body of the function
- return statement immediately exits the function
- We can have multiple return statements in a function
  - Avoid many return statements in a function
- The return value is the result of the function call



---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Default Argument Values

### Date: 05/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What are default argument values?
- How do default argument values work in functions?
- When should you use default argument values?

---

#### Notes Section (Main Notes)

##### Default Argument Values
- When a function is called, all arguments must be supplied
- Sometimes some of the arguments have the same values most of the time
- We can tell the compiler to use default values if the arguments are not supplied
- Default values can be in the prototype or deﬁnition, not both
  - best practice – in the prototype
  - must appear at the tail end of the parameter list
- Can have multiple default values
  - must appear consecutively at the tail end of the parameter list
- Example – no default arguments
```cpp
double calc_cost(double base_cost, double tax_rate);
double calc_cost(double base_cost, double tax_rate) {
    return base_cost += (base_cost * tax_rate);
}
int main() {
    double cost {0};
    cost = calc_cost(100.0, 0.06);
    return 0;
}
```
- Example – single default argument
```cpp
double calc_cost(double base_cost, double tax_rate = 0.06);
double calc_cost(double base_cost, double tax_rate) {
    return base_cost += (base_cost * tax_rate);
}
int main() {
    double cost {0};
    cost = calc_cost(200.0);
    // will use the default tax
    cost = calc_cost (100.0, 0.08);
    // will use 0.08 not the default
    return 0;
}
```
- Example – multiple default arguments
```cpp
double calc_cost(double base_cost, double tax_rate = 0.06, double shipping = 3.50);
double calc_cost(double base_cost, double tax_rate, double shipping) {
    return base_cost += (base_cost * tax_rate) + shipping;
}
int main() {
    double cost {0};
    cost = calc_cost (100.0, 0.08, 4.25); // will use no defaults
    cost = calc_cost(100.0, 0.08);
    // will use default shipping
    cost = calc_cost(200.0);
    // will use default tax and shipping
    return 0;
}
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Overloading Functions

### Date: 05/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Overloading Functions
- We can have functions that have diﬀerent parameter lists that have the same name
- Abstraction mechanism since we can just think ‘print’ for example
- A type of polymorphism
- We can have the same name work with diﬀerent data types to execute similar behavior
- The compiler must be able to tell the functions apart based on the parameter lists and argument supplied
- Example
```cpp
int add_numbers(int, int);
// add ints
double add_numbers(double, double); // add doubles
int main() {
    cout << add_numbers(10,20) << endl;
    // integer
    cout << add_numbers(10.0, 20.0) << endl; // double
    return 0;
}
// === //
int add_numbers(int a, int b) {
    return a + b;
}
double add_numbers(double a, double b) {
    return a + b;
}
// === //
void display(int n);
void display(double d);
void display(std::string s);
void display(std::string s, std::string t);
void display(std::vector<int> v);
void display(std::vector<std::string> v);
```
- Return type is not considered
```cpp
int
get_value();
double get_value();
// Error
cout << get_value() << endl; // which one?
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Passing Arrays to Functions

### Date: 05/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Passing Arrays To Functions
- We can pass an array to a function by providing square brackets in the formal parameter description 
```cpp
void print_array(int numbers []);
```
- The array elements are NOT copied
- Since the array name evaluates to the location of the array in memory – this address is what is copied
- So the function has no idea how many elements are in the array since all it knows is the location of the ﬁrst element (the name of the array)

##### Example
```cpp
void print_array(int numbers []);
int main() {
    int my_numbers[] {1,2,3,4,5};
    print_array(my_numbers);
    return 0;
}
void print_array(int numbers []) {
    // Doesn’t know how many elements are in the array???
    // we need to pass in the size!!
}
// === //
void print_array(int numbers [], size_t size);
int main() {
    int my_numbers[] {1,2,3,4,5};
    print_array(my_numbers, 5);
    / 1 2 3 4 5
    return 0;
}
void print_array(int numbers [], size_t size) {
    for (size_t i{0}; i < size; ++i )
    cout << numbers[i] << endl;
}
```
- Since we are passing the location of the array
  - The function can modify the actual array!
```cpp
void zero_array(int numbers [], size_t size) {
    for (size_t i{0}; i < size; ++i )
    numbers[i] = 0;
    // zero out array element
}
int main() {
    int my_numbers[] {1,2,3,4,5};
    zero_array(my_numbers, 5);
    // my_numbers is now zeroes!
    print_array(my_numbers, 5);
    // 0 0 0 0 0
    return 0;
}
```

##### const parameters
- We can tell the compiler that function parameters are const (read-only)
- This could be useful in the print_array function since it should NOT modify the array
```cpp
void print_array(const int numbers [], size_t size) {
    for (size_t i{0}; i < size; ++i )
    cout << numbers[i] << endl;
    numbers[i] = 0;
    // any attempt to modify the array
    // will result in a compiler error
}
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Pass by Reference

### Date: 05/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Pass by Reference
- Sometimes we want to be able to change the actual parameter from within the function body
- In order to achieve this we need the location or address of the actual parameter
- We saw how this is the eﬀect with array, but what about other variable types?
- We can use reference parameters to tell the compiler to pass in a reference to the actual parameter.
- The formal parameter will now be an alias for the actual parameter
- You just pass the variable, and the compiler handles the address for you.

##### Example
```cpp
void scale_number(int &num); // prototype
int main() {
    int number {1000};
    scale_number(number); // call
    cout << number << endl; // 100
    return 0;
}
void scale_number(int &num) { // definition
    if (num > 100)
    num = 100;
}
// === //
void swap(int &a, int &b);
int main() {
    int x{10}, y{20};
    cout << x << " " << y << endl; // 10 20
    swap(x, y);
    cout << x << " " << y << endl; // 20 10
    return 0;
}
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}
```

##### vector example – pass by value
```cpp
void print(std::vector<int> v);
int main() {
    std::vector<int> data {1,2,3,4,5}; // 1 2 3 4 5
    print(data);
    return 0;
}
void print(std::vector<int> v) {
    for (auto num: v)
    cout << num << endl;
}
```

##### vector example – pass by reference
```cpp
void print(std::vector<int> &v);
int main() {
    std::vector<int> data {1,2,3,4,5}; // 1 2 3 4 5
    print(data);
    return 0;
}
void print(std::vector<int> &v) {
    for (auto num: v)
    cout << num << endl;
}
```

##### vector example – pass by const reference
```cpp
void print(const std::vector<int> &v);
int main() {
    std::vector<int> data {1,2,3,4,5}; // 1 2 3 4 5
    print(data);
    return 0;
}
void print(const std::vector<int> &v) {
    v.at(0) = 200;
    for (auto num: v)
    cout << num << endl;
}
```
---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Scope Rules

### Date: 05/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Scope Rules
- C++ uses scope rules to determine where an identiﬁer can be used
- C++ uses static or lexical scoping
- Local or Block scope
- Global scope

##### Local or Block Scope
- Identiﬁers declared in a block { }
- Function parameters have block scope
- Only visible within the block { } where declared
- Function local variables are only active while the function is executing
- Local variables are NOT preserved between function calls
- With nested blocks inner blocks can ‘see’ but outer blocks cannot ‘see’ in

##### Static local variables
- Declared with static qualiﬁer 
```cpp
static int value {10};
```
- Value IS preserved between function calls
- Only initialized the ﬁrst time the function is called

##### Global scope
- Identiﬁer declared outside any function or class
- Visible to all parts of the program after the global identiﬁer has been declared
- Global constants are OK
- Best practice – don’t use global variables

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: How do Function Calls Work?

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### How do Function Calls Work?
- **Functions use the `function call stack`**
  - Analogous to a stack of books
  - LIFO – Last In First Out
  - push and pop
- **Stack Frame or Activation Record**
  - Functions must return control to function that called it
  - Each time a function is called we create an new activation record and push it on stack
  - When a function terminates we pop the activation record and return
  - Local variables and function parameters are allocated on the stack
- Stack size is ﬁnite – Stack Overﬂow

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: inline Functions

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Inline Functions
- Function calls have a certain amount of overhead
- You saw what happens on the call stack
- Sometimes we have simple functions
- We can suggest to the compiler to compile them ‘inline’
  - avoid function call overhead
  - generate inline assembly code
  - faster
  - could cause code bloat
- Compilers optimizations are very sophisticated
  - will likely inline even without your suggestion

##### Example
```cpp
inline int add_numbers(int a, int b) { // definition
    return a + b;
}
int main() {
    int result {0};
    result = add_numbers(100,200); // call
    return 0;
}
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Recursive Functions

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Recursive Functions
- A recursive function is a function that calls itself
  - Either directly or indirectly through another function
- Recursive problem solving
  - Base case
  - Divide the rest of problem into subproblem and do recursive call
- There are many problems that lend themselves to recursive solutions
- Mathematic – factorial, Fibonacci, fractals,…
- Searching and sorting – binary search, search trees, …

##### Example - Factorial
![alt text](01_learning/07_functions/image-8.png)
- Base case:
  - factorial(0) = 1
- Recursive case:
  - factorial(n) = n * factorial(n-1)

```cpp
unsigned long long factorial(unsigned long long n) {
if (n == 0)
    return 1;
    // base case
    return n * factorial(n-1);
    // recursive case
}
int main() {
    cout << factorial(8) << endl; // 40320
    return 0;
}
```

##### Example - Fibonacci
![alt text](01_learning/07_functions/image-9.png)

- **Base case**:
  - Fib(0) = 0
  - Fib(1) = 1
- **Recursive case**:
  - Fib(n) = Fib(n-1) + Fib(n-2)

```cpp
unsigned long long fibonacci(unsigned long long n) {
    if (n <= 1)
    return n;
    // base cases
    return fibonacci(n-1) + fibonacci(n-2); // recursion
}
int main() {
    cout << fibonacci(30) << endl; // 832040
    return 0;
}
```
---

#### Summary Section (Summary of Notes)

- Recursive functions call themselves either directly or indirectly.
- They require a base case to terminate the recursion.
- Common examples include factorials, Fibonacci numbers, and certain algorithms like binary search.

---

## Pointers And References

## Cornell Notes

### Topic: Section Overview

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

- What is a pointer?
- Declaring pointers
- Storing addresses in pointers
- Dereferencing pointers
- Dynamic memory allocation
- Pointer arithmetic 
- Pointers and arrays
- Pass-by-reference with pointers 
- const and pointers 
- Using pointers to functions 
- Potential pointer pitfalls
- What is a reference?
- Review passing references to functions 
- const and references 
- Reference variables in range-based for loops 
- Potential reference pitfalls 
- Raw vs. Smart pointers 

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is a Pointer?

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### What is a Pointer?
- A variable
  - whose value is an address
- What can be at that address?
  - Another variable
  - A function
- Pointers point to variables or functions?
  - If x is an integer variable and its value is 10 then I can declare a pointer that points to it
- To use the data that the pointer is pointing to you must know its type

##### Why use Pointers?
```
Can’t I just use the variable or function itself?
Yes, but not always
```
- Inside functions, pointers can be used to access data that are deﬁned outside the function. Those variables may not be in scope so you can’t access them by their name
- Pointers can be used to operate on arrays very eﬃciently
- We can allocate memory dynamically on the heap or free store.
  - This memory doesn’t even have a variable name.
  - The only way to get to it is via a pointer
- With OO. pointers are how polymorphism works!
- Can access speciﬁc addresses in memory
  - useful in embedded and systems applications

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Declaring Pointers

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Declaring Pointers
![alt text](01_learning/08_pointers_and_references/image.png)

- Initializing pointer variables to `nullptr` (C++11 and later) or `NULL` (pre-C++11) to indicate that they point nowhere

![alt text](01_learning/08_pointers_and_references/image-1.png)

- Always initialize pointers
- Uninitialized pointers contain garbage data and can `point anywhere`
- Initializing to zero or nullptr (C++ 11) represents address zero
  - implies that the pointer is `pointing nowhere`
- If you don’t initialize a pointer to point to a variable or function then you should initialize it to nullptr to `make it null`

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Accessing the Pointer Address and Storing Address in a Pointer

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Accessing Pointer Address?
- `&` the address operator
  - Variables are stored in unique addresses
  - Unary operator
  - Evaluates to the address of its operand
    - Operand cannot be a constant or expression that evaluates to temp values

```cpp
int num{10};
cout << "Value of num is: " << num << endl; // 10
cout << "sizeof of num is: " << sizeof num << endl; // 4
cout << "Address of num is: " << &num << endl; // 0x61ff1c
```
- `&` the address operator - example
```cpp
int *p;
cout << "Value of p is: " << p << endl; // 0x61ff60 - garbage
cout << "Address of p is: " << &p << endl; // 0x61ff18
cout << "sizeof of p is: " << sizeof p << endl; // 4
p = nullptr;// set p to point nowhere
cout << "Value of p is: " << p << endl; // 0x0
```
- `sizeof` a pointer variable
  - Don’t confuse the size of a pointer and the size of what it points to
  - All pointers in a program have the same size
  - They may be pointing to very large or very small types

```cpp
int *p1 {nullptr};
double *p2 {nullptr};
unsigned long long *p3 {nullptr};
vector<string> *p4 {nullptr};
string *p5 {nullptr};
```
##### Storing an Address in Pointer Variable?
- Typed pointers
    - The compiler will make sure that the address stored in a pointer variable is of the correct type
```cpp
int score {10};
double high_temp {100.7};
int *score_ptr {nullptr};
score_ptr = &score; // OK
score_ptr = &high_temp; // Compiler Error
```
- `&` the address operator
- Pointers are variables so they can change
- Pointers can be null
- Pointers can be uninitialized

```cpp
double high_temp {100.7};
double low_temp {37.2};
double *temp_ptr;
temp_ptr = &high_temp; // points to high_temp
temp_ptr = &low_temp; // now points to low_temp
temp_ptr = nullptr;
```


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Dereferencing a Pointer

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Dereferencing a Pointer
- Access the data we’re pointing to – dereferencing a pointer
  - If score_ptr is a pointer and has a valid address
  - Then you can access the data at the address contained in the score_ptr using the dereferencing operator `*`
```cpp
int score {100};
int *score_ptr {&score};
cout << *score_ptr << endl; // 100
*score_ptr = 200;
cout << *score_ptr << endl; // 200
cout << score << endl; // 200
```

- Access the data we’re pointing to
```cpp
double high_temp {100.7};
double low_temp {37.4};
double *temp_ptr {&high_temp};
cout << *temp_ptr << endl; // 100.7
temp_ptr = &low_temp;
cout << *temp_ptr << endl; // 37.4
```
- Access the data we’re pointing to
```cpp
string name {"Frank"};
string *string_ptr {&name}; // Frank
cout << *string_ptr << endl;
name = "James";
cout << *string_ptr << endl; // James
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Dynamic Memory Allocation

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Dynamic Memory Allocation
Allocating storage from the heap at runtime
- We often don’t know how much storage we need until we need it
- We can allocate storage for a variable at run time
- Recall C++ arrays
- We had to explicitly provide the size and it was ﬁxed
- But vectors grow and shrink dynamically
- We can use pointers to access newly allocated heap storage

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: The Relationship Between Arrays and Pointers

### Date: 06/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Relationship Between Arrays and Pointers
- The value of an array name is the address of the ﬁrst element in the array
- The value of a pointer variable is an address
- If the pointer points to the same data type as the array element then the pointer and array name can be used interchangeably (almost)
```cpp
int scores[] {100, 95, 89};
cout << scores << endl; // 0x61fec8
cout << *scores << endl; // 100
int *score_ptr {scores};
cout << score_ptr << endl; // 0x61fec8
cout << *score_ptr << endl; // 100
// === //
int scores[] {100, 95, 89};
int *score_ptr {scores};
cout << score_ptr[0] << endl;// 100
cout << score_ptr[1] << endl;// 95
cout << score_ptr[2] << endl;// 89
```
##### Using pointers in expressions
```cpp
int scores[] {100, 95, 89};
int *score_ptr {scores};
cout << score_ptr << endl; // 0x61ff10
cout << (score_ptr + 1) << endl; // 0x61ff14
cout << (score_ptr + 2) << endl; // 0x61ff18
// === //
int scores[] {100, 95, 89};
int *score_ptr {scores};
cout << *score_ptr << endl; // 100
cout << *(score_ptr + 1) << endl; // 95
cout << *(score_ptr + 2) << endl; // 89
```

##### Subscript and Oﬀset notation equivalence
![alt text](01_learning/08_pointers_and_references/image-2.png)

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Pointer Arithmetic

### Date: 07/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Pointer Arithmetic
- Pointers can be used in
  - Assignment expressions
  - Arithmetic expressions
  - Comparison expressions
- C++ allows pointer arithmetic
- Pointer arithmetic only makes sense with raw arrays

##### `++` and `--`

- (++) increments a pointer to point to the next array element 
```cpp
int_ptr++;
```
- (--) decrements a pointer to point to the previous array element 
```cpp
int_ptr--;
```

##### `+` and `-`
- (+) increment pointer by `n * sizeof(type)` 
```cpp 
int_ptr += n; or int_ptr = int_ptr + n;
```
- (-) decrement pointer by `n * sizeof(type)` 
```cpp
int_ptr -= n; or int_ptr = int_ptr - n;
```

##### Subtracting two pointers
- Determine the number of elements between the pointers
- Both pointers must point to the same data type 
```cpp
int n = int_ptr2 - int_ptr1;
```

##### Comparing two pointers `==` and `!=`
- Determine if two pointers point to the same location
  - does NOT compare the data where they point!

```cpp
string s1 {"Frank"};
string s2 {"Frank"};
string *p1 {&s1};
string *p2 {&s2};
string *p3 {&s1};
cout << (p1 == p2) << endl; // false
cout << (p1 == p3) << endl; // true
```

##### Comparing the data pointers point to
- Determine if two pointers point to the same data
  - you must compare the referenced pointers

```cpp
string s1 {"Frank"};
string s2 {"Frank"};
string *p1 {&s1};
string *p2 {&s2};
string *p3 {&s1};
cout << (*p1 == *p2) << endl; // true
cout << (*p1 == *p3) << endl; // true
```



---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Const and Pointers

### Date: 07/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Passing pointers to a function
`const` and Pointers
- There are several ways to qualify pointers using `const`
  - Pointers to constants
  - Constant pointers
  - Constant pointers to constants

##### Pointers to constants
- The data pointed to by the pointers is constant and cannot be changed.
- The pointer itself can change and point somewhere else.

```cpp
int high_score {100};
int low_score { 65};
const int *score_ptr { &high_score };
*score_ptr = 86; // ERROR
score_ptr = &low_score; // OK
```

##### Constant pointers
- The data pointed to by the pointers can be changed.
- The pointer itself cannot change and point somewhere else
```cpp
int high_score {100};
int low_score { 65};
int *const score_ptr { &high_score };
*score_ptr = 86; // OK
score_ptr = &low_score; // ERROR
```

##### Constant pointers to constants
- The data pointed to by the pointer is constant and cannot be changed.
- The pointer itself cannot change and point somewhere else.
```cpp
int high_score {100};
int low_score { 65};
const int *const score_ptr { &high_score };
*score_ptr = 86; // ERROR
score_ptr = &low_score; // ERROR
```

---

#### Summary Section (Summary of Notes)

- Pointers can be qualified with `const` in different ways:
  - Pointers to constants: The data pointed to is constant, but the pointer can change.
  - Constant pointers: The pointer itself is constant, but the data pointed to can change.
  - Constant pointers to constants: Both the pointer and the data pointed to are constant.

## Cornell Notes

### Topic: Passing Pointers to Functions

### Date: 07/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Passing pointers to a function
- Pass-by-reference with pointer parameters
- We can use pointers and the dereference operator to achieve pass-by-reference
- The function parameter is a pointer
- The actual parameter can be a pointer or address of a variable
- Pass-by-reference with pointers – deﬁning the function
```cpp
void double_data(int *int_ptr);
void double_data(int *int_ptr) {
    *int_ptr *= 2;
    // *int_ptr = *int_ptr * 2;
}
```
- Pass-by-reference with pointers – calling the function
```cpp
int main() {
int value {10};
    cout << value << endl; // 10
    double_data( &value);
    cout << value << endl; // 20
}
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Returning a Pointer from a Function

### Date: 07/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Returning a Pointer from a Function
- Functions can also return pointers type *function();
- Should return pointers to
  - Memory dynamically allocated in the function
  - To data that was passed in
- Never return a pointer to a local function variable!

##### Returning a parameter
```cpp
int *largest_int(int *int_ptr1, int *int_ptr2) {
    if (*int_ptr1 > *int_ptr2)
        return int_ptr1;
    else
        return int_ptr2;
}
```
```cpp
int main() {
    int a{100};
    int b{200};

    int *largest_ptr {nullptr};
    largest_ptr = largest_int(&a, &b);
    cout << *largest_ptr << endl; // 200
    return 0;
}
```

##### returning dynamically allocated memory
```cpp
int *create_array(size_t size, int init_value = 0) {
    int *new_storage {nullptr};
    new_storage = new int[size];
    for (size_t i{0}; i < size; ++i)
        *(new_storage + i) = init_value;
    return new_storage;
}
```
```cpp
int main() {
int *my_array; // will be allocated by the function
my_array = create_array(100,20); // create the array
// use it
delete [] my_array; // be sure to free the storage
return 0;
}
```

##### Never return a pointer to a local variable!!
```cpp
int *dont_do_this () {
    int size {};
    . . .
    return &size;
}
int *or_this () {
    int size {};
    int *int_ptr {&size};
    . . .
    return int_ptr;
}
```


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Potential Pointer Pitfalls

### Date: 07/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Potential Pointer Pitfalls
- Uninitialized pointers
- Dangling Pointers
- Not checking if new failed to allocate memory
- Leaking memory

##### Uninitialized pointers
```cpp
int *int_ptr; // pointing anywhere
. . .
*int_ptr = 100; // Hopefully a crash
```
##### Dangling pointer
- Pointer that is pointing to released memory
  - For example, 2 pointers point to the same data
  - 1 pointer releases the data with delete
  - The other pointer accesses the release data
- Pointer that points to memory that is invalid
  - We saw this when we returned a pointer to a function local variable

##### Not checking if new failed
- If `new` fails an exception is thrown
- We can use exception handling to catch exceptions
- Dereferencing a null pointer will cause your program to crash

##### Leaking memory
- Forgetting to release allocated memory with delete
- If you lose your pointer to the storage allocated on the heap you have not way to get to that storage again
- The memory is orphaned or leaked
- One of the most common pointer problems


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is a reference?

### Date: 07/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### What is a reference?
- An alias for a variable
- Must be initialized to a variable when declared
- Cannot be null
- Once initialized cannot be made to refer to a different variable
- Very useful as function parameters
- Might be helpful to think of a reference as a constant pointer that is automatically dereferenced
- Using references in range-based for loop
```cpp
vector<string> stooges {"Larry", "Moe", "Curly"};
for (auto str: stooges)
    str = "Funny"; // changes the copy
for (auto str:stooges)
    cout << str << endl; // Larry, Moe, Curly
```
```cpp
vector<string> stooges {"Larry", "Moe", "Curly"};
for (auto &str: stooges)
    str = "Funny"; // changes the actual
for (auto str:stooges)
    cout << str << endl; // Funny, Funny, Funny
```
```cpp
vector<string> stooges {"Larry", "Moe", "Curly"};
for (auto const &str: stooges)
    str = "Funny"; // compiler error
```
---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: L-Values and R-Values

### Date: 08/06/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### l-values
- l-values
  - values that have names and are addressable
  - modiﬁable if they are not constants
```cpp
int x {100}; // x is an l-value
x = 1000;
x = 1000 + 20;
string name; // name is an l-value
name = "Frank";
```
```cpp
100 = x; // 100 is NOT an l-value
(1000 + 20) = x; // (1000 + 20) is NOT an l-value
string name;
name = "Frank";
"Frank" = name; // "Frank" is NOT an l-value
```

##### r-values
- r-value (non-addressable and non-assignable)
  - A value that’s not an l-value
    - on the right-hand side of an assignment expression
    - a literal
    - a temporary which is intended to be non-modiﬁable
```cpp
int x {100};  // 100 is an r-value
int y = x + 200; // (x+200)is an r-value

string name;
name = "Frank"; // "Frank" is an r-value
int max_num = max(20,30); // max(20,30) is an r-value
```
- r-values can be assigned to l-values explicitly
```cpp
int x {100};
int y {0};
y = 100;// r-value 100 assigned to l-value y
x = x + y;// r-value (x+y) assigned to l-value x
```

##### l-value references
- The references we’ve used are l-value references
  - Because we are referencing l-values
```cpp
int x {100};
int &ref1 = x; // ref1 is reference to l-value
ref1 = 1000;
int &ref2 = 100; // Error 100 is an r-value
```

- The same when we pass-by-reference
```cpp
int square(int &n) {
return n*n;
}
int num {10};
square(num); // OK – num is an l-value
square(5); // Error – can’t reference r-value 5

```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Section Recap

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### When to use pointers vs. references parameters
- Pass-by-value
  - when the function does not modify the actual parameter, and
  - the parameter is small and eﬃcient to copy like simple types (int, char, double, etc.)
- Pass-by-reference using a pointer
  - when the function does modify the actual parameter, and
  - the parameter is expensive to copy, and
  - Its OK to the pointer is allowed a nullptr value
- Pass-by-reference using a pointer to const
  - when the function does not modify the actual parameter, and
  - the parameter is expensive to copy, and
  - Its OK to the pointer is allowed a nullptr value
- Pass-by-reference using a const pointer to const
  - when the function does not modify the actual parameter, and
  - the parameter is expensive to copy, and
  - Its OK to the pointer is allowed a nullptr value, and
  - You don’t want to modify the pointer itself
- Pass-by-reference using a reference
  - when the function does modify the actual parameter, and
  - the parameter is expensive to copy, and
  - The parameter will never be nullptr
- Pass-by-reference using a `const` reference
  - when the function does not modify the actual parameter, and
  - the parameter is expensive to copy, and
  - The parameter will never be nullptr



---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

---

## Oop Classes And Objects

## Cornell Notes

### Topic: Section Overview

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Object-Oriented Programming – Classes and Objects
- What is Object-Oriented Programming?
- What are Classes and Objects?
- Declaring Classes and creating Objects
- Dot and pointer operators
- `public` and `private` access modiﬁers
- Methods, Constructors and Destructors
  - `class` methods
  - default and overloaded constructors 
  - copy and move constructors
  - shallow vs. deep copying 
  - `this` pointer
- `static` class members
- `struct` vs. `class`
- `friend` of a class

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What is Object-Oriented Programming

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### What is Object-Oriented Programming?
- Procedural Programming
- Procedural Programming limitations
- OO Programming concepts and their advantages
- OO Programming limitations

##### Procedural programming
- Focus is on processes or actions that a program takes
- Programs are typically a collection of functions
- Data is declared separately
- Data is passed as arguments into functions
- Fairly easy to learn

##### Procedural programming - Limitations
- Functions need to know the structure of the data.
  - if the structure of the data changes many functions must be changed
- As programs get larger they become more:
  - diﬃcult to understand
  - diﬃcult to maintain
  - diﬃcult to extend
  - diﬃcult to debug
  - diﬃcult to reuse code
  - fragile and easier to break

- Classes and Objects
  - focus is on classes that model real-world domain entities
  - allows developers to think at a higher level of abstraction
  - used successfully in very large programs

- Encapsulation
  - objects contain data AND operations that work on that data
  - Abstract Data Type (ADT)

- Information-hiding
  - implementation-speciﬁc logic can be hidden
  - users of the class code to the interface since they don’t need to know the implementation
  - more abstraction
  - easier to test, debug, maintain and extend

- Reusability
  - easier to reuse classes in other applications
  - faster development
  - higher quality

- Inheritance
  - can create new classes in term of existing classes
  - reusability
  - polymorphic classes
- Polymorphism and more…

##### Limitations
- Not a panacea
  - OO Programming won’t make bad code better
  - not suitable for all types of problems
  - not everything decomposes to a class
- Learning curve
  - usually a steeper leaning curve, especially for C++
  - many OO languages, many variations of OO concepts
- Design
  - usually more up-front design is necessary to create good models and hierarchies
- Programs can be:
  - larger in size
  - slower
  - more complex


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: What are Classes and Objects?

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Classes and Objects
- Classes
  - blueprint from which objects are created
  - a user-deﬁned data-type
  - has attributes (data)
  - has methods (functions)
  - can hide data and methods
  - provides a public interface
- Example classes
  - Account
  - Employee
  - Image
  - std::vector
  - std::string

- Objects
  - created from a class
  - represents a speciﬁc instance of a class
  - can create many, many objects
  - each has its own identity
  - each can use the deﬁned class methods
- Example Account objects
  - Frank’s account is an instance of an Account
  - Jim’s account is an instance of an Account
  - Each has its own balance, can make deposits, withdrawals, etc.

```cpp
int high_score;
int low_score;
Account frank_account;
Account jim_account;
std::vector<int> scores;
std::string name;
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Declaring a Class and Creating Objects

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Declaring a Class
```cpp
class Class_Name
{
// declaration(s);
};
```
##### `Player` Class
```cpp
class Player
{
    // attributes
    std::string name;
    int health;
    int xp;
    // methods
    void talk(std::string text_to_say);
    bool is_dead();
};
```
- Creating Objects
```cpp
Player frank;
Player hero;
Player *enemy = new Player();
delete enemy;
```
##### `Account` Class
```cpp
class Account {
    //Attributes
    std::string name;
    double balance;
    // Methods
    bool withdraw(double amount);
    bool deposit(double amount);
};
```
- Creating objects
```cpp
Account frank_account;
Account jim_account;
Account accounts[] {frank_account, jim_account};
std::vector<Account> accounts1 {frank_account};
accounts1.push_back(jim_account);
```
---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Accessing Class Members

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- How do you access class members in C++?
- What is the difference between public, private, and protected members?
- How do you use getter and setter methods?

---

#### Notes Section (Main Notes)

##### Accessing Class Members
- We can access
    - class attributes
    - class methods
- Some class members will not be accessible (more on that later)
- We need an object to access instance variables
- If we have an object (dot operator)
- Using the dot operator
```cpp
Account frank_account;
frank_account.balance;
frank_account.deposit(1000.00);
```
- If we have a pointer to an object (member of pointer operator)
- Dereference the pointer then use the dot operator.
```cpp
Account
*frank_account = new Account();
(*frank_account).balance;
(*frank_account).deposit(1000.00);
```
- Or use the member of pointer operator (arrow operator)
```cpp
Account *frank_account = new Account();
frank_account->balance;
frank_account->deposit(1000.00);
```

---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Public and Private

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- Why do we need access modifiers in classes?
- What is the difference between `public` and `private` members?
- How does `protected` access work in inheritance?

---

#### Notes Section (Main Notes)

##### Class Member Access Modiﬁers

- `public`, `private`, and `protected`
- `public`
  - accessible everywhere
```cpp
class Class_Name
{
    public:
    // declaration(s);
};
```

- `private`
  - accessible only by members or friends of the class
```cpp
class Class_Name
{
private:
// declaration(s);
};
```

- `protected`
  - used with inheritance – we’ll talk about it in the next section
```cpp
class Class_Name
{
    protected:
    // declaration(s);
};
```

##### Declaring a Class
- `Player`
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
    void talk(std::string text_to_say);
    bool is_dead();
};
```
- Creating objects
```cpp
Player frank;
frank.name = "Frank"; // Compiler error
frank.health = 1000; // Compiler error
frank.talk("Ready to battle"); // OK

Player *enemy = new Player();
enemy->xp = 100; // Compiler error
enemy->talk("I will hunt you down"); // OK
delete enemy;
```

---

#### Summary Section (Summary of Notes)

Access modifiers in classes control the visibility and accessibility of class members. `public` members can be accessed from anywhere, while `private` members can only be accessed by the class itself or its friends. `protected` members are accessible in derived classes, which is important for inheritance. Proper use of access modifiers helps to encapsulate data and protect it from unintended access or modification.

## Cornell Notes

### Topic: Implementing Member Methods

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

#### Notes Section (Main Notes)

##### Implementing Member Methods
- Very similar to how we implemented functions
- Member methods have access to member attributes
  - So you don’t need to pass them as arguments!
- Can be implemented inside the class declaration
  - Implicitly inline
- Can be implemented outside the class declaration
  - Need to use `Class_name::method_name`
- Can separate speciﬁcation from implementation
  - .h ﬁle for the class declaration
  - .cpp ﬁle for the class implementation

##### Inside the class declaration
```cpp
class Account {
private:
    double balance;
public:
    void set_balance(double bal) {
        balance = bal;
    }
    double get_balance() {
        return balance;
    }
};
```

##### Outside the class declaration
```cpp
class Account {
private:
    double balance;
public:
    void set_balance(double bal);
    double get_balance();
};
void Account::set_balance(double bal) {
balance = bal;
}
double Account::get_balance() {
    return balance;
}
```

##### Separating Speciﬁcation from Implementation
```cpp
// Account.h
class Account {
private:
    double balance;
public:
    void set_balance(double bal);
    double get_balance();
};
```
- Include Guards
```cpp
#ifndef _ACCOUNT_H_
#define _ACCOUNT_H_
// Account class declaration
#endif
```
```cpp
// Account.h - #pragma once
#pragma once
class Account {
private:
    double balance;
public:
    void set_balance(double bal);
    double get_balance();
};
```
```cpp
// Account.cpp
#include "Account.h"
void Account::set_balance(double bal) {
    balance = bal;
}
double Account::get_balance() {
    return balance;
}
```
```cpp
// main.cpp
#include <iostream>
#include "Account.h"
int main() {
    Account frank_account;
    frank_account.set_balance(1000.00);
    double bal = frank_account.get_balance();
    std::cout << bal << std::endl; // 1000
return 0;
}
```



---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

## Cornell Notes

### Topic: Constructors And Destructors

### Date: 08/05/2026

---

#### Cue Column (Questions, Keywords, or Prompts)

- What is a constructor?
- What is a destructor?
- How are constructors and destructors used in C++?

---

#### Notes Section (Main Notes)

##### Constructors
- Special member method
- Invoked during object creation
- Useful for initialization
- Same name as the class
- No return type is speciﬁed
- Can be overloaded

##### Player Constructors
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
    // Overloaded Constructors
    Player();
    Player(std::string name);
    Player(std::string name, int health, int xp);
};
```

##### Account Constructors
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    // Constructors
    Account();
    Account(std::string name, double balance);
    Account(std::string name);
    Account(double balance);
};
```

##### Destructors
- Special member method
- Same name as the class proceeded with a tilde (~)
- Invoked automatically when an object is destroyed
- No return type and no parameters
- Only 1 destructor is allowed per class – cannot be overloaded!
- Useful to release memory and other resources

##### Player Destructor
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
    Player();
    Player(std::string name);
    Player(std::string name, int health, int xp);
    // Destructor
    ~Player();
};
```

##### Account Destructor
```cpp
class Account
{
private:
    std::string name;
    double balance;
public:
    Account();
    Account(std::string name, double balance);
    Account(std::string name);
    Account(double balance);
    // Destructor
    ~Account();
};
```

##### Creating objects
```cpp
{
    Player slayer;
    Player frank {"Frank", 100, 4 };
    Player hero {"Hero"};
    Player villain {"Villain"};
    // use the objects
}   // 4 destructors called
    
Player *enemy = new Player("Enemy", 1000, 0);
delete enemy; // destructor called
```


---

#### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]

