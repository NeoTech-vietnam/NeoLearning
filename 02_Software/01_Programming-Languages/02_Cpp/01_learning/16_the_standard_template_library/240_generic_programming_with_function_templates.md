# Cornell Notes

## Topic: Generic Programming with Function Templates

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

#### What is a C++ Template?

- Blueprint
- Function and class templates
- Allow plugging-in any data type
- Compiler generates the appropriate function/class from the blueprint
- Generic programming / meta-programming

- Let’s revisit the max function from the last note

![alt text](image-10.png)

#### max function

- Now suppose we need to determine the max of 2 doubles, and 2 chars

![alt text](image-11.png)

#### max function as a template function

- We can replace type we want to generalize with a name, say `T`
- But now this won’t compile

![alt text](image-12.png)

- We need to tell the compiler this is a template function
- We also need to tell it that T is the template parameter

![alt text](image-13.png)

- We may also use `class` instead of `typename`

![alt text](image-14.png)

- Now the compiler can generate the appropriate function from the template
- Note, this happens at compile-time!

![alt text](image-15.png)

- Many times the compiler can deduce the type and the template parameter is not needed
- Depending on the type of a and b, the compiler will ﬁgure it out

![alt text](image-16.png)

- And we can use almost any type we need

![alt text](image-17.png)

- Notice the type MUST support the `>` operator either natively or as an overloaded operator (`operator>`)

![alt text](image-18.png)

- The following will not compile unless `Player` overloads `operator>`

![alt text](image-19.png)

#### multiple types as template parameters

- We can have multiple template parameters
- And their types can be diﬀerent

![alt text](image-20.png)

- When we use the function we provide the template parameters
- Often the compiler can deduce them

![alt text](image-21.png)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]