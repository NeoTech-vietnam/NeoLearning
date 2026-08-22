# Cornell Notes

## Topic: Fuzzy Techniques for Intensity Transformations and Spatial Filtering

**Source:** Section 3.8, printed pp. 173–192 (PDF pp. 196–215).

---

### Cue Column

- How does fuzzy membership differ from binary membership?
- What are membership functions, linguistic variables, and fuzzy rules?
- How can fuzzy logic enhance contrast or detect boundaries?

---

### Notes Section

Classical sets assign membership $0$ or $1$. A fuzzy set allows partial membership:

$$\mu_A(z)\in[0,1]$$

This models imprecise concepts such as *dark*, *gray*, *bright*, or *near an edge*.

#### Core operations

For fuzzy sets $A$ and $B$:

$$\mu_{A\cup B}(z)=\max[\mu_A(z),\mu_B(z)]$$

$$\mu_{A\cap B}(z)=\min[\mu_A(z),\mu_B(z)]$$

$$\mu_{\bar A}(z)=1-\mu_A(z)$$

#### Fuzzy inference pipeline

1. **Fuzzification:** convert numeric inputs into membership degrees.
2. **Rules:** evaluate statements such as `IF intensity is dark THEN output is brighter`.
3. **Aggregation:** combine activated rule outputs.
4. **Defuzzification:** convert the fuzzy output into a numeric intensity.

```mermaid
flowchart LR
    X[Crisp pixels] --> F[Fuzzification]
    F --> R[Rule evaluation]
    R --> A[Aggregation]
    A --> D[Defuzzification]
    D --> Y[Enhanced pixels]
```

For spatial filtering, rules can use neighborhood differences. Strong membership in *positive edge* or *negative edge* supports sharpening; weak edge membership supports smoothing or no change.

Fuzzy logic is useful when expert descriptions are easier to state linguistically than as a precise physical model. Membership functions and rules still require validation; fuzziness does not remove design choices.

---

### Summary Section

Fuzzy processing maps vague image concepts to graded memberships, applies interpretable rules, then returns numeric pixels. It supports point enhancement and neighborhood filtering when class boundaries are inherently gradual.

**Previous:** [Combining Enhancement Methods](07_combining_spatial_enhancement_methods.md)
