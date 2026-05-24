# Cornell Notes

## Topic: Error Handling

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Split Function
```go
func Split(s, sep string) []string
```
- The `Split` function from the `strings` package is used to split a string into a slice of substrings based on a specified separator.
- It takes two parameters: the string to be split (`s`) and the separator (`sep`), and it returns a slice of strings.
```go
parts := strings.Split("a,b,c", ",")
```
- In this example, the string "a,b,c" is split into a slice containing the substrings "a", "b", and "c" using the comma as the separator.
#### Error Handling
- In Go, error handling is typically done using the `error` type. Functions that can encounter an error usually return an additional `error` value along with the expected result.
- The caller of the function is responsible for checking the error value and handling it appropriately.
```go
result, err := someFunction()
if err != nil {
    // Handle the error, for example by printing it and exiting the program
    fmt.Println("Error:", err)
    os.Exit(1)
}
```
- In this example, `someFunction` returns a result and an error. The caller checks if `err` is not `nil`, which indicates that an error occurred, and handles it accordingly. If there is an error, it prints the error message and exits the program with a non-zero exit code to indicate that an error occurred.
- Example for the file is not found in the hard drive:
```go
Error: open my: no such file or directory
exit status 1
```
- This error message indicates that the program attempted to open a file named "my" but could not find it in the specified directory, resulting in an error. The program then exits with a status code of 1, which is commonly used to indicate that an error occurred.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]