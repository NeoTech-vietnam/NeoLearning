# Cornell Notes

## Topic: Writing Useful Tests

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Writing Useful Tests
- In this lecture, we will focus on writing useful tests for our Go code. Writing tests is an important part of the development process, as it helps ensure that our code is working correctly and can help catch bugs early on.
- We will be writing tests for the `deck` type and its associated functions that we have been working on in our project. This will include tests for creating a new deck, shuffling the deck, and saving/loading the deck from a file.
- When writing tests, it's important to think about what you want to test and how you want to structure your tests. A good test should be clear, concise, and focused on a specific aspect of the code.
- We will be using the `testing` package in Go to write our tests. This package provides a simple and powerful way to write tests for your Go code. It includes functions for creating test cases, running tests, and reporting results.
- In our tests, we will be using the `Errorf` function to report any errors that occur during the tests. This function allows us to include formatting directives in our error messages, which can help make our tests more informative and easier to debug if something goes wrong.

#### Test Function Syntax
- Test functions in Go should have a specific signature. They should start with the word `Test`, followed by a descriptive name for the test. The function should take a single parameter of type `*testing.T`, which is used to report errors and log information during the test.
- For example, a test function for creating a new deck might look like this:
```go
func TestNewDeck(t *testing.T) {
    // Test code goes here
}
```
`*testing.T` is a pointer to a `testing.T` struct, which provides methods for reporting errors and logging information during the test. You can use this parameter to check the results of your test and report any issues that arise.
- Inside the test function, you can write your test code to create a new deck and check that it has the expected properties. If any of the checks fail, you can use `t.Errorf` to report the error and include information about what went wrong.
- For example, you might check that the length of the new deck is correct, or that it contains the expected cards. If any of these checks fail, you can use `t.Errorf` to report the error and include information about what went wrong.
```go
func TestNewDeck(t *testing.T) {
    d := newDeck()
    
    if len(d) != 16 {
        t.Errorf("Expected deck length of 16, but got %v", len(d))
    }
    
    // Additional checks for the contents of the deck can go here
}
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]