# Cornell Notes

## Topic: Fuzzy Techniques for Intensity Transformations and Spatial Filtering

**Source:** Section 3.8, printed pp. 173–192 (PDF pp. 196–215).

**Learning outcomes**

- Distinguish crisp membership, fuzzy membership, and probability.
- Apply complement, union, and intersection to membership values.
- Trace fuzzification through inference, aggregation, and defuzzification.
- Design simple fuzzy rules for intensity transformation and boundary filtering.

---

## Cue Column

- What does a membership value mean?
- Why is fuzzy membership not probability?
- How do linguistic rules become numeric output?
- What happens during implication and aggregation?
- When is fuzzy image processing worth its complexity?

---

## Notes Section

### 1. Crisp and fuzzy sets

A crisp set assigns an element either outside or inside:

$$\mu_A(z)\in\{0,1\}.$$

A fuzzy set permits graded membership:

$$\mu_A(z)\in[0,1].$$

For example, intensity $z=90$ might belong to *dark* with degree $0.7$ and to *gray* with degree $0.3$. These values describe compatibility with concepts chosen by the designer.

Fuzzy membership is not probability. Probability models uncertainty about whether an event occurs. Fuzzy membership models degree of fit to an imprecise concept. A pixel may be known exactly while its classification as *dark* remains gradual.

### 2. Basic fuzzy operations

Using the common Zadeh operators:

$$\mu_{\bar A}(z)=1-\mu_A(z),$$

$$\mu_{A\cup B}(z)=\max[\mu_A(z),\mu_B(z)],$$

$$\mu_{A\cap B}(z)=\min[\mu_A(z),\mu_B(z)].$$

If $\mu_A(z)=0.7$ and $\mu_B(z)=0.4$:

$$\mu_{\bar A}(z)=0.3,$$

$$\mu_{A\cup B}(z)=0.7,$$

$$\mu_{A\cap B}(z)=0.4.$$

Other fuzzy systems use different complements, t-norms, or s-norms. The operator set is part of the model and must be documented.

### 3. Membership functions

Common shapes include:

- triangular;
- trapezoidal;
- Gaussian;
- sigmoid or S-shaped;
- Z-shaped.

Membership functions convert numeric variables into linguistic labels such as *dark*, *gray*, *bright*, *small positive difference*, and *large edge*.

Their breakpoints and slopes encode expert choices. Heavy overlap produces gradual transitions; narrow overlap produces behavior closer to crisp thresholds.

### 4. Five-stage fuzzy inference

1. **Fuzzification:** evaluate input memberships.
2. **Antecedent logic:** combine conditions using AND/OR.
3. **Implication:** limit or scale each rule's output set using rule strength.
4. **Aggregation:** combine all implied output sets.
5. **Defuzzification:** convert the aggregate set to one numeric output.

```mermaid
flowchart LR
    X["Crisp input values"] --> F[Fuzzification]
    F --> R["Antecedent logic"]
    R --> I[Implication]
    I --> A[Aggregation]
    A --> D[Defuzzification]
    D --> Y["Crisp output value"]
```

A typical rule is

`IF intensity is dark THEN output is brighter.`

If *dark* membership is $0.7$, the rule activates with strength $0.7$. Implication modifies the *brighter* output membership accordingly. Aggregation combines this result with other active rules.

### 5. Defuzzification

A common centroid or center-of-gravity result is

$$z^*=\frac{\int z\,\mu_C(z)\,dz}{\int\mu_C(z)\,dz},$$

where $\mu_C$ is the aggregated output membership.

For singleton outputs $v_i$ with rule strengths $\alpha_i$, the computation simplifies to

$$z^*=\frac{\sum_i\alpha_i v_i}{\sum_i\alpha_i},$$

provided $\sum_i\alpha_i>0$.

If no rule fires, define a fallback explicitly—for example, return the original intensity. Division by zero is not a valid policy.

#### Singleton example

Suppose two rules activate:

- *dark* rule: $\alpha_1=0.75$, output singleton $v_1=180$;
- *gray* rule: $\alpha_2=0.25$, output singleton $v_2=120$.

