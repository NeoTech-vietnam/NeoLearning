# Hướng dẫn AI cài bộ extension Nimbalyst local

## Yêu cầu của chủ bộ extension

Cài các extension trong thư mục `extensions/` cạnh tài liệu này vào Nimbalyst trên máy đích. Giữ nguyên chức năng hiện có. **Browser chỉ cho người dùng thao tác thủ công: không bật lại AI tools.** Không sửa `app.asar`, preload hoặc core Nimbalyst; không khởi động lại ứng dụng nếu người dùng chưa yêu cầu. Không tự nhập hoặc sao chép API key, cookie, mật khẩu hay dữ liệu project từ máy khác.

Đọc hết tài liệu trước khi cài. Các đường dẫn bên dưới là ví dụ: dùng đường dẫn thực tế trên máy đích, không dùng lại tên người dùng/ổ đĩa của máy nguồn.

## Nội dung bộ cài

| Thư mục | Extension ID | Phiên bản | Công dụng |
|---|---|---|---|
| `extensions/browser-internal-tabs` | `com.nimbalyst.browser` | `1.0.1-local.3` | Browser Chromium, link mở tab nội bộ, thanh dấu trang; AI tools đã tắt |
| `extensions/browser-launcher` | `com.local.browser-launcher` | `0.1.0` | Icon mở Browser trên activity bar |
| `extensions/project-calendar` | `com.local.project-calendar` | `0.1.4` | Lịch workspace, thêm/sửa sự kiện, nút lưu và liên kết tracker |
| `extensions/agent-office` | `com.local.agent-office` | `0.17.0` | Bốn khu nghề, trang phục, ánh sáng đêm/mưa, đi theo lối và nước nền |
| `extensions/midnight-teal` | `com.local.midnight-teal` | `0.5.3` | Theme Claude Extension Dark và CSS hội thoại |
| `extensions/antigravity-cli` | `com.local.antigravity-cli` | `0.3.3` | Adapter cho chương trình Antigravity CLI, hội thoại streaming và quota |

Mỗi thư mục chứa manifest, source cần cho build và `dist` đã build. Cả 6 gói đã build thành công ngày 22/10/2026. Bộ cài không chứa chương trình `agy`; cần cài và đăng nhập CLI riêng trên máy đích. Có thể kiểm tra file bằng `node verify.mjs` tại thư mục gốc bộ cài. Bộ này không mang theo `node_modules`, tests/ảnh kiểm chứng, lịch/sự kiện, tab Browser, dấu trang cá nhân, API key, tài khoản, session AI, tracker database hay backup của máy nguồn. Tác giả và cấu hình mặc định trong code được giữ nguyên.

## 1. Chuẩn bị máy đích

1. Mở Nimbalyst và workspace muốn dùng.
2. Bật Extension Dev Tools trong Settings > Advanced nếu chưa bật. Tìm các tool `extension_build`, `extension_install`, `extension_reload`, `extension_get_status` của Extension Developer Kit. Tên namespace có thể khác giữa các phiên bản; tìm tool theo chức năng.
3. Năm gói ban đầu build bằng thư viện chuẩn Node.js, không cần `npm install`. Riêng Antigravity CLI cần **Node.js 22.12+** và `npm ci` trước khi build lại. React và runtime được Nimbalyst cung cấp khi chạy. Các bản `dist/` đã có sẵn để cài trực tiếp; không cần tải dependency nếu không build lại.
4. Đặt source tại thư mục bền vững ngoài thư mục cài ứng dụng, ví dụ Windows: `%USERPROFILE%\Nimbalyst-Extensions`. Copy từng thư mục con trong `extensions/` vào đó. Không cài lâu dài từ USB/thư mục tạm/thư mục resources của Nimbalyst. Có thể dùng trực tiếp bản trong Downloads nếu người dùng muốn giữ nó cố định ở đó.
5. Nếu máy đích đã có source hoặc extension cùng ID, đọc phiên bản hiện tại và sao lưu trước. Không xóa đè thư mục đang chứa dữ liệu người dùng. Không đổi ID để lách xung đột; Browser chủ ý thay thế implementation built-in có cùng ID.

## 2. Kiểm tra và cài

Ưu tiên thứ tự: Browser Internal Tabs -> Browser Launcher -> Project Calendar -> Agent Office -> Theme -> Antigravity CLI.

Cho mỗi extension, gọi tool với **đường dẫn tuyệt đối đến thư mục chứa `manifest.json`**, không trỏ vào `dist/`:

```json
extension_install({ "path": "<EXTENSIONS_ROOT>/browser-internal-tabs" })
extension_get_status({ "extensionId": "com.nimbalyst.browser" })
```

