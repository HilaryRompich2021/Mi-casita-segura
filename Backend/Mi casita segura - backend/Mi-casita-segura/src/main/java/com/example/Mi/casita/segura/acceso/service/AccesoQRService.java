package com.example.Mi.casita.segura.acceso.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.acceso.websocket.TalanqueraWebSocketHandler;
import org.springframework.stereotype.Service;

@Service
public class AccesoQRService {

    private final AccesoQRRepository repo;
    private final TalanqueraWebSocketHandler wsHandler;

    public AccesoQRService(AccesoQRRepository repo, TalanqueraWebSocketHandler wsHandler) {
        this.repo = repo;
        this.wsHandler = wsHandler;
    }

    public void procesarCodigo(String qr) {
        Acceso_QR acceso = repo.findByCodigoQR(qr)
                .orElseThrow(() -> new RuntimeException("QR no existe"));

        if (acceso.getEstado() != Acceso_QR.Estado.ACTIVO) {
            // invalido
            wsHandler.broadcast("deny");
            // registra intento fallido, cambia estado, etc.
            return;
        }

        // válido: abre entrada o salida según contexto
        wsHandler.broadcast("open_entry");
        // …marca acceso como USADO, guarda RegistroIngreso…
    }

    public void registrarFallo(String qr) {
        // Lógica adicional si quieres procesar el fallo en backend
    }
}