// src/app/perfil/perfil.component.ts

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

import {
  RegistroService,
  UsuarioListadoDTO,
  UsuarioUpdateDTO
} from '../services/registro.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,           // para *ngIf, *ngFor, etc.
    ReactiveFormsModule,    // para [formGroup], formControlName, Validators…
    NgIf                    // directiva *ngIf
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export default class PerfilComponent implements OnInit {
  form!: FormGroup;
  cargando: boolean = false;
  errorGeneral: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registroSvc: RegistroService   // ← aquí cambiamos a RegistroService
  ) {}

  ngOnInit(): void {
    // 1) Construir el formulario vacío
    this.form = this.fb.group({
      correoElectronico: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|gt)$/)
        ]
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]
      ]
    });

    // 2) Cargar datos del perfil actual
    this.cargando = true;
    this.registroSvc.obtenerPerfilActual().subscribe({
      next: (usuario: UsuarioListadoDTO) => {
        // Rellenamos formulario con datos recibidos
        this.form.patchValue({
          correoElectronico: usuario.correoElectronico,
          telefono: usuario.telefono
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.errorGeneral = 'No se pudo cargar tu perfil. Intenta más tarde.';
        this.cargando = false;
      }
    });
  }

  /** Envía al backend los cambios de correo y teléfono */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: UsuarioUpdateDTO = {
      correoElectronico: this.form.value.correoElectronico,
      telefono: this.form.value.telefono
    };

    this.registroSvc.actualizarPerfilActual(dto).subscribe({
      next: (actualizado: UsuarioListadoDTO) => {
        Swal.fire({
          icon: 'success',
          title: '¡Perfil actualizado!',
          text: 'Tus datos se guardaron correctamente.'
        });
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.obtenerMensajeDeError(err)
        });
      }
    });
  }

  /** Traduce el error a mensaje legible */
  private obtenerMensajeDeError(err: any): string {
    if (err.error && typeof err.error.message === 'string') {
      return err.error.message;
    }
    if (typeof err.error === 'string') {
      return err.error;
    }
    if (typeof err.message === 'string') {
      return err.message;
    }
    return 'Ocurrió un error inesperado.';
  }

  // Getters para acceso en el template
  get correoElectronicoControl(): AbstractControl {
    return this.form.get('correoElectronico')!;
  }

  get telefonoControl(): AbstractControl {
    return this.form.get('telefono')!;
  }
}
