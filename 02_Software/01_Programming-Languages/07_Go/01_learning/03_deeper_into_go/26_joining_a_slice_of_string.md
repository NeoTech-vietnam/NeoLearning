# Cornell Notes

## Topic: Joining a Slice of Strings

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How do you join a slice of strings in Go?
- What function is used to join strings with a separator?
- Can you use any string as a separator when joining strings?

---

### Notes Section (Main Notes)

#### Joining a Slice of Strings
- In Go, you can join a slice of strings into a single string using the `strings.Join` function from the `strings` package.
- The `strings.Join` function takes two parameters: the slice of strings to join and a separator string that will be placed between each element in the resulting string.
- For example, if you have a slice of strings like `[]string{"Hello", "World", "Go"}`, you can join them with a space as a separator:
```go
import "strings"

func main() {
    words := []string{"Hello", "World", "Go"}
    result := strings.Join(words, " ")
    fmt.Println(result) // Output: "Hello World Go"
}
```
- The `strings.Join` function is efficient and is the recommended way to concatenate a slice of strings in Go, especially when dealing with large slices, as it minimizes memory allocations compared to using the `+` operator in a loop.
- You can use any string as a separator, such as a comma, a hyphen, or even an empty string if you want to concatenate the strings without any separator:
```go
result := strings.Join(words, ", ")
fmt.Println(result) // Output: "Hello, World, Go"
```
---

### Summary Section (Summary of Notes)

- The `strings.Join` function is used to concatenate a slice of strings into a single string with a specified separator.
- It is efficient and minimizes memory allocations compared to using the `+` operator in a loop.
- Any string can be used as a separator, including commas, hyphens, spaces, or even an empty string for direct concatenation.
```go
import "strings"
```
- You can go to [Strings Function](https://golang.org/pkg/strings/#Join) for more information on the `strings.Join` function and its usage.