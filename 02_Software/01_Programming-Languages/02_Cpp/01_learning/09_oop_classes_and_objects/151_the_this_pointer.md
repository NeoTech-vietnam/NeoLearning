# Cornell Notes

## Topic: The `this` pointer

## Date: 13/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### The `this` pointer
- `this` is a reserved keyword
- Contains the address of the object - so it’s a pointer to the object
- Can only be used in class scope
- All member access is done via the `this` pointer
- Can be used by the programmer
  - To access data member and methods
  - To determine if two objects are the same (more in the next section)
  - Can be dereferenced `(*this)` to yield the current object
```cpp
void Account::set_balance(double bal) {
    balance = bal; // this->balance is implied
}
```
- To disambiguate identiﬁer use
```cpp
void Account::set_balance(double balance) {
    balance = balance; // which balance? The parameter
}
void Account::set_balance(double balance) {
    this->balance = balance; // Unambiguous
}
```
- To determine object identity
- Sometimes its useful to know if two objects are the same object
```cpp
int Account::compare_balance(const Account &other) {
    if (this == &other)
        std::cout << "The same objects" << std::endl;
        ...
}
frank_account.compare_balance(frank_account);
```
- We’ll use the `this` pointer again when we overload the assignment operator

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]