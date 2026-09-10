# Nền tảng và thiết lập Git

## Dành cho ai?

Người mới dùng Git hoặc người cần thiết lập một máy phát triển mới. Mục tiêu là hiểu nơi Git lưu thay đổi trước khi chạy các lệnh có tác động.

## Mô hình tối thiểu

- **Working tree** là các tệp bạn đang sửa trên máy.
- **Staging area / index** là tập thay đổi được chọn cho commit kế tiếp.
- **Commit** là một mốc lịch sử bất biến, có tác giả, thời điểm và liên kết tới commit trước.
- **Branch** là tên trỏ tới một dòng lịch sử; tạo nhánh không sao chép toàn bộ dự án.
- **Remote** là tên ngắn cho một repository khác, thường là GitHub.

Git có cấu trúc local-first: bạn có thể xem lịch sử và tạo commit khi không có mạng. Chỉ khi fetch, pull hoặc push thì Git mới trao đổi với remote.

## Cài đặt và xác nhận

Cài phiên bản Git hiện hành theo hệ điều hành từ [trang tải Git](https://git-scm.com/downloads). Sau đó, kiểm tra công cụ đã có mặt:

```sh
git --version
```

Lệnh trên chỉ đọc thông tin; không thay đổi repository hay cấu hình.

## Danh tính commit và phạm vi cấu hình

Mỗi commit lưu tên và email tác giả. Git đọc cấu hình theo ba phạm vi, trong đó phạm vi cụ thể hơn ghi đè phạm vi rộng hơn:

1. **System**: áp dụng cho mọi người dùng trên máy; cần quyền quản trị để thay đổi.
2. **Global**: áp dụng cho một người dùng trên máy.
3. **Local**: chỉ áp dụng cho repository hiện tại.

Kiểm tra trước khi sửa cấu hình:

```sh
git config --global --get user.name
git config --global --get user.email
```

Khi giá trị hiện có chưa đúng, đặt danh tính global bằng thông tin bạn được phép công khai trong lịch sử dự án:

```sh
git config --global user.name "<Tên hiển thị>"
git config --global user.email "<email@example.com>"
```

Hai lệnh cuối thay đổi cấu hình **global** của người dùng hiện tại, không thay đổi repository. Với một repository cần danh tính khác, bỏ `--global` sau khi đã vào đúng repository; khi đó cấu hình chỉ có hiệu lực tại repository đó.

## Tên nhánh khởi tạo

Khi tạo repository mới, hãy tuân theo quy ước của tổ chức. Git hỗ trợ đặt tên nhánh khởi tạo mặc định qua `init.defaultBranch`; nhiều dịch vụ, trong đó có GitHub cho repository mới, dùng `main` làm mặc định. Không đổi tên nhánh mặc định của repository dùng chung nếu chưa có sự thống nhất của nhóm.

## Trợ giúp và kiểm tra

Các thao tác đọc an toàn, hữu ích khi chưa chắc chắn:

```sh
git help <lệnh>
git status
git config --show-origin --get <khóa-cấu-hình>
```

`git status` cần được chạy trong working tree của một repository. `--show-origin` cho biết tệp cấu hình nào cung cấp giá trị cuối cùng, giúp tránh sửa nhầm phạm vi.

## Nguồn chính thức

- [Pro Git: First-Time Git Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
- [`git-config` reference](https://git-scm.com/docs/git-config)
- [GitHub Docs: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)
