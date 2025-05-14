package com.example.Mi.casita.segura.visitantes.dto;

import com.example.Mi.casita.segura.ValidationCui.ValidCui;
import com.example.Mi.casita.segura.usuarios.Validaciones.NombreValido;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisitanteRegistroDTO {

    @NotBlank
    @NotNull(message = "El cui no puede ser nulo")
    @Pattern(regexp = "\\d{13}", message = "El CUI debe tener exactamente 13 dígitos")
    @ValidCui
    private String cui;

    @NotBlank
    @NombreValido
    private String nombreVisitante;

    @NotBlank
    @NotNull(message = "Teléfono no puede quedar vacío")
    @Pattern(regexp = "\\d{8}", message = "El número de teléfono debe contener exactamente 8 dígitos numéricos")
    private String telefono;

    @NotNull
    private boolean estado;

    @NotNull(message = "El número de casa no puede ser nulo")
    @Min(value = 1, message = "El número de casa debe ser al menos 1")
    @Max(value = 300, message = "El número de casa no puede ser mayor a 300")
    private Integer numeroCasa;

    @NotBlank
    private String motivoVisita;

    @NotBlank

    private String nota;

    // ID del usuario que lo crea (Administrador o Residente)
    @NotBlank
    private String creadoPor;
}