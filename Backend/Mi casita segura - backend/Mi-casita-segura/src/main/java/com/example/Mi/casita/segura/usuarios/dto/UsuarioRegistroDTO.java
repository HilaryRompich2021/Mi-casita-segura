package com.example.Mi.casita.segura.usuarios.dto;

import com.example.Mi.casita.segura.ValidationCui.ValidCui;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UsuarioRegistroDTO {


    @NotNull(message = "El cui no puede ser nulo")
    @Pattern(regexp = "\\d{13}", message = "El CUI debe tener exactamente 13 dígitos")
    @ValidCui
    private String cui;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El correo no puede estar vacío")
    @Email(message = "El correo no es válido")
    private String correoElectronico;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String contrasena;

    @NotNull(message = "El rol no puede ser nulo")
    private Usuario.Rol rol;

    @NotNull(message = "Teléfono no puede quedar vacío")
    private String telefono;

    @NotNull(message = "El número de casa no puede estar vacío")
    private int numeroCasa;
}
