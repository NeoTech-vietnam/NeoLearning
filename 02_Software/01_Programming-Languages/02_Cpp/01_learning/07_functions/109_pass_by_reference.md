# Cornell Notes

## Topic: Pass by Reference

## Date: 05/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Pass by Reference
- Sometimes we want to be able to change the actual parameter from within the function body
- In order to achieve this we need the location or address of the actual parameter
- We saw how this is the eﬀect with array, but what about other variable types?
- We can use reference parameters to tell the compiler to pass in a reference to the actual parameter.
- The formal parameter will now be an alias for the actual parameter
- You just pass the variable, and the compiler handles the address for you.

#### Example
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

#### vector example – pass by value
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

#### vector example – pass by reference
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

#### vector example – pass by const reference
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

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]