Thay folder/ID theo bảng để cài các extension còn lại. Bản build sẵn đã đi kèm. Nếu host yêu cầu build lại, dùng `extension_build` sau khi chuẩn bị dependency đúng loại gói. Với extension đã cài, `extension_reload` sẽ build lại rồi cập nhật; riêng Antigravity CLI phải có dependency trước:

```json
extension_reload({
  "extensionId": "<ID trong manifest>",
  "path": "<đường dẫn source extension>"
})
extension_get_status({ "extensionId": "<ID trong manifest>" })
```

Các ví dụ trên là lời gọi tool minh họa, không phải lệnh shell. Nếu cần kiểm tra build năm gói ban đầu qua terminal:

```powershell
Set-Location -LiteralPath '<đường dẫn source extension>'
node build.mjs
```

Build qua terminal không tự đăng ký extension vào Nimbalyst. Cần bước `extension_install`/`extension_reload` của host. Nếu tool cài không có trên máy đích, báo thiếu Extension Dev Tools và hướng dẫn bật; không đoán một đường dẫn profile để copy lén vào và không tự sửa core.

## 3. Kiểm tra tính năng và cấu hình riêng máy đích

### Browser

- Bấm icon Browser Launcher, mở thử một website công khai do người dùng chọn.
- Kiểm tra thanh dấu trang: lưu trang bằng ☆, mở lại và xóa bằng ×. Dấu trang khởi đầu trống, được lưu vào extension-global storage trên máy đích.
- Link `target=_blank` phải mở tab Browser nội bộ, giữ tab gốc, không có lỗi “Could not refresh”. Các file tab mới được tạo trong `sessions/` của Browser; không đưa folder này vào gói chia sẻ tiếp.
- Status phải còn ba custom editors và **không đăng ký Browser AI tools**. Cả `manifest.contributions.aiTools` và runtime export đều rỗng. Không gọi browser automation tools hoặc bật chúng lại để kiểm chứng.
- Tắt Browser tools không phải firewall: preview HTML local vẫn có thể kết nối mạng. Không tải preview không tin cậy có dữ liệu nhạy cảm.

### Agent Office

- Đọc session của workspace trên máy đích; bộ cài không chứa session của máy nguồn. Host có thể yêu cầu quyền catalog `nimbalyst-database-read` và quyền mạng đã khai báo trong manifest.
- Thời tiết mặc định: Quận 7, TP.HCM. Đổi vị trí nếu cần. Người dùng nhập API key Tomorrow.io tại Settings của extension; không yêu cầu dán key vào chat hay ghi vào source. Chưa có key thì dùng Open-Meteo cho thời tiết hiện tại; dự báo Tomorrow.io cần key riêng.
- Cadence: hiện tại 5 phút, dự báo 20 phút; khi chạy liên tục một feed mỗi loại, tối đa lịch thường lệ khoảng 360 request/ngày. Các guard/backoff vẫn áp dụng.
- Mở Office một lần trong mỗi lần chạy Nimbalyst để khởi tạo nền; sau đó đóng panel vẫn tiếp tục tính nước. Nước được lưu khi thay đổi, tối đa mỗi phút; tốc độ dâng x2, tốc độ rút giữ nguyên. Không phục dựng mưa khi ứng dụng tắt hoặc máy sleep.
- Bù mưa ngày 12/10/2026 trong source là thao tác một lần đã có hạn thời gian; không gia hạn hoặc kích lại trên máy mới.
- Bấm nhân vật thật để mở session. Kiểm tra nghỉ lâu thì ngủ và nhiều session chung một nghề.

### Project Calendar

- Bấm icon Calendar trong workspace đích. Launcher tạo lịch trống tại `nimbalyst-local/calendar/project.project-calendar.json` **chỉ khi chưa có file**. Không ghi đè lịch có sẵn.
- Tạo một sự kiện thử khi người dùng cho phép, bấm **Lưu lịch**, mở lại kiểm tra. Không coi build-pass là bằng chứng đã lưu thành công trong host.
- Muốn chuyển sự kiện từ máy cũ cần copy/export file lịch riêng; bộ này không kèm sự kiện. Các link tracker chỉ mở đúng khi tracker tương ứng tồn tại ở workspace/tài khoản máy đích. Không tạo tracker giả để làm link có vẻ hoạt động.
- Calendar có tool `calendar_add_event` theo manifest hiện tại. Yêu cầu tắt agent chỉ áp dụng cho Browser; không tự tắt/bật tool extension khác.

### Theme

