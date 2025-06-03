import { Injectable } from '@angular/core';

export interface AguaCargoDTO {
  cui: string;
  metrosCubicosUsados: number;
  estadoPago: string; // normalmente "PENDIENTE"
}

@Injectable({
  providedIn: 'root'
})
export class ExcedenteAguaService {

  constructor() { }
}
