- [ ] Cập nhật giá nước __`(theo người / theo khối nước sử dụng)`__
  
   ⇒ T/H tính theo đầu người thì thực hiện tính tổng và hiển thị trên màn hình luôn.

- [ ] Trong room có thể thực hiện update __`ảnh cccd, số cccd, SĐT`__ của người thuê phòng.

- [ ] Cập nhật thêm số điện của tháng cũ, số điện của tháng mới.
      
  ⇒ Confirm lại việc điền chỉ số điện và nước tại màn hình tạo hoá đơn.

- [ ] Bỏ input tầng của building.

- [ ] Cập nhật hiển thị phân cách đơn vị của số khi nhập input.

- [ ] Xuất hoá đơn theo toà nhà, theo phòng ⇒ Confirm việc cập nhật chỉ số diện nước vào trong room. Sau đó, tại room sẽ có 1 button tạo hoá đơn hàng loạt.

→ Tạo hoá đơn hàng loạt: 
  - Có 1 button 「Tạo hoá đơn hàng loạt」tại rooms.
  - Khi thực hiện click vào sẽ hiển thị dialog
    - Dự tính trong dialog sẽ có 1 dropdown chứa option gồm: Tạo theo toà nhà, Tạo theo phòng
      - Khi chọn __`Tạo theo toà nhà`__, hiển thị danh sách toà nhà. Chọn 1 toà nhà để tạo hoá đơn cho các phòng trong toà nhà đó.
      - Khi chọn __`Tạo theo phòng`__, hiển thị danh sách room. Chọn 1 hoặc nhiều phòng để tạo hoá đơn cho các phòng được chọn.
    - Data của hoá đơn bao gồm:
      ```
      {
        
      }
      ```
- [ ] Confirm lại với Vi về việc __`Khi tạo nhà có thể sửa được tên phòng, giá phòng`__
