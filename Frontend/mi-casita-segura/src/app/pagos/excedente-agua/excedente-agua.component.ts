import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AguaCargoDTO, PagosService } from '../../services/pagos.service';

@Component({
  selector: 'app-excedente-agua',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './excedente-agua.component.html',
  styleUrl: './excedente-agua.component.css'
})
export default class ExcedenteAguaComponent implements OnInit {
cargoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pagosService: PagosService
  ) {}

  ngOnInit(): void {
    this.cargoForm = this.fb.group({
      cui: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{13}$/) // asumiendo CUI de 13 dígitos
        ]
      ],
      metrosCubicosUsados: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(1000) // límite arbitrario; ajuste según necesidad
        ]
      ]
    });
  }

  get cui() {
    return this.cargoForm.get('cui');
  }

  get metrosCubicosUsados() {
    return this.cargoForm.get('metrosCubicosUsados');
  }

  onSubmit(): void {
    if (this.cargoForm.invalid) {
      this.cargoForm.markAllAsTouched();
      return;
    }

    const dto: AguaCargoDTO = {
      cui: this.cui!.value,
      metrosCubicosUsados: this.metrosCubicosUsados!.value,
      estadoPago: 'PENDIENTE'
    };

    this.pagosService.generarCargoAgua(dto).subscribe({
      next: (textoRespuesta: string) => {
        // textoRespuesta viene como string (ej. "{}" o mensaje JSON raw)
        Swal.fire(
          'Cargo registrado',
          `Se creó el cargo de agua para CUI ${dto.cui} correctamente.`,
          'success'
        );
        this.cargoForm.reset();
      },
      error: err => {
        console.error('Error generando cargo de agua:', err);
        let msg = 'Error al generar cargo de agua.';
        if (err.error && typeof err.error === 'string') {
          msg = err.error;
        } else if (err.error && err.error.message) {
          msg = err.error.message;
        }
        Swal.fire('Error', msg, 'error');
      }
    });
  }


}
