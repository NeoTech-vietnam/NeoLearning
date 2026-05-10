# Cornell Notes

## Topic: Receiver Functions

## Date: 20/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Receiver Functions
- In Go, you can define methods on types using receiver functions.
```go
func ( d deck) print() {
    for _, card := range d {
        fmt.Println(card)
    }
}
```
- `d`: the actual copy of the `deck` we are working with is available in the function as a variable. `d` could be replaced with any name, but it is common to use a short, lowercase name that represents the type.
- The receiver function is defined with a receiver type (in this case, `deck`) and allows you to call the method on instances of that type. Every variable of type `deck` will have access to the `print` method.
```go
d := deck{"Ace of Spades", "Two of Hearts"}
d.print()
```
- Receiver functions can be defined on any type, including custom types that you create using the `type` keyword.
- This allows you to add behavior to your custom types and make them more powerful and flexible.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]