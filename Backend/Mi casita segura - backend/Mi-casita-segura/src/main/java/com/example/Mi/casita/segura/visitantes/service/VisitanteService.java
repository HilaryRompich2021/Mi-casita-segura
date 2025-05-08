package com.example.Mi.casita.segura.visitantes.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.notificaciones.service.NotificacionService;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import com.example.Mi.casita.segura.visitantes.dto.VisitanteRegistroDTO;
import com.example.Mi.casita.segura.visitantes.model.Visitante;
import com.example.Mi.casita.segura.visitantes.repository.VisitanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitanteService {

    private final VisitanteRepository visitanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AccesoQRRepository accesoQRRepository;
    private final NotificacionService notificacionService;

    public Visitante registrarVisitante(VisitanteRegistroDTO dto) {
        if (dto.getCui() != null && visitanteRepository.existsByCui(dto.getCui())) {
            throw new IllegalArgumentException("El visitante ya existe");
        }

        Usuario creador = usuarioRepository.findById(dto.getCuiCreador())
                .orElseThrow(() -> new IllegalArgumentException("Usuario creador no encontrado"));

        Visitante visitante = new Visitante();
        visitante.setCui(dto.getCui());
        visitante.setNombreVisitante(dto.getNombreVisitante());
        visitante.setTelefono(dto.getTelefono());
        visitante.setNumeroCasa(dto.getNumeroCasa());
        visitante.setMotivoVisita(dto.getMotivoVisita());
        visitante.setNota(dto.getNota());
        visitante.setEstado(true);
        visitante.setFechaDeIngreso(LocalDate.now());
        visitante.setCreadoPor(creador);

        visitanteRepository.save(visitante);

        // Generar código QR
        Acceso_QR qr = new Acceso_QR();
        qr.setCodigoQR(UUID.randomUUID().toString());
        qr.setFechaGeneracion(LocalDateTime.now());
        qr.setEstado(Acceso_QR.Estado.valueOf("ACTIVO"));
        qr.setVisitante(visitante);
        accesoQRRepository.save(qr);

        // Notificar
        // notificacionService.enviarNotificacionVisitante(visitante, qr.getCodigoQR());

        return visitante;
    }
}
