# Cornell Notes

## Topic: Generic Programming with Class Templates

## Date: 15/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What is a C++ Class Template?

- Similar to function template, but at the class level
- Allows plugging-in any data type
- Compiler generates the appropriate class from the blueprint

#### Generic Programming with class templates

- Let’s say we want a class to hold Items where the item has a name and an integer

![alt text](image-22.png)

- But we’d like our `Item` class to be able to hold any type of data in addition to the string
- We can’t overload class names
- We don’t want to use dynamic polymorphism

#### Generic Programming with class templates

![alt text](image-23.png)

![alt text](image-24.png)

![alt text](image-25.png)

#### Multiple types as template parameters

- We can have multiple template parameters
- An their types can be diﬀerent

![alt text](image-26.png)

![alt text](image-27.png)

#### `std::pair`

![alt text](image-28.png)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]