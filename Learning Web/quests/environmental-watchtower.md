---
id: environmental-watchtower
title: Hành trình Trạm Quan trắc
level: intermediate
problem: Thiết kế một trạm quan trắc nhỏ đi từ mạch cảm biến tới firmware, kiểm thử và truyền số đo qua mạng.
destination: Một thiết bị đo môi trường lấy mẫu định kỳ, truyền số đo qua mạng và có bằng chứng kiểm thử đầu cuối.
regions:
  - content:01_hardware
  - content:02_software
  - content:03_interfaces-and-protocols
knowledgeLinks:
  - 01_Hardware/01_Electronics
  - 02_Software/03_Microcontrollers
  - 03_Interfaces-and-Protocols/06_Network
milestones:
  - id: choose-electrical-contract
    title: Chọn cảm biến và mạch điện
    order: 1
    description: Nắm nguồn cấp, mức logic, dải đo và yêu cầu kết nối của cảm biến.
    challenge: Vẽ sơ đồ nối cảm biến với vi điều khiển và ghi ba rủi ro điện cần kiểm tra.
    required: true
    knowledgeLinks:
      - 01_Hardware/01_Electronics
  - id: measure-the-bench
    title: Đo và quan sát mạch
    order: 2
    description: Biết dùng dụng cụ đo để phân biệt lỗi nguồn, dây nối và tín hiệu.
    challenge: Đo nguồn cấp và một tín hiệu cảm biến, rồi ghi lại giá trị kỳ vọng và giá trị thực tế.
    required: true
    knowledgeLinks:
      - 01_Hardware/02_Test-Equipment
  - id: build-the-prototype
    title: Dựng nguyên mẫu phần cứng
    order: 3
    description: Biến sơ đồ thành nguyên mẫu có thể cấp nguồn và đo kiểm an toàn.
    challenge: Lắp breadboard hoặc hoàn thiện sơ đồ CAD, kiểm tra kết nối và lưu ảnh hay file thiết kế.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 01_Hardware/03_Prototyping-Skills
  - id: characterize-the-sensor
    title: Hiểu dữ liệu cảm biến
    order: 4
    description: Xác định đơn vị đo, cách chuyển đổi số đọc và trạng thái cảm biến lỗi.
    challenge: Ghi bảng ba số đo mẫu, cách hiệu chỉnh và phản ứng khi cảm biến mất kết nối.
    required: true
    knowledgeLinks:
      - 02_Software/12_Sensors-and-Actuators
  - id: schedule-sampling
    title: Viết vòng lấy mẫu không chặn
    order: 5
    description: Nắm timer, trạng thái firmware và cách tách lấy mẫu khỏi truyền dữ liệu.
    challenge: Tạo luồng lấy mẫu định kỳ không dùng vòng chờ bận, có trạng thái lỗi rõ ràng.
    required: true
    knowledgeLinks:
      - 02_Software/03_Microcontrollers
  - id: verify-sampling
    title: Kiểm thử luồng đo
    order: 6
    description: Phân biệt kết quả bình thường, giá trị ngoài dải và lỗi giao tiếp.
    challenge: Chạy kiểm thử cho ba tình huống đó và lưu log hoặc báo cáo có thể lặp lại.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 02_Software/09_Testing
  - id: define-the-local-bus
    title: Định nghĩa giao tiếp cảm biến
    order: 7
    description: Nắm địa chỉ, khung dữ liệu và cách phát hiện lỗi trên giao tiếp cơ bản.
    challenge: Viết hợp đồng dữ liệu I2C và đối chiếu ít nhất một lần đọc với bản ghi bus.
    required: true
    knowledgeLinks:
      - 03_Interfaces-and-Protocols/01_Basic
  - id: keep-wireless-connected
    title: Giữ kết nối không dây
    order: 8
    description: Hiểu kết nối Wi-Fi, mất mạng và chính sách thử kết nối lại.
    challenge: Mô tả và thử một lần mất kết nối rồi khôi phục mà không dừng việc lấy mẫu.
    required: true
    knowledgeLinks:
      - 03_Interfaces-and-Protocols/03_Wireless
  - id: deliver-the-reading
    title: Truyền số đo đầu cuối
    order: 9
    description: Nắm đường đi của số đo từ thiết bị qua mạng tới nơi nhận.
    challenge: Gửi số đo qua TCP/IP tới một endpoint, trình diễn thiết bị chạy và lưu trace cùng kết quả kiểm thử.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 03_Interfaces-and-Protocols/06_Network
completionCriteria:
  - Cả chín điểm dừng được hoàn thành theo tuyến Hardware, Software rồi Interfaces & Protocols.
  - Ba checkpoint phần cứng, kiểm thử và truyền số đo có bằng chứng không rỗng.
  - Trạm đo lấy mẫu định kỳ, truyền được số đo và có thể tái hiện kết quả kiểm thử.
---

# Hành trình Trạm Quan trắc

Đi qua chín vùng đất trong ba quốc gia để tạo một nguyên mẫu có thể đo, truyền
và kiểm thử. Bạn có thể chọn loại cảm biến và vi điều khiển phù hợp; tuyến chỉ
quy định kết quả cần chứng minh, không khóa vào một board cụ thể.

Bằng chứng có thể là đường dẫn tới sơ đồ, ảnh, mã nguồn, log hoặc mô tả quan sát.
Ứng dụng hiện lưu ghi chú bằng chứng của bạn nhưng chưa tự kiểm chứng tệp hay
thiết bị thật.
