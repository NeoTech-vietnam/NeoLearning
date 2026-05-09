# Section 5: Structure of a C++ Program

## Topic: Writing my first program

## Date: 14/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a preprocessor directive and when is it processed?
- What is the `#include` directive and what are the two ways to use it?
- What is the difference between `#include <filename>` and `#include "filename"`?
- What are standard library headers and how are they included?
- What are custom headers and how do you create them?
- What other preprocessor directives exist besides `#include`?
- How does the C++ preprocessor work differently from the C++ compiler?
- What is the difference between including a header file vs. defining code inline?

---

### Notes Section (Main Notes)

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

### Summary Section (Summary of Notes)

Preprocessor directives (starting with `#`) are processed before compilation and instruct the compiler on file inclusion and text manipulation. The `#include` directive includes header files using either `<filename>` for standard libraries or `"filename"` for custom headers. The preprocessor works by copying the entire content of included files into the source code before the compiler processes it. Beyond `#include`, other important directives include `#define` for macros, `#ifdef`/`#ifndef` for conditional compilation, and `#pragma` for compiler-specific instructions. Header guards (using `#ifndef` or `#pragma once`) prevent multiple inclusions of the same file. Understanding preprocessor directives is essential for organizing code, managing dependencies, and enabling conditional compilation in C++ programs.
