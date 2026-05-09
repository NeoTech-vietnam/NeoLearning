# Section 5: Structure of a C++ Program

## Topic: Namespaces in C++

## Date: 14/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

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

### Notes Section (Main Notes)

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

### Summary Section (Summary of Notes)

Namespaces are organizational tools in C++ that prevent naming conflicts by grouping code into logical scopes. The `std` namespace contains the C++ standard library. There are three primary ways to use namespaces: (1) **Explicit scope resolution** (`std::cout`) - most explicit and recommended for production code; (2) **`using namespace` directive** - imports all namespace members but risks conflicts and namespace pollution; (3) **Qualified `using` declarations** (`using std::cout;`) - a balanced approach importing only specific identifiers. The scope resolution operator `::` accesses namespace members. Custom namespaces organize large projects and third-party frameworks use their own namespaces to avoid conflicts. Best practice is using explicit scope resolution in library code, avoiding `using namespace std;` in production, and using qualified `using` declarations for frequently-accessed identifiers.
