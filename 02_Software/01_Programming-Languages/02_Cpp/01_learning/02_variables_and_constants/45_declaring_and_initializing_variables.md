# Cornell Notes

## Topic: Declaring and Initializing Variables

## Date: 09/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Declaring Variables**
```cpp
VariableType VariableName;
int age;
double rate;
string name;
Account franks_account;
Person james;
```

**2. Naming Variables**

- Can contain letters, numbers, and underscores
- Must begin with a letter or underscore (_)
- cannot begin with a number
- Cannot use C++ reserved keywords
- Cannot redeclare a name in the same scope
  - Remember that C++ is case sensitive

| Legal            | Illegal  |
| ---------------- | -------- |
| Age              | int      |
| _age             | 2014_age |
| My_age           | My age   |
| your_age_in_2014 | Age+1    |
| INT              | cout     |
| Int              | return   |

- Style and Best Practices:
- Be consistent with your naming conventions
  - myVariableName vs. my_variable_name
  - avoid beginning names with underscores
- Use meaningful names
  - Not too long and not too short
- Never use variables before initializing them
- Declare variables close to when you need them in your code

**3. Initializing Variables**

- **Datatypes with numbers:**
```cpp
int age; // uninitialized
int age = 21; // C-like initialization
int age (21); // Constructor initialization
int age {21}; // C++11 list initialization syntax
```
- **Datatypes with characters:**
```cpp
char grade = 'A'; // C-like initialization
char grade ('A'); // Constructor initialization
char grade {'A'}; // C++11 list initialization syntax
```
- **Datatypes with strings:**
```cpp
string name = "Frank"; // C-like initialization
string name ("Frank"); // Constructor initialization
string name {"Frank"}; // C++11 list initialization syntax
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]