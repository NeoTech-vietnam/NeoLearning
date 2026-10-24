# Cornell Notes

## Topic: FreeRTOS Queues — Why use them? FIFO vs Mailbox, Blocking Mechanism

## Date: 2026-06-20

---

### Cue Column (Questions, Keywords, or Prompts)

- Tại sao dùng queue thay vì biến global?
- Queue "by copy" nghĩa là gì? Khác "by reference" ở điểm nào?
- FIFO hoạt động như thế nào?
- Mailbox là gì? Khác FIFO ở chỗ nào?
- Blocking khi đọc từ queue rỗng — chuyện gì xảy ra?
- Blocking khi ghi vào queue đầy — chuyện gì xảy ra?
- Nếu nhiều task cùng blocked trên một queue, ai được unblock trước?
- Queue Set dùng khi nào?

---

### Notes Section (Main Notes)

#### 1. Tại sao dùng queue?

**Vấn đề với biến global:**

```c
// KHÔNG an toàn — hai task đọc/ghi đồng thời gây race condition
int g_sensor_value = 0;

void vTaskA() { g_sensor_value = read_sensor(); }   // writer
void vTaskB() { process(g_sensor_value); }           // reader — có thể đọc giá trị bị xé đôi
```

**Queue giải quyết 3 vấn đề cùng lúc:**

| Vấn đề | Giải pháp của queue |
|--------|---------------------|
| Race condition | RTOS quản lý toàn bộ copy vào/ra — atomic ở mức item |
| Busy-wait (polling) | Task tự block, CPU nhường cho task khác |
| Tight coupling | Sender & receiver không cần biết nhau — chỉ cần biết queue handle |

**Queue dùng được cho 3 hướng giao tiếp:**

```
Task A ──────────────────────────► Task B     (task-to-task)
ISR   ──── xQueueSendFromISR() ──► Task B     (interrupt-to-task)
Task A ──── xQueueSendToBack() ──► ISR        (task-to-interrupt, hiếm)
```

---

#### 2. Queue by Copy — tại sao không phải by Reference?

FreeRTOS chọn **copy by value** (sao chép toàn bộ dữ liệu vào queue):

```
Sender stack:          Queue storage:         Receiver stack:
┌─────────────┐        ┌────────────────┐     ┌─────────────┐
│ int32_t val │──copy──► [100][200][...] │─copy─►│ int32_t buf │
│   = 100     │        └────────────────┘     └─────────────┘
└─────────────┘
  (có thể thoát)         (RTOS sở hữu)          (nhận được giá trị)
```

**Lợi thế:**

- Stack variable của sender có thể **thoát scope** ngay sau khi gửi — dữ liệu đã được sao chép an toàn
- Sender và receiver **hoàn toàn tách rời** — không cần lo ai "sở hữu" bộ nhớ
- Vẫn hỗ trợ **by reference**: nếu dữ liệu quá lớn, copy **con trỏ** vào queue thay vì copy dữ liệu

```c
// Copy con trỏ (by-reference qua queue)
char *pcBuffer = pvPortMalloc(1024);
snprintf(pcBuffer, 1024, "big data...");
xQueueSend(xPointerQueue, &pcBuffer, portMAX_DELAY);  // copy 4 byte địa chỉ
// CHÚ Ý: receiver phải free buffer sau khi dùng xong
```

---

#### 3. FIFO — cơ chế ghi/đọc thông thường

```
                  xQueueSendToBack()
                         │
                         ▼ tail (đuôi)
┌──────────────────────────────────┐
│   item5 │ item4 │ item3 │ item2  │  ← dữ liệu dịch từ tail → head
└──────────────────────────────────┘
  head (đầu) ▲
             │
      xQueueReceive() — lấy ra và XÓA item khỏi queue
```

**Ghi vào đầu queue (priority item):**
```c
xQueueSendToFront(xQueue, &urgentItem, 0);
// Dùng khi có dữ liệu ưu tiên cao cần xử lý trước
```

**API thường dùng:**

```c
QueueHandle_t xQueue = xQueueCreate(5, sizeof(int32_t));  // tối đa 5 item, mỗi item 4 byte

// Gửi (ghi vào đuôi)
xQueueSendToBack(xQueue, &value, pdMS_TO_TICKS(100));

// Nhận (đọc và xóa khỏi đầu)
xQueueReceive(xQueue, &buffer, pdMS_TO_TICKS(100));

// Kiểm tra số item hiện có
uxQueueMessagesWaiting(xQueue);
```

---

#### 4. Mailbox — FIFO nhưng dữ liệu không bị xóa

```
             xQueueOverwrite()     xQueuePeek()
                   │                    │
                   ▼                    ▼
           ┌───────────────┐    ┌───────────────┐
           │  latest_val   │    │  latest_val   │   ← dữ liệu VẪN CÒN sau khi đọc
           └───────────────┘    └───────────────┘
           (length = 1, ghi đè)  (đọc nhưng không xóa)
```

**So sánh FIFO vs Mailbox:**

| Đặc điểm | FIFO Queue | Mailbox |
|-----------|-----------|---------|
| Độ dài | N item | **1 item** |
| Ghi | `xQueueSendToBack()` — thất bại nếu đầy | `xQueueOverwrite()` — **luôn thành công**, ghi đè |
| Đọc | `xQueueReceive()` — **xóa** item sau khi đọc | `xQueuePeek()` — **giữ nguyên** item |
| Mô hình | Dữ liệu di chuyển từ sender → receiver | Sender ghi "trạng thái mới nhất", mọi task đọc được |
| Dùng khi | Truyền sự kiện, lệnh | Chia sẻ trạng thái hệ thống (sensor reading, config) |

