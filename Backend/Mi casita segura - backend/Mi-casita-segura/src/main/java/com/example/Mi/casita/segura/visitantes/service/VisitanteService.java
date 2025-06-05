package com.example.Mi.casita.segura.visitantes.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.notificaciones.service.NotificacionService;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import com.example.Mi.casita.segura.visitantes.dto.VisitanteListadoDTO;
import com.example.Mi.casita.segura.visitantes.dto.VisitanteRegistroDTO;
import com.example.Mi.casita.segura.visitantes.model.Visitante;
import com.example.Mi.casita.segura.visitantes.repository.VisitanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitanteService {

    private final VisitanteRepository visitanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AccesoQRRepository accesoQRRepository;
    private final NotificacionService notificacionService;

    public Visitante registrarVisitante(VisitanteRegistroDTO dto) {
        if (dto.getCui() != null && visitanteRepository.existsByCui(dto.getCui())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El visitante ya existe");

            //throw new IllegalArgumentException("El visitante ya existe");
        }

        Usuario creador = usuarioRepository.findById(dto.getCreadoPor())
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
        LocalDateTime ahora = LocalDateTime.now();
        qr.setFechaGeneracion(ahora);
        qr.setEstado(Acceso_QR.Estado.valueOf("ACTIVO"));
        qr.setFechaExpiracion(ahora.plusHours(24));
        //Usuario creador = visitante.getCreadoPor();
        qr.setAsociado(creador);
        qr.setVisitante(visitante);
        accesoQRRepository.save(qr);


        // Notificar
        // notificacionService.enviarNotificacionVisitante(visitante, qr.getCodigoQR());

        return visitante;
    }

    public List<VisitanteListadoDTO> obtenerTodosVisitantes() {
        return visitanteRepository.findAll().stream()
                .map(v -> {
                    VisitanteListadoDTO dto = new VisitanteListadoDTO();
                    dto.setId(v.getId());
                    dto.setCui(v.getCui());
                    dto.setNombreVisitante(v.getNombreVisitante());
                    dto.setEstado(v.isEstado());
                    dto.setFechaDeIngreso(v.getFechaDeIngreso());
                    dto.setTelefono(v.getTelefono());
                    dto.setNumeroCasa(v.getNumeroCasa());
                    dto.setMotivoVisita(v.getMotivoVisita());
                    dto.setNota(v.getNota());
                    dto.setCreadoPor(v.getCreadoPor().getCui());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Visitante actualizarVisitante(Long id, VisitanteRegistroDTO dto) {

        Visitante visitante = visitanteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visitante con id " + id + " no encontrado"));

        // 2. (Opcional) verifica permisos del creador aquí si ya integras JWT

        visitante.setNombreVisitante(dto.getNombreVisitante());
        visitante.setTelefono(dto.getTelefono());
        visitante.setMotivoVisita(dto.getMotivoVisita());
        visitante.setNota(dto.getNota());
        visitante.setEstado(dto.isEstado());

        return visitanteRepository.save(visitante);
    }

    public List<VisitanteListadoDTO> listaDefault(String creadorCui) {
        return visitanteRepository                    // <-- usas la variable que definiste
                .findByCreadoPor_Cui(creadorCui)
                .stream()
                .map(v -> {
                    VisitanteListadoDTO dto = new VisitanteListadoDTO();
                    dto.setId(v.getId());
                    dto.setCui(v.getCui());
                    dto.setNombreVisitante(v.getNombreVisitante());
                    dto.setEstado(v.isEstado());
                    dto.setFechaDeIngreso(v.getFechaDeIngreso());
                    dto.setTelefono(v.getTelefono());
                    dto.setNumeroCasa(v.getNumeroCasa());
                    dto.setMotivoVisita(v.getMotivoVisita());
                    dto.setNota(v.getNota());
                    dto.setCreadoPor(v.getCreadoPor().getCui());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Visitante cambiarEstado(Long id, boolean nuevoEstado) {
        Visitante visitante = visitanteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Visitante no encontrado"));

        visitante.setEstado(nuevoEstado);
        return visitanteRepository.save(visitante);
    }

    public VisitanteListadoDTO toListadoDTO(Visitante v) {
        VisitanteListadoDTO dto = new VisitanteListadoDTO();
        dto.setId(v.getId());
        dto.setCui(v.getCui());
        dto.setNombreVisitante(v.getNombreVisitante());
        dto.setEstado(v.isEstado());
        dto.setFechaDeIngreso(v.getFechaDeIngreso());
        dto.setTelefono(v.getTelefono());
        dto.setNumeroCasa(v.getNumeroCasa());
        dto.setMotivoVisita(v.getMotivoVisita());
        dto.setNota(v.getNota());
        // Asegúrate que el DTO tenga este campo, si no, puedes omitirlo
        if (v.getCreadoPor() != null) {
            dto.setCreadoPor(v.getCreadoPor().getCui());
        }
        return dto;
    }
}
