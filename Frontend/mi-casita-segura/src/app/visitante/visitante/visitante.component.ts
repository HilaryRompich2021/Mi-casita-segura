import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { VisitanteService } from '../../services/visitante.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-visitante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './visitante.component.html',
  styleUrl: './visitante.component.css'
})
export default class RegistroVisitanteComponent implements  OnInit {
  form!: FormGroup;
formulario: any;
/*
  visitanteForm = this.fb.group({
    cui:            ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    nombreVisitante:['', [Validators.required]],
    telefono:       ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    numeroCasa:     [null, [Validators.required, Validators.min(1), Validators.max(300)]],
    motivoVisita:   ['', [Validators.required]],
    nota:           ['', [Validators.required]],
    creadoPor:      [{value: '', disabled: true}, [Validators.required]]
  });
*/
  constructor(
    private fb: FormBuilder,
    private svc: VisitanteService,
    private authSrv: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cui: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{13}$/)
        ]
      ],
      nombreVisitante: ['', [ Validators.required,
        this.nombreValidoValidator
      ]
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]
      ],
      numeroCasa: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(300)
        ]
      ],
      motivoVisita: ['', Validators.required],
      nota: ['', Validators.required],
      // se sacará del token JWT
      creadoPor: [ this.getCurrentCui(), Validators.required ],
      // no mostramos al usuario, pero el back espera un boolean
      estado: [ true ]
    });
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

  private getCurrentCui(): string {
    const token = localStorage.getItem('auth_token');
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.svc.registrar(this.form.value).subscribe({
      next: () => {
        Swal.fire('¡Listo!','Visitante registrado con éxito','success');
        this.form.reset({
          creadoPor: this.getCurrentCui(),
          estado: true
        });
      },
      error: err => {
        Swal.fire('Error', err.error || 'No fue posible registrar','error');
      }
    });
  }

}
