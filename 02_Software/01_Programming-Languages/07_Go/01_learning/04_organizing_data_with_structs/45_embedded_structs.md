# Cornell Notes

## Topic: Embedded Structs

## Date: 19/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Embedded Structs
- In Go, you can embed one struct within another struct. This allows the outer struct to access the fields of the embedded struct directly, without needing to specify the name of the embedded struct.
```go
type Address struct {
    Street string
    City   string
}
type Person struct {
    Name    string
    Age     int
    Address // Embedded struct
}
func main() {
    person := Person{
        Name: "Alice",
        Age:  30,
        Address: Address{
            Street: "123 Main St",
            City:   "Anytown",
        },
    }
    fmt.Println(person.Name)   // Output: Alice
    fmt.Println(person.Age)    // Output: 30
    fmt.Println(person.Street) // Output: 123 Main St
    fmt.Println(person.City)   // Output: Anytown
}
```
- In this example, the `Person` struct embeds the `Address` struct. This allows us to access the `Street` and `City` fields directly from the `person` variable without needing to specify `person.Address.Street` or `person.Address.City`.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]