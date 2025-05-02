package com.example.Mi.casita.segura.usuarios.repository;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    Optional<Usuario> findByCorreoElectronico(String correoElectronico);

    boolean existsByCorreoElectronico(String correoElectronico);

    // Buscar por nombre de usuario
    Optional<Usuario> findByUsuario(String usuario);

    // Verificar existencia por nombre de usuario
    boolean existsByUsuario(String usuario);

    // Buscar todos por rol
    List<Usuario> findAllByRol(String rol);
}
