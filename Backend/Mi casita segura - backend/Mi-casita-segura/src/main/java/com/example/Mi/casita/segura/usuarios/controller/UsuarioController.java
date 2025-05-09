package com.example.Mi.casita.segura.usuarios.controller;

import com.example.Mi.casita.segura.usuarios.dto.UsuarioListadoDTO;
import com.example.Mi.casita.segura.usuarios.dto.UsuarioRegistroDTO;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import com.example.Mi.casita.segura.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar (@Valid @RequestBody UsuarioRegistroDTO dto){
        Usuario usuario = usuarioService.registrarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);

    }

    @DeleteMapping("/{cui}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable String cui) {
        usuarioService.eliminarUsuario(cui);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

   /* @GetMapping("/rol/{rol}")
    public ResponseEntity<List<UsuarioListadoDTO>> buscarUsuarioPorRol(@PathVariable String rol) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorRol(rol));
    }*/


    @GetMapping
    public ResponseEntity<List<UsuarioListadoDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodosLosUsuarios());
    }

}
