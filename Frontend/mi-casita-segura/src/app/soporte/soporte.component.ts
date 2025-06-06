// src/app/soporte/soporte.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTicketRequest, TicketService, TicketSoporteDTO, UpdateEstadoRequest } from '../services/ticket.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
  standalone: true,
  selector: 'app-soporte',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule      
  ],
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export default class SoporteComponent implements OnInit {
  tickets: TicketSoporteDTO[] = [];
  formCrear!: FormGroup;
  formActualizar!: FormGroup;

  usuarioActualCui = '';  
  usuarioActualRol = ''; 

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private auth: AuthService 
  ) { }

  ngOnInit(): void {

    const user = this.auth.getCurrentUserData();
    this.usuarioActualRol = user.roles?.[0] ?? '';    // asume roles = ['RESIDENTE','ADMINISTRADOR',…]
    this.usuarioActualCui = user.cui ?? '';

    this.formCrear = this.fb.group({
      tipoError: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.formActualizar = this.fb.group({
      ticketId: ['', Validators.required],
      detalle: ['', Validators.required],
    });

    this.cargarTickets();
  }

  cargarTickets(): void {
    this.ticketService.listarTickets().subscribe({
      next: (list) => this.tickets = list,
      error: (err) => console.error('Error al listar tickets', err)
    });
  }

  crearTicket(): void {
    if (this.formCrear.invalid) {
      return;
    }
    const dto: CreateTicketRequest = {
      tipoError: this.formCrear.value.tipoError,
      descripcion: this.formCrear.value.descripcion,
    };
    this.ticketService.crearTicket(dto).subscribe({
      next: (t) => {
        console.log('Ticket creado', t);
        this.formCrear.reset();
        this.cargarTickets();
      },
      error: (err) => console.error('Error al crear ticket', err)
    });
  }

  ponerEnProceso(): void {
    if (this.usuarioActualRol !== 'ADMINISTRADOR') {
      alert('Solo ADMINISTRADOR puede poner en proceso.');
      return;
    }
    if (this.formActualizar.invalid) {
      return;
    }
    const dto: UpdateEstadoRequest = {
      ticketId: this.formActualizar.value.ticketId,
      detalle: this.formActualizar.value.detalle
    };
    this.ticketService.ponerEnProceso(dto).subscribe({
      next: (t) => {
        console.log('Ticket en proceso', t);
        this.formActualizar.reset();
        this.cargarTickets();
      },
      error: (err) => console.error('Error al actualizar a EN_PROCESO', err)
    });
  }

  completarTicket(): void {
    if (this.usuarioActualRol !== 'ADMINISTRADOR') {
      alert('Solo ADMINISTRADOR puede completar ticket.');
      return;
    }
    if (this.formActualizar.invalid) {
      return;
    }
    const dto: UpdateEstadoRequest = {
      ticketId: this.formActualizar.value.ticketId,
      detalle: this.formActualizar.value.detalle
    };
    this.ticketService.completarTicket(dto).subscribe({
      next: (t) => {
        console.log('Ticket completado', t);
        this.formActualizar.reset();
        this.cargarTickets();
      },
      error: (err) => console.error('Error al completar ticket', err)
    });
  }
}
