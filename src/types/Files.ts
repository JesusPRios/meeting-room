export interface File {
  id: number;
  nombre_archivo: string;
  tipo_archivo: string;
  content?: string | undefined;
}