import { Component, OnInit } from '@angular/core';
import { PagosService } from '../services/pagos.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthInterceptor } from '../auth/auth/auth-interceptor/auth-interceptor';



@Component({
  selector: 'app-pagos',
  standalone: true,
  providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS },JwtHelperService],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export default class PagosComponent implements OnInit {
  cuotasPendientes: any[] = [];
  showModal = false;
  showResumenPago = false;
  showPagoTarjeta = false;

  montoBase = 550;
  totalPagar = 0;
  cuiUsuario: string = '';
  detallesPago: any[] = [];
  montoReinstalacion: number = 0;
totalConMulta: number = 0;

totalCuotas = 0;
totalReservas = 0;



  pagoForm = new FormGroup({
    nombreTitular: new FormControl('',
       Validators.required,),
    metrosExceso: new FormControl(0),
    numeroTarjeta: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{16}$/)
    ]),
    cvv: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3,4}$/)
    ]),
    vencimiento: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    ])
  });

  detalleForm = new FormGroup({
    concepto: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    servicioPagado: new FormControl('CUOTA', Validators.required)
  });


  constructor(private pagosService: PagosService, private jwtHelper: JwtHelperService) {
    console.log('PagosComponent se inicializó');
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.cuiUsuario = decoded.cui;
      this.obtenerTodosLosPagos();
    } else {
      console.warn('Token no encontrado');
    }
  }

  obtenerTodosLosPagos() {
    this.pagosService.getPagosPorCui(this.cuiUsuario).subscribe({
      next: data => {
        this.cuotasPendientes = data || [];
        this.detallesPago = this.cuotasPendientes;
        this.calcularTotalDesglosado();
      },
      error: err => {
        console.error('Error al cargar pagos:', err);
      }
    });
  }

  abrirResumenPago() {
    this.detallesPago = [];

    const form = this.pagoForm.value;
    const metrosExceso = form.metrosExceso || 0;
    const excedente = metrosExceso > 4 ? metrosExceso - 4 : 0;
    const costoExcedente = excedente * 23.5;
    const montoPorCuota = this.montoBase + costoExcedente;

     // Usar los detalles originales sin alterar el servicioPagado
  this.detallesPago = this.cuotasPendientes
    .filter(c => c.estado === 'PENDIENTE')
    .flatMap((cuota, index) => {
      if (!cuota.detalles || cuota.detalles.length === 0) {
        // Si no hay detalles, se muestra como "sin descripción"
        return [{
          concepto: 'Pago pendiente',
          descripcion: 'Sin detalle disponible',
          monto: cuota.montoTotal,
          servicioPagado: 'DESCONOCIDO',
          estadoPago: 'COMPLETADO',
          reservaId: null
        }];
      }

      return cuota.detalles.map((detalle: any) => {
        let descripcion = detalle.descripcion;

        if (detalle.servicioPagado === 'CUOTA') {
          descripcion = `Pago de cuota ${index + 1} con ${metrosExceso} m³ de agua (${excedente} m³ extra)`;
        }

        return {
          concepto: detalle.concepto || 'Pago',
          descripcion,
          monto: detalle.servicioPagado === 'CUOTA' ? (550 + costoExcedente) : detalle.monto,
          servicioPagado: detalle.servicioPagado,
          estadoPago: 'COMPLETADO',
          reservaId: detalle.reservaId || null
        };
      });
    });

  // Recalcula total de cuotas y reservas
  this.totalCuotas = this.detallesPago
    .filter(d => d.servicioPagado === 'CUOTA')
    .reduce((sum, d) => sum + d.monto, 0);

  this.totalReservas = this.detallesPago
    .filter(d => d.servicioPagado === 'RESERVA')
    .reduce((sum, d) => sum + d.monto, 0);

  // Nuevo: Total general considerando TODOS los detalles
this.totalPagar = parseFloat(
  this.detallesPago.reduce((sum, d) => sum + d.monto, 0).toFixed(2)
);

  // Multa solo si hay 2 o más cuotas mensuales
  this.montoReinstalacion = this.detallesPago.filter(d => d.servicioPagado === 'CUOTA').length >= 2 ? 89.00 : 0;

  // Total visual con multa (no se envía)
  this.totalConMulta = parseFloat((this.totalPagar + this.montoReinstalacion).toFixed(2));


    this.showResumenPago = true;
    this.showModal = false;
    this.showPagoTarjeta = false;
  }

  continuarAPago() {
    this.showResumenPago = false;
    this.showModal = true;
  }

  continuarATarjeta() {
    if (this.detalleForm.invalid) {
    this.detalleForm.markAllAsTouched();
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor, completa los campos de concepto, descripción y servicio pagado antes de continuar.'
    });
    return;
  }
    const detalleFormValue = this.detalleForm.value;

    this.detallesPago = this.detallesPago.map(det => ({
      ...det,
      concepto: detalleFormValue.concepto,
      descripcion: detalleFormValue.descripcion,
      servicioPagado: detalleFormValue.servicioPagado
    }));

    this.showResumenPago = false;
    this.showPagoTarjeta = true;
  }

  cancelarResumen() {
    this.showResumenPago = false;
  }

  cancelarPagoTarjeta() {
    this.showPagoTarjeta = false;
  }


    calcularTotal() {
  // Si no hay detalles cargados, no se recalcula nada
  if (!this.detallesPago || this.detallesPago.length === 0) return;

  // Sumar todos los montos desde los detalles que ya tienes
  this.totalPagar = parseFloat(
    this.detallesPago.reduce((acc, d) => acc + d.monto, 0).toFixed(2)
  );
}


  pagar() {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const form = this.pagoForm.value;

    // Excluir detalle visual de reinstalación
  const detallesParaEnviar = this.detallesPago.map(d => ({
    concepto: d.concepto,
    descripcion: d.descripcion,
    monto: d.monto,
    estadoPago: d.estadoPago,
    servicioPagado: d.servicioPagado,
    reservaId: d.reservaId || null,             // Actualizar reserva en la entidad reserva
    reinstalacionId: d.reinstalacionId || null  // Actualiza la entidad reinstalación
  }));

  const pago = {
  montoTotal: parseFloat(
    detallesParaEnviar.reduce((acc, d) => acc + d.monto, 0).toFixed(2)
  ),
  metodoPago: 'TARJETA',
  estado: 'COMPLETADO',
  creadoPor: this.cuiUsuario,
  numeroTarjeta: form.numeroTarjeta,
  cvv: form.cvv,
  fechaVencimiento: form.vencimiento,
  detalles: detallesParaEnviar
};


    this.pagosService.registrarPago(pago).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Pago exitoso', text: 'Tu pago se ha procesado correctamente.' });
        this.showPagoTarjeta = false;
        this.pagoForm.reset({ metrosExceso: 0 });
        this.detalleForm.reset();
        this.obtenerTodosLosPagos();
      },
      error: err => {
        console.error('Error al registrar pago:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar el pago. Verifica los datos ingresados.' });
      }
    });
  }

  calcularTotalDesglosado() {
  const cuotasMensuales = this.detallesPago.filter(d => d.servicioPagado === 'CUOTA');
    const reservas = this.detallesPago.filter(d => d.servicioPagado === 'RESERVA');

    this.totalCuotas = cuotasMensuales.reduce((sum, d) => sum + d.monto, 0);
    this.totalReservas = reservas.reduce((sum, d) => sum + d.monto, 0);

    //this.montoReinstalacion = cuotasMensuales.length >= 2 ? 89.0 : 0;
    this.totalPagar = this.totalCuotas;
   // this.totalConMulta = parseFloat((this.totalPagar + this.montoReinstalacion).toFixed(2));
  }

}
