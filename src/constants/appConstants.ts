export enum Path {
  root = 'user',
  login = 'login',
  buildings = 'buildings',
  rooms = 'rooms',
  tenants = 'tenants',
  payments = 'payments',
  houseId = ':houseId',
  roomId = ':roomId',
  userId = ':userId',
}

export enum AppConst {
  token = 'token',
  userid = 'UserId',
}

export enum Breadcrumb {
  home = 'Home',
  buildings = 'Quản Lý Tòa Nhà',
  rooms = 'Quản Lý Phòng',
  tenants = 'Quản Lý Người Thuê',
  payments = 'Quản Lý Thanh Toán',
}

export enum QueriesKey {
  provinces = 'provinces',
  wards = 'wards',
}

export enum RoomStatus {
  all = '0', //all
  available = '1', // available
  occupied = '2', // occupied
  maintenance = '3', // maintenance
}
