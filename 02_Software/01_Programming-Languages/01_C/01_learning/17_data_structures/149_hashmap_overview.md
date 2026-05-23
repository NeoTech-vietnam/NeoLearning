# Section 19: Data Structures

## Topic: Hash Map (Overview)

## Date: 11/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a hash map?
- How does a hash function work?
- What is a collision and how is it resolved?
- What are the time complexities?
- Where is a hash map used in practice?
- How does hash map compare to the brute-force (nested-loop) approach?

---

### Notes Section (Main Notes)

**1. Definition**

A **hash map** (also called a hash table) is a data structure that stores **key-value pairs** and provides near-constant-time lookup, insertion, and deletion.

It works by passing the key through a **hash function** that computes an integer index into a fixed-size array (the backing table). The value is stored at that index.

```
key  →  hash(key)  →  index  →  value
```

Key concepts:
- **Hash function**: maps a key to a bucket index. A good hash function distributes keys uniformly to minimise collisions.
- **Bucket**: a slot in the backing array.
- **Collision**: two different keys hash to the same index.
- **Load factor**: `n / capacity` (number of entries / table size). A high load factor increases collision probability.

Two common collision resolution strategies:
- **Chaining** — each bucket holds a linked list of all entries that hash there.
- **Open addressing** — on collision, probe for the next free slot (linear, quadratic, or double-hashing probe sequences).

---

**2. Example (C — open addressing, linear probing)**

```c
#define MAP_SIZE 20011  /* prime table size */

typedef struct { int key; int value; } Entry;

Entry map[MAP_SIZE];
/* initialise all slots as empty */
for (int i = 0; i < MAP_SIZE; i++) map[i].value = -1;

/* insert */
unsigned int slot = (unsigned int)key % MAP_SIZE;
while (map[slot].value != -1) slot = (slot + 1) % MAP_SIZE;
map[slot].key   = key;
map[slot].value = val;

/* lookup */
unsigned int s = (unsigned int)key % MAP_SIZE;
while (map[s].value != -1) {
    if (map[s].key == key) return map[s].value; /* found */
    s = (s + 1) % MAP_SIZE;
}
/* not found */
```

Real-world usage (LeetCode Two Sum):
- Store each `nums[i]` as the key, `i` as the value.
- For every element, check if `target - nums[i]` is already in the map → O(n) total.

---

**3. Advantages**

- **O(1) average** lookup, insert, and delete — the fastest of any general-purpose container.
- Simple to use once implemented; most languages provide a built-in version (`unordered_map` in C++, `dict` in Python, `HashMap` in Java).
- Flexible keys — any hashable type (integer, string, pointer) can serve as a key.
- Memory-efficient when the load factor is kept low (typically < 0.75).

---

**4. Disadvantages**

- **O(n) worst case** when many collisions occur (all keys map to the same bucket).
- No ordering — keys are stored in no predictable sequence; cannot efficiently iterate in sorted order.
- **Extra memory** overhead from the backing array (must be larger than the number of entries).
- Hash function quality matters — a poor function causes clustering and degrades performance.
- Resizing (rehashing) is expensive: all entries must be re-inserted into the larger table.
- Open-addressing tables require careful deletion (tombstone markers) to avoid breaking probe chains.

---

**5. Applications**

| Use Case                    | Detail                                              |
| --------------------------- | --------------------------------------------------- |
| Caching / memoisation       | Store previously computed results keyed by input    |
| Database indexing           | Fast record lookup by primary key                   |
| Frequency counting          | Count occurrences of words, characters, elements    |
| Two-sum / complement search | Check existence of a value in O(1)                  |
| Symbol tables               | Compilers map variable names to memory addresses    |
| Deduplication               | Detect duplicate entries in a stream                |
| Routing tables              | Network routers map IP prefixes to next-hop entries |

---

**6. Comparison: Traditional (Brute Force) vs Hash Map**

*Context: LeetCode Two Sum — find two indices whose values sum to `target`.*

| Aspect                        | Brute Force (nested loops)            | Hash Map (single pass)                               |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------- |
| **Strategy**                  | Try every pair `(i, j)` where `j > i` | For each element, look up `target - nums[i]` in O(1) |
| **Time complexity**           | O(n²)                                 | O(n) average                                         |
| **Space complexity**          | O(1)                                  | O(n)                                                 |
| **No. of iterations**         | Up to n×(n-1)/2                       | At most n                                            |
| **Early exit**                | Yes, returns on first match           | Yes, returns on first match                          |
| **Extra data structure**      | None                                  | Hash map (backing array)                             |
| **Implementation complexity** | Very simple                           | Moderate (hash function + collision handling)        |
| **Worst-case behaviour**      | Always O(n²)                          | O(n²) only if all keys collide (extremely rare)      |
| **Cache friendliness**        | High (sequential array access)        | Lower (random probing into large table)              |

**Code side-by-side:**

```c
/* Brute force — O(n²) */
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target)
            return {i, j};
```

```c
/* Hash map — O(n) average */
for (int i = 0; i < n; i++) {
    int complement = target - nums[i];
    if (map_contains(map, complement))       /* O(1) lookup  */
        return {map_get(map, complement), i};
    map_insert(map, nums[i], i);             /* O(1) insert  */
}
```

**When to prefer brute force:**
- Input size is very small (n ≤ ~100) — overhead of the hash map outweighs the gain.
- Memory is extremely constrained — hash map requires O(n) extra space.
- Simplicity is the top priority and performance is not critical.

**When to prefer hash map:**
- Input size is large (n > a few hundred).
- Performance is critical and O(n²) would time-out.
- The problem involves frequent complement / existence queries.

---

### Summary Section (Summary of Notes)

A hash map stores key-value pairs and uses a hash function to map keys to array indices, giving **O(1) average-case** lookup, insertion, and deletion. Collisions are handled by either chaining (linked lists per bucket) or open addressing (probing for a free slot). The main trade-offs are no guaranteed ordering, worst-case O(n) on heavy collisions, and the cost of periodic resizing. Hash maps are ubiquitous wherever fast key-based access is needed: caches, frequency counts, symbol tables, and complement-search problems like Two Sum.
