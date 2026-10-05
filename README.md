# Báo cáo: Xử lý xung đột từng bước trong quá trình Rebase

### Bước 1: Khởi tạo dữ liệu và mô phỏng phân nhánh

1. **Trên nhánh `main`**:
   - Tạo file `config.json` gốc (`{"port": 8080, "debug": false}`) -> commit: `init config`.
   - Sửa `"port": 8081` -> commit: `update port on main`.
   - Thêm `"env": "production"` -> commit: `add env config`.

2. **Trên nhánh `feature-api` (tách từ `init config`)**:
   - Sửa `"port": 9000` -> commit: `feat: change port`.
   - Sửa `"debug": true` -> commit: `feat: enable debug`.

**Lịch sử phân nhánh trước khi Rebase (`git log --graph --oneline --all`):**
```text
* 677540a (main) add env config
* 6d0b5e3 update port on main
| * fa67070 (HEAD -> feature-api) feat: enable debug
| * f1cbe8f feat: change port
|/  
* bd2eea0 init config
```

---

### Bước 2: Bắt đầu Rebase và giải quyết Conflict lần 1 (Chặng 1)

Đứng ở nhánh `feature-api`, chạy lệnh rebase lên `main`:
```bash
git rebase main
```

**Thông báo xung đột:**
```text
Rebasing (1/2)
Auto-merging config.json
CONFLICT (content): Merge conflict in config.json
error: could not apply f1cbe8f... feat: change port
```

**Nội dung xung đột trong `config.json`:**
```json
{
<<<<<<< HEAD
  "port": 8081,
  "debug": false,
  "env": "production"
=======
  "port": 9000,
  "debug": false
>>>>>>> f1cbe8f (feat: change port)
}
```

**Cách giải quyết:** Giữ port `9000` của tính năng mới và giữ `env: "production"` từ `main`:
```json
{
  "port": 9000,
  "debug": false,
  "env": "production"
}
```

**Tiếp tục tiến trình:**
```bash
git add config.json
git rebase --continue
```

---

### Bước 3: Giải quyết Conflict lần 2 (Chặng 2)

Sau khi qua chặng 1, Git tiếp tục áp dụng commit thứ hai `feat: enable debug` và phát sinh xung đột tiếp theo:

**Thông báo xung đột:**
```text
Rebasing (2/2)
Auto-merging config.json
CONFLICT (content): Merge conflict in config.json
error: could not apply fa67070... feat: enable debug
```

**Nội dung xung đột trong `config.json`:**
```json
{
  "port": 9000,
<<<<<<< HEAD
  "debug": false,
  "env": "production"
=======
  "debug": true
>>>>>>> fa67070 (feat: enable debug)
}
```

**Cách giải quyết:** Đặt `"debug": true` theo tính năng mới và giữ `"env": "production"` từ `main`:
```json
{
  "port": 9000,
  "debug": true,
  "env": "production"
}
```

**Hoàn tất Rebase:**
```bash
git add config.json
git rebase --continue
```

**Kết quả:**
```text
Successfully rebased and updated refs/heads/feature-api.
```

---

### Bước 4: Kiểm tra kết quả sau khi hoàn tất

1. **Kiểm tra trạng thái (`git status`)**:
```bash
git status
```
**Kết quả:**
```text
On branch feature-api
nothing to commit, working tree clean
```

2. **Kiểm tra đồ thị lịch sử (`git log --graph --oneline`)**:
```bash
git log --graph --oneline
```
**Kết quả:**
```text
* d5c700f (HEAD -> feature-api) feat: enable debug
* fbd10e3 feat: change port
* 677540a (main) add env config
* 6d0b5e3 update port on main
* bd2eea0 init config
```
-> Lịch sử Git thẳng hàng tuyệt đối, không có merge commit phụ, các commit của `feature-api` nằm nối tiếp ngay trên đầu nhánh `main`.

3. **Kiểm tra nội dung tệp `config.json` cuối cùng**:
```json
{
  "port": 9000,
  "debug": true,
  "env": "production"
}
```
