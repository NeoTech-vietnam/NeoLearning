# Cornell Notes

## Topic: Function Parameters and the return Statement

## Date: 05/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What are function parameters?
- How does the return statement work?
- What is the difference between pass-by-value and pass-by-reference?

---

### Notes Section (Main Notes)

#### Function Parameters
- When we call a function we can pass in data to that function
- In the function call they are called arguments
- In the function deﬁnition they are called parameters
- They must match in number, order, and in type

#### Example
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
#### Pass-by-value
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

#### Function Return Statement
- If a function returns a value then it must use a return statement that returns a value
- If a function does not return a value (void) then the return statement is optional
- return statement can occur anywhere in the body of the function
- return statement immediately exits the function
- We can have multiple return statements in a function
  - Avoid many return statements in a function
- The return value is the result of the function call



---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]