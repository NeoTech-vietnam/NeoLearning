# Cornell Notes

## Topic: Abstract Classes as Interfaces

## Date: 08/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What is using a class as an interface?
- An abstract class that has only pure virtual functions
- These functions provide a general set of services to the user of the class
- Provided as public
- Each subclass is free to implement these services as needed
- Every service (method) must be implemented
- The service type information is strictly enforced

#### A Printable example

- C++ does not provide true interfaces
- We use abstract classes and pure virtual functions to achieve it
- Suppose we want to be able to provide `Printable` support for any object we wish without knowing it’s implementation at compile time

```cpp
std::cout << any_object << std::endl;
```
- any_object must conform to the Printable interface

![alt text](image-18.png)

![alt text](image-19.png)

![alt text](image-20.png)

#### A Shapes example

![alt text](image-21.png)

![alt text](image-22.png)

![alt text](image-23.png)

![alt text](image-24.png)

![alt text](image-25.png)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]