```c
// Tạo mailbox = queue độ dài 1
QueueHandle_t xMailbox = xQueueCreate(1, sizeof(SensorData_t));

// Cập nhật mailbox (ghi đè giá trị cũ)
void vSensorTask(void *pvParameters) {
    SensorData_t xNewData = { .value = read_sensor(), .timestamp = xTaskGetTickCount() };
    xQueueOverwrite(xMailbox, &xNewData);   // không bao giờ block
}

// Nhiều task đọc cùng một mailbox
void vDisplayTask(void *pvParameters) {
    SensorData_t xData;
    xQueuePeek(xMailbox, &xData, portMAX_DELAY);   // đọc nhưng không xóa
    display(xData.value);
}
```

---

#### 5. Blocking Mechanism — trái tim của queue

**5a. Block khi đọc (queue rỗng):**

```
vReceiverTask():
    xQueueReceive(xQueue, &buf, pdMS_TO_TICKS(100))
                                        │
                        ┌───────────────▼────────────────┐
                        │ Queue rỗng?                    │
                        │  → Task vào Blocked state      │
                        │  → CPU chạy task khác          │
                        └───────────────┬────────────────┘
                                        │
               ┌────────────────────────▼────────────────────────────┐
               │ Ai thắng? Một trong hai điều xảy ra trước:          │
               │  A) Sender gửi data → task thoát Blocked, nhận data │
               │  B) Timeout hết → task thoát, trả về errQUEUE_EMPTY │
               └────────────────────────────────────────────────────┘
```

**5b. Block khi ghi (queue đầy):**

```
vSenderTask():
    xQueueSendToBack(xQueue, &val, pdMS_TO_TICKS(100))
                                        │
                        ┌───────────────▼────────────────┐
                        │ Queue đầy?                     │
                        │  → Task vào Blocked state      │
                        │  → CPU chạy task khác          │
                        └───────────────┬────────────────┘
                                        │
               ┌────────────────────────▼────────────────────────────┐
               │  A) Receiver đọc data → có chỗ trống → task unblock │
               │  B) Timeout hết → task thoát, trả về errQUEUE_FULL  │
               └────────────────────────────────────────────────────┘
```

**5c. Quy tắc unblock khi có nhiều task cùng chờ:**

```
Queue: [ ] [ ] [ ]  ← có 1 chỗ trống

Blocked tasks (cùng chờ ghi):
  Task A (priority 2) — chờ 50ms
  Task B (priority 2) — chờ 200ms    ← chờ lâu nhất → THẮNG (ưu tiên ngang nhau)
  Task C (priority 1) — chờ 10ms

→ Task B được unblock (priority bằng Task A nhưng chờ lâu hơn)
→ Nếu Task A priority = 3 → Task A thắng bất kể thời gian chờ
```

**Quy tắc:** Highest priority first → nếu priority bằng nhau → longest waiting first.

**5d. Giá trị `xTicksToWait` đặc biệt:**

```c
xQueueReceive(xQueue, &buf, 0);                   // không block, trả về ngay
xQueueReceive(xQueue, &buf, pdMS_TO_TICKS(100));  // block tối đa 100ms
xQueueReceive(xQueue, &buf, portMAX_DELAY);        // block vô hạn (cần INCLUDE_vTaskSuspend=1)
```

---

#### 6. Queue Set — block trên nhiều queue cùng lúc

```c
// Thay vì polling từng queue:
while (1) {
    if (uxQueueMessagesWaiting(xQueue1)) { xQueueReceive(xQueue1, ...); }
    if (uxQueueMessagesWaiting(xQueue2)) { xQueueReceive(xQueue2, ...); }
    // BAD: CPU luôn chạy dù không có data
}

// Dùng Queue Set — task block cho đến khi BẤT KỲ queue nào có data:
QueueSetHandle_t xSet = xQueueCreateSet(2);  // tổng capacity = 2
xQueueAddToSet(xQueue1, xSet);
xQueueAddToSet(xQueue2, xSet);

QueueHandle_t xActive = xQueueSelectFromSet(xSet, portMAX_DELAY);
// xActive sẽ là handle của queue CÓ data → đọc trực tiếp từ nó
xQueueReceive(xActive, &buf, 0);
```

**Lưu ý:** Queue Set kém hiệu quả hơn thiết kế dùng một queue nhận struct. Chỉ dùng khi bị ràng buộc bởi thư viện bên thứ ba.

---

### Summary Section

Queue là công cụ giao tiếp chính trong FreeRTOS vì nó giải quyết đồng thời ba vấn đề: **an toàn dữ liệu** (copy by value, RTOS quản lý), **hiệu quả CPU** (blocking thay vì polling), và **decoupling** (sender/receiver không phụ thuộc nhau).

- **FIFO**: dùng `xQueueSendToBack` + `xQueueReceive` để truyền sự kiện — data được tiêu thụ một lần.
- **Mailbox**: dùng `xQueueOverwrite` + `xQueuePeek` trên queue độ dài 1 để chia sẻ trạng thái mới nhất — data không bị xóa.
- **Blocking**: task tự ngủ khi queue rỗng (đọc) hoặc đầy (ghi); RTOS đánh thức task có priority cao nhất (hoặc chờ lâu nhất nếu priority bằng nhau) khi điều kiện thỏa mãn.
