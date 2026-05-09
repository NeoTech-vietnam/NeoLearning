# Section 5: Structure of a C++ Program

## Topic: Writing my first program

## Date: 14/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What are C++ keywords and why can't they be used as variable names?
- What is an identifier and what are the naming rules for identifiers?
- What is the stream insertion operator and how is it used?
- What is the stream extraction operator and how does it differ from insertion?
- What is the scope resolution operator and when do you use it?
- What role does punctuation play in C++ programs?
- What does syntax mean in the context of C++ programming?

---

### Notes Section (Main Notes)

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

### Summary Section (Summary of Notes)

The structure of a C++ program is built on fundamental components: **keywords** (reserved words like `int` and `return`), **identifiers** (user-defined names for variables and functions), and **syntax** (rules governing how code is written). Communication with the program happens through **stream operators**: the **stream insertion operator** `<<` for output to `cout` and the **stream extraction operator** `>>` for input from `cin` (opposite directions). The **scope resolution operator** `::` allows access to namespaced members, while **punctuation** marks (`;`, `{}`, `()`, etc.) organize and structure the code. Understanding these elements collectively is essential to writing syntactically correct and functional C++ programs.



