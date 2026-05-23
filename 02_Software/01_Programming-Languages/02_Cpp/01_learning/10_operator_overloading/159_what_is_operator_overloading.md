# Cornell Notes

## Topic: What is Operator Overloading?

## Date: 18/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What is Operator Overloading?

- Using traditional operators such as `+`, `=`, `*`, etc. with user-deﬁned types
- Allows user deﬁned types to behave similar to built-in types
- Can make code more readable and writable
- Not done automatically (except for the assignment operator) 
- They must be explicitly deﬁned

- Suppose we have a Number class that models any number
- Using functions:
```cpp
Number result = multiply(add(a,b),divide(c,d));
```
- Using member methods:
```cpp
Number result = (a.add(b)).multiply(c.divide(d));
```
- Using overloaded operators 

```cpp
Number result = (a+b)*(c/d);
```

#### What operators can be overloaded?
- The majority of C++’s operators can be overloaded
- The only operators that cannot be overloaded are:
  - Scope resolution operator `::`
  - Member access operator `.`
  - Pointer to member access operator `.*`
  - Ternary conditional operator `?:`
  - `sizeof` operator

#### Some basic rules
- Precedence and Associativity cannot be changed
- `arity` cannot be changed (i.e. can’t make the division operator unary)
- Can’t overload operators for primitive type (e.g. int, double, etc.)
- Can’t create new operators
- `[]`, `()`, `->`, and the assignment operator (`=`) must be declared as member methods
- Other operators can be declared as member methods or global functions

#### Some examples
- `int`
```cpp
a = b + c;
a < b;
std::cout << a;
```
- `double`
```cpp
a = b + c;
a < b;
std::cout << a;
```
- `long`
```cpp
a = b + c;
a < b;
std::cout << a;
```
- `std::string`
```cpp
s1 = s2 + s3;
s1 < s2;
std::cout << s1;    
```
- `Mystring`
```cpp
s1 = s2 + s3;
s1 < s2;
s1 == s2;
std::cout << s1; 
```
- `Player`
```cpp
p1 = p2 + p3;
p1 == p2;
std::cout << p1;
```
- `Mystring` class declaration
```cpp
class Mystring {
private:
    char *str; // pointer to a char[] that holds a C-style string
public:
    Mystring(); // No-args constructor
    Mystring(const char *s); // Overloaded constructor
    Mystring(const Mystring &source); // Copy constructor
    ~Mystring(); // Destructor
    void display() const;
    int get_length(); const;
    const char *get_str() const;
};
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]