---
id: pwm-signal-lab
title: Hành trình Tín hiệu PWM
level: beginner
problem: Tạo và kiểm chứng một tín hiệu PWM có tần số và duty cycle xác định.
destination: Một thiết kế tín hiệu PWM được giải thích, mô phỏng và kiểm thử trước khi đem lên phần cứng.
regions:
  - content:01_hardware
  - content:02_software
knowledgeLinks:
  - 01_Hardware/01_Electronics
  - 02_Software/03_Microcontrollers/04_PWM
milestones:
  - id: set-electrical-goal
    title: Đặt mục tiêu tín hiệu
    order: 1
    description: Chọn tải, mức logic, tần số và duty cycle phù hợp.
    challenge: Ghi tần số, duty cycle và mức điện áp dự kiến; giải thích một rủi ro khi nối tải thật.
    required: true
    knowledgeLinks:
      - 01_Hardware/01_Electronics
  - id: prove-waveform
    title: Dự đoán và tạo dạng sóng
    order: 2
    description: Dùng timer, comparator và generator để tạo xung mong muốn.
    challenge: Hoàn thành mini-lab PWM, dự đoán thời gian HIGH và lưu bằng chứng mô phỏng.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 02_Software/03_Microcontrollers/04_PWM
  - id: test-boundaries
    title: Kiểm thử giới hạn
    order: 3
    description: Đối chiếu công thức với dạng sóng và xác định điều gì còn cần đo trên phần cứng.
    challenge: Thử ít nhất hai duty cycle khác nhau và ghi kết quả kỳ vọng cùng phép đo cần làm sau này.
    required: true
    knowledgeLinks:
      - 02_Software/09_Testing
completionCriteria:
  - Ba điểm dừng được hoàn thành và mini-lab có bằng chứng.
  - Người học phân biệt rõ mô phỏng thời gian với phép đo điện áp thực tế.
---

# Hành trình Tín hiệu PWM

Bắt đầu từ yêu cầu của tải, dự đoán dạng sóng, sau đó dùng mini-lab để kiểm tra
công thức thời gian. Bằng chứng từ mini-lab chỉ chứng minh mô hình thời gian;
khi dùng phần cứng thật vẫn phải đo điện áp, dòng tải và dạng sóng thực.
