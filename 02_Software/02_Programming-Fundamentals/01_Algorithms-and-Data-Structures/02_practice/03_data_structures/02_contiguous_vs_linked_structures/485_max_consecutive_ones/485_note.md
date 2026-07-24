# Cornell Notes

## Topic: Leetcode - 485 - Maximum Consecutive Ones

## Date: 16/07/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Problem Description

Given a binary array `nums`, return the maximum number of consecutive `1`s in the array.

Only adjacent `1`s belong to the same sequence. A `0` ends the current sequence, so the answer is the greatest sequence length found anywhere in the array.

#### Example 1

```text
Input:  nums = [1,1,0,1,1,1]
Output: 3
```

The array contains sequences of two and three consecutive `1`s, so the maximum is `3`.

#### Example 2

```text
Input:  nums = [1,0,1,1,0,1]
Output: 2
```

The longest sequence consists of the two adjacent `1`s in the middle.

#### Constraints

- `1 <= nums.length <= 10^5`
- Every element of `nums` is either `0` or `1`.

#### Function Contract

- **Input:** A non-empty binary array.
- **Output:** The length of its longest contiguous sequence of `1`s.
- **Mutation:** The input array does not need to be modified.
- **Contiguity:** Sequences separated by a `0` must be counted independently.

---

### Cue Column (Questions, Keywords, or Prompts)

- What pattern does this problem recognize?
- Why do we need two counters (current and max)?
- What invariant must always hold?
- Is one pass sufficient or do we need multiple?
- What edge cases test boundary handling?
- How does reset timing affect correctness?

---

### Notes Section (Main Notes)

## Mindset First (language-agnostic)

- Recognize pattern: finding maximum length contiguous subsequence matching a condition.
- NOT two pointers, NOT sliding window (no shrinking), NOT DP.
- Simple state tracking with two variables.
- Lock invariant before coding:
	- `current` = count of consecutive 1's so far.
	- `max_seen` = longest sequence of 1's found up to this point.
	- When we see 1: increment `current`.
	- When we see 0: reset `current` to 0, update `max_seen` if needed.
- Complexity targets fixed early:
	- Time must be `O(n)` (single pass through array).
	- Space must be `O(1)` (only two counter variables).

## Strategy A: Counter with Reset (Most Intuitive - Optimal)

- Maintain two counters: `current` and `max_seen`.
- Traverse array once left to right.
- Algorithm:
	1. Initialize `current = 0`, `max_seen = 0`.
	2. For each element:
		- If element is 1: increment `current`, update `max_seen = max(max_seen, current)`.
		- If element is 0: reset `current = 0`.
	3. Return `max_seen`.
- Why strong:
	- `O(n)` time, `O(1)` space (truly optimal).
	- Single pass, no preprocessing.
	- Crystal clear logic flow.
- Invariant maintained:
	- `max_seen` always holds the longest sequence seen so far.
	- `current` always reflects the length of the ongoing sequence.

## Strategy B: Update Max Only After Reset

- Defer `max_seen` update until after seeing a 0.
- Algorithm:
	1. Iterate through array.
	2. If 1: increment counter.
	3. If 0: compare counter with max, reset counter.
	4. After loop: check final counter (case when 1's end at array boundary).
- Why useful:
	- Emphasizes the "gap detection" mental model.
	- Good when problem asks "count 1's between 0's".
- Trade-off:
	- Requires extra comparison after loop (easy to forget).
	- Slightly more code.

## Strategy C: State Machine Approach (Formal)

- Model as finite state machine with two states:
	- **State 0**: Just saw a zero (or start).
	- **State 1**: Inside a sequence of ones.
- Transitions:
	- State 0 + see 1 → move to State 1, reset counter.
	- State 1 + see 1 → stay in State 1, increment counter.
	- State 1 + see 0 → move to State 0, update max.
- Why useful:
	- Bridges to more complex state machine problems.
	- Clear separation of concerns.
- Trade-off:
	- Overkill for simple problem but good mental exercise.

## Common Failure Points (all languages)

- Forgetting to update `max_seen` inside the 1-processing block (not just at reset).
- Resetting `current` before comparing with `max_seen`.
- Skipping the final comparison after loop ends (if array ends with 1's).
- Initializing `max_seen` to -1 instead of 0 (breaks when all zeros).
- Confusing counter direction (incrementing when should reset).
- Off-by-one when handling single element.
- Not handling empty array (return 0 immediately).

## Edge Cases to Test

| Case | Input | Expected | Notes |
|------|-------|----------|-------|
| Empty array | [] | 0 | No elements = no ones |
| Single 1 | [1] | 1 | Minimum non-zero case |
| Single 0 | [0] | 0 | Single element = zero |
| All 1s | [1,1,1,1,1] | 5 | Entire array is ones |
| All 0s | [0,0,0,0] | 0 | No ones present |
| 1s at start | [1,1,1,0,1] | 3 | Longest at beginning |
| 1s at end | [0,1,1,1] | 3 | Longest at end (must check after loop) |
| 1s in middle | [0,0,1,1,1,0,0] | 3 | Surrounded by zeros |
| Multiple sequences | [1,1,0,1,0,1] | 2 | Need to track across resets |
| Alternating | [1,0,1,0,1] | 1 | Never exceeds 1 |

## Why Single Counter Pass is Interview Gold

1. **Optimal space**: True `O(1)` with just two integers.
2. **Optimal time**: Can't do better than `O(n)` (must see all elements).
3. **Simple to explain**: Logic is immediately obvious.
4. **Generalizable**: Same approach works for "longest X between Y's" problems.
5. **No edge-case surprises**: Straightforward handling of array boundaries.
6. **Easy to debug**: Print `current` and `max_seen` at each step.

## Implementation Checklist

- [ ] Initialize both counters to 0.
- [ ] Handle empty array before loop.
- [ ] Update `max_seen` **before** resetting `current`.
- [ ] Check final counter value **after** loop exits.
- [ ] Test with all ones and all zeros.
- [ ] Verify single element cases.
- [ ] Confirm 1's at end of array are counted correctly.

---

### Summary Section (Summary of Notes)

Core mindset: find the longest contiguous subsequence of 1's using a simple state-tracking approach. Two counters (`current` and `max_seen`) suffice; a single `O(n)` pass is optimal. Lock the invariant early: `current` tracks ongoing sequence length, `max_seen` holds the maximum seen. Critical detail: update `max_seen` when incrementing `current`, reset `current` on seeing 0, and always check the final counter value after the loop (handles 1's at array boundary). Validate with edge cases (empty, single element, all-1s, all-0s, 1's at boundaries) and ensure reset timing is correct to avoid missed sequences.
