// src/app/visitante/visitante/visitante.component.ts
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

  ngOnInit() {
    // 1) Extraer datos del token
    const usuario = this.getCurrentUserData();
    this.rol = Array.isArray(usuario.roles) && usuario.roles.includes('RESIDENTE')
               ? 'RESIDENTE'
               : usuario.roles?.[0] || '';
    this.cuiDelUsuario   = usuario.cui;
    this.numeroCasaUsuario = usuario.numeroCasa ?? null;

    // 2) Construir el formulario
    this.form = this.fb.group({
      cui:                ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombreVisitante:    ['', [Validators.required, this.nombreValidoValidator]],
      telefono:           ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCasa:         [{ value: this.numeroCasaUsuario, disabled: this.rol === 'RESIDENTE' },
                           [Validators.required, Validators.min(1), Validators.max(300)]],
      motivoVisita:       ['', Validators.required],
      nota:               ['', Validators.required],
      creadoPor:          [ this.cuiDelUsuario, Validators.required ],
      estado:             [ true ]
    });

    if (this.rol === 'RESIDENTE') {
      // Si es residente, forzamos el valor y deshabilitamos
      this.form.get('numeroCasa')?.setValue(this.numeroCasaUsuario);
      this.form.get('numeroCasa')?.disable();
    }

    // 3) Cargar todos los visitantes al iniciar
    this.loadAllVisitors();
  }

  /** Trae todos los visitantes desde el backend */
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

  /** Se ejecuta al hacer submit en el formulario */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Leer el DTO directamente del form (ya contiene createdBy y estado)
    const dto: VisitanteRegistroDTO = this.form.getRawValue();

    this.svc.registrar(dto).subscribe({
      next: () => {
        // Si Angular logra parsear la respuesta JSON sin error, entrará aquí
        this.handleSuccess();
      },
      error: (err: any) => {
        // Si el backend devolvió 200 OK pero el cuerpo no era JSON parseable,
        // Angular lanza HttpErrorResponse con status=200. Lo comprobamos:
        if (err.status === 200) {
          return this.handleSuccess();
        }
        // Cualquier otro error 4xx/5xx real:
        Swal.fire('Error', this.parseError(err), 'error');
      }
    });
  }

  /** Lógica a ejecutar cuando se confirma guardado exitoso */
  private handleSuccess(): void {
    Swal.fire('¡Listo!', 'Visitante registrado con éxito', 'success');

    // Resetear el formulario, manteniendo creador y número de casa
    this.form.reset({
      numeroCasa: this.numeroCasaUsuario,
      creadoPor: this.cuiDelUsuario,
      estado: true
    });

    if (this.rol === 'RESIDENTE') {
      this.form.get('numeroCasa')?.disable();
    }

    // Volver a recargar la lista de visitantes para que aparezca el recién agregado
    this.loadAllVisitors();
  }

  /** Extrae mensaje de error de varias posibles estructuras */
  private parseError(err: any): string {
    if (typeof err.error === 'string')       return err.error;
    if (err.error?.message)                  return err.error.message;
    if (typeof err.message === 'string')     return err.message;
    return 'Ocurrió un error inesperado.';
  }

  /** Obtiene el payload completo del JWT */
  private getCurrentUserData(): any {
    const tok = localStorage.getItem('auth_token');
    if (!tok) return {};
    return JSON.parse(atob(tok.split('.')[1]));
  }

  /** Validador que exige al menos 2 palabras de 3+ letras */
  nombreValidoValidator(ctrl: AbstractControl): ValidationErrors | null {
    const val = (ctrl.value || '') as string;
    const palabras = val.trim().split(/\s+/);
    const esValido = palabras.length >= 2 && palabras.every((p: string) => p.length >= 3);
    return esValido ? null : { nombreInvalido: true };
  }
}
