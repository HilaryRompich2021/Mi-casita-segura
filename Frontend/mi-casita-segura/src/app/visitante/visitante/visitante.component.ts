import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VisitanteService } from '../../services/visitante.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-visitante',
  imports: [],
  templateUrl: './visitante.component.html',
  styleUrl: './visitante.component.css'
})
export default class RegistroVisitanteComponent implements  OnInit {

  visitanteForm = this.fb.group({
    cui:            ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    nombreVisitante:['', [Validators.required]],
    telefono:       ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    numeroCasa:     [null, [Validators.required, Validators.min(1), Validators.max(300)]],
    motivoVisita:   ['', [Validators.required]],
    nota:           ['', [Validators.required]],
    creadoPor:      [{value: '', disabled: true}, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private srv: VisitanteService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    // Si obtienes el CUI del creador desde JWT / un servicio:
    const cui = this.authSrv.getCurrentUserCui;
    this.visitanteForm.patchValue({ creadoPor: cui });
  }

  getError(ctrl: string): string {
    const c = this.visitanteForm.get(ctrl)!;
    if (c.hasError('required')) return 'Este campo es obligatorio';
    if (c.hasError('pattern'))  return 'Formato inválido';
    if (c.hasError('min'))      return 'Valor demasiado bajo';
    if (c.hasError('max'))      return 'Valor demasiado alto';
    return '';
  }

  onSubmit() {
    if (this.visitanteForm.invalid) return;
    const dto = this.visitanteForm.getRawValue();
    this.srv.registrarVisitante(dto).subscribe(() => {
      // navegar, mostrar mensaje, etc.
    });
  }

}
