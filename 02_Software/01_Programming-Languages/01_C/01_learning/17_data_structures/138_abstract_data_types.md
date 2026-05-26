# Section 19: Data Structures

## Topic: Abstract Data Types

## Date: 07/02/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- in programming, you try to match the data type to the needs of a programming problem
  - you would use the int type to represent the number of pants you own
  - you would use the float or double type to represent your average cost per pair of pants
- in other scenarios, the data could be a list of items
  - no basic C type matches data for a list of items
- we would need to define a structure to represent individual items
  - we would then create a couple methods for tying together a series of structures to form a list
  - we use C’s capabilities to design a new data type that matched our needs
- a type specifies two kinds of information
  - a set of properties
    - the int type’s property is that it represents an integer value and shares the properties of integers
  - a set of operations
    - you can perform arithmetic operations on ints (add, subtract, multiply, etc)
- when you declare a variable to be an int, you are saying that these and only these operations can affect it

**2. Abstract Data Type (ADT)**
- an Abstract Data type (ADT) is a type whose behavior is defined by a set of value and a set of operations
  - sound like a structure in C
- the definition of ADT only mentions what operations are to be performed
  - not how these operations will be implemented
  - does not specify how data will be organized in memory nor what algorithms will be used for implementing the operations
- it is called “abstract” because it gives an implementation-independent view
  - the process of providing only the essentials and hiding the details is known as abstraction
  - a contract for a type of data structure
- examples of abstract data types include
  - lists, stacks, trees, etc.

**3. creating a new Abstract Data type (ADT)**
- suppose you want to define a new data type
  - you have to provide a way to store the data
- usually by designing a structure
  - you have to provide ways of manipulating the data
    - adding, deleting, etc.
- to define new data types, you want to follow a three-step process (from more abstract to more concrete)
- provide an abstract description of the type’s properties and of the operations you can perform on the type
  - not tied to any particular implementation
  - referred to as an abstract data type (ADT)
- develop a programming interface that implements the ADT
  - indicate how to store the data
  - describe a set of functions that perform the desired operations
- write code to implement the interface

**4. Abstraction example**
- for a list abstract data type, the data is a number of items
- a list should be able to hold a sequence of items in some kind of order
- the list type should support operations such as adding an item to the list
- here are some useful operations
  - initializing a list to empty
  - adding an item to the end of a list
  - determining whether the list is empty
  - determining whether the list is full
  - determining how many items are in the list
- the above is an abstract definition of a list data type
  - a data object capable of holding a sequence of items and to which you can apply any of the above operations
  - does not state what kind of items can be stored in the list
  - does not specify how to store the items or what algorithms to use

**5. ADT’s we will study**
- in the next few lectures, we will be studying the following abstract data types
  - Linked Lists
  - Stacks
  - Queues
  - Binary Trees
- to give you a sneak peak, lets quickly look at some of the operations for each of these types of ADT’s
  - operation names will be similar (add, insert)

**6. Linked List ADT**
- insert – adds an element at the beginning of the list
- delete – deletes an element at the beginning of the list
- deleteAt – remove the element using a given key
- size – return the number of elements in the list
- isEmpty – Return true if the list is empty, otherwise return false
- search – searches an element using a key
- display – displays the complete list

**7. Stack ADT**
- push – insert an element at one end of the stack called top
- pop – remove and return the element at the top of the stack, if it is not
empty
- peek – return the element at the top of the stack without removing it, if
the stack is not empty
- size – return the number of elements in the stack
- isEmpty – return true if the stack is empty, otherwise return false

**8. Queue ADT**
- enqueue – insert an element at the end of the queue
- dequeue – remove and return the first element of the queue, if the queue
is not empty
- peek – return the element of the queue without removing it, if the queue is
not empty
- size – return the number of elements in the queue
- isEmpty – return true if the queue is empty, otherwise return false

**9. Binary Tree ADT**
- insert() -- insert a new node into the tree in the correct place
- delete - delete a node in the tree
- search - search for a node in the tree
- size() - count the number of nodes in the tree.
- preorder traversal
- postorder traversal
- inorder traversal

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
