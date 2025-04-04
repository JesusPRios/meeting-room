export interface User {
  id: string;
  name: string;
  cedula: string;
  phone: string;
  bio: string;
  password: string;
  email: string;
  photo: string | Blob | null;
}