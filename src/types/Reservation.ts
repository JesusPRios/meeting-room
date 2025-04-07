export interface Reservation {
  id: number;
  reason: string;
  date: Date;
  timeStart: string;
  timeEnd: string;
  duration: string;
  participants: string;
  status: string;
  user_id: number;
  cedula_user: string;
  nombre_usuario: string;
}