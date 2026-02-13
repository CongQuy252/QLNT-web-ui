export interface User {
  id: string;
  email: string;
  avatarUrl: string;
  name: string;
  role: number;
  phone?: string;
  CCCD?: string;
  CCCDImage: string[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: GetUserResponse;
}

export interface GetUserResponse {
  id: string;
  email: string;
  name: string;
  role: number;
  phone: string;
  cccdImages: {
    front: string;
    back: string;
  };
}

export interface GetUserByIdResponse {
  message: string;
  data: {
    cccdImages: {
      front: {
        url: string;
        publicId: string;
      };
      back: {
        url: string;
        publicId: string;
      };
    };
    id: string;
    email: string;
    name: string;
    role: number;
    phone: string;
    cccd?: string;
  };
}
