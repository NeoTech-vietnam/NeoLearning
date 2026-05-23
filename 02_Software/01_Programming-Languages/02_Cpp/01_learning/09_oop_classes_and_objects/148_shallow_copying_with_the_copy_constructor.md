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
- **Problem**: when we release the storage in the destructor, the other object still refers to the released storage!
- Example of the problem with shallow copying:
```
free(): double free detected in tcache 2
```

#### Copy Constructor
```cpp
//Shallow
class Shallow {
private:
    int *data; // Pointer
public:
    Shallow(int d); // Constructor
    Shallow(const Shallow &source); // Copy Constructor
    ~Shallow(); // Destructor
};
```
- Shallow constructor
```cpp
Shallow::Shallow(int d) {
    data = new int; // allocate storage
    *data = d;
    }
```
- Shallow destructor
```cpp
Shallow::~Shallow() {
    delete data; // free storage
    cout << "Destructor freeing data" << endl;
}
```
- Shallow copy constructor
```cpp
Shallow::Shallow(const Shallow &source)
    : data(source.data) {
        cout << "Copy constructor - shallow" << endl;
}
```
- Shallow copy - only the pointer is copied - not what it is pointing to!
- **Problem**: source and the newly created object BOTH point to the SAME data area!
- Sample main – will likely crash
```cpp
int main() {
    Shallow obj1 {100};
    display_shallow(obj1); // obj1’s data has been released!
    obj1.set_data_value(1000);
    Shallow obj2 {obj1};
    cout << "Hello world" << endl;
    return 0;
}
```


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]