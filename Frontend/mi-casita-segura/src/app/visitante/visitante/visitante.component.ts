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
    // Si el payload viene con un array de roles, verificamos si contiene 'RESIDENTE'
    this.rol = Array.isArray(usuario.roles) && usuario.roles.includes('RESIDENTE')
               ? 'RESIDENTE'
               : usuario.roles?.[0] || '';
    this.cuiDelUsuario = usuario.cui || '';
    this.numeroCasaUsuario = usuario.numeroCasa ?? null;

    // 2) Construir el formulario UNA SOLA VEZ
    this.form = this.fb.group({
      cui: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombreVisitante: ['', [Validators.required, this.nombreValidoValidator]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCasa: [
        { value: this.numeroCasaUsuario, disabled: this.rol === 'RESIDENTE' },
        [Validators.required, Validators.min(1), Validators.max(300)]
      ],
      motivoVisita: ['', Validators.required],
      nota: ['', Validators.required],
      creadoPor: [{ value: this.cuiDelUsuario, disabled: true }, Validators.required],
      estado: [true]
    });

    // Si el rol es RESIDENTE, dejamos número de casa preconfigurado y deshabilitado
    if (this.rol === 'RESIDENTE') {
      this.form.get('numeroCasa')?.setValue(this.numeroCasaUsuario);
      this.form.get('numeroCasa')?.disable();
    }

    // 3) Cargar todos los visitantes al iniciar
    this.loadAllVisitors();
  }

  /**
   * Carga el listado de visitantes según el rol:
   * - Si es RESIDENTE, carga solo los propios.
   * - En otro caso (p. ej. ADMIN), carga todos.
   */
  private loadAllVisitors(): void {
    if (this.rol === 'RESIDENTE') {
      this.svc.listarPropios().subscribe({
        next: lista => (this.visitantes = lista),
        error: err => {
          console.error('Error al cargar visitantes propios:', err);
          Swal.fire('Error', 'No se pudieron cargar tus visitantes', 'error');
        }
      });
    } else {
      this.svc.listar().subscribe({
        next: lista => (this.visitantes = lista),
        error: err => {
          console.error('Error al cargar todos los visitantes:', err);
          Swal.fire('Error', 'No se pudieron cargar los visitantes', 'error');
        }
      });
    }
  }

  /**
   * Validador que retorna { nombreInvalido: true } si la cadena no tiene al menos
   * 2 palabras y cada palabra menos de 3 letras.
   */
  nombreValidoValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value as string;
    if (!val) return null; // El required lo captura primero
    const palabras = val.trim().split(/\s+/);
    const esValido =
      palabras.length >= 2 && palabras.every(p => p.length >= 3);
    return esValido ? null : { nombreInvalido: true };
  }

  /** Extrae el payload del JWT y lo parsea a objeto */
  private getCurrentUserData(): any {
    const token = this.authSrv.getToken();
    if (!token) return {};
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return {};
    }
  }

  /** Obtiene únicamente el CUI del usuario desde el payload */
  private getCurrentCui(): string {
    const token = this.authSrv.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.cui || '';
    } catch {
      return '';
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Leemos del formulario el DTO completo
    const dto: VisitanteRegistroDTO = this.form.getRawValue();

    this.svc.registrar(dto).subscribe({
      next: () => {
        Swal.fire('¡Listo!', 'Visitante registrado con éxito', 'success');

        // Después de registrar, recargamos la lista
        this.loadAllVisitors();

        // Limpiamos el formulario y volvemos a preajustar los campos creados
        const usuario = this.getCurrentUserData();
        const esResidente = Array.isArray(usuario.roles) && usuario.roles.includes('RESIDENTE');

        this.form.reset({
          cui: '',
          nombreVisitante: '',
          telefono: '',
          numeroCasa: esResidente ? usuario.numeroCasa : null,
          motivoVisita: '',
          nota: '',
          creadoPor: usuario.cui || '',
          estado: true
        });

        if (esResidente) {
          this.form.get('numeroCasa')?.disable();
        } else {
          this.form.get('numeroCasa')?.enable();
        }
      },
      error: err => {
        Swal.fire('Error', this.obtenerMensajeDeError(err), 'error');
      }
    });

    console.log('Visitante enviado al backend:', dto);
  }

  /**
   * Intenta extraer un mensaje de error enviado por Spring Boot:
   * - Si viene err.error.message como string, retorna ese mensaje.
   * - Si no, retorna un texto genérico.
   */
  private obtenerMensajeDeError(err: any): string {
    if (err.error && typeof err.error.message === 'string') {
      return err.error.message;
    }
    if (typeof err.message === 'string') {
      return err.message;
    }
    return 'Ocurrió un error inesperado.';
  }
}
