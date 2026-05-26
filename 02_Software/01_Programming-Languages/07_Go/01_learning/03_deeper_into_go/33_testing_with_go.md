# Cornell Notes

## Topic: Testing with Go

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Testing in Go
- Go has a built-in testing framework that allows developers to write tests for their code. This framework is part of the standard library and can be used to create unit tests, integration tests, and more.
- To create a test in Go, you need to create a file that ends with `_test.go`  

#### Go mod and Testing
- When you run `go test`, Go will automatically look for files that end with `_test.go` and execute the tests defined in those files. This is a convention that Go uses to identify test files.
- In our project, we will create a file called `deck_test.go` where we will write our tests for the `deck` type and its associated functions.
- To run the tests, you can use the command `go test` in the terminal. This will execute all the tests in the current directory and report the results.
- *Note - the `go mod` command is used to manage dependencies in Go projects. It allows you to specify which versions of external packages your project depends on, and it helps ensure that your project can be built and run consistently across different environments.*
- Hence, **you need to run** `go mod init` to initialize a new module for your project, and then you can run `go test` to execute your tests.

#### Errorf call has arguments but no formatting directives
- We will be running some tests using `Errorf`. Omitting a formatting directive will now cause the tests to fail, so, we will need to add these right away.
- *Note - this directive was originally added at the end of the lecture.*
- When running your tests starting around the 8:00 timestamp, change the following:

`t.Errorf("Expected deck length of 16, but got", len(d))`

- to this:

`t.Errorf("Expected deck length of 16, but got %v", len(d))`

- The `%v` is a formatting directive that tells `Errorf` to include the value of `len(d)` in the error message. This way, if the test fails, you will get a more informative error message that includes the actual length of the deck.

---

### Summary Section (Summary of Notes)

- Go has a built-in testing framework that allows developers to write tests for their code.
- Test files in Go should end with `_test.go`.
- The `go test` command automatically finds and runs tests in these files.
- The `go mod` command is used to manage dependencies in Go projects.
- The `Errorf` function in tests requires formatting directives to include variable values in error messages.