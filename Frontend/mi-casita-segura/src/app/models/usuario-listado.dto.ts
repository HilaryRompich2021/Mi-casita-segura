export interface UsuarioListadoDTO {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  numeroCasa: number;
  roles: string[];   
  telefono: string;   
  estado?: string;      
}