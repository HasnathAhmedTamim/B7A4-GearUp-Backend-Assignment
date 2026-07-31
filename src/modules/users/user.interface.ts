export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER";

  photo?: string;
  phone?: string;
  address?: string;
  bio?: string;
}
export interface IUpdateProfile {
  name?: string;
  photo?: string;
  phone?: string;
  address?: string;
  bio?: string;
}