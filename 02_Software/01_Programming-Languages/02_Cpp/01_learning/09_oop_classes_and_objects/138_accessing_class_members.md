# Cornell Notes

## Topic: Accessing Class Members

## Date: 08/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How do you access class members in C++?
- What is the difference between public, private, and protected members?
- How do you use getter and setter methods?

---

### Notes Section (Main Notes)

#### Accessing Class Members
- We can access
    - class attributes
    - class methods
- Some class members will not be accessible (more on that later)
- We need an object to access instance variables
- If we have an object (dot operator)
- Using the dot operator
```cpp
Account frank_account;
frank_account.balance;
frank_account.deposit(1000.00);
```
- If we have a pointer to an object (member of pointer operator)
- Dereference the pointer then use the dot operator.
```cpp
Account
*frank_account = new Account();
(*frank_account).balance;
(*frank_account).deposit(1000.00);
```
- Or use the member of pointer operator (arrow operator)
```cpp
Account *frank_account = new Account();
frank_account->balance;
frank_account->deposit(1000.00);
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]