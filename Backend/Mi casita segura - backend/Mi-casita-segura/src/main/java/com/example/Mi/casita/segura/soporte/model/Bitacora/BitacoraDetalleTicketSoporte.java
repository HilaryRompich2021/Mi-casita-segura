package com.example.Mi.casita.segura.soporte.model.Bitacora;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BitacoraDetalleTicketSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bitacoraTicketSoporte_id", nullable = false)
    private BitacoraTicketSoporte bitacoraTicketSoporte;

    @Column(nullable = false, length = 100)
    private String usuario;

    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosAnteriores;

    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosNuevos;

}
