package com.example.Mi.casita.segura.usuarios.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.notificaciones.service.notificacionService;
import com.example.Mi.casita.segura.usuarios.dto.UsuarioRegistroDTO;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final AccesoQRRepository accesoQRRepository;
    private final notificacionService notificacion_Service;

    public Usuario registrarUsuario(UsuarioRegistroDTO dto) {
        if (usuarioRepository.existsById(dto.getCui())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        // Crear el usuario
        Usuario usuario = new Usuario();
        usuario.setCui(dto.getCui());
        usuario.setNombre(dto.getNombre());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setUsuario(generarUsuarioDesdeNombre(dto.getNombre()));
        usuario.setContrasena(encriptar(dto.getContrasena()));
        usuario.setRol(dto.getRol());
        usuario.setTelefono(dto.getTelefono());
        usuario.setNumeroCasa(dto.getNumeroCasa());
        usuario.setFechaDeIngreso(LocalDate.now());
        usuario.setEstado(true);

        usuarioRepository.save(usuario);

        // Crear código QR fijo
        Acceso_QR qr = new Acceso_QR();
        qr.setCodigoQR(UUID.randomUUID().toString()); // puedes generar con Zxing si deseas
        qr.setFechaGeneracion(LocalDateTime.now());
        qr.setEstado(Acceso_QR.Estado.ACTIVO);
        qr.setAsociado(usuario);
        accesoQRRepository.save(qr);

        // Enviar notificación
       // notificacionService.enviarBienvenida(usuario, qr.getCodigoQR());

        return usuario;
    }

    private String generarUsuarioDesdeNombre(String nombre) {
        return nombre.trim().toLowerCase().replace(" ", ".") + new Random().nextInt(100);
    }

    private String encriptar(String contrasena) {
        return new BCryptPasswordEncoder().encode(contrasena);
    }

}
