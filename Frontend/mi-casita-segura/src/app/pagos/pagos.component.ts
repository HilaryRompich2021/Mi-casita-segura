import { Component, OnInit } from '@angular/core';
import { PagosService } from '../services/pagos.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  montoBase = 550;
  totalPagar = 0;
  cuiUsuario: string = '';

  pagoForm = new FormGroup({
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


  constructor(private pagosService: PagosService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.cuiUsuario = decoded.cui;
      this.obtenerTodosLosPagos();
    }
  }

  obtenerTodosLosPagos() {
    this.pagosService.obtenerTodosLosPagos(this.cuiUsuario).subscribe({
      next: data => {
        console.log('Pagos recibidos:', data);
        this.cuotasPendientes = data;
      },
      error: err => {
        console.error('Error al cargar pagos:', err);
      }
    });
  }

   abrirModal() {
    this.showModal = true;
    this.calcularTotal();
  }

  calcularTotal() {
    const metros = this.pagoForm.get('metrosExceso')?.value || 0;
    const extra = metros > 4 ? (metros - 4) * 23.5 : 0;
    this.totalPagar = this.montoBase + extra;
  }


/*
  cargarCuotasPendientes() {
    this.pagosService.obtenerCuotasPendientes(this.cuiUsuario).subscribe(data => {
      console.log('Cuotas cargadas:', data);
      this.cuotasPendientes = data;
    });
  }*/

  /*  cargarCuotasPendientes() {
  this.pagosService.obtenerCuotasPendientes(this.cuiUsuario).subscribe({
    next: data => {
      this.cuotasPendientes = data;
    },
    error: err => {
      console.error('Error al cargar cuotas pendientes:', err);
    }
  });
}
*/





   pagar() {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const form = this.pagoForm.value;

    const detalle = {
      concepto: 'Cuota mensual',
      descripcion: `Cuota mensual con ${form.metrosExceso} m3 de agua`,
      monto: this.totalPagar,
      servicioPagado: 'AGUA',
      estadoPago: 'COMPLETADO'
    };

    const pago = {
      montoTotal: this.totalPagar,
      metodoPago: 'TARJETA',
      estado: 'COMPLETADO',
      creadoPor: this.cuiUsuario,
      numeroTarjeta: form.numeroTarjeta,
      cvv: form.cvv,
      fechaVencimiento: form.vencimiento,
      detalles: [detalle]
    };

    this.pagosService.registrarPago(pago).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Pago exitoso',
          text: 'Tu pago se ha procesado correctamente.'
        });
        this.showModal = false;
        this.pagoForm.reset({ metrosExceso: 0 });
        this.calcularTotal();
        this.obtenerTodosLosPagos;
      },
      error: err => {
        console.error('Error al registrar pago:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el pago. Verifica los datos ingresados.'
        });
      }
    });
  }
}
