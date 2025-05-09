import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  //providers:[AuthService]
})
export default class RegistroComponent implements OnInit{
  formulario!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['']
    });
  }

  registrarUsuario(): void {
    if (this.formulario.valid) {
      this.authService.registrar(this.formulario.value).subscribe({
        next: (respuesta: any) => console.log('Registrado:', respuesta),
        error: (err: any) => console.error('Error al registrar:', err)
      });
    }
  }
}
