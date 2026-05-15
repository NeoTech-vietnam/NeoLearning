# Cornell Notes

## Topic: Declaring Structs

## Date: 15/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Declaring Structs
- There are 2 ways to declare a struct in Go:
```go
person := Person{"Alice", 30}
```
- This method is concise but less readable, especially when there are many fields or when the order of fields is not clear. In case you change the order of fields in the struct definition, this method can lead to errors since it relies on the order of fields.
```go
person := Person{
    Name: "Alice",
    Age:  30,
}
```
- This method is more verbose but improves readability by explicitly naming each field and its value.
```go
person := Person{Name: "Alice", Age: 30}
fmt.Println(person.Name) // Output: Alice
fmt.Println(person.Age)  // Output: 30
```

---

### Summary Section (Summary of Notes)

- Declaring structs in Go allows you to create complex data types that group together related fields.
- You can create instances of structs and access their fields using dot notation.
- Structs can have methods associated with them, enabling you to define behavior for the data they contain.