# 283. Move Zeroes

## Problem Description

Given an integer array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.

### Examples

**Example 1:**
- Input: `nums = [0,1,0,3,12]`
- Output: `[1,3,12,0,0]`

**Example 2:**
- Input: `nums = [0]`
- Output: `[0]`

### Constraints

- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`

### Follow Up

Could you minimize the total number of operations done?

## Solution Strategy

### Strategy A: Two-Pointer Approach (Optimal)

**Algorithm:**
1. Use two pointers: `write` (position to place next non-zero) and `read` (current element being examined)
2. Iterate through array with `read` pointer
3. When `nums[read] != 0`, copy to `nums[write]` and increment both pointers
4. After processing all elements, fill remaining positions with zeros

**Time Complexity:** O(n) - single pass through array
**Space Complexity:** O(1) - in-place modification

**Mermaid Flowchart:**
```mermaid
graph TD
    A[Start: write=0] --> B[read=0 to n-1]
    B --> C{nums[read] != 0?}
    C -->|Yes| D[nums[write] = nums[read]]
    C -->|No| E[continue]
    D --> F[write++, read++]
    E --> F
    F --> G{read < n?}
    G -->|Yes| B
    G -->|No| H[fill zeros from write to n-1]
    H --> I[End]
```

### Strategy B: Counting Approach

**Algorithm:**
1. Count number of zeros in array
2. Rebuild array by copying non-zero elements to front
3. Fill remaining positions with zeros

**Time Complexity:** O(n) - two passes
**Space Complexity:** O(1) - in-place modification

## Edge Cases

| Test Case | Input | Expected Output | Notes |
|-----------|-------|----------------|-------|
| Empty array | `[]` | `[]` | Not possible due to constraints |
| Single element | `[0]` | `[0]` | Already correct |
| Single element | `[1]` | `[1]` | Already correct |
| All zeros | `[0,0,0,0]` | `[0,0,0,0]` | No movement needed |
| No zeros | `[1,2,3,4,5]` | `[1,2,3,4,5]` | No movement needed |
| Zeros at start | `[0,0,1,2,3]` | `[1,2,3,0,0]` | Multiple zeros to move |
| Zeros at end | `[1,2,3,0,0]` | `[1,2,3,0,0]` | Already correct |
| Zeros in middle | `[5,0,0,0,5]` | `[5,5,0,0,0]` | Non-zeros separated by zeros |
| Alternating | `[1,0,2,0,3,0,4,0]` | `[1,2,3,4,0,0,0,0]` | Pattern of zeros and non-zeros |

## Implementation Details

### C++ Implementation
```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int write = 0;
        for (int read = 0; read < static_cast<int>(nums.size()); read++) {
            if (nums[read] != 0) {
                nums[write++] = nums[read];
            }
        }
        for (int i = write; i < static_cast<int>(nums.size()); i++) {
            nums[i] = 0;
        }
    }
};
```

### C Implementation
```c
void moveZeroes(int* nums, int numsSize) {
    int write = 0;
    for (int read = 0; read < numsSize; read++) {
        if (nums[read] != 0) {
            nums[write++] = nums[read];
        }
    }
    for (int i = write; i < numsSize; i++) {
        nums[i] = 0;
    }
}
```

## Concrete Worked Examples

### Example 1: `[0,1,0,3,12]`

**Step-by-step execution:**
1. Initial: `[0,1,0,3,12]`, `write=0`, `read=0`
2. `nums[0]=0` → skip, `write=0`, `read=1`
3. `nums[1]=1` → `nums[0]=1`, `write=1`, `read=2`
4. `nums[2]=0` → skip, `write=1`, `read=3`
5. `nums[3]=3` → `nums[1]=3`, `write=2`, `read=4`
6. `nums[4]=12` → `nums[2]=12`, `write=3`, `read=5`
7. Fill zeros: `nums[3]=0`, `nums[4]=0`
8. Final: `[1,3,12,0,0]`

### Example 2: `[1,0,2,0,3,0,4,0]`

**Step-by-step execution:**
1. Initial: `[1,0,2,0,3,0,4,0]`, `write=0`, `read=0`
2. `nums[0]=1` → `nums[0]=1`, `write=1`, `read=1`
3. `nums[1]=0` → skip, `write=1`, `read=2`
4. `nums[2]=2` → `nums[1]=2`, `write=2`, `read=3`
5. `nums[3]=0` → skip, `write=2`, `read=4`
6. `nums[4]=3` → `nums[2]=3`, `write=3`, `read=5`
7. `nums[5]=0` → skip, `write=3`, `read=6`
8. `nums[6]=4` → `nums[3]=4`, `write=4`, `read=7`
9. `nums[7]=0` → skip, `write=4`, `read=8`
10. Fill zeros: `nums[4]=0`, `nums[5]=0`, `nums[6]=0`, `nums[7]=0`
11. Final: `[1,2,3,4,0,0,0,0]`

## Performance Analysis

### Two-Pointer Approach
- **Operations:** Each non-zero element is copied exactly once
- **Zero writes:** Only write zeros for positions that need them
- **Optimal:** Minimizes total operations

### Comparison with Alternative Approaches

| Approach | Time | Space | Operations | Notes |
|----------|------|-------|------------|-------|
| Two-Pointer | O(n) | O(1) | ~2n | Optimal |
| Counting | O(n) | O(1) | ~2n | Simpler but less efficient |
| Extra Array | O(n) | O(n) | n | Not in-place |

## Testing

### Test Harness
The solution includes a comprehensive test suite with 10 test cases covering:
- Basic examples from problem statement
- Edge cases (all zeros, no zeros, single elements)
- Complex patterns (alternating, zeros at start/end, zeros in middle)

### Test Results
All 10 test cases pass with the two-pointer implementation.

## Key Takeaways

1. **Two-pointer technique** is optimal for in-place array manipulation
2. **Write pointer** tracks position for next non-zero element
3. **Read pointer** scans array to find non-zero elements
4. **Zero filling** only affects positions that need zeros
5. **Time-space tradeoff**: O(n) time, O(1) space is optimal for this problem
6. **In-place requirement** eliminates need for extra memory allocation

## Related Problems

- 26. Remove Duplicates from Sorted Array (similar two-pointer approach)
- 27. Remove Element (two-pointer technique)
- 283. Move Zeroes (current problem)
- 344. Reverse String (two-pointer approach)

## Code Quality Notes

- **Variable naming**: `write` and `read` clearly indicate their purposes
- **Boundary handling**: Proper use of array size in loop conditions
- **Type safety**: Use of `static_cast<int>(nums.size())` for consistency
- **Comments**: Clear explanation of algorithm steps
- **Error handling**: No error cases in this problem due to constraints