package com.example.Mi.casita.segura.visitantes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VisitanteRegistroDTO {

    @NotBlank
    private String cui;

    @NotBlank
    private String nombreVisitante;

    @NotBlank
    private String telefono;

    @NotBlank
    private Integer numeroCasa;

    @NotBlank
    private String motivoVisita;

    @NotBlank
    private String nota;

    @NotBlank
    private String cuiCreador; // ID del usuario que lo crea (Administrador o Residente)
}