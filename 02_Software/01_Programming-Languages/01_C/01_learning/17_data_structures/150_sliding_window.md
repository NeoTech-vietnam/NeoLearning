# Section 19: Data Structures

## Topic: Sliding Window

## Date: 11/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a sliding window?
- What are the two types of sliding window?
- How do you know when to shrink the window?
- What is the time and space complexity?
- How does sliding window compare to the brute-force approach?
- Where is sliding window used in practice?

---

### Notes Section (Main Notes)

**1. Definition**

A **sliding window** is an algorithmic technique that maintains a **contiguous subrange (window)** over a linear data structure (array or string) and slides it forward, expanding or shrinking the window based on a constraint — instead of recomputing from scratch for every possible subrange.

```
array:  [ a  b  c  d  e  f ]
              └──────┘
          left       right   ← window [left, right]
```

Key concepts:
- **Left pointer**: the start of the window (inclusive).
- **Right pointer**: the end of the window (inclusive); always advances forward.
- **Window invariant**: the condition that must hold for all elements inside `[left, right]` (e.g. all characters are unique, sum ≤ k).
- **Shrink step**: when adding `s[right]` violates the invariant, advance `left` until the invariant is restored.

Two variants:
- **Fixed-size window** — window length is constant; both pointers move together (e.g. moving average of size k).
- **Variable-size window** — window expands by moving `right`; shrinks by moving `left` whenever the constraint is broken (e.g. longest unique substring).

---

**2. Example (C — variable window: longest substring without repeating characters)**

```c
int lengthOfLongestSubstring (char* s)
{
    /* charIndex[c] = next valid left boundary if character c entered the window */
    int charIndex[128] = { 0 };
    int maxLen = 0;
    int left   = 0;

    for (int right = 0; s[right] != '\0'; right++)
    {
        /* If s[right] was seen inside the current window, shrink from the left */
        if (charIndex[(unsigned char)s[right]] > left)
            left = charIndex[(unsigned char)s[right]];

        /* Record: next valid left if s[right] appears again = right + 1 */
        charIndex[(unsigned char)s[right]] = right + 1;

        int currentLen = right - left + 1;
        if (currentLen > maxLen) maxLen = currentLen;
    }
    return maxLen;
}
```

Trace for `"pwwkew"`:

| right | s[right] | left | window | len |
| ----- | -------- | ---- | ------ | --- |
| 0     | p        | 0    | "p"    | 1   |
| 1     | w        | 0    | "pw"   | 2   |
| 2     | w        | 2    | "w"    | 1   |
| 3     | k        | 2    | "wk"   | 2   |
| 4     | e        | 2    | "wke"  | 3   |
| 5     | w        | 5    | "w"    | 1   |

Result: **3** ("wke")

---

**3. Advantages**

- **O(n) time** — each element is visited at most twice (once by `right`, once by `left`), regardless of window size.
- **O(1) or O(k) space** — typically only a few variables or a small auxiliary array are needed (no proportional-to-n extra memory).
- Avoids redundant recomputation: information from the previous window position is reused rather than recalculated.
- Naturally handles streaming / online data since the window only moves forward.

---

**4. Disadvantages**

- Only applies to **contiguous** subarrays or substrings — cannot skip elements.
- Requires the problem to have a **monotonic shrink condition**: moving `left` forward must make the window "more valid", not less.
- Variable-window problems need careful thought about *when* to shrink, which can be non-obvious.
- Harder to adapt to 2-D arrays or non-linear structures without significant modification.

---

**5. Applications**

| Use Case                                        | Detail                                                 |
| ----------------------------------------------- | ------------------------------------------------------ |
| Longest substring without repeats               | Shrink when a duplicate enters the window              |
| Maximum/minimum sum subarray of size k          | Fixed window; slide one step at a time                 |
| Smallest subarray with sum ≥ S                  | Shrink greedily once the sum condition is met          |
| Longest substring with at most k distinct chars | Track distinct count; shrink when > k                  |
| Find all anagrams in a string                   | Fixed window of pattern length; compare frequency maps |
| Sliding window maximum                          | Fixed window; use a deque to track the max in O(1)     |
| DNA sequence analysis                           | Find repeated or unique sequences in genomic data      |

---

**6. Comparison: Brute Force vs Sliding Window**

*Context: Longest substring without repeating characters.*

| Aspect                        | Brute Force (all substrings)                   | Sliding Window                               |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------- |
| **Strategy**                  | Generate every substring, check for uniqueness | Maintain one window; shrink only when needed |
| **Time complexity**           | O(n²) or O(n³)                                 | O(n)                                         |
| **Space complexity**          | O(min(n, charset)) per check                   | O(charset) — fixed 128-entry array           |
| **Redundant work**            | Rechecks overlapping characters from scratch   | Reuses previous window state                 |
| **Early exit**                | Possible but rarely helps in worst case        | Naturally skips invalid positions            |
| **Implementation complexity** | Simple                                         | Moderate (two-pointer logic)                 |

**Code side-by-side:**

```c
/* Brute force — O(n²) */
for (int i = 0; i < n; i++) {
    bool seen[128] = { false };
    for (int j = i; j < n; j++) {
        if (seen[(int)s[j]]) break;   /* duplicate found */
        seen[(int)s[j]] = true;
        maxLen = max(maxLen, j - i + 1);
    }
}
```

```c
/* Sliding window — O(n) */
for (int right = 0; s[right] != '\0'; right++) {
    if (charIndex[(int)s[right]] > left)
        left = charIndex[(int)s[right]];    /* shrink */
    charIndex[(int)s[right]] = right + 1;
    maxLen = max(maxLen, right - left + 1);
}
```

**When to prefer brute force:**
- Input is very small (n ≤ ~50) and simplicity matters more than performance.

**When to prefer sliding window:**
- Input size is large or performance is critical.
- The problem involves a contiguous subarray/substring with a shrinkable constraint.

---

### Summary Section (Summary of Notes)

A sliding window maintains a contiguous `[left, right]` range over an array or string, expanding by advancing `right` and shrinking by advancing `left` whenever a constraint is violated. This avoids redundant recomputation and reduces time complexity from O(n²) or O(n³) (brute force) to **O(n)**, with typically O(1) extra space. The technique applies to fixed-size and variable-size windows alike, and is the go-to pattern for substring/subarray problems involving uniqueness, sums, or character frequency constraints.
