# Cornell Notes

## Topic: Function Prototypes

## Date: 04/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Function Prototypes
- The compiler must ‘know’ about a function before it is used
  - Define functions before calling them
    - OK for small programs 
    - Not a practical solution for larger programs
  - Use function prototypes
    - Tells the compiler what it needs to know without a full function definition 
    - Also called forward declarations
    - Placed at the beginning of the program 
    - Also used in our own header files (.h) – more about this later

#### Example
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
#### A function with no return type and no parameters
```cpp
void say_hello();
void say_hello() {
    cout << "Hello" << endl;
}
```
#### Calling a function
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

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]