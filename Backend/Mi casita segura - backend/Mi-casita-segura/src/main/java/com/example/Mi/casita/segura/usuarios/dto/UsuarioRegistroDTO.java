package com.example.Mi.casita.segura.usuarios.dto;

import com.example.Mi.casita.segura.ValidationCui.ValidCui;
import com.example.Mi.casita.segura.usuarios.Validaciones.NombreValido;
import com.example.Mi.casita.segura.usuarios.model.Usuario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.jdbc.repository.query.Query;

import java.util.List;

@Data
public class UsuarioRegistroDTO {


    @NotNull(message = "El cui no puede ser nulo")
    @Pattern(regexp = "\\d{13}", message = "El CUI debe tener exactamente 13 dígitos")
    @ValidCui
    private String cui;

    @NombreValido
    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El correo no puede estar vacío")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|org|net|edu|gov|mil|gt)$",
            message = "Correo electrónico inválido. Debe ser una dirección válida como nombre@dominio.com"
    )
    @Email(message = "El correo no es válido")
    private String correoElectronico;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s])\\S{6,13}$",
            message = "La contraseña debe tener entre 6 y 13 caracteres, incluir al menos una mayúscula, una minúscula, un dígito, un carácter especial y no contener espacios."
    )
    @NotBlank(message = "La contraseña no puede estar vacía")
    private String contrasena;

    @NotNull(message = "El rol no puede ser nulo")
    private Usuario.Rol rol;

    @NotNull(message = "Teléfono no puede quedar vacío")
    @Pattern(regexp = "\\d{8}", message = "El número de teléfono debe contener exactamente 8 dígitos numéricos")
    private String telefono;

    //@NotNull(message = "El número de casa no puede estar vacío")
    //@Min(value = 1, message = "El número de casa debe ser mayor a cero")
    //@Max(value = 300, message = "El número de casa no puede ser mayor a 300")
    @Min(value = 0, message = "El número de casa no puede ser negativo")
    private int numeroCasa;

    @AssertTrue(message = "El número de casa debe estar entre 1 y 300 para residentes")
    public boolean isNumeroCasaValido() {
        if (rol == Usuario.Rol.RESIDENTE) {
            return numeroCasa >= 1 && numeroCasa <= 100;
        }
        return true;
    }

}
