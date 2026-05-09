# Cornell Notes

## Topic: Public and Private

## Date: 08/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Why do we need access modifiers in classes?
- What is the difference between `public` and `private` members?
- How does `protected` access work in inheritance?

---

### Notes Section (Main Notes)

#### Class Member Access Modiﬁers

- `public`, `private`, and `protected`
- `public`
  - accessible everywhere
```cpp
class Class_Name
{
    public:
    // declaration(s);
};
```

- `private`
  - accessible only by members or friends of the class
```cpp
class Class_Name
{
private:
// declaration(s);
};
```

- `protected`
  - used with inheritance – we’ll talk about it in the next section
```cpp
class Class_Name
{
    protected:
    // declaration(s);
};
```

#### Declaring a Class
- `Player`
```cpp
class Player
{
private:
    std::string name;
    int health;
    int xp;
public:
    void talk(std::string text_to_say);
    bool is_dead();
};
```
- Creating objects
```cpp
Player frank;
frank.name = "Frank"; // Compiler error
frank.health = 1000; // Compiler error
frank.talk("Ready to battle"); // OK

Player *enemy = new Player();
enemy->xp = 100; // Compiler error
enemy->talk("I will hunt you down"); // OK
delete enemy;
```

---

### Summary Section (Summary of Notes)

Access modifiers in classes control the visibility and accessibility of class members. `public` members can be accessed from anywhere, while `private` members can only be accessed by the class itself or its friends. `protected` members are accessible in derived classes, which is important for inheritance. Proper use of access modifiers helps to encapsulate data and protect it from unintended access or modification.