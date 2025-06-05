package com.example.Mi.casita.segura.correspondencia.service;


import com.example.Mi.casita.segura.correspondencia.dto.CodigoDTO;
import com.example.Mi.casita.segura.correspondencia.dto.PaqueteRegistroDTO;
import com.example.Mi.casita.segura.correspondencia.model.Paquete;
import com.example.Mi.casita.segura.correspondencia.repository.PaqueteRepository;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Data
@RequiredArgsConstructor
@Service
public class PaqueteService {

    private final PaqueteRepository paqueteRepo;
    private final UsuarioRepository usuarioRepo;

    /**
     * Registra un nuevo paquete para el residente dado su CUI y DTO de registro.
     * @param cuiResidente  CUI del usuario autenticado (residente)
     * @param dto           Datos editables para registrar paquete
     * @return              El Paquete recién creado
     */
    @Transactional
    public Paquete registrarPaquete(String cuiResidente, PaqueteRegistroDTO dto) {
        // 1) Validar que el residente exista y esté activo
        Usuario residente = usuarioRepo.findById(cuiResidente)
                .orElseThrow(() -> new IllegalArgumentException("Residente no encontrado"));
        if (!residente.isEstado()) {
            throw new IllegalArgumentException("Residente inactivo");
        }

        // 2) Crear nueva instancia de Paquete
        Paquete paquete = new Paquete();
        String codigo = UUID.randomUUID().toString();
        paquete.setCodigo(codigo);

        // 3) Copiar datos desde el DTO
        paquete.setEmpresaDeEntrega(dto.getEmpresaDeEntrega());
        paquete.setNumeroDeGuia(dto.getNumeroDeGuia());
        paquete.setTipoDePaquete(dto.getTipoDePaquete());
        paquete.setObservacion(dto.getObservacion());

        // 4) Poner fechas y estado inicial
        LocalDateTime ahora = LocalDateTime.now();
        paquete.setFechaRegistro(ahora);
        paquete.setFechaExpiracion(ahora.plusDays(7)); // válido durante 7 días
        paquete.setEstado(Paquete.EstadoPaquete.REGISTRADO);

        // 5) Relacionar con el residente que creó el paquete
        paquete.setCreadopor(residente);

        // 6) Guardar en BD y devolver
        return paqueteRepo.save(paquete);
    }


    /**
     * Valida un código de llegada (códigoLlegada). Solo el guardia lo invoca.
     * Si el paquete existe, está en estado REGISTRADO y aún no expiró,
     * cambia estado a PENDIENTE_A_RECOGER y registra fechaRecepcion = ahora.
     */
    @Transactional
    public Paquete validarCodigoLlegada(CodigoDTO dto) {
        Paquete paquete = paqueteRepo.findByCodigo(dto.getCodigo())
                .orElseThrow(() -> new IllegalArgumentException("Código inválido"));

        if (paquete.getEstado() != Paquete.EstadoPaquete.REGISTRADO) {
            throw new IllegalArgumentException("El paquete no está en estado REGISTRADO");
        }
        if (LocalDateTime.now().isAfter(paquete.getFechaExpiracion())) {
            throw new IllegalArgumentException("El código ha expirado");
        }

        paquete.setFechaRecepcion(LocalDateTime.now());
        paquete.setEstado(Paquete.EstadoPaquete.PENDIENTE_A_RECOGER);
        return paqueteRepo.save(paquete);
    }

    /**
     * Valida un código de entrega (códigoEntrega). Solo el guardia lo invoca.
     * Si el paquete existe, está en estado PENDIENTE_A_RECOGER y el código coincide,
     * cambia estado a ENTREGADO y registra fechaEntrega = ahora.
     */
    @Transactional
    public Paquete validarCodigoEntrega(CodigoDTO dto) {
        Paquete paquete = paqueteRepo.findByCodigo(dto.getCodigo())
                .orElseThrow(() -> new IllegalArgumentException("Código inválido"));

        if (paquete.getEstado() != Paquete.EstadoPaquete.PENDIENTE_A_RECOGER) {
            throw new IllegalArgumentException("El paquete no está en estado PENDIENTE_A_RECOGER");
        }

        paquete.setFechaEntrega(LocalDateTime.now());
        paquete.setEstado(Paquete.EstadoPaquete.ENTREGADO);
        return paqueteRepo.save(paquete);
    }
    /*@Transactional
    public Paquete validarCodigoEntrega(CodigoDTO dto) {
        Optional<Paquete> opt = paqueteRepo.findByCodigoEntrega(dto.getCodigo());
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Código de entrega inválido.");
        }

        Paquete paquete = opt.get();

        // Verificar estado actual
        if (paquete.getEstado() != Paquete.EstadoPaquete.PENDIENTE_A_RECOGER) {
            throw new IllegalArgumentException("El paquete no está pendiente de recogida.");
        }

        // Actualizar a Entregado
        paquete.setEstado(Paquete.EstadoPaquete.ENTREGADO);
        paquete.setFechaEntrega(LocalDateTime.now());

        return paqueteRepo.save(paquete);
    }*/
}
