package com.example.Mi.casita.segura.soporte.Bitacora.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Data
@Table(name = "bitacora_detalle_ticket_soporte")
public class BitacoraDetalleTicketSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bitacoraTicketSoporte_id", nullable = false)
    private BitacoraTicketSoporte bitacoraTicketSoporte;

    @Column(nullable = false, length = 100)
    private String usuario;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosAnteriores;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = true)
    private String datosNuevos;

}
