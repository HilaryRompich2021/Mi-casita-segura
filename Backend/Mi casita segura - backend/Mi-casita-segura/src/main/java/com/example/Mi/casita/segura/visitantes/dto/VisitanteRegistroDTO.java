package com.example.Mi.casita.segura.visitantes.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisitanteRegistroDTO {

    @NotBlank
    private String cui;

    @NotBlank
    private String nombreVisitante;

    @NotBlank
    private String telefono;

    @NotNull
    private boolean estado;

    @NotBlank
    @Min(1)
    @Max(100)
    private Integer numeroCasa;

    @NotBlank
    private String motivoVisita;

    @NotBlank
    private String nota;

    // ID del usuario que lo crea (Administrador o Residente)
    @NotBlank
    private String cuiCreador;
}