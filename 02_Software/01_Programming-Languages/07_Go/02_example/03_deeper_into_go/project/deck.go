package main

import (
	"fmt"
	"os"
	"strings"
)

// Create a new type of 'deck'
// Which is a slice of strings
type deck []string

func newDeck() deck {
	cards := deck{}

	cardSuits := []string{"Spades", "Diamonds", "Hearts", "Clubs"}
	cardValues := []string{"Ace", "Two", "Three", "Four"}

	for _, suit := range cardSuits {
		for _, value := range cardValues {
			cards = append(cards, value+" of "+suit)
		}
	}
	return cards
}

func (d deck) print() {
	for i, card := range d {
		fmt.Println(i, card)
	}
}

func deal(d deck, handSize int) (deck, deck) {
	return d[:handSize], d[handSize:]
}

// Video 25 - Deck to String
func (d deck) toString() string {
	return strings.Join([]string(d), ", ")
}

// Video 27 - Save to File
func (d deck) saveToFile(filename string) error {
	return os.WriteFile(filename, []byte(d.toString()), 0666) // 0666 is the permission for the file that we can read and write
}

// Video 28 - Load from File
func newDeckFromFile(filename string) deck {
	bs, err := os.ReadFile(filename)
	if err != nil {
		// Option #1 - Log the error and return a call to newDeck()
		// Option #2 - Log the error and entirely quit the program
		fmt.Println("Error:", err)
		os.Exit(1)
	}

	// Video 29 - Error Handling
	s := strings.Split(string(bs), ",") // Ace of Spades, Two of Spades, Three of Spades, ...
	return deck(s)
}
