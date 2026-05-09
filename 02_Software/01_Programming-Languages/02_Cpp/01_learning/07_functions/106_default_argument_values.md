# Cornell Notes

## Topic: Default Argument Values

## Date: 05/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What are default argument values?
- How do default argument values work in functions?
- When should you use default argument values?

---

### Notes Section (Main Notes)

#### Default Argument Values
- When a function is called, all arguments must be supplied
- Sometimes some of the arguments have the same values most of the time
- We can tell the compiler to use default values if the arguments are not supplied
- Default values can be in the prototype or deﬁnition, not both
  - best practice – in the prototype
  - must appear at the tail end of the parameter list
- Can have multiple default values
  - must appear consecutively at the tail end of the parameter list
- Example – no default arguments
```cpp
double calc_cost(double base_cost, double tax_rate);
double calc_cost(double base_cost, double tax_rate) {
    return base_cost += (base_cost * tax_rate);
}
int main() {
    double cost {0};
    cost = calc_cost(100.0, 0.06);
    return 0;
}
```
- Example – single default argument
```cpp
double calc_cost(double base_cost, double tax_rate = 0.06);
double calc_cost(double base_cost, double tax_rate) {
    return base_cost += (base_cost * tax_rate);
}
int main() {
    double cost {0};
    cost = calc_cost(200.0);
    // will use the default tax
    cost = calc_cost (100.0, 0.08);
    // will use 0.08 not the default
    return 0;
}
```
- Example – multiple default arguments
```cpp
double calc_cost(double base_cost, double tax_rate = 0.06, double shipping = 3.50);
double calc_cost(double base_cost, double tax_rate, double shipping) {
    return base_cost += (base_cost * tax_rate) + shipping;
}
int main() {
    double cost {0};
    cost = calc_cost (100.0, 0.08, 4.25); // will use no defaults
    cost = calc_cost(100.0, 0.08);
    // will use default shipping
    cost = calc_cost(200.0);
    // will use default tax and shipping
    return 0;
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]