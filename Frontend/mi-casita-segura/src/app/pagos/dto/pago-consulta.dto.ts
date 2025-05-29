import { PagoDetalleConsultaDTO } from './pago-detalle-consulta.dto';

export interface PagoConsultaDTO {
  id: number;
  montoTotal: number;
  metodoPago: string;
  estado: 'COMPLETADO' | 'PENDIENTE';
  fechaPago: string;
  detalles: PagoDetalleConsultaDTO[];
}
