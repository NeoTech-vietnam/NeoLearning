# Cornell Notes

## Topic: Functions and Return Types

## Date: 15/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### 1. Functions Declaration
- In Go, you can declare a function using the `func` keyword followed by the function name, parameters, and return type. For example:
```go
func add(a int, b int) int {
    return a + b
}
```
- This declares a function named `add` that takes two parameters of type `int` and returns an `int`. The function body contains the logic to add the two parameters and return the result.
- You can also declare a function that does not return any value by omitting the return type:
```go
func printMessage(message string) {
    fmt.Println(message)
}
```
- This function takes a `string` parameter and prints it to the console without returning any value.
- Additionally, you can declare a function that returns multiple values by specifying multiple return types:
```go
func divide(a int, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}
```
- In this example, the `divide` function takes two `int` parameters and returns an `int` result and an `error`. If the second parameter is zero, it returns an error; otherwise, it returns the result of the division and `nil` for the error.

#### 2. Functions called in `func main()`
- In Go, the `main` function is the entry point of the program. You can call other functions from within the `main` function to execute your program's logic.
- By using the syntax `:=`, you can call a function and assign its return value to a variable in one step.
- For example:
```go
func main() {
    result := add(5, 3)
    fmt.Println("The result of addition is:", result)
    printMessage("Hello, Go!")
    quotient, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("The result of division is:", quotient)
    }
}
func add(a int, b int) int {
    return a + b
}
func printMessage(message string) {
    fmt.Println(message)
}
func divide(a int, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}
```
- You can also call functions inside `fmt.Println` or any other function that accepts the return value as an argument:
```go
func main() {
    fmt.Println("The result of addition is:", add(5, 3))
    printMessage("Hello, Go!")
    quotient, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {        fmt.Println("The result of division is:", quotient)
    }
}
```
- Unlike C or C++, Go does not require a separate header file to declare functions. You can define all your functions in the same file, and they can be called from the `main` function or any other function within the same package.
```go
package main
import "fmt"
func main() {
    result := add(5, 3)
    fmt.Println("The result of addition is:", result)
}
// Function declaration can be placed after the main function
func add(a int, b int) int {
    return a + b
}
```
- Or
```go
package main
import "fmt"

// Function declaration can be placed before the main function
func add(a int, b int) int {
    return a + b
}
func main() {
    result := add(5, 3)
    fmt.Println("The result of addition is:", result)
}
```


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]