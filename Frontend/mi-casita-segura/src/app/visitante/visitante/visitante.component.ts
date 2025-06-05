// src/app/visitante/visitante.component.ts
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

import {
  VisitanteListadoDTO,
  VisitanteRegistroDTO,
  VisitanteService
} from '../../services/visitante.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-visitante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './visitante.component.html',
  styleUrls: ['./visitante.component.css']
})
export default class RegistroVisitanteComponent implements OnInit {
  form!: FormGroup;
  visitantes: VisitanteListadoDTO[] = [];
  rol!: string;
  numeroCasaUsuario!: number | null;
  cuiDelUsuario!: string;

  constructor(
    private fb: FormBuilder,
    private svc: VisitanteService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    // 1) Extraer datos del token
    const usuario = this.getCurrentUserData();
    this.rol = Array.isArray(usuario.roles) && usuario.roles.includes('RESIDENTE')
               ? 'RESIDENTE'
               : usuario.roles?.[0] || '';
    this.cuiDelUsuario   = usuario.cui;
    this.numeroCasaUsuario = usuario.numeroCasa ?? null;

    // 2) Construir el formulario solo UNA vez
    this.form = this.fb.group({
      cui:                ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombreVisitante:    ['', [Validators.required, this.nombreValidoValidator]],
      telefono:           ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCasa:         [{ value: this.numeroCasaUsuario, disabled: false },
                           [Validators.required, Validators.min(1), Validators.max(300)]],
      motivoVisita:       ['', Validators.required],
      nota:               ['', Validators.required],
      creadoPor:          [ this.cuiDelUsuario, Validators.required ],
      estado:             [ true ]
    });

    // Si el usuario es RESIDENTE, forzamos número de casa y deshabilitamos el campo
    if (this.rol === 'RESIDENTE') {
      this.form.get('numeroCasa')?.setValue(this.numeroCasaUsuario);
      this.form.get('numeroCasa')?.disable();
    }

    // 3) Cargar todos los visitantes (funcionalidad de administrador)
    this.loadAllVisitors();
  }

  // ----------------------------------------------------------
  // 4) Definición del validador “nombre válido”
  //    (retorna null si es válido o { nombreInvalido: true } en caso contrario)
  // ----------------------------------------------------------
  nombreValidoValidator(control: AbstractControl): ValidationErrors | null {
    const val = (control.value || '') as string;
    if (!val.trim()) return null; // el Validators.required ya cubre el no vacío
    const palabras = val.trim().split(/\s+/);
    // Al menos dos palabras con mínimo 3 letras cada una
    const esValido =
      palabras.length >= 2 && palabras.every(p => p.length >= 3);
    return esValido ? null : { nombreInvalido: true };
  }

  // ----------------------------------------------------------
  // 5) Método para cargar **todos** los visitantes (administrador)
  // ----------------------------------------------------------
  private loadAllVisitors(): void {
    this.svc.listar().subscribe({
      next: (data: VisitanteListadoDTO[]) => {
        this.visitantes = data;
      },
      error: (err: any) => {
        console.error('No se pudieron cargar los visitantes:', err);
      }
    });
  }

  // ----------------------------------------------------------
  // 6) Método de envío del formulario
  // ----------------------------------------------------------
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Obtenemos el DTO directamente desde el form (incluye creadoPor y estado)
    const dto: VisitanteRegistroDTO = this.form.getRawValue();

    this.svc.registrar(dto).subscribe({
      next: () => {
        Swal.fire('¡Listo!','Visitante registrado con éxito','success');

        // Después de registrar, reiniciamos el formulario:
        //   - Conservamos creadoPor y, si es residente, el número de casa
        const esResidente = this.rol === 'RESIDENTE';

        this.form.reset({
          numeroCasa: esResidente ? this.numeroCasaUsuario : null,
          creadoPor: this.cuiDelUsuario,
          estado: true
        });

        if (esResidente) {
          this.form.get('numeroCasa')?.disable();
        } else {
          this.form.get('numeroCasa')?.enable();
        }

        // Finalmente, recargamos la lista completa de visitantes
        this.loadAllVisitors();
      },
      error: err => {
        Swal.fire('Error', this.obtenerMensajeDeError(err), 'error');
      }
    });

    // (Solo para debugging en consola, si lo deseas):
    console.log('Visitante enviado al backend:', dto);
  }

  // ----------------------------------------------------------
  // 7) Extraer mensaje de error del backend
  // ----------------------------------------------------------
  private obtenerMensajeDeError(err: any): string {
    // Caso típico: Spring Boot envía { message: "...mensaje..." }
    if (err.error && typeof err.error.message === 'string') {
      return err.error.message;
    }
    // Si el error es simplemente un string
    if (typeof err.error === 'string') {
      return err.error;
    }
    if (typeof err.message === 'string') {
      return err.message;
    }
    return 'Ocurrió un error inesperado.';
  }

  // ----------------------------------------------------------
  // 8) Obtener datos del token JWT (payload)
  // ----------------------------------------------------------
  private getCurrentUserData(): any {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {};
    }
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }

  //Cambiar estado visitante:
  onCambiarEstado(v: VisitanteListadoDTO): void {
    const nuevoEstado = !v.estado;
    Swal.fire({
      title: nuevoEstado ? 'Activar visitante' : 'Desactivar visitante',
      text: `¿Estás seguro que quieres ${nuevoEstado ? 'activar' : 'desactivar'} a este visitante?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.cambiarEstado(v.id, nuevoEstado).subscribe({
          next: () => {
            Swal.fire(
              '¡Listo!',
              `Visitante ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
              'success'
            );
            this.loadAllVisitors();
          },
          error: (err) => {
            console.error('Error en cambiarEstado:', err);
            Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
          }
        });
      }
    });
  }



}
