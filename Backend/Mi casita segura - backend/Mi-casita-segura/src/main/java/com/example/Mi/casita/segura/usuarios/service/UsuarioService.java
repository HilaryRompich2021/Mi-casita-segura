package com.example.Mi.casita.segura.usuarios.service;

import com.example.Mi.casita.segura.acceso.model.Acceso_QR;
import com.example.Mi.casita.segura.acceso.repository.AccesoQRRepository;
import com.example.Mi.casita.segura.notificaciones.service.NotificacionService;
import com.example.Mi.casita.segura.usuarios.dto.UsuarioListadoDTO;
import com.example.Mi.casita.segura.usuarios.dto.UsuarioRegistroDTO;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.repository.UsuarioRepository;
import com.example.Mi.casita.segura.usuarios.model.Usuario;

import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final AccesoQRRepository accesoQRRepository;
    private final NotificacionService notificacionService;


    public Usuario registrarUsuario(UsuarioRegistroDTO dto) {
        if (usuarioRepository.existsById(dto.getCui())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }

        // Crear el usuario
        Usuario usuario = new Usuario();
        usuario.setCui(dto.getCui());
        usuario.setNombre(dto.getNombre());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setUsuario(generarUsuarioUnico(dto.getNombre()));
        usuario.setContrasena(encriptar(dto.getContrasena()));
        usuario.setRol(dto.getRol());
        usuario.setTelefono(dto.getTelefono());
        usuario.setNumeroCasa(dto.getNumeroCasa());
        usuario.setFechaDeIngreso(LocalDate.now());
        usuario.setEstado(true);

        if (dto.getRol() == Usuario.Rol.ADMINISTRADOR || dto.getRol() == Usuario.Rol.GUARDIA) {
            usuario.setNumeroCasa(0); //
        } else {
            usuario.setNumeroCasa(dto.getNumeroCasa());
        }


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

    public void eliminarUsuario(String cui) {
        if (!usuarioRepository.existsById(cui)) {
            throw new IllegalArgumentException("El usuario con CUI " + cui + " no existe.");
        }

        usuarioRepository.deleteById(cui);
    }

    public void actualizarUsuario(UsuarioRegistroDTO dto) {}




    public List<UsuarioListadoDTO> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(usuario -> new UsuarioListadoDTO(
                        usuario.getCui(),
                        usuario.getNombre(),
                        usuario.getCorreoElectronico(),
                        usuario.getRol(),
                        usuario.isEstado()
                ))
                .collect(Collectors.toList());
    }


    public String generarUsuarioUnico(String nombreCompleto) {
        String[] palabras = nombreCompleto.trim().split("\\s+");

        if (palabras.length < 2) {
            throw new IllegalArgumentException("Debe ingresar al menos dos nombres");
        }

        String primera = palabras[0].toLowerCase();
        String ultima = palabras[palabras.length - 1].toLowerCase();

        // 1. Empieza con la primera letra de la primera palabra + última palabra
        for (int i = 1; i <= primera.length(); i++) {
            String intento = primera.substring(0, i) + ultima;
            if (!usuarioRepository.existsByUsuario(intento)) {
                return intento;
            }
        }

        // 2. Si ya se usó toda la primera palabra, empieza a combinar con la segunda palabra y un número
        String segunda = palabras.length >= 2 ? palabras[1].toLowerCase() : "";
        String base = primera + segunda;

        int contador = 1;
        String intentoFinal;
        do {
            intentoFinal = base + contador;
            contador++;
        } while (usuarioRepository.existsByUsuario(intentoFinal));

        return intentoFinal;
    }


    private String encriptar(String contrasena) {
       // return new BCryptPasswordEncoder().encode(contrasena);
        Usuario usuario = new Usuario();
        UsuarioRegistroDTO dto = new UsuarioRegistroDTO();
        usuario.setContrasena(dto.getContrasena());
        return contrasena;
    }

}
