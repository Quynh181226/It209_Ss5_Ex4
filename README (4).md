# Báo cáo: Mô phỏng quy trình Hotfix & Gitflow thực tế

### Bước 1: Khởi tạo trạng thái ban đầu

1. **Trên nhánh `main` (Production v1.0.0)**:
   - Tạo tệp `app.js` phiên bản `v1.0.0` (tồn tại lỗi lộ mật khẩu người dùng).
   - Thực hiện commit và gắn tag release:
   ```bash
   git commit -m "feat: release production v1.0.0"
   git tag -a v1.0.0 -m "Release version 1.0.0"
   ```

2. **Trên nhánh `develop` (Phát triển tính năng mới v1.1.0)**:
   - Tách nhánh `develop` từ `main`:
   ```bash
   git checkout -b develop
   ```
   - Thêm tính năng thanh toán đang phát triển dở dang (chưa thể release):
   ```bash
   git commit -m "feat: dang phat trien tinh nang thanh toan (v1.1.0)"
   ```

---

### Bước 2: Tạo nhánh Hotfix để xử lý sự cố khẩn cấp
Phát hiện lỗi bảo mật nghiêm trọng trên production `main` (v1.0.0). Vì `develop` đang phát triển dở dang, ta tách nhánh `hotfix/v1.0.1` trực tiếp từ `main`:

```bash
git checkout main
git checkout -b hotfix/v1.0.1
```

Tiến hành sửa lỗi trong `app.js` (loại bỏ trường password trả về) và commit:
```bash
git commit -am "fix: khac phuc loi ro ri mat khau nguoi dung"
```

---

### Bước 3: Gộp Hotfix vào `main` và đánh tag `v1.0.1`
Chuyển về nhánh `main` và gộp bản vá:
```bash
git checkout main
git merge --no-ff hotfix/v1.0.1 -m "Merge branch 'hotfix/v1.0.1' into main"
```

Tạo tag đánh dấu phiên bản vá lỗi:
```bash
git tag -a v1.0.1 -m "Release Hotfix 1.0.1"
```

---

### Bước 4: Đồng bộ Hotfix vào `develop` và xóa nhánh Hotfix
Để tránh việc lỗi này tái diễn ở các phiên bản tương lai, đồng bộ ngược lại vào nhánh `develop`:
```bash
git checkout develop
git merge --no-ff hotfix/v1.0.1 -m "Merge branch 'hotfix/v1.0.1' into develop"
```

Xóa nhánh Hotfix cục bộ sau khi hoàn tất:
```bash
git branch -d hotfix/v1.0.1
```

---

### Bước 5: Kiểm tra kết quả thực tế

1. **Kiểm tra danh sách nhánh và tag**:
```bash
git branch -a
git tag
```
**Kết quả:**
```text
  develop
* main

v1.0.0
v1.0.1
```

2. **Đồ thị commit sau khi hoàn tất (`git log --graph --oneline --all`)**:
```text
*   7545473 (develop) Merge branch 'hotfix/v1.0.1' into develop
|\  
* | 096feb6 feat: dang phat trien tinh nang thanh toan (v1.1.0)
| | * 035c7f9 (tag: v1.0.1, main) Merge branch 'hotfix/v1.0.1' into main
| |/| 
|/|/  
| * 3da9302 fix: khac phuc loi ro ri mat khau nguoi dung
|/  
* 912b383 (tag: v1.0.0) feat: release production v1.0.0
```

---

### Sơ đồ quy trình Gitflow (ASCII Diagram)

```text
main:     (v1.0.0)------------------------->(Merge: v1.0.1)
             \                                    ^
              \--[hotfix/v1.0.1: fix bug]--------/ \
               \                                    \
develop:        \-------->[tinh nang dang lam]------->(Merge hotfix)
```
