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
  rol: string = '';
  numeroCasaUsuario: number | null = null;
  cuiDelUsuario: string = '';

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
    const usuario = this.getCurrentUserData();
    this.rol = usuario.rol;
    //this.numeroCasaUsuario = usuario.numeroCasa;
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
   /* this.form = this.fb.group({
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
      numeroCasa: [{
       value: this.numeroCasaUsuario || null,
       disabled: this.rol === 'RESIDENTE'
      },
        [
          Validators.required,
          Validators.min(1),
          Validators.max(300)
        ]
      ],
      motivoVisita: ['', Validators.required],
      nota: ['', Validators.required],
      // se sacará del token JWT
      creadoPor: [usuario.username || usuario.sub, Validators.required],
      // no mostramos al usuario, pero el back espera un boolean
      estado: [ true ]
    });*/

  // Forzar valor y estado del campo número de casa si el rol es RESIDENTE
  if (esResidente) {
    this.form.get('numeroCasa')?.setValue(usuario.numeroCasa);
    this.form.get('numeroCasa')?.disable(); // Esto también lo puedes controlar desde el HTML con readonly si quieres reforzar
  }
  console.log(this.getCurrentUserData());
  this.cuiDelUsuario = usuario.cui;
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

    const visitanteDTO = this.form.getRawValue();
    visitanteDTO.creadoPor = this.cuiDelUsuario;

    this.svc.registrar(visitanteDTO).subscribe({
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

  // Si viene como string plano
  if (typeof err.error === 'string') {
    return err.error;
  }

  // Si viene como objeto completo con status
  if (typeof err.message === 'string') {
    return err.message;
  }

  return 'Ocurrió un error inesperado.';
}


}
