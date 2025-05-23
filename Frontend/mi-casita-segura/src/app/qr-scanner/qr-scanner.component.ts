import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { ActivatedRoute } from '@angular/router';

import { WebSocketService } from '../services/web-socket.service';
import { AccesoService }  from '../services/acceso.service';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ CommonModule, ZXingScannerModule ],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class ScannerQrComponent implements OnInit {
  @Input() esEntrada = true;

  availableDevices: MediaDeviceInfo[] = [];
  currentDevice?: MediaDeviceInfo;
  formats: BarcodeFormat[] = [ BarcodeFormat.QR_CODE ];

  constructor(
    private route: ActivatedRoute,
    private ws:    WebSocketService,
    private api:   AccesoService
  ) {}

  ngOnInit() {
    const tipo = this.route.snapshot.data['esEntrada'];
    if (typeof tipo === 'boolean') {
      this.esEntrada = tipo;
    }
    this.ws.onMessage().subscribe(msg => {
      console.log('WS ←', msg);
    });
  }

  handleDevicesFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.currentDevice    = devices[0];
  }

  onDeviceSelect(event: Event) {
    const idx = +(event.target as HTMLSelectElement).value;
    this.currentDevice = this.availableDevices[idx];
  }

  // Este es el nuevo método para el permiso de cámara
  onPermissionResponse(hasPermission: boolean) {
  console.log('Permiso cámara:', hasPermission);
  if (!hasPermission) {
    alert('No diste permiso para usar la cámara');
  }
}

  onCodeResult(code: string) {
    console.log('QR leído:', code);
    const peticion$ = this.esEntrada
      ? this.api.validarEntrada(code)
      : this.api.validarSalida(code);

    peticion$.subscribe({
      next: ()   => console.log(`Validación ${this.esEntrada ? 'entrada' : 'salida'} OK`),
      error: err => console.error('Error validando QR', err)
    });
  }

  onScanError(e: any)   { console.error('ScanError', e); }
  onScanFailure()      { /* frame sin QR, normal */ }
}