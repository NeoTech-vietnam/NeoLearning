# Cornell Notes

## Topic: FreeRTOS Semaphores vs Mutexes — Differences, Use Cases, and Pitfalls

## Date: 2026-06-20

---

### Cue Column (Questions, Keywords, or Prompts)

- Binary semaphore vs mutex — là một hay khác nhau?
- Counting semaphore dùng khi nào?
- Tại sao mutex KHÔNG được dùng trong ISR?
- Priority inversion là gì?
- Priority inheritance giải quyết gì và giới hạn là gì?
- Deadlock xảy ra như thế nào?
- Recursive mutex dùng khi nào?
- Gatekeeper task thay thế mutex như thế nào?

---

### Notes Section (Main Notes)

#### 1. Ba loại "semaphore" trong FreeRTOS

| Loại | API tạo | Kích thước queue ngầm | Mục đích chính |
|------|---------|----------------------|----------------|
| Binary semaphore | `xSemaphoreCreateBinary()` | 1 (có/không) | **Synchronization** task ↔ ISR |
| Counting semaphore | `xSemaphoreCreateCounting(max, init)` | > 1 (đếm) | **Đếm events** hoặc quản lý resource pool |
| Mutex | `xSemaphoreCreateMutex()` | 1 (có/không) | **Mutual exclusion** — bảo vệ tài nguyên chia sẻ |

Cả ba đều dùng `xSemaphoreTake()` / `xSemaphoreGive()`. Nhưng **ý nghĩa ngữ nghĩa khác hoàn toàn.**

---

#### 2. Binary Semaphore — Synchronization (task ↔ ISR)

**Luồng hoạt động:**

```
ISR:   xSemaphoreGiveFromISR(sem, &woken)  ← "có event rồi"
Task:  xSemaphoreTake(sem, portMAX_DELAY)  ← "đợi event"
```

- ISR **give** mà không cần **take** trước — hoàn toàn đúng.
- Task **take** nhưng không **give** lại — hoàn toàn đúng.
- Queue ngầm = 1 slot → nếu ISR give 2 lần trước khi task kịp take, lần give thứ 2 thất bại (`pdFAIL`). **Event bị mất!**

**Giải pháp:** Dùng **counting semaphore** để latch nhiều event mà không mất.

```c
// Counting semaphore: latch tối đa 10 events
xCountingSemaphore = xSemaphoreCreateCounting(10, 0);
// ISR give 3 lần → count = 3 → task lấy từng cái một, không mất event
```

---

#### 3. Counting Semaphore — Hai use case

**Use case A: Đếm events (event counter)**

```
uxInitialCount = 0  (chưa có event nào)
uxMaxCount     = N  (buffer tối đa N events)

ISR: give()     → count++  (event xảy ra)
Task: take()    → count--  (task xử lý 1 event)
```

**Use case B: Quản lý resource pool**

```
uxInitialCount = N  (có N tài nguyên sẵn có)
uxMaxCount     = N

Task muốn dùng: take()  → count--  (lấy 1 tài nguyên)
Task trả về:    give()  → count++  (trả lại tài nguyên)
count = 0 → không còn tài nguyên → task bị block
```

---

#### 4. Mutex — Mutual Exclusion (task ↔ task)

Mutex = **token** đính kèm với tài nguyên chia sẻ.

```c
xSemaphoreTake(xMutex, portMAX_DELAY);  // Lấy token (vào critical zone)
{
    // Chỉ 1 task ở đây tại 1 thời điểm
    printf("%s", pcString);
}
xSemaphoreGive(xMutex);                 // Trả token
```

**Quy tắc bắt buộc:** Task nào **take** phải **give** lại. Không như binary semaphore dùng cho sync.

**KHÔNG dùng mutex trong ISR** — vì mutex có cơ chế priority inheritance, cơ chế này tác động đến task priority, vô nghĩa trong ngữ cảnh ISR.

---

#### 5. Bảng so sánh toàn diện

| Tiêu chí | Binary Semaphore | Counting Semaphore | Mutex |
|----------|-----------------|-------------------|-------|
| Mục đích | Task-ISR sync | Đếm events / pool | Mutual exclusion |
| Take trong ISR? | Không | Không | Không |
| Give trong ISR? | Có (`FromISR`) | Có (`FromISR`) | Không |
| Task phải give lại? | Không bắt buộc | Không bắt buộc | **Bắt buộc** |
| Priority Inheritance? | **Không** | **Không** | **Có** |
| Đếm được nhiều event? | Không (mất event) | Có | Không áp dụng |
| Dùng khi nào? | ISR báo task | ISR báo nhiều lần / pool N resource | Bảo vệ tài nguyên dùng chung |

