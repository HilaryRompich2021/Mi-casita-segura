package com.example.Mi.casita.segura.usuarios.dto;

import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRegistroDTO {

    @NotBlank
    private String cui;

    @NotBlank
    private String nombre;

    @Email
    private String correoElectronico;

    @NotBlank
    private String contrasena;

    @NotNull(message = "El rol no puede ser nulo")
    private Usuario.Rol rol;

    private String telefono;

    private int numeroCasa;
}
