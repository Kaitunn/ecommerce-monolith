# Ecommerce Monolithic REST API

Dự án RESTful API cho hệ thống thương mại điện tử phiên bản Minimum Viable Product (MVP), được xây dựng theo kiến trúc Monolithic.

## Công nghệ sử dụng

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs
- Docker
- Docker Compose

## Chức năng chính

### Authentication
- Đăng ký tài khoản
- Đăng nhập
- Mã hóa mật khẩu bằng bcrypt
- Xác thực người dùng bằng JWT
- API lấy thông tin người dùng hiện tại

### Authorization
Hệ thống hỗ trợ 2 role:

- USER
- ADMIN

ADMIN có quyền quản lý sản phẩm và shipment.

### Product
- Lấy danh sách sản phẩm
- Lấy chi tiết sản phẩm
- Thêm sản phẩm
- Cập nhật sản phẩm
- Xóa sản phẩm

### Order
- Người dùng tạo đơn hàng
- Một đơn hàng có nhiều sản phẩm
- Lưu giá sản phẩm tại thời điểm đặt hàng
- Tự động trừ số lượng tồn kho
- Người dùng xem danh sách đơn hàng của mình

### Shipment
- ADMIN tạo shipment cho đơn hàng
- ADMIN cập nhật trạng thái shipment
- ADMIN xem danh sách shipment

## Database

Hệ thống gồm các bảng:

- Role
- User
- Membership
- Product
- Order
- OrderDetail
- Shipment

Quan hệ chính:

- Role 1 - N User
- Membership 1 - N User
- User 1 - N Order
- Order 1 - N OrderDetail
- Product 1 - N OrderDetail
- Order 1 - N Shipment

Order và Product có quan hệ nhiều-nhiều thông qua bảng OrderDetail.

## Environment Variables

Tạo file `.env` dựa trên `.env.example`:

```env
DATABASE_URL="postgresql://admin:123456@localhost:5432/ecommerce_db?schema=public"

PORT=4000

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d