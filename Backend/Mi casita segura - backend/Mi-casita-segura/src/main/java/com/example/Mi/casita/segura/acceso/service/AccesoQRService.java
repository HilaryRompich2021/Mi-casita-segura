package com.example.Mi.casita.segura.acceso.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.model.RegistroIngreso;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.acceso.repository.RegistroIngresoRepository;
import com.example.Mi.casita.segura.acceso.websocket.TalanqueraWebSocketHandler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AccesoQRService {

    private final AccesoQRRepository repo;
    private final RegistroIngresoRepository logRepo;
    private final TalanqueraWebSocketHandler ws;

    public AccesoQRService(AccesoQRRepository repo,
                           RegistroIngresoRepository logRepo,
                           TalanqueraWebSocketHandler ws) {
        this.repo = repo;
        this.logRepo = logRepo;
        this.ws = ws;
    }

    public void procesarCodigo(String qr, boolean esEntrada) {
        Acceso_QR acceso = repo.findByCodigoQR(qr)
                .orElseThrow(() -> new RuntimeException("QR no existe"));

        // siempre rechazamos si no está ACTIVO
        if (acceso.getEstado() != Acceso_QR.Estado.ACTIVO) {
            ws.broadcast("deny");
            return;
        }

        boolean esVisitante = acceso.getVisitante() != null;

        if (!esEntrada) {
            // ruta /salida
            if (esVisitante) {
                // debe haber pasado antes por entrada
                long conteo = logRepo.countByAccesoQrIdAndTipoIngreso(acceso.getId(), RegistroIngreso.TipoIngreso.SISTEMA);
                if (conteo == 0) {
                    throw new RuntimeException("No puede salir sin haber entrado");
                }
                ws.broadcast("open_exit");
                // marca el QR inactivo al salir
                acceso.setEstado(Acceso_QR.Estado.INACTIVO);
                repo.save(acceso);
                logRepo.save(crearLog(acceso, RegistroIngreso.TipoIngreso.SEGURIDAD, "Salida visitante"));
            } else {
                // residentes pueden usar salida igual que entrada (si lo quisieras)
                ws.broadcast("open_exit");
                logRepo.save(crearLog(acceso, RegistroIngreso.TipoIngreso.SISTEMA, "Salida residente"));
            }
            return;
        }

        // ruta /entrada
        if (esVisitante) {
            ws.broadcast("open_entry");
            logRepo.save(crearLog(acceso, RegistroIngreso.TipoIngreso.SISTEMA, "Entrada visitante"));
        } else {
            ws.broadcast("open_entry");
            logRepo.save(crearLog(acceso, RegistroIngreso.TipoIngreso.SISTEMA, "Entrada residente"));
        }
    }

    private RegistroIngreso crearLog(Acceso_QR acceso,
                                     RegistroIngreso.TipoIngreso tipo,
                                     String obs) {
        RegistroIngreso log = new RegistroIngreso();
        log.setAccesoQr(acceso);
        log.setFechaHoraIngreso(LocalDateTime.now());
        log.setTipoIngreso(tipo);
        log.setResultadoValidacion("OK");
        log.setNombreLector("WebCam");
        log.setObservacion(obs);
        return log;
    }
}