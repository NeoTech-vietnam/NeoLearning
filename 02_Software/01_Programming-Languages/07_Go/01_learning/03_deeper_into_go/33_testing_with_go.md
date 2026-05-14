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

#### Errorf call has arguments but no formatting directives
- We will be running some tests using `Errorf`. Omitting a formatting directive will now cause the tests to fail, so, we will need to add these right away.
- *Note - this directive was originally added at the end of the lecture.*
- When running your tests starting around the 8:00 timestamp, change the following:

`t.Errorf("Expected deck length of 16, but got", len(d))`

- to this:

`t.Errorf("Expected deck length of 16, but got %v", len(d))`

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]