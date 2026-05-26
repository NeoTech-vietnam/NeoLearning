# Cornell Notes

## Topic: Shuffling a Deck

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Intn Function
- The `Intn` function is used to generate a random integer between 0 and a specified number (exclusive). For example, `rand.Intn(10)` will return a random integer between 0 and 9.
- This function is useful for shuffling a deck of cards, as it allows us to randomly select an index in the deck to swap with another card.
```go
import "math/rand"
func shuffle() {
    for i := range cards {
        newPosition := rand.Intn(len(cards) - 1)
        cards[i], cards[newPosition] = cards[newPosition], cards[i]
    }
}
```
- In the above code, we loop through each card in the deck and generate a random index to swap with. This effectively shuffles the deck of cards.

#### Swapping Elements
- The swapping of elements in a slice is done using a simple assignment. For example, `cards[i], cards[newPosition] = cards[newPosition], cards[i]` swaps the card at index `i` with the card at index `newPosition`.
- This is a common technique used in many programming languages to shuffle or rearrange elements in a collection.

---

### Summary Section (Summary of Notes)

- The `rand.Intn` function is used to generate a random integer within a specified range, which is essential for shuffling a deck of cards.
- Swapping elements in a slice can be done using a simple assignment, allowing for efficient rearrangement of elements.
- The combination of generating random indices and swapping elements effectively shuffles the deck, a technique commonly used in many programming languages.