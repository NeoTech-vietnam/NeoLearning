# Cornell Notes

## Topic: OO Approach vs Go Approach

## Date: 18/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### OO Approach
- In Object-Oriented Programming (OOP), we typically define classes that encapsulate data and behavior. For example, we might have a `Card` class with properties like `suit` and `value`, and methods to manipulate those properties. We can create instances of the `Card` class to represent individual cards in a deck.
- We can have a `Deck` class that contains a collection of `Card` instances and methods to shuffle the deck, deal cards, etc. This approach emphasizes encapsulation and abstraction, allowing us to model real-world entities in our code.
- Meanwhile, `Deck` instance can include:
  - cards := []string
  - print() function
  - shuffle() function
  - saveToFile() function

#### Go Approach
- In Go, we don't have classes, but we can achieve similar functionality by extending a base type and add some extra functionality to it.
```go
typde deck []string
```
- Tell Go we want to create an array of strings and add a bunch of functions specifically made to work with it.
- Then, we can create a functions with `deck` as the receiver, which allows us to call those functions on instances of `deck`. For example:
```go
func (d deck) print() {
    for i, card := range d {
        fmt.Println(i, card)
    }
}
```
- This allows us to call the `print` function on any instance of `deck`, and it will print the contents of the deck. We can also create other functions like `shuffle`, `saveToFile`, etc., that operate on the `deck` type. This approach emphasizes composition and allows us to build functionality on top of existing types without the need for classes or inheritance.
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]