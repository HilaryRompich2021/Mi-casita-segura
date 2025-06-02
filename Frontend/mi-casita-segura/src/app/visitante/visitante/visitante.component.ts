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
    this.rol = usuario.rol;
    const esResidente = usuario.roles?.includes('RESIDENTE');

    const username = usuario.sub;     // Visible en el campo
    const cui = usuario.cui;          // Enviado al backend


      this.form = this.fb.group({
    cui: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    nombreVisitante: ['', [Validators.required, this.nombreValidoValidator]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    numeroCasa: [{ value: null, disabled: false }, [Validators.required, Validators.min(1), Validators.max(300)]],
    motivoVisita: ['', Validators.required],
    nota: ['', Validators.required],
    creadoPor: [this.getCurrentCui(), Validators.required],
    estado: [true]
  });


    if (this.rol === 'RESIDENTE') {
      // Si es residente, forzamos el valor y deshabilitamos
      this.form.get('numeroCasa')?.setValue(this.numeroCasaUsuario);
      this.form.get('numeroCasa')?.disable();
    }

    // 3) Cargar todos los visitantes al iniciar
    this.loadAllVisitors();
  }

  // Validador que retorna { nombreInvalido: true } si falla
  nombreValidoValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value as string;
    if (!val) return null; // lo deja pasar al required
    const palabras = val.trim().split(/\s+/);
    // al menos 2 palabras y cada una ≥ 3 letras
    const esValido =
      palabras.length >= 2 && palabras.every(p => p.length >= 3);
    return esValido ? null : { nombreInvalido: true };
  }

  private getCurrentUserData(): any {
    const token = localStorage.getItem('auth_token');
    if (!token) return {};
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }

  private getCurrentCui(): string {
  const token = localStorage.getItem('auth_token');
  if (!token) return '';
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.cui || ''; // ✅ Devuelve el CUI en lugar del sub
}


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Leer el DTO directamente del form (ya contiene createdBy y estado)
    const dto: VisitanteRegistroDTO = this.form.getRawValue();

    this.svc.registrar(dto).subscribe({
      next: () => {
        Swal.fire('¡Listo!','Visitante registrado con éxito','success');

        const user = this.getCurrentUserData();
        const esResidente = user.roles?.includes('RESIDENTE');



        this.form.reset();
      this.form.patchValue({
        creadoPor: user.sub, // Mostrar nuevamente el username
        numeroCasa: esResidente ? user.numeroCasa : null,
        estado: true
      });

        if (esResidente) {
        this.form.get('numeroCasa')?.disable();
      } else {
        this.form.get('numeroCasa')?.enable();
      }
      },
      error: err => {Swal.fire('Error', this.obtenerMensajeDeError(err), 'error');


      }
    });
    console.log('Visitante enviado al backend:', visitanteDTO);

  }

  /*
  private obtenerMensajeDeError(err: any): string {
  if (typeof err.error === 'string') return err.error;
  if (typeof err.message === 'string') return err.message;
  return 'Ocurrió un error inesperado.';
}*/
private obtenerMensajeDeError(err: any): string {
  // Caso típico de error enviado por Spring Boot
  if (err.error && typeof err.error.message === 'string') {
    return err.error.message;
  }

  /** Validador que exige al menos 2 palabras de 3+ letras */
  nombreValidoValidator(ctrl: AbstractControl): ValidationErrors | null {
    const val = (ctrl.value || '') as string;
    const palabras = val.trim().split(/\s+/);
    const esValido = palabras.length >= 2 && palabras.every((p: string) => p.length >= 3);
    return esValido ? null : { nombreInvalido: true };
  }
}
