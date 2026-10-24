# Cornell Notes

## Topic: Recognition Based on Decision-Theoretic Methods

**Source:** Section 12.2, printed pp. 866–902 (PDF pp. 889–925).

---

### Cue Column

- How do distance, probability, and loss define decisions?
- What is the Bayes classifier?
- Why separate training error from test error?

---

### Notes Section

Decision-theoretic recognition maps a numeric feature vector to a class. A minimum-distance classifier chooses the nearest prototype $m_i$:

$$\hat\omega(x)=\arg\min_i\|x-m_i\|.$$

With unequal feature scales or correlated noise, Mahalanobis distance

$$d_i^2=(x-m_i)^T\Sigma_i^{-1}(x-m_i)$$

is more meaningful. It requires reliable covariance estimates.

Bayes classification combines class priors and likelihoods:

$$P(\omega_i\mid x)=\frac{p(x\mid\omega_i)P(\omega_i)}{p(x)}.$$

Under equal misclassification costs, choose the largest posterior. With loss $\lambda_{ij}$ for deciding $i$ when truth is $j$, choose the action minimizing conditional risk

$$R(i\mid x)=\sum_j\lambda_{ij}P(\omega_j\mid x).$$

Parametric methods assume a distribution, commonly Gaussian; nonparametric density estimates and nearest-neighbor rules rely more directly on samples. Neural and other discriminant functions learn decision surfaces without requiring explicit density models.

Evaluation must use held-out samples. Complexity can lower training error while raising test error. Cross-validation tunes choices without consuming the final test set; confusion matrices expose class-specific failure.

Example: when missing a hazardous defect costs far more than a false alarm, minimum-risk classification lowers the defect threshold even if total error count rises.

---

### Summary Section

Decision methods compare distances, discriminants, posteriors, or risks. Priors, covariance, costs, and honest test data determine the useful rule.

**Previous:** [Patterns and Pattern Classes](01_patterns_and_pattern_classes.md)  
**Next:** [Structural Methods](03_structural_methods.md)
