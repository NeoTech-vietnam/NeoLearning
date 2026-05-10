# Cornell Notes

## Topic: Saving data to Hard Drive

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Saving Data to Hard Drive - Old Fashioned Way
- By using the `ioutil` package, we can save data to a file on the hard drive.
- The `ioutil.WriteFile` function takes three parameters: the filename, the data to write, and the file permissions.
- The data must be in the form of a byte slice, so we can convert a string to a byte slice using `[]byte(string)`.
- Example usage:
```go
import (
    "io/ioutil"
)

func saveToFile(filename string, data string) error {
    return ioutil.WriteFile(filename, []byte(data), 0644)
}
```
- This function will create a file with the specified name and write the data to it. If the file already exists, it will be overwritten.
- To read data from a file, we can use the `ioutil.ReadFile` function, which returns the contents of the file as a byte slice. We can convert it back to a string using `string(byteSlice)`.
```go
func readFromFile(filename string) (string, error) {
    data, err := ioutil.ReadFile(filename)
    if err != nil {
        return "", err
    }
    return string(data), nil
}
```
- This function will read the contents of the specified file and return it as a string. If there is an error (e.g., the file does not exist), it will return an empty string and the error.

#### Saving Data to Hard Drive - New Way (Using `os` package)
- The `os` package provides more control over file operations, such as creating, opening, and writing to files.
- To create a file, we can use `os.Create`, which returns a file handle and an error. We can then use the `Write` method of the file handle to write data to the file.
- Example usage:
```go
import (
    "os"
)

func saveToFile(filename string, data string) error {
    file, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = file.Write([]byte(data))
    return err
}
```
- This function creates a file and writes the data to it. The `defer file.Close()` statement ensures that the file is properly closed after the operation, even if an error occurs.
- To read data from a file using the `os` package, we can use `os.Open` to get a file handle, and then use the `Read` method to read the contents of the file.
```go
func readFromFile(filename string) (string, error) {
    file, err := os.Open(filename)
    if err != nil {
        return "", err
    }
    defer file.Close()

    data := make([]byte, 1024) // Create a byte slice to hold the data
    n, err := file.Read(data)
    if err != nil {
        return "", err
    }
    return string(data[:n]), nil
}
```
- This function opens the specified file, reads its contents into a byte slice, and returns it as a string. The `defer file.Close()` statement ensures that the file is closed after the operation.
---

### Summary Section (Summary of Notes)

- Error handling is important when working with file operations to handle cases like non-existent files or permission issues.
- The `os` package provides more control over file operations, allowing for creating, opening, and writing to files with more flexibility.  