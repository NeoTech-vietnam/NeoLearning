# Cornell Notes

## Topic: Deep copying with the copy constructor

## Date: 13/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a copy constructor?
- When should you use a deep copy?
- How do you implement a user-provided copy constructor?

---

### Notes Section (Main Notes)

#### User-provided copy constructor
- Create a copy of the pointed-to data
- Each copy will have a pointer to unique storage in the heap
- Deep copy when you have a raw pointer as a class data member

#### Copy Constructor
- Deep:
```cpp
class Deep {
private:
    int *data; // POINTER
public:
    Deep(int d); // Constructor
    Deep(const Deep &source); // Copy Constructor
    ~Deep(); // Destructor
};
```
- Deep constructor
```cpp
Deep::Deep(int d) {
    data = new int; // allocate storage
    *data = d;
}
```
- Deep destructor
```cpp
Deep::~Deep() {
    delete data; // free storage
    cout << "Destructor freeing data" << endl;
}
```
- Deep copy – create new storage and copy values
```cpp
Deep::Deep(const Deep &source)
{
    data = new int; // allocate storage
    *data = *source.data;
    cout << "Copy constructor - deep"
    << endl;
}
```
- Deep copy constructor – delegating constructor
```cpp
Deep::Deep(const Deep &source)
    : Deep{*source.data} {
    cout << "Copy constructor - deep"
        << endl;
}
```
- Delegate to `Deep(int)` and pass in the `int (*source.data)` source is pointing to
- Deep – a simple method that expects a copy
```cpp
void display_deep(Deep s) {
    cout << s.get_data_value() << endl;
}
```
- When s goes out of scope the destructor is called and releases data.
- **No Problem**: since the storage being releases is unique to `s`
- Sample main – will not crash
```cpp
int main() {
    Deep obj1 {100};
    display_deep(obj1);
    obj1.set_data_value(1000);
    Deep obj2 {obj1};
    return 0;
}
```

---

### Summary Section (Summary of Notes)

- A copy constructor is used to create a new object as a copy of an existing object.
- Deep copying is necessary when a class contains raw pointers to ensure each object has its own copy of the data.
- Implementing a user-provided copy constructor allows for proper management of dynamically allocated memory, preventing shallow copy issues.