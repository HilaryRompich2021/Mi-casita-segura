// src/main/java/com/example/Mi/casita/segura/usuarios/service/UsuarioService.java
package com.example.Mi.casita.segura.usuarios.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.notificaciones.service.NotificacionService;
import com.example.Mi.casita.segura.usuarios.dto.UsuarioListadoDTO;
import com.example.Mi.casita.segura.usuarios.dto.UsuarioRegistroDTO;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AccesoQRRepository accesoQRRepository;
    private final NotificacionService notificacionService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un usuario y genera un QR, devolviendo el DTO con el campo codigoQR rellenado.
     */
    public UsuarioRegistroDTO registrarUsuario(UsuarioRegistroDTO dto) {
        if (usuarioRepository.existsById(dto.getCui())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        // 1. Crear y guardar el Usuario
        Usuario usuario = new Usuario();
        usuario.setCui(dto.getCui());
        usuario.setNombre(dto.getNombre());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setUsuario(generarUsuarioUnico(dto.getNombre()));
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        usuario.setRol(dto.getRol());
        usuario.setTelefono(dto.getTelefono());
        usuario.setFechaDeIngreso(LocalDate.now());
        usuario.setEstado(true);
        // Si es ADMINISTRADOR o GUARDIA, siempre casa = 0
        usuario.setNumeroCasa(
                (dto.getRol() == Usuario.Rol.ADMINISTRADOR || dto.getRol() == Usuario.Rol.GUARDIA)
                        ? 0
                        : dto.getNumeroCasa()
        );
        usuarioRepository.save(usuario);

        // 2. Generar y guardar el Acceso_QR para este usuario
        Acceso_QR qr = new Acceso_QR();
        qr.setCodigoQR(UUID.randomUUID().toString());
        LocalDateTime ahora = LocalDateTime.now();
        qr.setFechaGeneracion(ahora);
        qr.setFechaExpiracion(ahora.plusHours(24));  // expira en 24h
        qr.setEstado(Acceso_QR.Estado.ACTIVO);
        qr.setAsociado(usuario);
        accesoQRRepository.save(qr);

        // 3. Rellenar el campo codigoQR del DTO de respuesta
        dto.setCodigoQR(qr.getCodigoQR());

        // 4. (Opcional) enviar notificación de bienvenida
        // notificacionService.enviarBienvenida(usuario, qr.getCodigoQR());

        return dto;
    }

    public void eliminarUsuario(String cui) {
        if (!usuarioRepository.existsById(cui)) {
            throw new IllegalArgumentException("El usuario con CUI " + cui + " no existe.");
        }
        usuarioRepository.deleteById(cui);
    }

    public void actualizarUsuario(UsuarioRegistroDTO dto) {
        // implementar según necesidades...
    }

    public List<UsuarioListadoDTO> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(u -> {
                    // Busca el último QR generado
                    String qrCode = accesoQRRepository
                            .findFirstByAsociadoOrderByFechaGeneracionDesc(u)
                            .map(Acceso_QR::getCodigoQR)
                            .orElse(null);  // o "" si prefieres cadena vacía

                    // Construye el DTO incluyendo el QR
                    return new UsuarioListadoDTO(
                            u.getCui(),
                            u.getNombre(),
                            u.getCorreoElectronico(),
                            u.getTelefono(),
                            u.getNumeroCasa(),
                            u.getRol(),
                            u.isEstado(),
                            qrCode
                    );
                })
                .collect(Collectors.toList());
    }

    /** Lógica para generar un nombre de usuario único a partir del nombre completo */
    public String generarUsuarioUnico(String nombreCompleto) {
        String[] palabras = nombreCompleto.trim().split("\\s+");
        if (palabras.length < 2) {
            throw new IllegalArgumentException("Debe ingresar al menos dos nombres");
        }
        String primera = palabras[0].toLowerCase();
        String ultima  = palabras[palabras.length - 1].toLowerCase();

        // Intentos con prefijo creciente
        for (int i = 1; i <= primera.length(); i++) {
            String intento = primera.substring(0, i) + ultima;
            if (!usuarioRepository.existsByUsuario(intento)) {
                return intento;
            }
        }
        // Si ya no queda, agregamos número
        String base = primera + (palabras.length > 1 ? palabras[1].toLowerCase() : "");
        int contador = 1;
        String intentoFinal;
        do {
            intentoFinal = base + contador++;
        } while (usuarioRepository.existsByUsuario(intentoFinal));
        return intentoFinal;
    }
}
