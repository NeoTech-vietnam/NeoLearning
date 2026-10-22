# NeoLearning Web — Định hướng sản phẩm dài hạn

Ngày nghiên cứu và thống nhất định hướng: **2026-10-01**.

Trạng thái: định hướng được người dùng yêu cầu lưu lại; **không phải cam kết lịch giao hàng hoặc lệnh triển khai toàn bộ roadmap**. Mỗi đợt cần được chuyển thành task có phạm vi và tiêu chí kiểm thử trước khi phát triển.

## 1. Tầm nhìn

**NeoLearning = bản đồ kiến thức + hành trình học + phòng thực hành + hồ sơ năng lực.**

Embedded là một thế giới rộng lớn. Quốc gia tương ứng với topic lớn của repo; các vùng nhỏ tương ứng với thư mục con. Bản đồ giúp người học biết kiến thức nào tồn tại và cần đến đâu khi gặp vấn đề. Quest là hành trình nối nhiều vùng, có thể đi qua nhiều quốc gia, để giải quyết một bài toán thực tế.

Vòng lặp chủ đạo:

**Bài toán thực tế → khám phá kiến thức → dự đoán/thử nghiệm → thiết kế & làm → kiểm thử → ghi lại → ôn lại.**

Không xây một thư viện tài liệu có điểm thưởng bên ngoài. Xây một môi trường giúp người học hiểu, nhớ và tạo được sản phẩm chạy thật.

## 2. Nguyên tắc sản phẩm

- Giữ cây thư mục curriculum và Markdown làm nguồn kiến thức; không đổi cấu trúc chỉ để phục vụ giao diện game.
- Metadata bài học, quest và bài tập nằm riêng, liên kết tới tài liệu bằng ID ổn định. Đường dẫn là vị trí nội dung, không nên là định danh duy nhất khi hỗ trợ đổi tên/di chuyển.
- Quest bắt đầu từ vấn đề thực tế; chỉ dẫn về lý thuyết cần thiết, ý chính, phương pháp thiết kế và design pattern, rồi quay lại thực hiện và kiểm thử.
- Mỗi project thể hiện quy trình kỹ thuật ở mức mini: yêu cầu, thiết kế, triển khai, kiểm thử, kết quả và phản tư. Bổ sung schematic/PCB/CAD khi bài toán cần, không ép mọi project phải có tất cả.
- Một vùng có thể xuất hiện trong nhiều tuyến quest; không chỉ có một lộ trình duy nhất.
- Khám phá tự do luôn có ích. Điều kiện tiên quyết là gợi ý/điều kiện của thử thách, không mặc định khóa việc đọc kiến thức.
- EXP ghi nhận hoạt động/thành tựu; năng lực cần bằng chứng. Ghé vùng, cuộn đọc và ghi chú không tự chứng minh đã học thành thạo.
- Phân biệt mô phỏng, tự xác nhận, test tự động và bằng chứng từ phần cứng thật. Không quảng cáo mô phỏng là xác minh phần cứng.
- Hỗ trợ điện thoại, bàn phím, giảm chuyển động và quyền sở hữu dữ liệu cá nhân. Không dùng hiệu ứng gây cản trở đọc hoặc điều hướng.

## 3. Nghiên cứu nền tảng học tập

Các nguồn dưới đây là tài liệu chính thức được tham khảo ngày 2026-10-01. Tính năng là bằng chứng về cơ chế sản phẩm, không phải bằng chứng rằng sao chép giao diện sẽ tạo cùng hiệu quả học tập.

