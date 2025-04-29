package com.example.Mi.casita.segura.acceso.model.Bitacora;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BitacoraDetalleRegistroIngreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bitacora_registro_ingreso_id", nullable = false)
    private BitacoraRegistroIngreso bitacoraRegistroIngreso;

    @Column(nullable = false, length = 100)
    private String usuario;

    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosAnteriores;

    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosNuevos;
}
