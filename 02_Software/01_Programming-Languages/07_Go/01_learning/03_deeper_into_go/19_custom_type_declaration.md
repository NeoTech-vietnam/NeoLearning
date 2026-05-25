# Cornell Notes

## Topic: Custom Type Declaration

## Date: 20/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Type Declaration
- In Go, you can create custom types using the `type` keyword.
```go
type MyInt int
```
- This creates a new type `MyInt` that is based on the built-in `int` type.
- You can use `MyInt` just like you would use `int`, but it is a distinct type.
```go
var a MyInt = 5
var b int = 10
```
- Or you can use deck to replace string in also the function:
```go
type Deck []string
func( d deck ) print() {
    for _, card := range d {
        fmt.Println(card)
    }
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]