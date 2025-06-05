import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaqueteResponse, PaqueteService } from '../../services/paquete.service';
import Swal from 'sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validate-paquete',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './validate-paquete.component.html',
  styleUrl: './validate-paquete.component.css'
})
export default class ValidatePaqueteComponent {
form!: FormGroup;
  isLoadingIngreso = false;
  isLoadingEntrega = false;
  paqueteActual: PaqueteResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private paqueteService: PaqueteService
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required]]
    });
  }

  validarIngreso(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const codigo = this.form.value.codigo.trim();
    this.isLoadingIngreso = true;
    this.paqueteService.validarIngreso(codigo).subscribe({
      next: (resp: PaqueteResponse) => {
        this.isLoadingIngreso = false;
        this.paqueteActual = resp;
        Swal.fire({
          icon: 'success',
          title: 'Ingreso Validado',
          html: `
            <p>Código: <strong>${resp.codigo}</strong></p>
            <p>Estado: <strong>${resp.estado}</strong></p>
            <p>Fecha de Recepción: <strong>${new Date(resp.fechaRecepcion!).toLocaleString()}</strong></p>
          `
        });
      },
      error: err => {
        this.isLoadingIngreso = false;
        console.error('Error al validar ingreso:', err);
        const msg = err.error?.message || 'No se pudo validar ingreso.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  validarEntrega(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const codigo = this.form.value.codigo.trim();
    this.isLoadingEntrega = true;
    this.paqueteService.validarEntrega(codigo).subscribe({
      next: (resp: PaqueteResponse) => {
        this.isLoadingEntrega = false;
        this.paqueteActual = resp;
        Swal.fire({
          icon: 'success',
          title: 'Entrega Validada',
          html: `
            <p>Código: <strong>${resp.codigo}</strong></p>
            <p>Estado: <strong>${resp.estado}</strong></p>
            <p>Fecha de Entrega: <strong>${new Date(resp.fechaEntrega!).toLocaleString()}</strong></p>
          `
        });
      },
      error: err => {
        this.isLoadingEntrega = false;
        console.error('Error al validar entrega:', err);
        const msg = err.error?.message || 'No se pudo validar entrega.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}
