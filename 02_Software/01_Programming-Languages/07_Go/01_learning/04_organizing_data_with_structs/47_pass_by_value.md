# Cornell Notes

## Topic: Pass By Value

## Date: 19/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Pass By Value in Go
- In Go, when we pass a struct to a function, it is passed by value. This means that a copy of the struct is created for the function, and any modifications made to the struct within the function do not affect the original struct outside the function.
- This is an important concept to understand when working with structs in Go, as it can lead to unexpected behavior if you are not aware of it.
- For example, if we have a function that takes a struct as an argument and modifies its fields, the changes will not be reflected in the original struct outside the function.
```go
type Person struct {
    Name string
    Age  int
}
func UpdateAge(p Person, newAge int) {
    p.Age = newAge
}
func PrintInfo(p Person) {
    fmt.Printf("Name: %s, Age: %d\n", p.Name, p.Age)
}
```
- In this example, we have defined a `Person` struct and two functions: `UpdateAge` and `PrintInfo`. The `UpdateAge` function takes a `Person` struct and a new age as arguments and attempts to update the age of the person. However, since the struct is passed by value, the original `Person` struct in the main function will not be modified.
- When we call `UpdateAge` on a `Person` instance, the age will not be updated in the original struct because the receiver is passed by value, meaning a copy of the struct is created for the function.
```go
person := Person{Name: "Bob", Age: 25}
UpdateAge(person, 26)
PrintInfo(person) // Output: Name: Bob, Age: 25
```
- When a function returns, its stack frame is popped — all local variables and parameter copies created for that function are automatically deallocated.
- In Go (and most languages):
  - When you call a function, a stack frame is pushed — it holds all local variables and copies of passed arguments.
  - The function executes using those copies.
  - When the function returns, the stack frame is popped and destroyed — all those copies are gone.
```go
type Point struct { X, Y int }

func double(p Point) {  // p is a copy on the stack
    p.X *= 2
    p.Y *= 2
    // p lives here...
} // <-- stack frame destroyed, copy of p is gone

func main() {
    pt := Point{1, 2}
    double(pt)  // pt is unaffected; the copy inside double is deleted
    fmt.Println(pt) // {1, 2} — original unchanged
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]