- Cài xong, chọn **Claude Extension Dark** trong phần chọn theme nếu chưa được chọn. `midnight-teal` là tên thư mục/ID cũ; tên hiển thị hiện tại là Claude Inspired Theme.
- Kiểm tra giao diện, màu chữ và hội thoại. Không sao chép cấu hình theme toàn ứng dụng từ máy nguồn.

### Antigravity CLI

- Gói `antigravity-cli` chứa adapter/backend đã bundle, không chứa chương trình `agy` hoặc tài khoản. Cài Antigravity CLI trên máy đích, kiểm tra `agy --version` rồi đăng nhập bằng giao diện/terminal của CLI. Trên Windows, adapter mặc định tìm `%LOCALAPPDATA%\agy\bin\agy.exe`; đặt CLI path trong Settings nếu dùng vị trí khác. Không yêu cầu gửi token vào chat hoặc copy credential store.
- Cài trực tiếp bản `dist/` đi kèm bằng `extension_install`. Nếu cần build lại, dùng Node.js 22.12+; tại thư mục `antigravity-cli` chạy `npm ci`, rồi `npm run build`. Có package-lock để cố định dependency; tải dependency cần mạng. Không chạy model discovery hoặc gọi model chỉ để build/cài.
- Nimbalyst máy đích cần hỗ trợ backend modules và extension agent providers. Người dùng cấp quyền native lần đầu theo cơ chế host; không sao chép permission grants từ máy khác.
- Bản 0.3.3 mặc định Normal (Accept Edits), Turbo bật. Turbo bỏ bước hỏi quyền tool trong subprocess CLI; tắt trong Settings nếu muốn CLI áp dụng quy tắc quyền của nó. Đây là mặc định source, không phải tài khoản/cấu hình cá nhân được mang sang.
- Model trong manifest là snapshot, khả năng dùng phụ thuộc tài khoản CLI. Chỉ thử hội thoại trả phí khi người dùng cho phép. Adapter hỗ trợ ảnh; các định dạng tài liệu khác chưa được hỗ trợ.
- Quota indicator cần backend/CLI tương thích. Nếu báo `quota_v2` unavailable thì không coi là quota 0. Backend cũ đã cache có thể cần mở lại ứng dụng sau cập nhật; chỉ thực hiện khi người dùng đồng ý.

## 4. Giới hạn tương thích

- Browser đóng gói từ built-in Browser 1.0.1 và dùng IPC nội bộ của Nimbalyst. Các build patch có exact guard: nếu guard thất bại, dừng và báo phiên bản không khớp; không bỏ guard hoặc patch mù vendor.
- Office dùng schema session/message nội bộ; Calendar dùng `tracker_items`. Các schema này không phải hợp đồng SDK ổn định. Khi query lỗi, kiểm tra SDK/schema trên máy đích rồi báo giới hạn; không tự mở rộng quyền hoặc sửa database.
- Calendar hiện import `@nimbalyst/runtime`; host phải cung cấp module này. Nếu không có, đối chiếu SDK của chính máy đó trước khi thay import.
- Ưu tiên phiên bản Nimbalyst tương thích với máy nguồn. Cài trên phiên bản khác hoặc hệ điều hành khác cần kiểm chứng riêng; chưa chứng nhận Windows/macOS/Linux đều hoạt động.
- Chỉ build và kiểm tra chức năng liên quan; không chạy integration scripts cũ dùng CDP/cổng debug để vượt giới hạn host hoặc chính sách tắt Browser automation.
- Các bài test không có trong gói gọn này; `npm test` trong package gốc có thể tham chiếu tests không được mang theo. Dùng `node build.mjs` hoặc Extension Dev Tools để build/cài.

## 5. Báo cáo sau cài

Ghi ngắn: phiên bản Nimbalyst, extension nào `loaded`, source đặt ở đâu, tính năng nào đã kiểm tra thực tế, phần nào mới build-pass và cấu hình còn chờ người dùng nhập. Không tuyên bố đã test restart/lưu dữ liệu nếu chưa làm. Không gửi nội dung project hoặc credential ra ngoài để kiểm chứng.

`CONTENTS.json` liệt kê bộ đóng gói; `SHA256SUMS.json` dùng kiểm tra file không đổi trong quá trình vận chuyển. Sau khi build hoặc sửa source, checksum cũ có thể không còn khớp; đó không tự động là lỗi bảo mật.

## Kiểm tra bộ cài trước khi dùng

Chạy `node verify.mjs` tại thư mục chứa hướng dẫn này để đối chiếu toàn bộ SHA-256 và phiên bản manifest. Bộ cài chỉ chứa source cần cho build và bản build, không chứa tests hoặc lệnh test. Không coi build/hash-pass là bằng chứng mọi tính năng đã chạy trên máy đích.
