# Cornell Notes

## Topic: Principal Components for Description

**Source:** Section 11.4, printed pp. 842–851 (PDF pp. 865–874).

---

### Cue Column

- What optimization defines principal components?
- How does PCA reduce dimension?
- Why must training and test data share preprocessing?

---

### Notes Section

PCA rotates correlated feature vectors into orthogonal directions of decreasing variance. Given centered samples $x_i-\mu$, estimate covariance

$$C=\frac{1}{N}\sum_{i=1}^{N}(x_i-\mu)(x_i-\mu)^T.$$

Solve $Ce_k=\lambda_ke_k$, ordering $\lambda_1\ge\lambda_2\ge\cdots$. Projection onto the first $d$ eigenvectors is

$$y=E_d^T(x-\mu),\qquad E_d=[e_1,\ldots,e_d].$$

Among linear $d$-dimensional projections, this subspace minimizes mean squared reconstruction error; discarded variance is $\sum_{k>d}\lambda_k$. Choose $d$ from a retained-energy target such as

$$\frac{\sum_{k=1}^{d}\lambda_k}{\sum_k\lambda_k}\ge\eta.$$

PCA is unsupervised: high variance need not separate classes. Feature scaling strongly affects covariance. The training mean, scaling, and eigenvectors must be reused unchanged for every new sample.

```mermaid
flowchart LR
    X[Feature samples] --> C[Center and scale]
    C --> V[Covariance eigendecomposition]
    V --> K[Keep leading eigenvectors]
    K --> P[Project train/test features]
```

---

### Summary Section

PCA provides compact decorrelated descriptors by preserving maximum sample variance, not necessarily maximum class discrimination.

**Previous:** [Regional Descriptors](03_regional_descriptors.md)  
**Next:** [Relational Descriptors](05_relational_descriptors.md)
