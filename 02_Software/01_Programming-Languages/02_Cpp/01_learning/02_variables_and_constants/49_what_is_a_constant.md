# Cornell Notes

## Topic: What is a constant?

## Date: 13/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

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

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]