export interface User {
  id?: number;
  nom: string;
  email: string;
  password?: string;
  role?: string;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
}