Then

$$z^*=\frac{0.75(180)+0.25(120)}{0.75+0.25}=165.$$

The result blends rule conclusions rather than choosing one abruptly.

### 6. Fuzzy intensity transformation

Point enhancement can define input labels *dark*, *gray*, and *bright*, then map them to desired output labels.

Example rules:

- `IF input is dark THEN output is darker.`
- `IF input is gray THEN output is midgray.`
- `IF input is bright THEN output is brighter.`

This S-shaped contrast transform moves dark values downward and bright values upward while retaining a gradual transition around gray. Unlike a fixed algebraic gamma curve, its shape follows chosen memberships and output conclusions.

A 256-entry LUT can store the completed fuzzy transform for 8-bit images. Fuzzy inference then runs only when parameters change, not per frame.

### 7. Fuzzy spatial filtering

For boundary detection, compare the center pixel $z_5$ with neighbors $z_i$:

$$d_i=z_i-z_5.$$

Fuzzify each difference into concepts such as *negative*, *zero*, and *positive*. Rules can identify a boundary when several directional differences consistently support an intensity transition.

Example:

- `IF east difference is positive AND west difference is negative THEN center is on a boundary.`
- `IF all neighbor differences are near zero THEN center is uniform.`

A boundary output can sharpen or mark the pixel. A uniform output can preserve or smooth it. Unlike a single hard threshold, overlapping memberships provide gradual behavior near uncertain boundaries.

### 8. Choosing fuzzy processing

Useful when:

- expert knowledge is naturally linguistic;
- class boundaries are gradual;
- interpretability of rules matters;
- a compact rule system replaces an awkward piecewise model.

Avoid it when a threshold, LUT, median, or linear filter already solves the measured problem. Fuzzy logic does not automatically improve accuracy. Memberships, operators, rules, and defuzzification add tunable choices requiring validation.

### Embedded implementation notes

- Use fixed-point membership values when floating-point cost matters.
- Precompute point-transform memberships or the final LUT.
- Bound every membership to $[0,1]$ or its fixed-point equivalent.
- Ensure aggregation and weighted sums cannot overflow.
- Define the no-rule fallback.
- Keep the smallest rule base that covers tested conditions.
- Test overlap boundaries, because that is where multiple rules interact.

### Common mistakes

- Interpreting membership $0.7$ as a 70% probability.
- Omitting implication from the inference pipeline.
- Mixing min/max rules with product/sum formulas without documentation.
- Dividing by zero when no singleton rule activates.
- Creating too many overlapping rules without measurable benefit.
- Claiming fuzzy logic removes subjective design choices.
- Using fuzzy processing where one explicit threshold suffices.

### Quick activity

For memberships

$$\mu_{\text{dark}}=0.6,\qquad\mu_{\text{gray}}=0.5,$$

using max for OR and min for AND:

$$\mu_{\text{dark OR gray}}=0.6,$$

$$\mu_{\text{dark AND gray}}=0.5,$$

$$\mu_{\text{NOT dark}}=0.4.$$

### Self-check

1. How does fuzzy membership differ from probability?
2. What are the five inference stages?
3. What does implication do?
4. Why must a singleton system define a no-rule fallback?
5. When should a simple threshold replace fuzzy logic?

<details>
<summary>Answers</summary>

1. Membership measures degree of compatibility with a vague concept; probability measures uncertainty about events.
2. Fuzzification, antecedent logic, implication, aggregation, defuzzification.
3. It shapes each rule's output set according to activation strength.
4. Otherwise the weighted-average denominator can be zero and no output is defined.
5. When it solves the validated requirement without harmful discontinuity or lost accuracy.

</details>

---

## Summary Section

Fuzzy image processing converts precise pixel values into graded linguistic memberships, evaluates rules, aggregates their consequences, then returns numeric pixels. It supports gradual point transforms and boundary-aware spatial filters. Operator choices, membership design, fallback behavior, and measured validation remain mandatory.

**Previous:** [Combining Enhancement Methods](07_combining_spatial_enhancement_methods.md)
