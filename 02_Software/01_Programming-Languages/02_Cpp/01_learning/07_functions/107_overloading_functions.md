# Cornell Notes

## Topic: Overloading Functions

## Date: 05/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Overloading Functions
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

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]