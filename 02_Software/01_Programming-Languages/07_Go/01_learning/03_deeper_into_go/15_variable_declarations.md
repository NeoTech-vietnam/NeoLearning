# Cornell Notes

## Topic: Project Overview

## Date: 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### 1. Variable Declarations
- In Go, you can declare a variable using the `var` keyword followed by the variable name and its type. For example:
```go
var card string = "Ace of Spades"
```
- This declares a variable named `card` of type `string` and assigns it the value "Ace of Spades". Means that **only the string type** of value can be assigned to the `card` variable.
- You can also declare a variable without specifying the type, and Go will infer the type based on the assigned value:
```go
var card = "Ace of Spades"
```
- Additionally, you can use the short variable declaration syntax, which is a shorthand for declaring and initializing a variable:
```go
card := "Ace of Spades"
```
- This is equivalent to the previous examples but is more concise. The `:=` operator tells Go to infer the type of the variable based on the assigned value.
- We might be able to initialize a variable and then later assign a variable to it, but we cannot change the type of the variable after it has been declared. For example:
```go
var deckSize int
deckSize = 52
deckSize = "Thach" // This will cause a compile-time error
```
- In this example, we declare a variable `deckSize` of type `int` and then assign it the value 52. We can change the value of `deckSize`, but we cannot assign a value of a different type (e.g., a string) to it without causing a compile-time error.
```go
./prog.go:12:13: cannot use "Thach" (untyped string constant) as int value in assignment
```

#### 2. Dynamic Type Language vs Static Type Language
- Go is a statically typed language, which means that the type of a variable is determined at compile time and cannot change at runtime. This is in contrast to dynamically typed languages, where the type of a variable can change at runtime.
- In Go, once you declare a variable with a specific type, you cannot assign a value of a different type to that variable. 
- For example, if you declare a variable as a string, you cannot later assign an integer to that variable without causing a compile-time error.
- This static typing helps catch type-related errors early in the development process and can lead to more efficient code execution since the compiler can optimize based on known types.

| Dynamic Types            | Static Types  |
| ------------------------ | ------------- |
| JavaScript, Python, Ruby | Go, Java, C++ |

#### 3. Basic Go Types

| Type     | Description                          | Example Value |
| -------- | ------------------------------------ | ------------- |
| int      | A whole number                       | 42            |
| float64  | A floating-point number              | 3.14          |
| string   | A sequence of characters             | "Hello, Go!"  |
| bool     | A boolean value (true or false)      | true          |


#### 4. Variable declaration outside of main function
- **`var` keyword declaration:**
  - In Go, you can declare variables outside of the `main` function, and these variables will have package-level scope. This means that they can be accessed by any function within the same package.
  - For example, you can declare a variable at the package level like this:
  ```go
  package main
  import "fmt"
  var card string = "Ace of Spades"
  func main() {
      fmt.Println(card)
  }
  ```
  - In this example, the variable `card` is declared outside of the `main` function and can be accessed within the `main` function. This allows you to share data across different functions within the same package without needing to pass the variable as an argument.
- **Short variable declaration (`:=`)**:
  - When declaring with `:=`, you **cannot** declare a variable at the package level. The short variable declaration syntax is only allowed within functions. If you try to use `:=` outside of a function, you will get a compile-time error.
    ```go
    ./prog.go:7:1: syntax error: non-declaration statement outside function body
    ```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]