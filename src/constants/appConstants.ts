export const debounceTime = 300;

export enum Path {
  root = 'user',
  login = 'login',
  buildings = 'buildings',
  rooms = 'rooms',
  tenants = 'tenants',
  payments = 'payments',
  statistics = 'statistics',
  createpayment = 'payments/createpayment',
  buildingId = ':buildingId',
  roomId = ':roomId',
  userId = ':userId',
  paymentId = ':paymentId',
  users = 'users',
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
  all = '0',
  available = 'available',
  occupied = 'occupied',
  maintenance = 'maintenance',
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

export enum WaterType {
  person = 'person',
  m3 = 'm3',
}
