export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phoneNumber: string;
    userType: string;
  };
}

export interface OTPRequest {
  phoneNumber: string;
  userType: "student" | "admin";
}

export interface OTPVerifyRequest {
  phoneNumber: string;
  otp: string;
  userType: "student" | "admin";
}
