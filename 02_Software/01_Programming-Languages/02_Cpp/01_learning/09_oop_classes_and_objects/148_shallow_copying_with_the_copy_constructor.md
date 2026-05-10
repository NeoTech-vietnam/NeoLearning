# Cornell Notes

## Topic: Shallow Copying with the Copy Constructor

## Date: 10/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Shallow vs. Deep Copying
- Consider a class that contains a pointer as a data member
- Constructor allocates storage dynamically and initializes the pointer
- Destructor releases the memory allocated by the constructor
- What happens in the default copy constructor?

#### Default copy constructor
- memberwise copy
- Each data member is copied from the source object
- The pointer is copied NOT what it points to (shallow copy)
- Problem: when we release the storage in the destructor, the other object still refers to the released storage!

#### Copy Constructor
```cpp
//Shallow
class Shallow {
private:
    int *data;
public:
    Shallow(int d);
    Shallow(const Shallow &source);
// Constructor
~Shallow();
};
```
- Shallow constructor
```cpp
Shallow::Shallow(int d) {
    data = new int; // allocate storage
    *data = d;
    }
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]