package com.example.Mi.casita.segura.correspondencia.controller;

import com.example.Mi.casita.segura.auth.service.UsuarioDetailsAdapter;
import com.example.Mi.casita.segura.correspondencia.dto.CodigoDTO;
import com.example.Mi.casita.segura.correspondencia.dto.PaqueteRegistroDTO;
import com.example.Mi.casita.segura.correspondencia.model.Paquete;
import com.example.Mi.casita.segura.correspondencia.service.PaqueteService;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import io.jsonwebtoken.Jwt;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Jwt;





@RestController
@RequestMapping("/api/paquetes")
@Validated
public class PaqueteController {

    private final PaqueteService paqueteService;
    private final UsuarioRepository usuarioRepo;

    public PaqueteController(PaqueteService paqueteService,
                             UsuarioRepository usuarioRepo) {
        this.paqueteService = paqueteService;
        this.usuarioRepo = usuarioRepo;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarPaquete(
            Authentication authentication,
            @Valid @RequestBody PaqueteRegistroDTO dto) {

        // 1. Asegurarnos de que Authentication no sea null y esté autenticado
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autorizado");
        }

        // 2. Obtener el username (campo 'usuario') desde authentication.getName()
        String username = authentication.getName();
        // 3. Cargar el Usuario de BD para extraer su CUI
        Usuario residente = usuarioRepo.findByUsuario(username)
                .orElseThrow(() -> new IllegalArgumentException("Residente no encontrado: " + username));
        // 4. Verificar que esté activo
        if (!residente.isEstado()) {
            return ResponseEntity.status(403).body("Residente inactivo");
        }

        String cui = residente.getCui();
        var creado = paqueteService.registrarPaquete(cui, dto);
        return ResponseEntity.ok(creado);
    }

    /**
     * Guardia valida el código de llegada (código_ingreso).
     */
    @PostMapping("/validar-ingreso")
    public ResponseEntity<?> validarIngreso(@Valid @RequestBody CodigoDTO dto) {
        Paquete actualizado = paqueteService.validarCodigoLlegada(dto);
        return ResponseEntity.ok(actualizado);
    }

    /**
     * Guardia valida el código de entrega (código_entrega).
     */
    @PostMapping("/validar-entrega")
    public ResponseEntity<?> validarEntrega(@Valid @RequestBody CodigoDTO dto) {
        Paquete actualizado = paqueteService.validarCodigoEntrega(dto);
        return ResponseEntity.ok(actualizado);
    }
}
