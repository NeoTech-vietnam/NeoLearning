# Cornell Notes

## Topic: Updating Struct Values

## Date: 15/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Third Way to Declare Structs
- You can also declare a struct using the `var` keyword and then assign values to its fields separately.
```go
var person Person
person.Name = "Alice"
person.Age = 30
fmt.Println(person.Name) // Output: Alice
fmt.Println(person.Age)  // Output: 30
```

#### Zero Values
- When you declare a struct without initializing its fields, they will have zero values. For example, a string field will be an empty string `""`, and an integer field will be `0`.
```go
var person Person
fmt.Println(person.Name) // Output: (empty string)
fmt.Println(person.Age)  // Output: 0
```

#### Printf Function
- You can use the `Printf` function from the `fmt` package to print the values of struct fields in a formatted way.
```go
fmt.Printf("Name: %s, Age: %d\n", person.Name, person.Age) // Output: Name: Alice, Age: 30
```
- `%+v` can be used to print the struct with field names.
```go
fmt.Printf("%+v\n", person) // Output: {Name:Alice Age:30}
```

---

### Summary Section (Summary of Notes)

- Structs in Go can be declared and initialized in multiple ways.
- You can update struct values using the `var` keyword and assigning values to fields separately.
- Uninitialized struct fields have zero values: empty string `""` for strings and `0` for integers.