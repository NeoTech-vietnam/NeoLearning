# Cornell Notes

## Topic: Import Statements

## Date: 14/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What does `import fmt` mean?
- In Go, the `import` statement is used to include packages in your program.
- `fmt` is the shorten form of `format` and it is a standard library package in Go that provides formatted I/O functions, such as printing to the console.
- When you write `import "fmt"`, you are telling the Go compiler that you want to use the functions provided by the `fmt` package in your code.
```go
import "fmt"
```
- After importing `fmt`, you can use its functions, such as `fmt.Println()`, to print output to the console.
```go
fmt.Println("Hello, World!")
```
#### The import statement
- The `import` statement can also be used to import multiple packages at once using parentheses:
```go
import (
    "fmt"
    "math"
)
```
- This allows you to organize your imports and makes it easier to read.
- We can visit `golang.org/pkg/` to see all the standard library packages available in Go.
- You can also import third-party packages by specifying their path, such as:
```go
import "github.com/some/package"
```


### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]