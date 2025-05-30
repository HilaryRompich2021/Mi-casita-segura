import { Component, OnInit } from '@angular/core';
import { PagosService } from '../services/pagos.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
        this.calcularTotal();
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

    this.detallesPago = this.cuotasPendientes
      .filter(c => c.estado === 'PENDIENTE')
      .map((cuota, index) => ({
        concepto: 'Pago mensual de mantenimiento',
        descripcion: `Pago de cuota ${index + 1} con ${metrosExceso} m³ de agua (${excedente} m³ extra)`,
        monto: montoPorCuota,
        servicioPagado: 'CUOTA',
        estadoPago: 'COMPLETADO'
      }));

      const cuotasPendientes = this.detallesPago.length;
    //this.totalPagar = cuotasPendientes * montoPorCuota;

    this.totalPagar = parseFloat(
  this.detallesPago.reduce((acc, d) => acc + d.monto, 0).toFixed(2)
);

// Mostrar multa visual si hay 2 o más cuotas
  this.montoReinstalacion = cuotasPendientes >= 2 ? 89.00 : 0;

  // Total con multa solo visual
  this.totalConMulta = parseFloat((this.totalPagar + this.montoReinstalacion).toFixed(2));


    this.showResumenPago = true;
    this.showModal = false;
    this.showPagoTarjeta = false;
  }

  continuarAPago() {
    this.showResumenPago = false;
    this.showModal = true;
    //this.calcularTotal();
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

  /*
  calcularTotal() {
    const metrosExceso = this.pagoForm.get('metrosExceso')?.value || 0;
    const excedente = metrosExceso > 4 ? metrosExceso - 4 : 0;
    const costoExcedente = excedente * 23.5;
    const montoPorCuota = this.montoBase + costoExcedente;

    const cuotas = this.cuotasPendientes.filter(c => c.estado === 'PENDIENTE').length;
    let total = cuotas * montoPorCuota;

    //if (cuotas >= 2) total += 89;
    this.totalPagar = parseFloat(total.toFixed(2));
  }*/

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
  const detallesParaEnviar = this.detallesPago;

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

    /*const pago = {
      montoTotal: this.totalPagar,
      metodoPago: 'TARJETA',
      estado: 'COMPLETADO',
      creadoPor: this.cuiUsuario,
      numeroTarjeta: form.numeroTarjeta,
      cvv: form.cvv,
      fechaVencimiento: form.vencimiento,
      detalles: detallesParaEnviar
      //detalles: this.detallesPago
    };*/

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
}