| Nền tảng | Cơ chế đáng học | Áp dụng đề xuất |
| --- | --- | --- |
| [Khan Academy — Mastery](https://support.khanacademy.org/hc/en-us/articles/360007253831-Using-self-paced-practice-and-Mastery-in-the-classroom) | Theo dõi mức năng lực theo kỹ năng và đánh giá bằng thực hành | Trạng thái vùng dựa trên luyện tập và bằng chứng, không chỉ hoàn thành khóa |
| [Brilliant — Learn by doing](https://brilliant.org/landing/learn-computer-science-basics/) | Bài học ngắn, tương tác, phản hồi ngay | Khái niệm → dự đoán → thử nghiệm → giải thích lỗi |
| [Anki — Active recall và spaced repetition](https://docs.ankiweb.net/background.html) | Chủ động nhớ lại và ôn cách quãng | Câu hỏi từ kiến thức/ghi chú, ôn theo kết quả nhớ lại |
| [Duolingo — Spaced repetition](https://blog.duolingo.com/spaced-repetition-for-learning/) | Đưa nội dung đã học trở lại trong hoạt động luyện tập | Ôn kiến thức trên tuyến quest và các lỗi từng mắc |
| [Codecademy — Portfolio projects](https://www.codecademy.com/resources/blog/portfolio-projects-in-career-paths) | Project từ có hướng dẫn đến tự chủ | Guided quest → challenge quest → project tự thiết kế |
| [Exercism — Getting started](https://exercism.org/docs/using/getting-started) | Thực hành kết hợp phản hồi/mentoring | Review code, thiết kế và kết quả thử nghiệm |
| [Wokwi — Simulator](https://docs.wokwi.com/) | Mô phỏng vi điều khiển, linh kiện và tín hiệu trong trình duyệt | Liên kết lab ESP32/cảm biến/logic analyzer rồi chuyển sang phần cứng thật |

Không mặc định tích hợp, sao chép nội dung hoặc mua dịch vụ của các nền tảng này. Trước khi tích hợp phải kiểm tra API, điều khoản, giấy phép và chi phí tại thời điểm triển khai.

## 4. Điểm xuất phát của NeoLearning

Tại commit `35532ef`, sản phẩm có nền bản đồ phân cấp, World Review, quest và tiến độ, hoạt động tương tác pilot, reader Markdown, notebook đồng bộ server, EXP/điểm danh và Discovery Compass.

Các khoảng trống quan trọng:

- **Định hướng:** chưa có một trải nghiệm Today thống nhất trả lời nên học gì tiếp và tại sao.
- **Nội dung:** hoạt động tương tác mới ở mức pilot; không phải mọi tài liệu đều có bài tập/lab.
- **Năng lực:** lượt ghé, đọc, thực hành và tự làm được cần có mô hình phân biệt rõ hơn.
- **Khả dụng:** chưa có gói nội dung offline/PWA hoàn chỉnh. Điện thoại hiện vẫn phụ thuộc server và kết nối tới preview.
- **Vận hành:** cần backup/restore được kiểm thử, xử lý đồng bộ/xung đột và chiến lược cập nhật dữ liệu trước khi mở rộng nền tảng.

## 5. Roadmap theo giai đoạn

Thứ tự là ưu tiên và phụ thuộc, không phải deadline. Biên soạn nội dung là một luồng công việc riêng, có thể tốn nhiều công hơn UI.

| Giai đoạn | Phạm vi chính | Điều kiện hoàn thành |
| --- | --- | --- |
| **A — Daily learning loop** | Today dashboard; tiếp tục hành trình; tìm kiếm nhanh; danh sách ôn; phiên học 10/20/45 phút với ước lượng rõ ràng | Mở app là biết việc tiếp theo và lý do; có thể bắt đầu học mà không phải tự tìm giữa hàng nghìn tài liệu |
| **B — Learning content engine** | Mục tiêu, tiên quyết, kiến thức chính, câu hỏi, lab và nguồn tham khảo; công cụ biên soạn/kiểm tra metadata | Một tuyến quest có nội dung và thử thách hoàn chỉnh, không chỉ link Markdown; kiểm tra được link/anchor/ID và đáp án |
| **C — Mastery & memory** | Đánh giá đầu vào; active recall; ôn cách quãng; sổ lỗi; đề xuất lấp lỗ hổng | Người học làm lại được bài hoặc áp dụng vào biến thể sau một khoảng thời gian; không suy năng lực từ EXP |
| **D — Maker Lab** | Mô phỏng; debug challenge; test case; nhật ký đo; evidence; schematic/PCB/CAD khi cần | Một project có yêu cầu, thiết kế, chạy thử, test và báo cáo tái hiện được; loại bằng chứng được ghi rõ |
| **E — Offline & apps** | PWA; tải gói kiến thức; notebook offline; đồng bộ an toàn; sau đó thử desktop/mobile native | Đọc được khi server offline; kết nối lại không mất ghi chú hoặc nhân đôi EXP; cập nhật gói nội dung và xử lý xung đột được kiểm thử |
| **F — Portfolio & collaboration** | Hồ sơ project; export báo cáo; review/mentor; tài khoản riêng nếu mở cho nhiều người | Chia sẻ được bằng chứng năng lực và nhận phản hồi; nội dung cá nhân chỉ được chia sẻ theo lựa chọn rõ ràng |

Giai đoạn A và nền tảng HTTPS/PWA có thể làm song song. Native không phải điều kiện để hoàn thiện trải nghiệm học tập.

### Tuyến nội dung mẫu

Dùng **Environmental Watchtower / Trạm quan trắc môi trường** để kiểm chứng vòng lặp:

1. Đi qua điện tử, firmware và giao tiếp; mỗi chặng có câu hỏi cần trả lời hoặc artifact cần tạo.
2. Thiết kế và xây một hệ thống có dữ liệu cảm biến, xử lý và truyền thông.
3. Ghi test, kết quả đo và báo cáo; nêu giới hạn mô phỏng/phần cứng.
4. Mở các biến thể mất Wi-Fi, cảm biến lỗi, tiết kiệm pin để kiểm tra khả năng vận dụng.

Chuẩn hóa một tuyến chất lượng trước khi mở rộng hàng loạt bài tập cho toàn repo.

## 6. Gamification có ý nghĩa

Hai hệ thống riêng:

- **EXP:** hoạt động và thành tựu có quy tắc chống nhận thưởng lặp.
- **Năng lực:** kết quả trả lời, giải thích, thực hành và evidence có nguồn gốc rõ ràng.

Trạng thái vùng đề xuất: **Đã khám phá → Đã luyện → Đã áp dụng**, kèm tín hiệu **Cần ôn lại**. Việc đến hạn ôn không xóa thành tựu đã đạt; mastery phải có định nghĩa và tiêu chí trước khi triển khai.

Các cơ chế phù hợp:

- Quest chính, side quest, debug challenge và thử thách biến thể.
- Trại nghỉ trên tuyến đường để ôn kiến thức vừa sử dụng.
- Huy hiệu cụ thể: tìm lỗi race condition, hoàn thành board đầu tiên, đo và giải thích một dạng sóng.
- Gợi ý hành trình theo mục tiêu firmware, PCB, RTOS hoặc Embedded Linux.
- Random có bộ lọc vùng chưa khám phá, vùng cần ôn hoặc liên quan project đang làm.

Ưu tiên thấp: leaderboard, tiền ảo, phạt mất streak, multiplayer hoặc hiệu ứng liên tục. Nhắc học phải tùy chọn và có thể tắt; không tạo áp lực giữ điểm.

## 7. Khả thi khi chuyển thành app

### PWA — ưu tiên đầu tiên

[PWA](https://web.dev/learn/pwa/) tận dụng web hiện tại, bổ sung cài đặt và offline. Không chỉ thêm icon: cần manifest, cache có phiên bản, gói tài liệu người dùng chọn, bộ nhớ local, hàng đợi đồng bộ và UI cho dữ liệu chưa đồng bộ.

Preview hiện tại dùng HTTP trên IP Tailscale. Đường truyền tailnet không tự biến origin HTTP thành secure context của trình duyệt. Service worker cần HTTPS, ngoại trừ các trường hợp phát triển như localhost; vì vậy phải chuẩn bị HTTPS có xác thực trước khi triển khai PWA cho điện thoại. [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

Offline triển khai tăng dần: đọc gói đã tải trước; sau đó ghi chú offline; cuối cùng hoạt động/quest offline khi có cơ chế xác nhận kết quả và chống thưởng trùng. Không cache mật khẩu hay tùy tiện lưu mọi response cá nhân; cần chính sách xóa dữ liệu local và cập nhật cache.

### Mobile — Capacitor là ứng viên

[Capacitor](https://capacitorjs.com/docs/basics/workflow) dùng web bundle để xây Android/iOS và bổ sung native bridge. Điện thoại ưu tiên đọc, ôn, ghi chú, ảnh board/kết quả đo, evidence và nhắc học tùy chọn.

Đóng gói frontend **không mang Express server hoặc repo trên máy tính vào điện thoại**. App online có thể dùng API server; app độc lập cần gói nội dung và local storage/sync. Cần cấu hình API origin, xác thực, quyền truy cập và kiểm thử trên thiết bị thật. Build iOS cần môi trường Apple phù hợp; không hứa một máy Linux sẽ trực tiếp build/phát hành mọi nền tảng.

### Desktop — so sánh Electron và Tauri bằng prototype

- [Electron](https://www.electronjs.org/docs/latest/) có Chromium và Node.js, là ứng viên thử trước nếu ưu tiên tận dụng backend Node hiện tại trên Windows/macOS/Linux. Đánh đổi là đóng gói thêm runtime. Markdown phải ở renderer bị giới hạn quyền, không bật Node integration cho nội dung không đáng tin; tuân thủ [hướng dẫn bảo mật](https://www.electronjs.org/docs/latest/tutorial/security).
- [Tauri](https://v2.tauri.app/start/) dùng frontend web và tích hợp native. [Node sidecar](https://v2.tauri.app/learn/sidecar-nodejs/) là một hướng giữ backend cho desktop, nhưng cần thêm toolchain/tích hợp. Tài liệu sidecar này chỉ áp dụng desktop; không suy ra backend Node sẽ chạy tương tự trên mobile. [Yêu cầu nền tảng](https://v2.tauri.app/start/prerequisites/) cũng cần được kiểm tra trước khi chốt.

Desktop ưu tiên Maker Lab: repo local, code, test, log serial và liên kết công cụ thiết kế. [Web Serial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) có thể hỗ trợ một số lab web nhưng tương thích còn hạn chế; luôn cần đường đi thay thế, không hứa mọi trình duyệt/điện thoại flash hoặc đọc serial được.

Chọn framework sau một prototype đo startup, bộ nhớ, khả năng đóng gói backend, truy cập repo và an toàn nội dung. Không viết lại bằng Flutter/React Native chỉ để có biểu tượng app.

## 8. Kiến trúc mục tiêu và các điều kiện mở rộng

Một lõi sản phẩm chung, không ba ứng dụng độc lập:

- Nội dung Markdown/assets + metadata đã kiểm tra → catalog/gói nội dung có phiên bản.
- Logic học tập, quest, đánh giá và hợp đồng dữ liệu dùng chung giữa các client.
- Web/PWA/mobile/desktop khác lớp lưu trữ, đồng bộ và truy cập thiết bị; không mặc định mọi API hệ điều hành dùng được trên mọi nền tảng.
- Dữ liệu cá nhân tách khỏi nội dung: notebook, tiến độ, lịch ôn và evidence.
- Markdown không đáng tin không được có quyền chạy shell, truy cập file tùy ý hoặc nhận quyền native.

Trước offline/multi-client cần ID ổn định, phiên bản schema, migration/backup, mutation ID chống lặp, xử lý xung đột và xác nhận thưởng phía server. SQLite hoặc giải pháp giao dịch tương đương là ứng viên khi yêu cầu vượt khả năng store JSON một process hiện tại; không đổi database chỉ vì roadmap có nhiều tính năng.

Ứng dụng hiện là private single-owner. Nếu mở cho nhiều người, cần dự án riêng cho danh tính, phân quyền, cô lập dữ liệu, upload an toàn và quản trị; không công khai API sửa curriculum hiện tại hoặc coi mật khẩu preview là thiết kế tài khoản hoàn chỉnh.

## 9. Cách đo giá trị

Ưu tiên các chỉ số liên quan học tập, có lựa chọn quyền riêng tư:

- Có bắt đầu được việc học tiếp theo mà không cần hướng dẫn thủ công không?
- Có hoàn thành quest kèm artifact/test/evidence không?
- Có nhớ và áp dụng lại được sau 7/30 ngày không? Đây là các mốc đánh giá đề xuất, không phải tuyên bố hiệu quả đã được đo.
- Có giải được biến thể của bài toán thay vì chỉ làm theo hướng dẫn không?
- Notebook có mất dữ liệu khi reload, offline hoặc đổi thiết bị không?

Không dùng số lượt click, thời gian mở trang hoặc EXP làm đại diện duy nhất cho thành công. Nội dung bài tập và rubric đánh giá phải được review như code.

## 10. Ưu tiên kế tiếp

1. Today dashboard + tìm kiếm/tiếp tục hành trình + trải nghiệm ôn thống nhất.
2. Hoàn chỉnh một tuyến quest với bài tập, lab và tiêu chí evidence thật sự.
3. HTTPS có xác thực + PWA đọc offline theo gói.
4. Sau khi kiểm chứng nhu cầu: notebook offline/sync, đánh giá năng lực và mở rộng nội dung.
5. Prototype desktop/mobile khi có nhu cầu native cụ thể; chỉ phát triển community/multi-user khi có quyết định sản phẩm riêng.

Đích đến: từ **bản đồ tài liệu thú vị** thành **môi trường học embedded dùng được mỗi ngày**.
