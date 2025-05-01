package com.example.Mi.casita.segura.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank
    private String rol;

    private String telefono;

    private int numeroCasa;
}
