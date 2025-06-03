import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ReservaDTO, ReservaListadoDTO, ReservaService } from '../services/reserva.service';
import Swal from 'sweetalert2';



type AreaComun = 'Piscina' | 'Cancha' | 'Salón';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export default class ReservaComponent implements OnInit{


  /** -------------- PROPIEDADES DEL COMPONENTE -------------- **/

  // Área seleccionada en el momento (o null si aún no se eligió)
  areaSeleccionada: AreaComun | null = null;

// Formulario reactivo para la reserva
  reservaForm!: FormGroup;

  // Opciones “1 a 10 horas”
  opcionesHoras: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

   // Opciones de hora de inicio (strings “HH:mm:ss”). Se recalculan en base a horasSeleccionadas.
  opcionesHoraInicio: string[] = [];

  // CUI del usuario extraído del token
  cuiUsuario: string = '';

  // Aquí guardamos las reservas a mostrar (propias o todas)
  misReservas: ReservaListadoDTO[] = [];

  // Booleano para saber si es admin
  esAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService ,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    // 1. Extraer CUI del usuario (payload del JWT)
    //this.cuiUsuario = this.getCuiFromToken();
  const token = this.authService.getToken();
  if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.cuiUsuario = payload.cui || '';
        // Asumimos que roles viene como ["ROLE_RESIDENTE"] o ["ROLE_ADMIN"]
        const roles: string[] = payload.roles || [];
        this.esAdmin = roles.includes('ADMINISTRADOR')|| roles.includes('ADMIN');
        console.log('Roles →', roles);
      console.log('¿esAdmin? →', this.esAdmin);
      } catch {
        this.cuiUsuario = '';
        this.esAdmin = false;
      }
    }

    // 2) Cargar reservas según el rol
    if (this.esAdmin) {
      this.cargarTodasReservas();
    } else {
      this.cargarReservasPropias();
    }


    // 2. Construir el formulario (sin área ni fecha, que se asignarán luego)
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],         // input type="date"
      numeroHoras: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      horaInicio: ['', Validators.required]     // string “HH:mm:ss”
    });

     // 3. Si cambia el número de horas, recalcular opciones de horaInicio automát.
    this.reservaForm.get('numeroHoras')!.valueChanges.subscribe((hrs: number) => {
      this.recalcularOpcionesHoraInicio(hrs);
      // Resetear la horaInicio elegida para forzar re-selección
      this.reservaForm.get('horaInicio')!.setValue('');
    });
  }

  /** Traer reservas propias (solo residente) */
  private cargarReservasPropias(): void {
    console.log('Invocando a listarConfirmadas()…');
    if (!this.cuiUsuario) return;
    this.reservaService.listarPropias(this.cuiUsuario).subscribe({
      next: lista => {
        console.log('RESPUESA LISTAR PROPIAS →', lista);
        this.misReservas = lista;
      },
      error: err => {
        console.error('Error cargando reservas propias:', err);
      }
    });
  }

   /** Traer todas las reservas (solo admin) */
  private cargarTodasReservas(): void {
    console.log('Invocando a listarConfirmadas()…');
    this.reservaService.listarConfirmadas().subscribe({
      next: lista => {
        console.log('Reservas confirmadas (admin):', lista);
        this.misReservas = lista;
      },
      error: err => {
        console.error('Error cargando todas las reservas:', err);
      }
    });
  }

  /** -------------- MÉTODOS AUXILIARES -------------- **/

  /**
   * Extrae el CUI del JWT almacenado en localStorage (auth_token).
   * Si no hay token o no tiene “cui”, devuelve cadena vacía.
   */
  private getCuiFromToken(): string {
    const token = this.authService.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.cui || '';
    } catch {
      return '';
    }
  }

  /**
   * Al elegir un área (“Piscina”, “Cancha” o “Salón”), seteamos `areaSeleccionada`
   * y reiniciamos el formulario de fecha/horas.
   */
  seleccionarArea(area: AreaComun): void {
    if(!this.esAdmin){
    this.areaSeleccionada = area;

    // Limpiar formulario actual (fecha, hrs, horaInicio)
    this.reservaForm.reset();
    this.opcionesHoraInicio = [];
  }
}

  /**
   * Genera el array de opciones de “hora de inicio” basado en cuántas horas
   * quiere el usuario reservar (por ejemplo, si pide 3h, las horas de inicio
   * pueden ser 00:00:00, 01:00:00, … hasta 20:00:00).
   */
  private recalcularOpcionesHoraInicio(horas: number): void {
    this.opcionesHoraInicio = [];

    // Cada hora de inicio válida va desde 0 hasta (24 - horas)
    const maxInicio = 24 - horas;
    for (let h = 0; h <= maxInicio; h++) {
      // Formato “HH:mm:ss” (ej. “00:00:00”, “01:00:00”, …)
      const hh = h.toString().padStart(2, '0');
      this.opcionesHoraInicio.push(`${hh}:00:00`);
    }
  }



  /**
   * Cuando el usuario presiona “Confirmar reserva”, construimos el ReservaDTO
   * con: cui, areaComun, fecha (YYYY-MM-DD), horaInicio, horaFin (horaInicio + horas).
   * Luego llamamos al servicio y mostramos un SweetAlert según resultado.
   */
  onSubmitReserva(): void {
    if (!this.areaSeleccionada) return;

    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const fecha: string = this.reservaForm.value.fecha;               // ej. “2025-06-05”
    const numeroHoras: number = this.reservaForm.value.numeroHoras;   // ej. 3
    const horaInicio: string = this.reservaForm.value.horaInicio;     // ej. “02:00:00”

    // Calcular horaFin: sumamos horas a la horaInicio
    const [hh, mm, ss] = horaInicio.split(':').map(p => parseInt(p, 10));
    const inicioDate = new Date(); // solo para manipular hora
    inicioDate.setHours(hh, mm, ss);

    // Hora fin = inicioDate + numeroHoras horas
    const finDate = new Date(inicioDate.getTime() + numeroHoras * 60 * 60 * 1000);
    const horaFin =
      finDate.getHours().toString().padStart(2, '0') + ':' +
      finDate.getMinutes().toString().padStart(2, '0') + ':' +
      finDate.getSeconds().toString().padStart(2, '0');

    const dto: ReservaDTO = {
      cui: this.cuiUsuario,
      areaComun: this.areaSeleccionada,
      fecha,                    // e.g. “2025-06-05”
      horaInicio,               // e.g. “02:00:00”
      horaFin                   // e.g. “05:00:00” (02 + 3)
    };

    this.reservaService.crearReserva(dto).subscribe({
      next: (respuestaTexto: string) => {
        Swal.fire('¡Éxito!', `Se reservó ${this.areaSeleccionada} el ${fecha} de ${horaInicio}
                          a ${horaFin}`, 'success');
        // Luego de agendar, “limpiamos” form y volvemos a mostrar tarjetas
        this.areaSeleccionada = null;
        this.reservaForm.reset();
        this.opcionesHoraInicio = [];
      },
      error: err => {
    let textoAMostrar = 'Error al intentar reservar. Por favor, inténtalo de nuevo.';

    // 1) Si err.error es un objeto y tiene la propiedad 'message', la usamos:
    if (err.error && typeof err.error === 'object' && 'message' in err.error) {
      textoAMostrar = (err.error as any).message;
    }
    // 2) Si err.error viene como string JSON (p. ej. '{"message":"..."}'), lo parseamos:
    else if (err.error && typeof err.error === 'string') {
      try {
        const obj = JSON.parse(err.error);
        if (obj && obj.message) {
          textoAMostrar = obj.message;
        } else {
          textoAMostrar = err.error;
        }
      } catch {
        // err.error no era JSON, es texto plano: lo mostramos directamente
        textoAMostrar = err.error;
      }
    }

    // Por último, disparamos el SweetAlert con el texto limpio
    Swal.fire('Error', textoAMostrar, 'error');
  }
});
  }

  /**
   * Permite que el usuario cancele el flujo de reserva y regrese a ver las tarjetas.
   */
  cancelarReserva(): void {
    this.areaSeleccionada = null;
    this.reservaForm.reset();
    this.opcionesHoraInicio = [];
  }
}
