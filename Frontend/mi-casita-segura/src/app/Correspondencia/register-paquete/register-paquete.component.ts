import { Component, OnInit } from '@angular/core';
import { PaqueteRegistroDTO, PaqueteResponse, PaqueteService } from '../../services/paquete.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-paquete',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './register-paquete.component.html',
  styleUrl: './register-paquete.component.css'
})
export default class RegisterPaqueteComponent implements OnInit {

  form!: FormGroup;
  isSubmitting = false;

// Nuevo: lista de todos los paquetes del residente
  misPaquetes: PaqueteResponse[] = [];
  isLoadingPaquetes = false;


  constructor(
    private fb: FormBuilder,
    private paqueteService: PaqueteService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      empresaDeEntrega: ['', [Validators.required, Validators.maxLength(100)]],
      numeroDeGuia: ['', [Validators.required, Validators.maxLength(50)]],
      tipoDePaquete: ['', [Validators.required, Validators.maxLength(50)]],
      observacion: ['', [Validators.required]]
    });
    // 2) Cargar lista inicial de paquetes del residente
    this.cargarMisPaquetes();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const dto: PaqueteRegistroDTO = this.form.value;

    this.paqueteService.registrarPaquete(dto).subscribe({
      next: (resp: PaqueteResponse) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: '¡Paquete registrado!',
          html: `
            <p>Código generado: <strong>${resp.codigo}</strong></p>
            <p>Estado: <strong>${resp.estado}</strong></p>
            <p>Expira el: <strong>${new Date(resp.fechaExpiracion).toLocaleString()}</strong></p>
          `
        });
        this.form.reset();
        // Refrescar la lista después de registrar
        this.cargarMisPaquetes();
      },
      error: (err: { error: { message: string; }; }) => {
        this.isSubmitting = false;
        console.error('Error al registrar paquete:', err);
        const msg = err.error?.message || 'Ocurrió un error al registrar el paquete.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  // Nuevo método: obtiene los paquetes del residente actualmente logueado
  private cargarMisPaquetes(): void {
    this.isLoadingPaquetes = true;
    this.paqueteService.obtenerMisPaquetes().subscribe({
      next: lista => {
        this.isLoadingPaquetes = false;
        this.misPaquetes = lista;
      },
      error: err => {
        this.isLoadingPaquetes = false;
        console.error('Error al cargar mis paquetes:', err);
        // Puedes mostrar un mensaje de error si lo deseas
      }
    });
  }
}
