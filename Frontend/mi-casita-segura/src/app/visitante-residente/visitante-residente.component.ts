import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

import { VisitanteService, VisitanteRegistroDTO, VisitanteListadoDTO } from '../services/visitante.service';

@Component({
  selector: 'app-visitante-residente',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, ReactiveFormsModule ],
  templateUrl: './visitante-residente.component.html',
  styleUrls: ['./visitante-residente.component.css']
})

export default class VisitanteResidenteComponent implements OnInit {
  form!: FormGroup;
  visitantes: VisitanteListadoDTO[] = [];
  rol!: string;
  numeroCasa!: number;
  cuiUsuario!: string;

  constructor(
    private fb: FormBuilder,
    private svc: VisitanteService
  ) {}

  ngOnInit(): void {
    // 1) extraer datos del token
    const payload = this.getCurrentUserData();
    this.rol = Array.isArray(payload.roles) && payload.roles.includes('RESIDENTE')
               ? 'RESIDENTE'
               : payload.roles?.[0] || '';
    this.cuiUsuario = payload.cui;
    this.numeroCasa = payload.numeroCasa ?? 0;

    // 2) construir el formulario
    this.form = this.fb.group({
      cui:                ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombreVisitante:    ['', [Validators.required, this.nombreValidoValidator]],
      telefono:           ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCasa:         [{ value: this.numeroCasa, disabled: this.rol === 'RESIDENTE' }, 
                           [Validators.required, Validators.min(1), Validators.max(300)]],
      motivoVisita:       ['', Validators.required],
      nota:               ['', Validators.required],
      creadoPor:          [ this.cuiUsuario, Validators.required ],
      estado:             [ true ]
    });

    // 3) cargar lista inicial
    this.loadVisitantes();
  }

  private loadVisitantes(): void {
    this.svc.listarPropios().subscribe({
      next: (data: VisitanteListadoDTO[]) => this.visitantes = data,
      error: (err: any)         => console.error('No se pudieron cargar', err)
    });
  }

  onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const dto: VisitanteRegistroDTO = this.form.getRawValue();

  this.svc.registrar(dto).subscribe({
    next: () => this.handleSuccess(),
    error: (err: any) => {
      // Cuando el backend responde 200 pero el cliente no puede parsear JSON
      if (err.status === 200) {
        return this.handleSuccess();
      }
      // Cualquier otro error real lo mostramos
      Swal.fire('Error', this.parseError(err), 'error');
    }
  });
}

private handleSuccess(): void {
  Swal.fire('¡Listo!', 'Visitante registrado con éxito', 'success');
  // Reset del formulario, manteniendo creadoPor y numeroCasa
  this.form.reset({
    numeroCasa: this.numeroCasa,
    creadoPor: this.cuiUsuario,
    estado: true
  });
  if (this.rol === 'RESIDENTE') {
    this.form.get('numeroCasa')?.disable();
  }
  this.loadVisitantes();
}


  private parseError(err: any): string {
    if (typeof err.error === 'string')       return err.error;
    if (err.error?.message)                  return err.error.message;
    if (typeof err.message === 'string')     return err.message;
    return 'Ocurrió un error inesperado.';
  }

  private getCurrentUserData(): any {
    const tok = localStorage.getItem('auth_token');
    if (!tok) return {};
    return JSON.parse(atob(tok.split('.')[1]));
  }

  nombreValidoValidator(ctrl: AbstractControl): ValidationErrors | null {
    const val = (ctrl.value || '') as string;
    const palabras = val.trim().split(/\s+/);
    const esValido = palabras.length >= 2 && palabras.every(p => p.length >= 3);
    return esValido ? null : { nombreInvalido: true };
  }
}
