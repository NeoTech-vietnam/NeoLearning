# Cornell Notes

## Topic: Multiple Return Values

## Date: 01/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Multiple Return Values
- Go functions can return multiple values.
- This is useful for returning both a result and an error, or for returning multiple related values without needing to create a struct.
```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}
```
- In the example above, the `divide` function returns both the result of the division and an error if the division cannot be performed.
- When calling a function that returns multiple values, you can use multiple assignment to capture those values:
```go
result, err := divide(10, 2)
if err != nil {
    fmt.Println("Error:", err)
} else {
    fmt.Println("Result:", result)
}
```
- This allows for clean error handling and makes it clear what each returned value represents.

---

### Summary Section (Summary of Notes)

- Go functions can return multiple values, which is useful for returning both a result and an error or multiple related values.
- Multiple assignment allows capturing all returned values from a function.
- This approach enables clean error handling and makes it clear what each returned value represents.
