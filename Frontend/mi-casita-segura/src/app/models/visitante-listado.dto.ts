export interface VisitanteListadoDTO {
  id: number;
  cui: string;
  nombreVisitante: string;
  estado: boolean;
  fechaDeIngreso: string;  // o Date si prefieres
  telefono: string;
  numeroCasa: number;
  motivoVisita: string;
  nota: string;
}