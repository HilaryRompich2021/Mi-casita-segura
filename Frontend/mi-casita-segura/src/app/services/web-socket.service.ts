import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubjectConfig, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<string>;

  constructor() {
    const config: WebSocketSubjectConfig<string> = {
      url: 'ws://localhost:8080/ws/talanquera',
            deserializer: ({ data }) => data as string,
      serializer: msg => msg,
      // opcional: observar apertura/cierre
      openObserver: {
        next: () => console.log('[WS] conectado'),
      },
      closeObserver: {
        next: () => console.log('[WS] desconectado'),
      }
    };
    this.socket$ = webSocket<string>(config);
  }

  send(message: string): void {
    this.socket$.next(message);
  }

  onMessage(): Observable<string> {
    return this.socket$.asObservable();
  }

  close(): void {
    this.socket$.complete();
  }
}