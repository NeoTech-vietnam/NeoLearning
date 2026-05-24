# Cornell Notes

## Topic: Struct vs Classes

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Structs vs Classes
- In addition to deﬁne a class we can declare a struct
- struct comes from the C programming language
- Essentially the same as a class expect
  - members are public by default

#### class
```cpp
class Person {
    std::string name;
    std::string get_name();
};
Person p; 
p.name = "Frank"; // compiler error - private
std::cout << p.get_name(); // compiler error - private
```

#### struct
```cpp
struct Person {
    std::string name;
    std::string get_name(); // Why if name is public?
};
Person p;
p.name = "Frank"; // OK - public
std::cout << p.get_name(); // OK - public
```

#### Some general guidelines
- struct
  - Use struct for passive objects with public access
  - Don’t declare methods in struct
- class
  - Use class for active objects with private access
  - Implement getters/setters as needed
  - Implement member methods as needed

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]