# chat-web-ui

**1. Lệnh cho git không tự động format CRLF**

```bash
git config --global core.autocrlf false
```

**2. Yêu cầu cần thiết**

- Tải extension Prettier

- Cấu hình default format là prettier. Không sử dụng format mặc định của VSCode

**3. Hướng dẫn sử dụng**

- Clone dự án:

  ```bash
  git clone https://github.com/quyok808/chat-web-ui.git
  ```

- Di chuyển vào thư mục dự án:

  ```bash
  cd chat-web-ui
  ```

- Tải các package cần thiết:

  ```bash
  npm ci
  ```

- Chạy dự án:

  ```bash
  npm start
  ```

- Access endpoint:

  ```bash
  http://localhost:4000
  ```
