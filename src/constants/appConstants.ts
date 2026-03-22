export enum Path {
  root = 'user',
  login = 'login',
  buildings = 'buildings',
  rooms = 'rooms',
  tenants = 'tenants',
  payments = 'payments',
  statistics = 'statistics',
  buildingId = ':buildingId',
  roomId = ':roomId',
  userId = ':userId',
  paymentId = ':paymentId',
}

export enum Breadcrumb {
  home = 'Home',
  buildings = 'Quản Lý Tòa Nhà',
  rooms = 'Quản Lý Phòng',
  tenants = 'Quản Lý Người Thuê',
  payments = 'Quản Lý Thanh Toán',
  statistics = 'Thống Kê',
}

export enum QueriesKey {
  provinces = 'provinces',
  districts = 'districts',
  wards = 'wards',
  user = 'user',
  users = 'users',
  buildings = 'buildings',
  building = 'building',
  rooms = 'rooms',
  payment = 'payment',
  room = 'room',
  payments = 'payments',
  occupiedRooms = 'occupiedRooms',
}

export enum RoomStatus {
  all = '0', //all
  available = 'available', // available
  occupied = 'occupied', // occupied
  maintenance = 'maintenance', // maintenance
}

export enum Mode {
  owner = 'owner',
  tenant = 'tenant',
}

export enum UserRole {
  admin = 1,
  tenant = 0,
}

export enum LocalStorageKey {
  token = 'token',
  userId = 'userId',
}

export enum TenantStatus {
  all = 'all',
  active = 'active',
  inactive = 'inactive',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}
