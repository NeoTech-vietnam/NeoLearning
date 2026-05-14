# Cornell Notes

## Topic: Reading from the Hard Drive

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### ReadFile Function
```go
func ReadFile(filename string) ([]byte, error)
```
- Reads the contents of a file and returns it as a byte slice.
- `[]byte` is a slice of bytes, which is a common way to represent data in Go.
```go
bs, err := os.ReadFile(filename)
if err != nil {
    // Handle the error, for example by printing it and exiting the program
    fmt.Println("Error:", err)
    os.Exit(1)
}
```
- The `ReadFile` function returns two values: the byte slice containing the file's contents and an error value.
- If the file is read successfully, `err` will be `nil`. If there is an error (e.g., the file does not exist), `err` will contain the error information.
- It's important to check for errors when working with file I/O to ensure that your program can handle unexpected situations gracefully.
```go
s := string(bs)
```
- To convert the byte slice to a string, you can use a simple type conversion. This allows you to work with the file's contents as a string, which is often more convenient for text processing.
#### Exit Function
```go
func Exit(code int)
```
- The `Exit` function is used to terminate the program immediately with a given exit code.
- An exit code of `0` typically indicates that the program finished successfully, while a non-zero exit code indicates that an error occurred. In the example, `os.Exit(1)` is used to indicate that the program is exiting due to an error.


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]