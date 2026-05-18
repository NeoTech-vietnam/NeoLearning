# Cornell Notes

## Topic: Structs with Receiver Functions

## Date: 19/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Structs with Receiver Functions in Go
- We can pass a struct as a receiver to a function, allowing us to define methods on the struct.
- This is done by defining a function with a receiver argument, which is the struct type.
```go
type Person struct {
    Name string
    Age  int
}
func (p Person) Greet() string {
    return fmt.Sprintf("Hello, my name is %s and I am %d years old.", p.Name, p.Age)
}
```
- In this example, we have defined a `Person` struct with two fields: `Name` and `Age`. We then defined a method `Greet` that takes a `Person` as a receiver and returns a greeting string.
- We can create an instance of the `Person` struct and call the `Greet` method on it:
```go
person := Person{Name: "Alice", Age: 30}
greeting := person.Greet()
fmt.Println(greeting) // Output: Hello, my name is Alice and I am 30 years old.
```
- Receiver functions allow us to associate behavior with our data structures, making our code more organized and easier to read. They are a fundamental part of Go's approach to object-oriented programming, enabling us to define methods on our structs and work with them in a more intuitive way.

#### Funny Scenario with normal struct argument of function?
- Create 1 function to modify the struct in main() and 1 function to print the struct in main().
```go
func (p Person) UpdateAge(newAge int) {
    p.Age = newAge
}
func (p Person) PrintInfo() {
    fmt.Printf("Name: %s, Age: %d\n", p.Name, p.Age)
}
```
- What happens when we call `UpdateAge` on a `Person` instance? The age will not be updated in the original struct because the receiver is passed by value, meaning a copy of the struct is created for the function.

```go
person := Person{Name: "Bob", Age: 25}
person.UpdateAge(26)
person.PrintInfo() // Output: Name: Bob, Age: 25
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]