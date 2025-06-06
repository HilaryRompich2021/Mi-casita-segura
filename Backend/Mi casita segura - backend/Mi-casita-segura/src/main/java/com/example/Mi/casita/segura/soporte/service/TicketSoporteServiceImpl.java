// src/main/java/com/example/Mi/casita/segura/soporte/service/TicketSoporteServiceImpl.java
package com.example.Mi.casita.segura.soporte.service;

import com.example.Mi.casita.segura.soporte.dto.CreateTicketRequestDTO;
import com.example.Mi.casita.segura.soporte.dto.TicketSoporteDTO;
import com.example.Mi.casita.segura.soporte.dto.UpdateEstadoRequestDTO;
import com.example.Mi.casita.segura.soporte.model.TicketSoporte;
import com.example.Mi.casita.segura.soporte.model.Bitacora.BitacoraTicketSoporte;
import com.example.Mi.casita.segura.soporte.model.Bitacora.BitacoraDetalleTicketSoporte;
import com.example.Mi.casita.segura.soporte.repository.TicketSoporteRepository;
import com.example.Mi.casita.segura.soporte.repository.BitacoraTicketSoporteRepository;
import com.example.Mi.casita.segura.soporte.repository.BitacoraDetalleTicketSoporteRepository;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketSoporteServiceImpl implements TicketSoporteService {

    private final TicketSoporteRepository ticketRepo;
    private final BitacoraTicketSoporteRepository bitacoraRepo;
    private final BitacoraDetalleTicketSoporteRepository detalleRepo;
    private final UsuarioRepository usuarioRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public TicketSoporteDTO crearTicket(CreateTicketRequestDTO request, String usuarioLogeado) {
        // 1. Verificar que el usuario logeado exista (buscamos por “usuario” en lugar de por CUI)
        Usuario usuario = usuarioRepo.findByUsuario(usuarioLogeado)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Si necesitas el CUI para guardarlo en la bitácora:
        String cuiReal = usuario.getCui();

        // 2. Crear el ticket usando usuario (con su CUI real)
        TicketSoporte ticket = new TicketSoporte();
        ticket.setTipoError(request.getTipoError());
        ticket.setDescripcion(request.getDescripcion());
        ticket.setEstado("CREADO");
        ticket.setFechaCreacion(LocalDate.now());
        ticket.setFechaActualizacion(LocalDateTime.now());
        ticket.setUsuario(usuario); // asocia la entidad completa (incluye su CUI)
        ticketRepo.save(ticket);

        // 3. Bitácora de CREACIÓN
        BitacoraTicketSoporte bitEnc = new BitacoraTicketSoporte();
        bitEnc.setTicketSoporte(ticket);
        bitEnc.setOperacion("CREACION");
        bitEnc.setFecha(LocalDateTime.now());
        bitacoraRepo.save(bitEnc);

        // 4. Detalle de bitácora (puedes usar usuario.getNombre() o usuario.getCui())
        BitacoraDetalleTicketSoporte detalle = new BitacoraDetalleTicketSoporte();
        detalle.setBitacoraTicketSoporte(bitEnc);
        detalle.setUsuario(usuario.getNombre()); // o usuario.getCui() si prefieres guardar el CUI
        detalle.setDatosAnteriores(null);
        try {
            String jsonNuevos = objectMapper.writeValueAsString(ticket);
            detalle.setDatosNuevos(jsonNuevos);
        } catch (JsonProcessingException e) {
            detalle.setDatosNuevos(null);
        }
        detalleRepo.save(detalle);

        return mapToDTO(ticket);
    }

    @Override
    @Transactional
    public TicketSoporteDTO ponerEnProceso(UpdateEstadoRequestDTO request, String usuarioLogeado) {
        Usuario usuario = usuarioRepo.findByUsuario(usuarioLogeado)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        if (!Usuario.Rol.ADMINISTRADOR.equals(usuario.getRol())) {
            throw new SecurityException("Solo administradores pueden poner en proceso");
        }

        TicketSoporte ticket = ticketRepo.findById(request.getTicketId())
                .orElseThrow(() -> new EntityNotFoundException("Ticket no encontrado"));

        String snapshotAnterior = null;
        try {
            snapshotAnterior = objectMapper.writeValueAsString(ticket);
        } catch (JsonProcessingException ignored) {}

        // Concatenar detalle en proceso
        String descripcionAnterior = ticket.getDescripcion();
        String nuevaDescripcion = descripcionAnterior
                + "\n\n--- DETALLE EN PROCESO ---\n"
                + request.getDetalle();
        ticket.setDescripcion(nuevaDescripcion);
        ticket.setEstado("EN_PROCESO");
        ticket.setFechaActualizacion(LocalDateTime.now());
        ticketRepo.save(ticket);

        BitacoraTicketSoporte bitEnc = new BitacoraTicketSoporte();
        bitEnc.setTicketSoporte(ticket);
        bitEnc.setOperacion("EN_PROCESO");
        bitEnc.setFecha(LocalDateTime.now());
        bitacoraRepo.save(bitEnc);

        BitacoraDetalleTicketSoporte detalle = new BitacoraDetalleTicketSoporte();
        detalle.setBitacoraTicketSoporte(bitEnc);
        detalle.setUsuario(usuario.getNombre());
        detalle.setDatosAnteriores(snapshotAnterior);
        try {
            String snapshotNuevo = objectMapper.writeValueAsString(ticket);
            detalle.setDatosNuevos(snapshotNuevo);
        } catch (JsonProcessingException ignored) {}
        detalleRepo.save(detalle);

        return mapToDTO(ticket);
    }

    @Override
    @Transactional
    public TicketSoporteDTO completarTicket(UpdateEstadoRequestDTO request, String usuarioLogeado) {
        Usuario usuario = usuarioRepo.findByUsuario(usuarioLogeado)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        if (!Usuario.Rol.ADMINISTRADOR.equals(usuario.getRol())) {
            throw new SecurityException("Solo administradores pueden completar ticket");
        }

        TicketSoporte ticket = ticketRepo.findById(request.getTicketId())
                .orElseThrow(() -> new EntityNotFoundException("Ticket no encontrado"));

        String snapshotAnterior = null;
        try {
            snapshotAnterior = objectMapper.writeValueAsString(ticket);
        } catch (JsonProcessingException ignored) {}

        // Concatenar detalle final
        String descripcionActual = ticket.getDescripcion();
        String nuevaDescripcion = descripcionActual
                + "\n\n--- DETALLE COMPLETADO ---\n"
                + request.getDetalle();
        ticket.setDescripcion(nuevaDescripcion);
        ticket.setEstado("COMPLETADO");
        ticket.setFechaActualizacion(LocalDateTime.now());
        ticketRepo.save(ticket);

        BitacoraTicketSoporte bitEnc = new BitacoraTicketSoporte();
        bitEnc.setTicketSoporte(ticket);
        bitEnc.setOperacion("COMPLETADO");
        bitEnc.setFecha(LocalDateTime.now());
        bitacoraRepo.save(bitEnc);

        BitacoraDetalleTicketSoporte detalle = new BitacoraDetalleTicketSoporte();
        detalle.setBitacoraTicketSoporte(bitEnc);
        detalle.setUsuario(usuario.getNombre());
        detalle.setDatosAnteriores(snapshotAnterior);
        try {
            String snapshotNuevo = objectMapper.writeValueAsString(ticket);
            detalle.setDatosNuevos(snapshotNuevo);
        } catch (JsonProcessingException ignored) {}
        detalleRepo.save(detalle);

        return mapToDTO(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketSoporteDTO> listarTickets() {
        return ticketRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketSoporteDTO obtenerPorId(Long id) {
        TicketSoporte ticket = ticketRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket no encontrado"));
        return mapToDTO(ticket);
    }

    // -------------------------
    // Mapeo entidad → DTO
    private TicketSoporteDTO mapToDTO(TicketSoporte ticket) {
        TicketSoporteDTO dto = new TicketSoporteDTO();
        dto.setId(ticket.getId());
        dto.setTipoError(ticket.getTipoError());
        dto.setDescripcion(ticket.getDescripcion());
        dto.setEstado(ticket.getEstado());
        dto.setFechaCreacion(ticket.getFechaCreacion());
        dto.setFechaActualizacion(ticket.getFechaActualizacion());
        dto.setUsuarioCui(ticket.getUsuario().getCui());
        dto.setUsuarioNombre(ticket.getUsuario().getNombre());
        return dto;
    }
}
