export interface PagoDetalleConsultaDTO {
  concepto: string;
  descripcion: string;
  monto: number;
  servicioPagado: 'AGUA' | 'LUZ' | 'RECOLLECION_DE_BASURA' | 'RESERVA' | 'REINSTALACION' | 'CUOTA';
  estadoPago: 'COMPLETADO' | 'PENDIENTE';
}
