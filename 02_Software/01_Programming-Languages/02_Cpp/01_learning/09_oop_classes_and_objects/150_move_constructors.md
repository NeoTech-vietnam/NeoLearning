# Cornell Notes

## Topic: Move Constructors

## Date: 13/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a move constructor?
- When should you use a move constructor?
- How do you implement a user-provided move constructor?

---

### Notes Section (Main Notes)

#### Move Constructor
- Sometimes when we execute code the compiler creates unnamed temporary values
```cpp
int total {0};
total = 100 + 200;
```
- 100 + 200 is evaluated and 300 stored in an unnamed temp value
- the 300 is then stored in the variable total
- then the temp value is discarded
- The same happens with objects as well

#### When is it useful?
- Sometimes copy constructors are called many times automatically due to the copy semantics of C++
- Copy constructors doing deep copying can have a signiﬁcant performance bottleneck
- C++11 introduced move semantics and the move constructor
- Move constructor moves an object rather than copy it
- Optional but recommended when you have a raw pointer
- Copy elision – C++ may optimize copying away completely (RVO-Return Value Optimization)

#### r-value references
- Used in moving semantics and perfect forwarding
- Move semantics is all about r-value references
- Used by move constructor and move assignment operator to eﬃciently move an object rather than copy it
- R-value reference operator `(&&)`
```cpp
int x {100}
int &l_ref = x; // l-value reference
l_ref = 10; // change x to 10
int &&r_ref = 200; // r-value ref

r_ref = 300; // change r_ref to 300
int &&x_ref = x; // Compiler error
```

#### l-value reference parameters
```cpp
int x {100}; // x is an l-value

void func(int &num); // A
func(x); // calls A – x is an l-value
func(200); // Error – 200 is an r-value
```
#### r-value reference parameters
```cpp
int x {100}; // x is an l-value
void func(int &&num); // B
func(200); // calls B – 200 is an r-value
func(x); // ERROR - x is an l-value
```
- `error`: cannot bind rvalue reference of type 'int&&' to lvalue of type 'int'

#### l-value and r-value reference parameters
```cpp
int x {100}; // x is an l-value
void func(int &num); // A
void func(int &&num); // B
func(x); // calls A – x is an l-value
func(200); // calls B - 200 is an r-value
```
#### Example - Move class
```cpp
class Move {
private:
    int *data;
// raw pointer
public:
    void set_data_value(int d) { *data = d; }
    int get_data_value() { return *data; }
    Move(int d); // Constructor
    Move(const Move &source); // Copy Constructor
    ~Move(); // Destructor
};
```
#### Move class copy constructor
```cpp
Move::Move(const Move &source) {
    data = new int;
    *data = *source.data;
}
```
- Allocate storage and copy
#### Ineﬃcient copying
```cpp
Vector<Move> vec;
vec.push_back(Move{10});
vec.push_back(Move{20});
```
- Copy Constructors will be called to copy the temps

#### Ineﬃcient copying
```
Constructor for: 10
Constructor for: 10
Copy constructor - deep copy for: 10
Destructor freeing data for: 10
Constructor for: 20
Constructor for: 20
Copy constructor - deep copy for: 20
Constructor for: 10
Copy constructor - deep copy for: 10
Destructor freeing data for: 10
Destructor freeing data for: 20
```
#### What does it do?
- Instead of making a deep copy of the move constrictor
  - `moves` the resource
  - Simply copies the address of the resource from source to the current object
  - And, nulls out the pointer in the source pointer
- Very eﬃcient

#### syntax - r-value reference
```cpp
Type::Type(Type &&source);
Player::Player(Player &&source);
Move::Move(Move &&source);
```

#### Move class with move constructor
```cpp
class Move {
private:
    int *data; // raw pointer
public:
void set_data_value(int d) { *data = d; }
    int get_data_value() { return *data; }
    Move(int d); // Constructor
    Move(const Move &source); // Copy Constructor
    Move(Move &&source); // Move Constructor
    ~Move(); // Destructor
};
```
```
Move::Move(Move &&source)
    : data{source.data} {
        source.data = nullptr;
}
```
- `Steal` the data and then null out the source pointer

#### eﬃcient
```cpp
Vector<Move> vec;
vec.push_back(Move{10});
vec.push_back(Move{20});
```
- Move Constructors will be called for the temp r-values
```
Constructor for: 10
Move constructor - moving resource: 10
Destructor freeing data for nullptr
Constructor for: 20
Move constructor - moving resource: 20
Move constructor - moving resource: 10
Destructor freeing data for nullptr
Destructor freeing data for nullptr
Destructor freeing data for: 10
Destructor freeing data for: 20
```

---

### Summary Section (Summary of Notes)

- Move constructors allow for efficient transfer of resources from temporary objects (r-values) to new objects.
- R-value references (`&&`) are used to implement move semantics.
- Move constructors "steal" resources from the source object and nullify the source's pointers to prevent double deletion.
- Using move constructors can significantly improve performance by avoiding unnecessary deep copies.