---

#### 6. Priority Inversion và Priority Inheritance

**Priority Inversion** — vấn đề cốt lõi của mutex:

```
Task H (high)  → chờ mutex
Task M (mid)   → đang chạy (không cần mutex)
Task L (low)   → đang giữ mutex  ← bị chặn bởi Task M

Kết quả: Task H phải chờ Task L, nhưng Task L còn bị Task M chặn
→ Task có priority cao nhất lại bị trì hoãn lâu nhất = Priority Inversion
```

**Priority Inheritance** (FreeRTOS mutex có sẵn):

```
Khi Task H chờ mutex đang bị Task L giữ:
→ Task L tạm thời được "nâng" priority lên bằng Task H
→ Task L chạy ngay (không bị Task M chen ngang)
→ Task L give mutex → priority Task L trở về bình thường
→ Task H tiếp tục
```

**Giới hạn của priority inheritance:**
- Chỉ là "giảm thiểu" chứ không "loại bỏ" hoàn toàn priority inversion
- Không nên dựa vào nó để thiết kế hệ thống — cần tránh tình huống priority inversion từ đầu
- Làm phân tích timing phức tạp hơn

---

#### 7. Deadlock

Xảy ra khi Task A chờ mutex của Task B, trong khi Task B lại chờ mutex của Task A.

```
Task A: lấy Mutex X → bị block chờ Mutex Y
Task B: lấy Mutex Y → bị block chờ Mutex X
→ Cả hai không ai chạy được mãi mãi
```

**Phòng tránh:**
1. Không dùng `portMAX_DELAY` — dùng timeout có hạn, xử lý `pdFAIL`
2. Thiết kế thứ tự lấy mutex nhất quán: nếu cần cả X và Y thì luôn lấy X trước Y
3. Đơn giản hóa dependency giữa các task

**Recursive Mutex** — giải quyết deadlock với chính mình:

```c
// Mutex thường: deadlock nếu task take 2 lần
// Recursive mutex: take N lần → phải give N lần mới thực sự thả
xSemaphoreTakeRecursive(xRecMutex, timeout);  // count = 1
xSemaphoreTakeRecursive(xRecMutex, timeout);  // count = 2
xSemaphoreGiveRecursive(xRecMutex);           // count = 1 (chưa thả)
xSemaphoreGiveRecursive(xRecMutex);           // count = 0 (thả thật)
```

Dùng khi function gọi đệ quy hoặc khi library function cũng dùng mutex đó.

---

#### 8. Gatekeeper Task — Thay thế mutex không cần priority inheritance

Thay vì dùng mutex, để **một task duy nhất** trực tiếp truy cập tài nguyên:

```
Task A ─┐
         ├──→ Queue ──→ Gatekeeper Task ──→ Tài nguyên (printf, LCD, v.v.)
Task B ─┘
ISR   ─┘ (xQueueSendToFrontFromISR)
```

**Ưu điểm:**
- Không có priority inversion (không dùng mutex)
- ISR cũng dùng được (gửi qua queue)
- Code gatekeeper đơn giản, không cần bảo vệ thêm

**Nhược điểm:**
- Tốn thêm 1 task và 1 queue
- Gatekeeper chạy ở priority cố định — không linh hoạt như mutex

---

### Summary Section

FreeRTOS có **3 loại semaphore** với mục đích khác nhau, mặc dù API trông giống nhau:

- **Binary semaphore**: chỉ dành cho sync task ↔ ISR. ISR give, task take. Không cần give lại.
- **Counting semaphore**: latch nhiều event hoặc quản lý pool N tài nguyên. Không mất event khi ISR xảy ra nhanh hơn task xử lý.
- **Mutex**: bảo vệ tài nguyên chia sẻ giữa các task. Task nào take **phải** give lại. Có priority inheritance để giảm priority inversion, nhưng không dùng trong ISR.

**Quy tắc chọn nhanh:**
- Task cần đợi signal từ ISR → **Binary/Counting Semaphore**
- Task cần độc chiếm tài nguyên (shared data, peripheral) → **Mutex**
- Nhiều ISR event nhanh, task xử lý chậm → **Counting Semaphore**
- Muốn tránh hoàn toàn priority inversion, ISR cũng cần dùng → **Gatekeeper Task**
